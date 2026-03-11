/**
 * TableOfContents — Sidebar navigation with anchor links.
 *
 * Extracts h2/h3 headings from raw MDX content and renders a sticky
 * sidebar navigation with jump links.
 *
 * Spec reference: §7.3 (Blog Post Template)
 *
 * Note: This is a v1.0.0 implementation. Active heading tracking
 * via IntersectionObserver is deferred to a future sprint.
 */

import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

/**
 * Parse raw MDX content for headings (## and ###).
 * Generates IDs by slugifying heading text.
 */
function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({ id, text, level });
  }

  return headings;
}

export default function TableOfContents({
  content,
  className,
}: TableOfContentsProps) {
  const headings = extractHeadings(content);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn("sticky top-24", className)}
    >
      <p className="mb-3 font-display text-body-sm font-medium uppercase tracking-widest text-accent">
        On this page
      </p>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block text-body-sm text-text-muted transition-colors hover:text-accent",
                heading.level === 3 && "pl-4",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
