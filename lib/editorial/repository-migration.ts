import "server-only";

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { getAuthorByReference } from "../team";
import {
  parseArticle,
  type Article,
  type AssetReference,
  type EditorialAsset,
} from "./domain";
import { EditorialValidationError } from "./errors";
import { MdxArticleReader } from "./mdx-article-reader";
import type { ArticleRepository, AssetStore } from "./ports";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const articleSourcePathSchema = z
  .string()
  .regex(/^content\/blog\/[a-z0-9._-]+\.mdx$/);
const assetSourcePathSchema = z
  .string()
  .regex(/^public\/images\/blog\/[a-z0-9._-]+$/);

const migrationAssetSchema = z
  .object({
    role: z.enum(["featured", "og", "body"]),
    sourcePath: assetSourcePathSchema,
    sourceSha256: sha256Schema,
    sourceUrl: z.string().regex(/^\/images\/blog\/[a-z0-9._-]+$/),
    targetAssetId: z.string().regex(/^asset:repository:[a-z0-9:_-]+$/),
    contentType: z.enum([
      "image/avif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]),
    altText: z.string().max(300),
  })
  .strict();

const migrationArticleSchema = z
  .object({
    slug: z.string().min(3),
    sourcePath: articleSourcePathSchema,
    sourceSha256: sha256Schema,
    state: z.enum(["draft", "published"]),
    targetArticleId: z.string().regex(/^article:[a-z0-9:_-]+$/),
    targetAuthor: z
      .object({ id: z.string().regex(/^team:[a-z0-9_-]+$/), name: z.string() })
      .strict(),
    assets: z.array(migrationAssetSchema),
  })
  .strict();

export const repositoryMigrationManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    articles: z.array(migrationArticleSchema).min(1),
  })
  .strict()
  .superRefine((manifest, context) => {
    const slugs = new Set<string>();
    const articleIds = new Set<string>();
    const assetIds = new Set<string>();
    for (const [index, article] of manifest.articles.entries()) {
      if (slugs.has(article.slug)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate migration slug: ${article.slug}`,
          path: ["articles", index, "slug"],
        });
      }
      if (articleIds.has(article.targetArticleId)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate target article ID: ${article.targetArticleId}`,
          path: ["articles", index, "targetArticleId"],
        });
      }
      slugs.add(article.slug);
      articleIds.add(article.targetArticleId);

      const roles = new Set<string>();
      for (const [assetIndex, asset] of article.assets.entries()) {
        if (asset.role !== "body" && roles.has(asset.role)) {
          context.addIssue({
            code: "custom",
            message: `Duplicate ${asset.role} asset for ${article.slug}`,
            path: ["articles", index, "assets", assetIndex, "role"],
          });
        }
        if (assetIds.has(asset.targetAssetId)) {
          context.addIssue({
            code: "custom",
            message: `Duplicate target asset ID: ${asset.targetAssetId}`,
            path: ["articles", index, "assets", assetIndex, "targetAssetId"],
          });
        }
        roles.add(asset.role);
        assetIds.add(asset.targetAssetId);
      }
    }
  });

export type RepositoryMigrationManifest = z.infer<
  typeof repositoryMigrationManifestSchema
>;

export interface RepositoryMigrationReport {
  mode: "apply" | "dry-run";
  articles: Array<{
    action: "create" | "unchanged";
    articleId: string;
    assets: Array<{
      action: "create" | "unchanged";
      assetId: string;
      sourceSha256: string;
    }>;
    slug: string;
    verified: boolean;
  }>;
}

interface MigrationOptions {
  apply: boolean;
  articleRepository: ArticleRepository;
  assetStore: AssetStore;
  manifest: RepositoryMigrationManifest;
  repositoryRoot?: string;
  siteOrigin: string;
}

const MIGRATION_ACTOR = "admin:repository-migration";

function sha256(bytes: Uint8Array | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function localBodyAssetUrls(source: string): string[] {
  return [
    ...source.matchAll(
      /!\[[^\]]*\]\((\/images\/blog\/[a-z0-9._-]+)(?:\s+"[^"]*")?\)/gi,
    ),
  ].map((match) => match[1]);
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function assertSourceHash(
  repositoryRoot: string,
  sourcePath: string,
  expected: string,
): Promise<Buffer> {
  const absolutePath = path.resolve(repositoryRoot, sourcePath);
  const relative = path.relative(repositoryRoot, absolutePath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new EditorialValidationError(
      `Migration source escapes the repository: ${sourcePath}`,
    );
  }
  const bytes = await readFile(absolutePath);
  const actual = sha256(bytes);
  if (actual !== expected) {
    throw new EditorialValidationError(
      `Migration source hash changed for ${sourcePath}.`,
      { actual, expected },
    );
  }
  return bytes;
}

function migratedArticle(
  source: Article,
  entry: RepositoryMigrationManifest["articles"][number],
  references: ReadonlyMap<string, AssetReference>,
): Article {
  let body = source.body.source;
  for (const asset of entry.assets.filter(({ role }) => role === "body")) {
    const reference = references.get(asset.targetAssetId);
    if (!reference) {
      throw new EditorialValidationError(
        `Missing migrated body asset ${asset.targetAssetId}.`,
      );
    }
    body = body.replaceAll(asset.sourceUrl, reference.deliveryUrl);
  }

  const featured = entry.assets.find(({ role }) => role === "featured");
  const og = entry.assets.find(({ role }) => role === "og");
  return parseArticle({
    ...source,
    id: entry.targetArticleId,
    author: entry.targetAuthor,
    body: { format: "markdown", source: body },
    featuredImage: featured
      ? (references.get(featured.targetAssetId) ?? null)
      : null,
    ogImage: og ? (references.get(og.targetAssetId) ?? null) : null,
    revision: {
      ...source.revision,
      updatedBy: MIGRATION_ACTOR,
    },
  });
}

async function assertManifestCoverage(
  manifest: RepositoryMigrationManifest,
  repositoryRoot: string,
  sources: Article[],
): Promise<void> {
  const postsDirectory = path.join(repositoryRoot, "content", "blog");
  const repositoryFiles = (await readdir(postsDirectory))
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => `content/blog/${file}`)
    .sort();
  const manifestFiles = manifest.articles
    .map(({ sourcePath }) => sourcePath)
    .sort();
  if (!sameValue(repositoryFiles, manifestFiles)) {
    throw new EditorialValidationError(
      "The migration manifest does not account for every repository blog article.",
      { manifestFiles, repositoryFiles },
    );
  }

  const sourceBySlug = new Map(
    sources.map((article) => [article.slug, article]),
  );
  for (const entry of manifest.articles) {
    const source = sourceBySlug.get(entry.slug);
    if (!source) {
      throw new EditorialValidationError(
        `The migration manifest references an unknown slug: ${entry.slug}`,
      );
    }
    if (entry.sourcePath !== `content/blog/${entry.slug}.mdx`) {
      throw new EditorialValidationError(
        `The source path does not match the slug ${entry.slug}.`,
      );
    }
    if (source.state !== entry.state) {
      throw new EditorialValidationError(
        `The migration state changed for ${entry.slug}.`,
        { actual: source.state, expected: entry.state },
      );
    }
    if (
      source.author.name !== entry.targetAuthor.name ||
      !getAuthorByReference(entry.targetAuthor)
    ) {
      throw new EditorialValidationError(
        `The registered author does not match ${entry.slug}.`,
        { actual: source.author, expected: entry.targetAuthor },
      );
    }

    const bodyUrls = new Set(localBodyAssetUrls(source.body.source));
    for (const asset of entry.assets) {
      if (asset.sourcePath !== `public${asset.sourceUrl}`) {
        throw new EditorialValidationError(
          `The asset path does not match its source URL in ${entry.slug}.`,
          { sourcePath: asset.sourcePath, sourceUrl: asset.sourceUrl },
        );
      }
      const expectedUrl =
        asset.role === "featured"
          ? source.featuredImage?.deliveryUrl
          : asset.role === "og"
            ? source.ogImage?.deliveryUrl
            : bodyUrls.has(asset.sourceUrl)
              ? asset.sourceUrl
              : undefined;
      if (expectedUrl !== asset.sourceUrl) {
        throw new EditorialValidationError(
          `The ${asset.role} asset role does not match ${entry.slug}.`,
          { sourceUrl: asset.sourceUrl },
        );
      }
    }

    const referencedUrls = new Set(
      [
        ...(source.featuredImage ? [source.featuredImage.deliveryUrl] : []),
        ...(source.ogImage ? [source.ogImage.deliveryUrl] : []),
        ...localBodyAssetUrls(source.body.source),
      ].filter((url) => url.startsWith("/images/blog/")),
    );
    const manifestUrls = new Set(
      entry.assets.map(({ sourceUrl }) => sourceUrl),
    );
    if (!sameValue([...referencedUrls].sort(), [...manifestUrls].sort())) {
      throw new EditorialValidationError(
        `The migration manifest does not account for every local asset in ${entry.slug}.`,
        {
          manifestUrls: [...manifestUrls].sort(),
          referencedUrls: [...referencedUrls].sort(),
        },
      );
    }
  }
}

async function inspectExistingAsset(
  assetStore: AssetStore,
  expected: {
    altText: string;
    articleId: string;
    contentType: string;
    sourceSha256: string;
    targetAssetId: string;
  },
): Promise<EditorialAsset | null> {
  const stored = await assetStore.read(expected.targetAssetId);
  if (!stored) return null;
  const actualHash = sha256(stored.bytes);
  if (
    stored.asset.articleId !== expected.articleId ||
    stored.asset.altText !== expected.altText ||
    stored.asset.contentType !== expected.contentType ||
    stored.asset.checksumSha256 !== expected.sourceSha256 ||
    actualHash !== expected.sourceSha256
  ) {
    throw new EditorialValidationError(
      `Existing asset ${expected.targetAssetId} conflicts with the migration manifest.`,
    );
  }
  return stored.asset;
}

export function parseRepositoryMigrationManifest(
  input: unknown,
): RepositoryMigrationManifest {
  const parsed = repositoryMigrationManifestSchema.safeParse(input);
  if (!parsed.success) {
    throw new EditorialValidationError(
      "Migration manifest validation failed.",
      {
        issues: parsed.error.issues,
      },
    );
  }
  return parsed.data;
}

export async function loadRepositoryMigrationManifest(
  manifestPath: string,
): Promise<RepositoryMigrationManifest> {
  return parseRepositoryMigrationManifest(
    JSON.parse(await readFile(manifestPath, "utf8")),
  );
}

export async function migrateRepositoryBlog(
  options: MigrationOptions,
): Promise<RepositoryMigrationReport> {
  const repositoryRoot = path.resolve(options.repositoryRoot ?? process.cwd());
  const manifest = parseRepositoryMigrationManifest(options.manifest);
  const reader = new MdxArticleReader(
    path.join(repositoryRoot, "content", "blog"),
  );
  const sourceArticles = await reader.list({ visibility: "all" });
  await assertManifestCoverage(manifest, repositoryRoot, sourceArticles);
  const sourceBySlug = new Map(
    sourceArticles.map((article) => [article.slug, article]),
  );
  const origin = new URL(options.siteOrigin);
  if (origin.protocol !== "https:") {
    throw new EditorialValidationError(
      "The migration site origin must use HTTPS.",
    );
  }

  const report: RepositoryMigrationReport = {
    mode: options.apply ? "apply" : "dry-run",
    articles: [],
  };

  for (const entry of manifest.articles) {
    await assertSourceHash(
      repositoryRoot,
      entry.sourcePath,
      entry.sourceSha256,
    );
    const source = sourceBySlug.get(entry.slug)!;
    const references = new Map<string, AssetReference>();
    const assetReport: RepositoryMigrationReport["articles"][number]["assets"] =
      [];

    for (const assetEntry of entry.assets) {
      const bytes = await assertSourceHash(
        repositoryRoot,
        assetEntry.sourcePath,
        assetEntry.sourceSha256,
      );
      const existing = await inspectExistingAsset(options.assetStore, {
        altText: assetEntry.altText,
        articleId: entry.targetArticleId,
        contentType: assetEntry.contentType,
        sourceSha256: assetEntry.sourceSha256,
        targetAssetId: assetEntry.targetAssetId,
      });
      let asset = existing;
      if (!asset && options.apply) {
        asset = await options.assetStore.put({
          id: assetEntry.targetAssetId,
          articleId: entry.targetArticleId,
          fileName: path.basename(assetEntry.sourcePath),
          contentType: assetEntry.contentType,
          bytes,
          altText: assetEntry.altText,
          createdAt: source.createdAt,
          createdBy: MIGRATION_ACTOR,
        });
      }
      references.set(assetEntry.targetAssetId, {
        assetId: assetEntry.targetAssetId,
        deliveryUrl:
          asset?.deliveryUrl ??
          new URL(`/media/${assetEntry.targetAssetId}`, origin).toString(),
        altText: assetEntry.altText,
      });
      assetReport.push({
        action: existing ? "unchanged" : "create",
        assetId: assetEntry.targetAssetId,
        sourceSha256: assetEntry.sourceSha256,
      });
    }

    const target = migratedArticle(source, entry, references);
    const existingById = await options.articleRepository.getById(
      target.id,
      "all",
    );
    const existingBySlug = await options.articleRepository.getBySlug(
      target.slug,
      "all",
    );
    const existing = existingById ?? existingBySlug;
    if (existing && !sameValue(existing, target)) {
      throw new EditorialValidationError(
        `Existing article ${target.slug} conflicts with the migration manifest.`,
        { existingArticleId: existing.id, targetArticleId: target.id },
      );
    }

    if (!existing && options.apply) {
      await options.articleRepository.create({
        article: target,
        idempotencyKey: `repository-migration:${target.slug}:v1`,
        mutation: {
          actorId: MIGRATION_ACTOR,
          requestId: `repository-migration:${target.slug}:v1`,
          role: "admin",
        },
      });
    }

    const verified = options.apply
      ? sameValue(
          await options.articleRepository.getById(target.id, "all"),
          target,
        )
      : Boolean(existing);
    if (options.apply && !verified) {
      throw new EditorialValidationError(
        `Read-back verification failed for ${target.slug}.`,
      );
    }
    report.articles.push({
      action: existing ? "unchanged" : "create",
      articleId: target.id,
      assets: assetReport,
      slug: target.slug,
      verified,
    });
  }

  return report;
}

export function repositoryMigrationSummary(report: RepositoryMigrationReport) {
  return {
    mode: report.mode,
    articleCount: report.articles.length,
    articlesToCreate: report.articles.filter(
      ({ action }) => action === "create",
    ).length,
    assetsToCreate: report.articles
      .flatMap(({ assets }) => assets)
      .filter(({ action }) => action === "create").length,
    verifiedArticles: report.articles.filter(({ verified }) => verified).length,
    articles: report.articles,
  };
}
