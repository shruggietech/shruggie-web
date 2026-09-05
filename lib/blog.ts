/**
 * Project-owned blog adapter.
 *
 * Route and presentation code consume this module rather than repository or
 * Firebase SDK objects. During migration it reads validated repository MDX;
 * the backing reader can change without changing the public view model.
 */

import "server-only";

import readingTime from "reading-time";

import type { Article } from "./editorial/domain";
import { ArticleNotFoundError } from "./editorial/errors";
import { MdxArticleReader } from "./editorial/mdx-article-reader";

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
  return {
    slug: article.slug,
    title: article.title,
    date: (article.publishedAt ?? article.modifiedAt).slice(0, 10),
    author: article.author.name,
    category: article.category,
    excerpt: article.excerpt,
    readingTime: readingTime(article.body.source).text,
    published: article.state === "published",
    ogImage: article.ogImage?.deliveryUrl,
    featuredImage: article.featuredImage?.deliveryUrl,
    featuredImageAlt: article.featuredImage?.altText,
  };
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const visibility =
    process.env.NODE_ENV === "development" ? "all" : "published";
  const articles = await articleReader.list({ visibility });
  return articles.map(toPostMeta);
}

export async function getPostBySlug(slug: string): Promise<{
  content: string;
  meta: PostMeta;
}> {
  const visibility =
    process.env.NODE_ENV === "development" ? "all" : "published";
  const article = await articleReader.getBySlug(slug, visibility);
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
