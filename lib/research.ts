/**
 * Research content loading library.
 *
 * Reads .md files from content/research/, parses frontmatter with gray-matter,
 * and exposes canonical publication metadata + raw markdown body. Unlike the
 * blog (next-mdx-remote), research papers are rendered as plain Markdown via
 * lib/markdown.ts, because the source documents contain raw HTML and literal
 * angle-bracket tokens that an MDX/JSX parse would choke on.
 *
 * These are the canonical, on-site versions of work previously only published
 * on GitHub gists; each paper's `gistUrl` is retained as a mirror.
 *
 * Spec reference: §6.4 (Research and Publications), §8.2 (JSON-LD)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const RESEARCH_DIR = path.join(process.cwd(), "content", "research");

export type ResearchSchemaType = "ScholarlyArticle" | "TechArticle";

export interface ResearchMeta {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  date: string; // ISO 8601 datePublished
  dateModified?: string; // ISO 8601 last revision
  description: string;
  schemaType: ResearchSchemaType;
  gistUrl: string; // canonical mirror on GitHub
  keywords: string[];
  readingTime: string;
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): ResearchMeta {
  return {
    slug,
    title: String(data.title ?? ""),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    author: String(data.author ?? "ShruggieTech"),
    date: String(data.date ?? ""),
    dateModified: data.dateModified ? String(data.dateModified) : undefined,
    description: String(data.description ?? ""),
    schemaType: (data.schemaType as ResearchSchemaType) ?? "TechArticle",
    gistUrl: String(data.gistUrl ?? ""),
    keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
    readingTime: readingTime(content).text,
  };
}

export function getAllResearchMeta(): ResearchMeta[] {
  if (!fs.existsSync(RESEARCH_DIR)) return [];

  return fs
    .readdirSync(RESEARCH_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(RESEARCH_DIR, filename), "utf-8"),
      );
      return toMeta(slug, data, content);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getResearchBySlug(slug: string): {
  meta: ResearchMeta;
  content: string;
} | null {
  const filePath = path.join(RESEARCH_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
  return { meta: toMeta(slug, data, content), content };
}

export const RESEARCH_SLUGS = getAllResearchMeta().map((r) => r.slug);
