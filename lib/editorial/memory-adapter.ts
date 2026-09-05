import "server-only";

import { prepareAssetUpload } from "./assets";
import {
  editorialIdSchema,
  parseArticle,
  type Article,
  type AssetUploadInput,
  type EditorialAsset,
} from "./domain";
import {
  ArticleNotFoundError,
  AssetCollisionError,
  ContentTimeoutError,
  ContentUnavailableError,
  EditorialValidationError,
  SlugCollisionError,
} from "./errors";
import type {
  ArticleListOptions,
  ArticleRepository,
  ArticleVisibility,
  AssetStore,
  CreateArticleCommand,
  UpdateArticleCommand,
} from "./ports";
import { validateArticleListLimit, validateIdempotencyKey } from "./ports";
import { assertArticleMutation } from "./transitions";

type FailureMode = "available" | "timeout" | "unavailable";

interface IdempotentResult {
  articleId: string;
  fingerprint: string;
}

export class InMemoryArticleRepository implements ArticleRepository {
  private readonly articles = new Map<string, Article>();
  private readonly articleIdBySlug = new Map<string, string>();
  private readonly idempotentResults = new Map<string, IdempotentResult>();
  private failureMode: FailureMode = "available";

  constructor(initialArticles: Article[] = []) {
    for (const article of initialArticles) {
      const validated = parseArticle(article);
      if (this.articleIdBySlug.has(validated.slug)) {
        throw new SlugCollisionError(
          validated.slug,
          this.articleIdBySlug.get(validated.slug)!,
        );
      }
      this.articles.set(validated.id, structuredClone(validated));
      this.articleIdBySlug.set(validated.slug, validated.id);
    }
  }

  setFailureMode(mode: FailureMode): void {
    this.failureMode = mode;
  }

  async create(command: CreateArticleCommand): Promise<Article> {
    this.assertAvailable("create an article");
    validateIdempotencyKey(command.idempotencyKey);
    const article = parseArticle(command.article);
    const fingerprint = JSON.stringify(article);
    const replay = this.getIdempotentReplay(
      command.idempotencyKey,
      fingerprint,
    );
    if (replay) return replay;

    if (article.revision.number !== 1) {
      throw new EditorialValidationError(
        "A new article must begin at revision 1.",
      );
    }
    if (this.articles.has(article.id)) {
      throw new EditorialValidationError(
        `Article ID ${article.id} already exists.`,
      );
    }

    const existingArticleId = this.articleIdBySlug.get(article.slug);
    if (existingArticleId) {
      throw new SlugCollisionError(article.slug, existingArticleId);
    }

    this.articles.set(article.id, structuredClone(article));
    this.articleIdBySlug.set(article.slug, article.id);
    this.idempotentResults.set(command.idempotencyKey, {
      articleId: article.id,
      fingerprint,
    });
    return structuredClone(article);
  }

  async update(command: UpdateArticleCommand): Promise<Article> {
    this.assertAvailable("update an article");
    validateIdempotencyKey(command.idempotencyKey);
    const next = parseArticle(command.article);
    const fingerprint = JSON.stringify({
      article: next,
      expectedRevision: command.expectedRevision,
    });
    const replay = this.getIdempotentReplay(
      command.idempotencyKey,
      fingerprint,
    );
    if (replay) return replay;

    const current = this.articles.get(next.id);
    if (!current) throw new ArticleNotFoundError(next.id);
    assertArticleMutation(current, next, command.expectedRevision);

    if (current.slug !== next.slug) {
      const existingArticleId = this.articleIdBySlug.get(next.slug);
      if (existingArticleId && existingArticleId !== next.id) {
        throw new SlugCollisionError(next.slug, existingArticleId);
      }
      this.articleIdBySlug.delete(current.slug);
      this.articleIdBySlug.set(next.slug, next.id);
    }

    this.articles.set(next.id, structuredClone(next));
    this.idempotentResults.set(command.idempotencyKey, {
      articleId: next.id,
      fingerprint,
    });
    return structuredClone(next);
  }

  async getById(
    id: string,
    visibility: ArticleVisibility,
  ): Promise<Article | null> {
    this.assertAvailable("read an article");
    const article = this.articles.get(id);
    if (
      !article ||
      (visibility === "published" && article.state !== "published")
    ) {
      return null;
    }
    return structuredClone(article);
  }

  async getBySlug(
    slug: string,
    visibility: ArticleVisibility,
  ): Promise<Article | null> {
    this.assertAvailable("read an article by slug");
    const id = this.articleIdBySlug.get(slug);
    return id ? this.getById(id, visibility) : null;
  }

  async list(options: ArticleListOptions): Promise<Article[]> {
    this.assertAvailable("list articles");
    const limit = validateArticleListLimit(options.limit);
    const articles = [...this.articles.values()]
      .filter(
        (article) =>
          options.visibility === "all" || article.state === "published",
      )
      .sort((a, b) => {
        const aDate = a.publishedAt ?? a.modifiedAt;
        const bDate = b.publishedAt ?? b.modifiedAt;
        return bDate.localeCompare(aDate) || a.id.localeCompare(b.id);
      });
    const limited = limit === undefined ? articles : articles.slice(0, limit);
    return limited.map((article) => structuredClone(article));
  }

  async exportAll(): Promise<Article[]> {
    this.assertAvailable("export articles");
    return [...this.articles.values()].map((article) =>
      structuredClone(article),
    );
  }

  private getIdempotentReplay(
    key: string,
    fingerprint: string,
  ): Article | null {
    const previous = this.idempotentResults.get(key);
    if (!previous) return null;
    if (previous.fingerprint !== fingerprint) {
      throw new EditorialValidationError(
        "An idempotency key cannot be reused for a different mutation.",
        { idempotencyKey: key },
      );
    }
    const article = this.articles.get(previous.articleId);
    if (!article) throw new ArticleNotFoundError(previous.articleId);
    return structuredClone(article);
  }

  private assertAvailable(operation: string): void {
    if (this.failureMode === "unavailable") {
      throw new ContentUnavailableError(operation);
    }
    if (this.failureMode === "timeout") {
      throw new ContentTimeoutError(operation, 1);
    }
  }
}

export class InMemoryAssetStore implements AssetStore {
  private readonly assets = new Map<string, EditorialAsset>();

  constructor(private readonly deliveryOrigin = "https://shruggie.tech") {}

  async put(input: AssetUploadInput): Promise<EditorialAsset> {
    if (this.assets.has(input.id)) throw new AssetCollisionError(input.id);
    const prepared = await prepareAssetUpload(input, this.deliveryOrigin);
    this.assets.set(prepared.asset.id, structuredClone(prepared.asset));
    return structuredClone(prepared.asset);
  }

  async getById(id: string): Promise<EditorialAsset | null> {
    const parsedId = editorialIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new EditorialValidationError("Asset ID is invalid.", {
        issues: parsedId.error.issues,
      });
    }
    const asset = this.assets.get(parsedId.data);
    return asset ? structuredClone(asset) : null;
  }

  async exportAll(): Promise<EditorialAsset[]> {
    return [...this.assets.values()].map((asset) => structuredClone(asset));
  }
}
