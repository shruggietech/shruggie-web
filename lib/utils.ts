/**
 * Shared utility functions.
 * Spec reference: §2.4 (Component Primitives)
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Table-of-contents entry extracted from MDX headings. */
export interface TocItem {
  id: string;
  text: string;
  level: 2;
}

/** Convert text to a URL-friendly slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Extract h2 headings from raw MDX content. */
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^##\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = slugify(text);
    headings.push({ id, text, level: 2 });
  }

  return headings;
}
