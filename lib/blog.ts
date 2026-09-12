/**
 * Project-owned blog adapter.
 *
 * Route and presentation code consume this module rather than repository or
 * Firebase SDK objects. The authority switch selects either validated recovery
 * MDX or Firestore without changing the public view model.
 */

import "server-only";

import readingTime from "reading-time";

import { SITE_URL } from "./constants";
import { getContentAuthority } from "./editorial/content-authority";
import type { Article } from "./editorial/domain";
import {
  ArticleNotFoundError,
  EditorialValidationError,
} from "./editorial/errors";
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
  if (getContentAuthority() === "repository") {
    return (await articleReader.list({ visibility })).map(toPostMeta);
  }
  if (!hasEditorialBackendConfiguration()) {
    throw new EditorialValidationError(
      "Firestore is the configured content authority, but its server configuration is incomplete.",
    );
  }

  return (await getEditorialArticlesForPublicRoutes())
    .filter((article) => article.state === "published")
    .sort((a, b) => {
      const aDate = a.publishedAt ?? a.modifiedAt;
      const bDate = b.publishedAt ?? b.modifiedAt;
      return bDate.localeCompare(aDate) || a.id.localeCompare(b.id);
    })
    .map(toPostMeta);
}

/**
 * Keep build-time route enumeration independent of the remote editorial store.
 * CMS-only slugs are served on demand because dynamicParams defaults to true.
 */
export async function getPrerenderedPostSlugs(): Promise<string[]> {
  if (getContentAuthority() === "firestore") return [];
  const repositoryArticles = await articleReader.list({
    visibility: "published",
  });
  return repositoryArticles.map((article) => article.slug);
}

export async function getPostBySlug(slug: string): Promise<{
  content: string;
  meta: PostMeta;
}> {
  const visibility =
    process.env.NODE_ENV === "development" ? "all" : "published";
  if (getContentAuthority() === "repository") {
    const article = await articleReader.getBySlug(slug, visibility);
    if (!article) throw new ArticleNotFoundError(slug);
    return { meta: toPostMeta(article), content: article.body.source };
  }
  if (!hasEditorialBackendConfiguration()) {
    throw new EditorialValidationError(
      "Firestore is the configured content authority, but its server configuration is incomplete.",
    );
  }

  const article = await getEditorialArticleForPublicRoute(slug);
  if (!article || article.state !== "published") {
    throw new ArticleNotFoundError(slug);
  }
  return { meta: toPostMeta(article), content: article.body.source };
}

/**
 * Read the saved editorial copy for an authorized Draft Mode request.
 * The exact authorized preview slug always reads the saved editorial revision,
 * independently of the public content authority.
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
