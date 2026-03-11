/**
 * PostCard — Blog index card component.
 *
 * Renders a clickable card for the blog index with title, date,
 * reading time, author, category badge, and 2-line excerpt.
 *
 * Spec reference: §6.7 (Blog), §7.2 (MDX Pipeline)
 */

import Link from "next/link";

import type { PostMeta } from "@/lib/blog";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

interface PostCardProps {
  post: PostMeta;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="transition-all duration-300 group-hover:border-accent/40">
        <div className="flex flex-col gap-3">
          {/* Category + Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{post.category}</Badge>
            <span className="text-body-xs text-text-muted">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-body-xs text-text-muted">
              &middot; {post.readingTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-display-xs font-bold text-text-primary transition-colors group-hover:text-accent">
            {post.title}
          </h3>

          {/* Excerpt (2-line clamp) */}
          <p className="line-clamp-2 text-body-md text-text-secondary">
            {post.excerpt}
          </p>

          {/* Author */}
          <p className="text-body-sm text-text-muted">By {post.author}</p>
        </div>
      </Card>
    </Link>
  );
}
