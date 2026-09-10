/**
 * Project-owned blog adapter.
 *
 * Route and presentation code consume this module rather than repository or
 * Firebase SDK objects. During migration it reads validated repository MDX;
 * the backing reader can change without changing the public view model.
 */

import "server-only";

import readingTime from "reading-time";

import { SITE_URL } from "./constants";
import type { Article } from "./editorial/domain";
import { ArticleNotFoundError, EditorialError } from "./editorial/errors";
import { createFirebaseEditorialBackend } from "./editorial/firebase-admin";
import { MdxArticleReader } from "./editorial/mdx-article-reader";
import {
  getEditorialArticleForPublicRoute,
  getEditorialArticlesForPublicRoutes,
  hasEditorialBackendConfiguration,
} from "./editorial/publication-cache";

const articleReader = new MdxArticleReader();

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  readingTime: string;
  published: boolean;
  ogImage?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
}

function toPostMeta(article: Article): PostMeta {
  const publicAssetUrl = (deliveryUrl: string | undefined) => {
    if (!deliveryUrl) return undefined;
    try {
      const url = new URL(deliveryUrl, SITE_URL);
      return url.origin === new URL(SITE_URL).origin
        ? `${url.pathname}${url.search}`
        : deliveryUrl;
    } catch {
      return deliveryUrl;
    }
  };

  return {
    slug: article.slug,
    title: article.title,
    date: (article.publishedAt ?? article.modifiedAt).slice(0, 10),
    author: article.author.name,
    category: article.category,
    excerpt: article.excerpt,
    readingTime: readingTime(article.body.source).text,
    published: article.state === "published",
    ogImage: publicAssetUrl(article.ogImage?.deliveryUrl),
    featuredImage: publicAssetUrl(article.featuredImage?.deliveryUrl),
    featuredImageAlt: article.featuredImage?.altText,
  };
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const visibility =
    process.env.NODE_ENV === "development" ? "all" : "published";
  const repositoryArticles = await articleReader.list({ visibility });
  if (!hasEditorialBackendConfiguration()) {
    return repositoryArticles.map(toPostMeta);
  }

  try {
    const editorialArticles = await getEditorialArticlesForPublicRoutes();
    const editorialSlugs = new Set(
      editorialArticles.map((article) => article.slug),
    );
    return [
      ...editorialArticles.filter((article) => article.state === "published"),
      ...repositoryArticles.filter(
        (article) => !editorialSlugs.has(article.slug),
      ),
    ]
      .sort((a, b) => {
        const aDate = a.publishedAt ?? a.modifiedAt;
        const bDate = b.publishedAt ?? b.modifiedAt;
        return bDate.localeCompare(aDate) || a.id.localeCompare(b.id);
      })
      .map(toPostMeta);
  } catch (error) {
    if (!(error instanceof EditorialError) || !error.retryable) throw error;
    console.error(
      "Published editorial index is unavailable; serving repository-backed articles.",
      error,
    );
    return repositoryArticles.map(toPostMeta);
  }
}

export async function getPostBySlug(slug: string): Promise<{
  content: string;
  meta: PostMeta;
}> {
  const visibility =
    process.env.NODE_ENV === "development" ? "all" : "published";
  let editorialFailure: unknown;

  if (hasEditorialBackendConfiguration()) {
    try {
      const editorialArticle = await getEditorialArticleForPublicRoute(slug);
      if (editorialArticle) {
        if (editorialArticle.state !== "published") {
          throw new ArticleNotFoundError(slug);
        }
        return {
          meta: toPostMeta(editorialArticle),
          content: editorialArticle.body.source,
        };
      }
    } catch (error) {
      if (error instanceof ArticleNotFoundError) throw error;
      if (!(error instanceof EditorialError) || !error.retryable) throw error;
      editorialFailure = error;
    }
  }

  const article = await articleReader.getBySlug(slug, visibility);
  if (!article) {
    if (editorialFailure) throw editorialFailure;
    throw new ArticleNotFoundError(slug);
  }
  return { meta: toPostMeta(article), content: article.body.source };
}

/**
 * Read the saved editorial copy for an authorized Draft Mode request.
 * Repository-backed public reads remain available during the migration window,
 * while the exact authorized preview slug reads the saved editorial revision.
 */
export async function getPreviewPostBySlug(slug: string): Promise<{
  content: string;
  meta: PostMeta;
}> {
  const article = await createFirebaseEditorialBackend().articles.getBySlug(
    slug,
    "all",
  );
  if (!article) throw new ArticleNotFoundError(slug);
  return { meta: toPostMeta(article), content: article.body.source };
}

export async function getPaginatedPosts(page: number, perPage = 10) {
  const all = await getAllPostsMeta();
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const start = (page - 1) * perPage;
  const posts = all.slice(start, start + perPage);

  return { posts, totalPages, currentPage: page };
}
