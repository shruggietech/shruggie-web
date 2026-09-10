import "server-only";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

import { SITE_URL } from "../constants";
import type { Article } from "./domain";
import { createFirebaseEditorialBackend } from "./firebase-admin";

export const BLOG_INDEX_CACHE_TAG = "editorial:blog:index";

export function blogArticleCacheTag(slug: string): string {
  return `editorial:blog:article:${slug}`;
}

export function hasEditorialBackendConfiguration(): boolean {
  return Boolean(
    (process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT) &&
    process.env.FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_SITE_URL,
  );
}

const getCachedEditorialArticles = unstable_cache(
  async () =>
    createFirebaseEditorialBackend().articles.list({ visibility: "all" }),
  ["editorial-public-articles-v1"],
  { tags: [BLOG_INDEX_CACHE_TAG] },
);

export async function getEditorialArticlesForPublicRoutes(): Promise<
  Article[]
> {
  return hasEditorialBackendConfiguration() ? getCachedEditorialArticles() : [];
}

export async function getEditorialArticleForPublicRoute(
  slug: string,
): Promise<Article | null> {
  if (!hasEditorialBackendConfiguration()) return null;
  return unstable_cache(
    async () =>
      createFirebaseEditorialBackend().articles.getBySlug(slug, "all"),
    ["editorial-public-article-v1", slug],
    { tags: [BLOG_INDEX_CACHE_TAG, blogArticleCacheTag(slug)] },
  )();
}

export interface PublicationInvalidator {
  revalidatePath(path: string, type?: "layout" | "page"): void;
  revalidateTag(tag: string, profile: "max" | { expire: number }): void;
}

const nextInvalidator: PublicationInvalidator = {
  revalidatePath,
  revalidateTag,
};

export function publicationAffectsPublicRoutes(
  previous: Article,
  next: Article,
): boolean {
  return previous.state === "published" || next.state === "published";
}

export function revalidateArticlePublication(
  previous: Article,
  next: Article,
  invalidator: PublicationInvalidator = nextInvalidator,
): void {
  if (!publicationAffectsPublicRoutes(previous, next)) return;

  const slugs = new Set([previous.slug, next.slug]);
  const requiresImmediateArticleExpiry =
    previous.state !== next.state || previous.slug !== next.slug;

  invalidator.revalidateTag(
    BLOG_INDEX_CACHE_TAG,
    requiresImmediateArticleExpiry ? { expire: 0 } : "max",
  );
  for (const slug of slugs) {
    invalidator.revalidateTag(
      blogArticleCacheTag(slug),
      requiresImmediateArticleExpiry ? { expire: 0 } : "max",
    );
    invalidator.revalidatePath(`/blog/${slug}`);
  }
  const siteOrigin = new URL(SITE_URL).origin;
  const mediaPaths = new Set(
    [
      previous.featuredImage?.deliveryUrl,
      previous.ogImage?.deliveryUrl,
      next.featuredImage?.deliveryUrl,
      next.ogImage?.deliveryUrl,
    ]
      .filter((url): url is string => Boolean(url))
      .map((url) => new URL(url, SITE_URL))
      .filter((url) => url.origin === siteOrigin)
      .map((url) => url.pathname)
      .filter((path) => path.startsWith("/media/")),
  );
  for (const path of mediaPaths) invalidator.revalidatePath(path);
  invalidator.revalidatePath("/blog");
  invalidator.revalidatePath("/sitemap.xml");
}
