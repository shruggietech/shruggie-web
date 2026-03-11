/**
 * Case study (Work) content loading library.
 *
 * Reads .mdx files from content/work/, parses frontmatter with gray-matter,
 * and returns structured metadata. Follows the same pattern as lib/blog.ts.
 *
 * Spec references: §6.3 (Work / Case Studies), §7.2 (MDX Pipeline)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const WORK_DIR = path.join(process.cwd(), "content", "work");

export interface CaseStudyMeta {
  slug: string;
  title: string;
  client: string;
  industry: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  summary: string;
  services: string[];
  heroImage: string; // Path to hero image (may not exist yet)
  published: boolean;
}

export function getAllCaseStudiesMeta(): CaseStudyMeta[] {
  if (!fs.existsSync(WORK_DIR)) {
    return [];
  }

  const files = fs.readdirSync(WORK_DIR).filter((f) => f.endsWith(".mdx"));

  const studies = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(WORK_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title,
      client: data.client,
      industry: data.industry,
      date: data.date,
      summary: data.summary,
      services: data.services ?? [],
      heroImage: data.heroImage ?? "",
      published: data.published !== false,
    } satisfies CaseStudyMeta;
  });

  return studies
    .filter((s) => process.env.NODE_ENV === "development" || s.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCaseStudyBySlug(slug: string) {
  const filePath = path.join(WORK_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: {
      slug,
      title: data.title,
      client: data.client,
      industry: data.industry,
      date: data.date,
      summary: data.summary,
      services: data.services ?? [],
      heroImage: data.heroImage ?? "",
      published: data.published !== false,
    } satisfies CaseStudyMeta,
    content,
  };
}
