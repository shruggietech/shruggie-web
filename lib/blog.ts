/**
 * Blog content loading library.
 *
 * Reads .mdx files from content/blog/, parses frontmatter with gray-matter,
 * computes reading time, filters drafts in production, and sorts by date.
 *
 * Spec references: §7.2 (MDX Pipeline), §7.3 (Blog Post Template)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  author: string;
  category: string;
  excerpt: string;
  readingTime: string; // e.g., "6 min read"
  published: boolean; // false = draft, excluded from production builds
  ogImage?: string; // Optional custom OG image path
  featuredImage?: string; // Optional hero/feature image path
}

export function getAllPostsMeta(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title,
      date: data.date,
      author: data.author ?? "ShruggieTech",
      category: data.category ?? "Announcements",
      excerpt: data.excerpt ?? "",
      readingTime: stats.text,
      published: data.published !== false,
      ogImage: data.ogImage,
      featuredImage: data.featuredImage,
    } satisfies PostMeta;
  });

  return posts
    .filter((p) => process.env.NODE_ENV === "development" || p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title,
      date: data.date,
      author: data.author ?? "ShruggieTech",
      category: data.category ?? "Announcements",
      excerpt: data.excerpt ?? "",
      readingTime: stats.text,
      published: data.published !== false,
      ogImage: data.ogImage,
      featuredImage: data.featuredImage,
    } satisfies PostMeta,
    content,
  };
}

export function getPaginatedPosts(page: number, perPage: number = 10) {
  const all = getAllPostsMeta();
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const start = (page - 1) * perPage;
  const posts = all.slice(start, start + perPage);

  return { posts, totalPages, currentPage: page };
}
