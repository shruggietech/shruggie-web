/**
 * MDXComponents — Custom renderers for MDX blog content.
 *
 * Overrides default HTML elements to apply ShruggieTech design system
 * styling. Includes a custom Callout component for info/warning boxes.
 *
 * Spec reference: §7.3 (Blog Post Template)
 */

import type { MDXComponents } from "mdx/types";
import type { ReactNode, HTMLAttributes } from "react";

import { cn, slugify } from "@/lib/utils";
import CopyCodeBlock from "@/components/blog/CopyCodeBlock";

/** Recursively extract text content from React children. */
function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    const el = node as { props: { children?: ReactNode } };
    return getTextContent(el.props.children);
  }
  return "";
}

interface CalloutProps {
  type?: "info" | "warning";
  children: ReactNode;
}

function Callout({ type = "info", children }: CalloutProps) {
  return (
    <aside
      role="note"
      className={cn(
        "my-6 rounded-lg border-l-4 p-4",
        type === "info" && "border-accent bg-[rgba(43,204,115,0.06)]",
        type === "warning" && "border-cta bg-[rgba(255,83,0,0.06)]",
      )}
    >
      {children}
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, id, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugify(getTextContent(children));
    return (
      <h2
        id={headingId}
        className="mt-12 mb-4 scroll-mt-24 font-display text-display-sm font-bold text-text-primary"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, id, ...props }: HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugify(getTextContent(children));
    return (
      <h3
        id={headingId}
        className="mt-8 mb-3 scroll-mt-24 font-display text-[1.375rem] font-bold text-text-primary"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="mb-5 text-body-md leading-relaxed text-text-secondary"
      {...props}
    >
      {children}
    </p>
  ),
  a: ({
    href,
    children,
    ...props
  }: HTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
    <a
      href={href}
      className="text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent"
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, ...props }: HTMLAttributes<HTMLElement>) => {
    // If the code element is inside a <pre> (syntax-highlighted block),
    // Shiki handles styling — pass through without extra classes.
    const isBlock =
      props.className?.includes("language-") ||
      props.style !== undefined;

    if (isBlock) {
      return (
        <code {...props}>{children}</code>
      );
    }

    return (
      <code
        className="rounded bg-bg-secondary px-1.5 py-0.5 font-mono text-body-sm text-accent"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: ({ children, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-6 italic text-text-muted"
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: CopyCodeBlock,
  Callout: Callout as unknown as React.ComponentType,
};
