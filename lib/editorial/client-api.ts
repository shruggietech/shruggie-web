import type { Article, EditorialAsset } from "./domain";
import type { EditorialRole } from "./audit";
import type { TeamAuthorReference } from "../team";

export interface EditorialEditor {
  author: TeamAuthorReference | null;
  id: string;
  role: EditorialRole;
}

export interface ApiIssue {
  message: string;
  path: PropertyKey[];
}

export class EditorialApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
    readonly issues: ApiIssue[] = [],
    readonly retryable = false,
  ) {
    super(message);
    this.name = "EditorialApiError";
  }
}

async function apiRequest<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...init?.headers,
      },
    });
  } catch {
    throw new EditorialApiError(
      "NETWORK_ERROR",
      "The editorial service could not be reached. Check your connection and try again.",
      0,
    );
  }

  const payload = (await response.json().catch(() => ({}))) as {
    error?: {
      code?: string;
      message?: string;
      issues?: ApiIssue[];
      retryable?: boolean;
    };
  };
  if (!response.ok) {
    throw new EditorialApiError(
      payload.error?.code ?? "REQUEST_FAILED",
      payload.error?.message ?? "The editorial request failed.",
      response.status,
      payload.error?.issues ?? [],
      payload.error?.retryable ?? response.status >= 500,
    );
  }
  return payload as T;
}

export async function getEditorialSession(): Promise<EditorialEditor> {
  const result = await apiRequest<{ editor: EditorialEditor }>(
    "/api/admin/session",
  );
  return result.editor;
}

export async function createEditorialSession(
  idToken: string,
): Promise<EditorialEditor> {
  const result = await apiRequest<{ editor: EditorialEditor }>(
    "/api/admin/session",
    { method: "POST", body: JSON.stringify({ idToken }) },
  );
  return result.editor;
}

export async function deleteEditorialSession(): Promise<void> {
  await apiRequest<{ signedOut: true }>("/api/admin/session", {
    method: "DELETE",
  });
}

export async function listEditorialArticles(): Promise<Article[]> {
  const result = await apiRequest<{ articles: Article[] }>(
    "/api/admin/articles?limit=100",
  );
  return result.articles;
}

export async function getEditorialArticle(id: string): Promise<Article> {
  const result = await apiRequest<{ article: Article }>(
    `/api/admin/articles/${encodeURIComponent(id)}`,
  );
  return result.article;
}

export async function listEditorialAssets(): Promise<EditorialAsset[]> {
  const result = await apiRequest<{ assets: EditorialAsset[] }>(
    "/api/admin/assets",
  );
  return result.assets;
}

export async function listArticleRevisions(id: string): Promise<Article[]> {
  const result = await apiRequest<{ revisions: Article[] }>(
    `/api/admin/articles/${encodeURIComponent(id)}/revisions`,
  );
  return result.revisions;
}

export async function createEditorialArticle(
  article: Article,
  idempotencyKey = editorialMutationKey("create"),
): Promise<Article> {
  const result = await apiRequest<{ article: Article }>("/api/admin/articles", {
    method: "POST",
    body: JSON.stringify({ article, idempotencyKey }),
  });
  return result.article;
}

export async function updateEditorialArticle(
  article: Article,
  expectedRevision: number,
  options: {
    idempotencyKey?: string;
    restoreFromRevision?: number;
  } = {},
): Promise<Article> {
  const result = await apiRequest<{ article: Article }>(
    `/api/admin/articles/${encodeURIComponent(article.id)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        article,
        expectedRevision,
        idempotencyKey:
          options.idempotencyKey ?? editorialMutationKey("update"),
        restoreFromRevision: options.restoreFromRevision,
      }),
    },
  );
  return result.article;
}

export async function uploadEditorialAsset(input: {
  altText: string;
  articleId: string;
  file: File;
}): Promise<EditorialAsset> {
  const form = new FormData();
  form.set("altText", input.altText);
  form.set("articleId", input.articleId);
  form.set("file", input.file);
  form.set("id", `asset:${crypto.randomUUID()}`);
  const result = await apiRequest<{ asset: EditorialAsset }>(
    "/api/admin/assets",
    { method: "POST", body: form },
  );
  return result.asset;
}

export function editorialMutationKey(action: string): string {
  return `${action}:${crypto.randomUUID()}`;
}
