/**
 * Blog index page — /blog
 *
 * Renders a hero section with headline and subheadline, followed by
 * paginated post cards in a single-column layout at 720px max width.
 *
 * Spec reference: §6.7 (Blog)
 */

import type { Metadata } from "next";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { getPaginatedPosts } from "@/lib/blog";
import PageHero from "@/components/shared/PageHero";
import PostCard from "@/components/blog/PostCard";
import Pagination from "@/components/blog/Pagination";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import CTABackground from "@/components/shared/CTABackground";

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
    images: [
      {
        url: getOgImageUrl("Blog"),
        width: 1200,
        height: 630,
        alt: "Blog | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | ShruggieTech",
    description:
      "We write about what we know and show you how to do it yourself. Tutorials, deep-dives, and honest takes on technology, AI, and business.",
    images: [getOgImageUrl("Blog")],
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
    <div>
      {/* Hero */}
      <PageHero
        headline="Blog"
        subheadline="We write about what we know and show you how to do it yourself. Tutorials, deep-dives, and honest takes on technology, AI, and business. If you would rather have us handle it, that works too."
        bgClass="bg-bg-secondary"
      />

      {/* Post Grid */}
      <section className="container-content pt-12 md:pt-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* CTA */}
      <CTABackground>
        <div className="container-content text-center">
          <p className="mb-6 text-body-lg text-text-secondary">
            Want to talk tech or explore a project idea?
          </p>
          <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
        </div>
      </CTABackground>
    </div>
  );
}
