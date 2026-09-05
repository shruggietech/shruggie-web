import type { Image, Link, Nodes, Text } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export interface MarkdownPolicyIssue {
  line?: number;
  message: string;
}

const executableModulePattern =
  /^\s*(?:import\s+.+\s+from\s+["']|export\s+(?:default|const|let|var|function|class|\{))/m;

function isAllowedLink(url: string): boolean {
  if (url.startsWith("#") || (url.startsWith("/") && !url.startsWith("//"))) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function isStableAssetUrl(url: string): boolean {
  if (url.startsWith("/media/") || url.startsWith("/images/")) return true;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function issueForNode(node: Nodes, message: string): MarkdownPolicyIssue {
  return { line: node.position?.start.line, message };
}

/**
 * Inspect author-controlled Markdown before it reaches a renderer.
 *
 * The accepted feature set is CommonMark plus GFM tables, task lists,
 * strikethrough, and autolinks. Raw HTML, JSX, MDX expressions/modules, unsafe
 * link schemes, and images without alternatives are deliberately rejected.
 */
export function inspectMarkdown(markdown: string): MarkdownPolicyIssue[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const issues: MarkdownPolicyIssue[] = [];

  visit(tree, (node: Nodes) => {
    if (node.type === "html") {
      issues.push(
        issueForNode(
          node,
          "Raw HTML and JSX are not allowed; use supported Markdown instead.",
        ),
      );
      return;
    }

    if (node.type === "text") {
      const value = (node as Text).value;
      if (value.includes("{") || value.includes("}")) {
        issues.push(
          issueForNode(
            node,
            "MDX expressions are not allowed in article Markdown.",
          ),
        );
      }
      if (executableModulePattern.test(value)) {
        issues.push(
          issueForNode(
            node,
            "Import and export statements are not allowed in article Markdown.",
          ),
        );
      }
      return;
    }

    if (node.type === "link") {
      const link = node as Link;
      if (!isAllowedLink(link.url)) {
        issues.push(
          issueForNode(node, `The link URL "${link.url}" is unsafe.`),
        );
      }
      return;
    }

    if (node.type === "image") {
      const image = node as Image;
      if (!image.alt?.trim()) {
        issues.push(
          issueForNode(node, "Markdown images require descriptive alt text."),
        );
      }
      if (!isStableAssetUrl(image.url)) {
        issues.push(
          issueForNode(
            node,
            "Markdown images must use a stable HTTPS or project media URL.",
          ),
        );
      }
    }
  });

  return issues;
}
