import "server-only";

import { createHash } from "node:crypto";

import type {
  DocumentData,
  DocumentReference,
  Firestore,
  Transaction,
} from "firebase-admin/firestore";
import { Timestamp } from "firebase-admin/firestore";

import {
  createAuditEvent,
  parseEditorialAuditEvent,
  parseEditorialMutationContext,
  type EditorialAuditEvent,
} from "./audit";
import {
  articleSlugSchema,
  editorialIdSchema,
  parseArticle,
  type Article,
} from "./domain";
import {
  ArticleNotFoundError,
  EditorialValidationError,
  SlugCollisionError,
} from "./errors";
import { withEditorialTimeout } from "./firebase-errors";
import type {
  ArticleListOptions,
  ArticleRepository,
  ArticleVisibility,
  CreateArticleCommand,
  UpdateArticleCommand,
} from "./ports";
import { validateArticleListLimit, validateIdempotencyKey } from "./ports";
import { assertArticleMutation } from "./transitions";

const ARTICLES = "articles";
const ARTICLE_SLUGS = "articleSlugs";
const ARTICLE_REVISIONS = "articleRevisions";
const EDITORIAL_AUDIT = "editorialAudit";
const IDEMPOTENCY_KEYS = "idempotencyKeys";
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

interface IdempotencyRecord {
  articleId: string;
  expiresAt: Timestamp;
  fingerprint: string;
  revisionNumber: number;
}

function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function revisionDocumentId(article: Article): string {
  return `${article.id}:${article.revision.number.toString().padStart(10, "0")}`;
}

function auditDocumentId(idempotencyKey: string): string {
  return `audit:${fingerprint(idempotencyKey).slice(0, 40)}`;
}

export class FirestoreArticleRepository implements ArticleRepository {
  constructor(
    private readonly db: Firestore,
    private readonly timeoutMs = 5_000,
  ) {}

  async create(command: CreateArticleCommand): Promise<Article> {
    const article = parseArticle(command.article);
    if (article.revision.number !== 1) {
      throw new EditorialValidationError(
        "A new article must begin at revision 1.",
      );
    }
    const idempotencyKey = validateIdempotencyKey(command.idempotencyKey);
    const mutation = parseEditorialMutationContext(command.mutation);
    const commandFingerprint = fingerprint({
      actorId: mutation.actorId,
      article,
      role: mutation.role,
    });

    return withEditorialTimeout("create an article", this.timeoutMs, () =>
      this.db.runTransaction(async (transaction) => {
        const replay = await this.readIdempotentReplay(
          transaction,
          idempotencyKey,
          commandFingerprint,
        );
        if (replay) return replay;

        const articleRef = this.db.collection(ARTICLES).doc(article.id);
        const slugRef = this.db.collection(ARTICLE_SLUGS).doc(article.slug);
        const [articleSnapshot, slugSnapshot] = await transaction.getAll(
          articleRef,
          slugRef,
        );

        if (articleSnapshot.exists) {
          throw new EditorialValidationError(
            `Article ID ${article.id} already exists.`,
          );
        }
        if (slugSnapshot.exists) {
          throw new SlugCollisionError(
            article.slug,
            String(slugSnapshot.data()?.articleId ?? "unknown"),
          );
        }

        transaction.create(articleRef, article);
        transaction.create(slugRef, {
          articleId: article.id,
          slug: article.slug,
        });
        transaction.create(
          this.db
            .collection(ARTICLE_REVISIONS)
            .doc(revisionDocumentId(article)),
          article,
        );
        this.writeIdempotencyRecord(
          transaction,
          idempotencyKey,
          commandFingerprint,
          article,
        );
        transaction.create(
          this.db
            .collection(EDITORIAL_AUDIT)
            .doc(auditDocumentId(idempotencyKey)),
          createAuditEvent(
            auditDocumentId(idempotencyKey),
            null,
            article,
            mutation,
          ),
        );
        return article;
      }),
    );
  }

  async update(command: UpdateArticleCommand): Promise<Article> {
    const next = parseArticle(command.article);
    const idempotencyKey = validateIdempotencyKey(command.idempotencyKey);
    const mutation = parseEditorialMutationContext(command.mutation);
    const commandFingerprint = fingerprint({
      article: next,
      actorId: mutation.actorId,
      expectedRevision: command.expectedRevision,
      role: mutation.role,
    });

    return withEditorialTimeout("update an article", this.timeoutMs, () =>
      this.db.runTransaction(async (transaction) => {
        const replay = await this.readIdempotentReplay(
          transaction,
          idempotencyKey,
          commandFingerprint,
        );
        if (replay) return replay;

        const articleRef = this.db.collection(ARTICLES).doc(next.id);
        const articleSnapshot = await transaction.get(articleRef);
        if (!articleSnapshot.exists) throw new ArticleNotFoundError(next.id);

        const current = parseArticle(articleSnapshot.data());
        assertArticleMutation(current, next, command.expectedRevision);

        if (current.slug !== next.slug) {
          const nextSlugRef = this.db.collection(ARTICLE_SLUGS).doc(next.slug);
          const nextSlugSnapshot = await transaction.get(nextSlugRef);
          if (
            nextSlugSnapshot.exists &&
            nextSlugSnapshot.data()?.articleId !== next.id
          ) {
            throw new SlugCollisionError(
              next.slug,
              String(nextSlugSnapshot.data()?.articleId ?? "unknown"),
            );
          }
          transaction.delete(
            this.db.collection(ARTICLE_SLUGS).doc(current.slug),
          );
          transaction.set(nextSlugRef, { articleId: next.id, slug: next.slug });
        }

        transaction.set(articleRef, next);
        transaction.create(
          this.db.collection(ARTICLE_REVISIONS).doc(revisionDocumentId(next)),
          next,
        );
        this.writeIdempotencyRecord(
          transaction,
          idempotencyKey,
          commandFingerprint,
          next,
        );
        transaction.create(
          this.db
            .collection(EDITORIAL_AUDIT)
            .doc(auditDocumentId(idempotencyKey)),
          createAuditEvent(
            auditDocumentId(idempotencyKey),
            current,
            next,
            mutation,
          ),
        );
        return next;
      }),
    );
  }

  async getById(
    id: string,
    visibility: ArticleVisibility,
  ): Promise<Article | null> {
    const parsedId = editorialIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new EditorialValidationError("Article ID is invalid.", {
        issues: parsedId.error.issues,
      });
    }
    return withEditorialTimeout("read an article", this.timeoutMs, async () => {
      const snapshot = await this.db
        .collection(ARTICLES)
        .doc(parsedId.data)
        .get();
      if (!snapshot.exists) return null;
      const article = parseArticle(snapshot.data());
      return visibility === "published" && article.state !== "published"
        ? null
        : article;
    });
  }

  async getBySlug(
    slug: string,
    visibility: ArticleVisibility,
  ): Promise<Article | null> {
    const parsedSlug = articleSlugSchema.safeParse(slug);
    if (!parsedSlug.success) {
      throw new EditorialValidationError("Article slug is invalid.", {
        issues: parsedSlug.error.issues,
      });
    }
    return withEditorialTimeout(
      "read an article by slug",
      this.timeoutMs,
      async () => {
        const slugSnapshot = await this.db
          .collection(ARTICLE_SLUGS)
          .doc(parsedSlug.data)
          .get();
        if (!slugSnapshot.exists) return null;
        const articleId = slugSnapshot.data()?.articleId;
        if (typeof articleId !== "string") {
          throw new EditorialValidationError(
            `Slug reservation ${parsedSlug.data} has no article ID.`,
          );
        }
        const articleSnapshot = await this.db
          .collection(ARTICLES)
          .doc(articleId)
          .get();
        if (!articleSnapshot.exists) return null;
        const article = parseArticle(articleSnapshot.data());
        return visibility === "published" && article.state !== "published"
          ? null
          : article;
      },
    );
  }

  async list(options: ArticleListOptions): Promise<Article[]> {
    const limit = validateArticleListLimit(options.limit);
    return withEditorialTimeout("list articles", this.timeoutMs, async () => {
      let query = this.db.collection(ARTICLES).orderBy("modifiedAt", "desc");
      if (options.visibility === "published") {
        query = query.where("state", "==", "published");
      }
      if (limit !== undefined) query = query.limit(limit);
      const snapshot = await query.get();
      return snapshot.docs.map((document) => parseArticle(document.data()));
    });
  }

  async exportAll(): Promise<Article[]> {
    return withEditorialTimeout("export articles", this.timeoutMs, async () => {
      const snapshot = await this.db
        .collection(ARTICLES)
        .orderBy("__name__")
        .get();
      return snapshot.docs.map((document) => parseArticle(document.data()));
    });
  }

  async exportAudit(): Promise<EditorialAuditEvent[]> {
    return withEditorialTimeout(
      "export editorial audit records",
      this.timeoutMs,
      async () => {
        const snapshot = await this.db
          .collection(EDITORIAL_AUDIT)
          .orderBy("__name__")
          .get();
        return snapshot.docs.map((document) =>
          parseEditorialAuditEvent(document.data()),
        );
      },
    );
  }

  private async readIdempotentReplay(
    transaction: Transaction,
    key: string,
    expectedFingerprint: string,
  ): Promise<Article | null> {
    const recordRef = this.db.collection(IDEMPOTENCY_KEYS).doc(key);
    const recordSnapshot = await transaction.get(recordRef);
    if (!recordSnapshot.exists) return null;

    const record = recordSnapshot.data() as IdempotencyRecord;
    if (record.fingerprint !== expectedFingerprint) {
      throw new EditorialValidationError(
        "An idempotency key cannot be reused for a different mutation.",
        { idempotencyKey: key },
      );
    }
    const revisionRef = this.db
      .collection(ARTICLE_REVISIONS)
      .doc(
        `${record.articleId}:${record.revisionNumber.toString().padStart(10, "0")}`,
      );
    const revisionSnapshot = await transaction.get(revisionRef);
    if (!revisionSnapshot.exists) {
      throw new EditorialValidationError(
        "An idempotency record references a missing article revision.",
        { idempotencyKey: key },
      );
    }
    return parseArticle(revisionSnapshot.data());
  }

  private writeIdempotencyRecord(
    transaction: Transaction,
    key: string,
    commandFingerprint: string,
    article: Article,
  ): void {
    const recordRef: DocumentReference<DocumentData> = this.db
      .collection(IDEMPOTENCY_KEYS)
      .doc(key);
    transaction.create(recordRef, {
      articleId: article.id,
      revisionNumber: article.revision.number,
      fingerprint: commandFingerprint,
      expiresAt: Timestamp.fromMillis(Date.now() + IDEMPOTENCY_TTL_MS),
    } satisfies IdempotencyRecord);
  }
}
