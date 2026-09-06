import { articleSchemaV1, type Article } from "./domain";

export type ArticleFieldErrors = Record<string, string>;

export function createBlankArticle(
  editorId: string,
  now = new Date(),
): Article {
  const timestamp = now.toISOString();
  return {
    schemaVersion: 1,
    id: `article:${crypto.randomUUID()}`,
    slug: "",
    title: "",
    excerpt: "",
    author: { id: editorId, name: "" },
    category: "",
    body: { format: "markdown", source: "" },
    state: "draft",
    createdAt: timestamp,
    modifiedAt: timestamp,
    publishedAt: null,
    featuredImage: null,
    ogImage: null,
    revision: {
      number: 1,
      previousNumber: null,
      updatedAt: timestamp,
      updatedBy: editorId,
    },
  };
}

export function articleForSave(
  draft: Article,
  editorId: string,
  persisted: Article | null,
  now = new Date(),
): Article {
  const timestamp = now.toISOString();
  if (!persisted) {
    return {
      ...draft,
      state: "draft",
      publishedAt: null,
      modifiedAt: timestamp,
      revision: {
        number: 1,
        previousNumber: null,
        updatedAt: timestamp,
        updatedBy: editorId,
      },
    };
  }
  return {
    ...draft,
    state: "draft",
    publishedAt: null,
    createdAt: persisted.createdAt,
    modifiedAt: timestamp,
    revision: {
      number: persisted.revision.number + 1,
      previousNumber: persisted.revision.number,
      updatedAt: timestamp,
      updatedBy: editorId,
    },
  };
}

export function validateArticleForSave(article: Article): ArticleFieldErrors {
  const result = articleSchemaV1.safeParse(article);
  if (result.success) return {};
  const errors: ArticleFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join(".") || "form";
    errors[field] ??= issue.message;
  }
  return errors;
}

export function slugFromTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}
