import type { Article, AssetUploadInput, EditorialAsset } from "./domain";
import type { EditorialAuditEvent, EditorialMutationContext } from "./audit";
import { EditorialValidationError } from "./errors";

export type ArticleVisibility = "all" | "published";

export interface ArticleListOptions {
  limit?: number;
  visibility: ArticleVisibility;
}

export interface CreateArticleCommand {
  article: Article;
  idempotencyKey: string;
  mutation: EditorialMutationContext;
}

export interface UpdateArticleCommand {
  article: Article;
  expectedRevision: number;
  idempotencyKey: string;
  mutation: EditorialMutationContext;
}

export interface ArticleReader {
  getById(id: string, visibility: ArticleVisibility): Promise<Article | null>;
  getBySlug(
    slug: string,
    visibility: ArticleVisibility,
  ): Promise<Article | null>;
  list(options: ArticleListOptions): Promise<Article[]>;
}

export interface ArticleRepository extends ArticleReader {
  create(command: CreateArticleCommand): Promise<Article>;
  exportAudit(): Promise<EditorialAuditEvent[]>;
  exportAll(): Promise<Article[]>;
  listRevisions(id: string): Promise<Article[]>;
  update(command: UpdateArticleCommand): Promise<Article>;
}

export interface AssetStore {
  exportAll(): Promise<EditorialAsset[]>;
  getById(id: string): Promise<EditorialAsset | null>;
  put(input: AssetUploadInput): Promise<EditorialAsset>;
}

export function validateIdempotencyKey(key: string): string {
  if (!/^[A-Za-z0-9:_-]{16,128}$/.test(key)) {
    throw new EditorialValidationError(
      "Idempotency keys must contain 16–128 letters, numbers, colons, underscores, or hyphens.",
    );
  }
  return key;
}

export function validateArticleListLimit(
  limit: number | undefined,
): number | undefined {
  if (
    limit !== undefined &&
    (!Number.isInteger(limit) || limit < 1 || limit > 100)
  ) {
    throw new EditorialValidationError(
      "Article list limits must be an integer from 1 through 100.",
    );
  }
  return limit;
}
