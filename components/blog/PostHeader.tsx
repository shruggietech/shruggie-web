/**
 * PostHeader — Individual blog post header section.
 *
 * Renders category badge, title, author name, date, and reading time
 * in a centered layout within the narrow container.
 *
 * Spec reference: §7.3 (Blog Post Template)
 */

import type { PostMeta } from "@/lib/blog";
import Badge from "@/components/ui/Badge";

interface PostHeaderProps {
  meta: PostMeta;
}

export default function PostHeader({ meta }: PostHeaderProps) {
  return (
    <header className="mb-12 text-center">
      <Badge className="mb-4">{meta.category}</Badge>
      <h1 className="font-display text-display-md font-bold text-text-primary">
        {meta.title}
      </h1>
      <div className="mt-4 flex items-center justify-center gap-3 text-body-sm text-text-muted">
        <span>{meta.author}</span>
        <span>&middot;</span>
        <time dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span>&middot;</span>
        <span>{meta.readingTime}</span>
      </div>
    </header>
  );
}
