/**
 * Blog index page — /blog
 *
 * Renders a hero section with headline and subheadline, followed by
 * paginated post cards in a single-column layout at 720px max width.
 *
 * Spec reference: §6.7 (Blog)
 */

import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";
import { getPaginatedPosts } from "@/lib/blog";
import SectionHeading from "@/components/ui/SectionHeading";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/blog/Pagination";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "We write about what we know and show you how to do it yourself. Tutorials, deep-dives, and honest takes on technology, AI, and business.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | ShruggieTech",
    description:
      "We write about what we know and show you how to do it yourself. Tutorials, deep-dives, and honest takes on technology, AI, and business.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams.page ?? "1", 10) || 1);
  const { posts, totalPages, currentPage } = getPaginatedPosts(page);

  return (
    <div className="py-20">
      {/* Hero */}
      <section className="container-narrow mb-16">
        <SectionHeading
          title="Blog"
          description="We write about what we know and show you how to do it yourself. Tutorials, deep-dives, and honest takes on technology, AI, and business. If you would rather have us handle it, that works too."
          align="center"
        />
      </section>

      {/* Post Grid */}
      <section className="container-narrow">
        {posts.length > 0 ? (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-body-lg text-text-muted">
            No posts yet. Check back soon!
          </p>
        )}

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </div>
  );
}
