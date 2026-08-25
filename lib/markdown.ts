/**
 * Plain-Markdown renderer for canonical research papers.
 *
 * These documents contain raw HTML (justified-paragraph <div>s, print rules)
 * and literal angle-bracket tokens inside code (Vec<u8>, <float>), so they are
 * rendered through a Markdown -> HTML pipeline rather than MDX. The pipeline:
 *
 *   remark-parse   -> Markdown AST
 *   remark-gfm     -> tables, footnotes, strikethrough, autolinks
 *   remark-rehype  -> HTML AST (allowDangerousHtml passes raw HTML through)
 *   rehype-raw     -> re-parse the raw HTML into real nodes
 *   rehype-slug    -> stable heading ids so anchors + the sidebar TOC work
 *   (collect TOC)  -> gather <h2> ids/text for the sidebar, using the SAME
 *                     ids rehype-slug produced (so links always resolve)
 *   @shikijs/rehype-> syntax-highlight fenced code (github-dark, matches blog)
 *   rehype-stringify
 *
 * Spec reference: §7.2 (content pipeline), §6.4 (Research)
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";

import type { TocItem } from "./utils";

/* ── Minimal hast helpers (avoid extra deps) ────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HastNode = any;

function nodeText(node: HastNode): string {
  if (node.type === "text") return node.value as string;
  if (Array.isArray(node.children)) return node.children.map(nodeText).join("");
  return "";
}

/** Rehype plugin: collect <h2> headings into `sink` (runs after rehype-slug). */
function rehypeCollectToc(sink: TocItem[]) {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "h2") {
        const id = node.properties?.id;
        const text = nodeText(node).trim();
        // Skip the paper's own in-body "Table of Contents" heading so the
        // sidebar doesn't list a link to a table of contents.
        if (id && text && !/^table of contents$/i.test(text)) {
          sink.push({ id: String(id), text, level: 2 });
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(tree);
  };
}

/* ── Public API ─────────────────────────────────────────────────────────── */

export async function renderMarkdown(
  markdown: string,
): Promise<{ html: string; toc: TocItem[] }> {
  const toc: TocItem[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeCollectToc, toc)
    .use(rehypeShiki, { theme: "github-dark" })
    .use(rehypeStringify)
    .process(markdown);

  return { html: String(file), toc };
}
