/**
 * Individual blog post page — /blog/[slug]
 *
 * Renders a full blog post with PostHeader, MDX body (via next-mdx-remote/rsc),
 * Shiki syntax highlighting, and BlogPosting JSON-LD schema.
 *
 * Uses generateStaticParams to pre-render all published posts at build time.
 *
 * Spec references: §7.2 (MDX Pipeline), §7.3 (Blog Post Template), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import { draftMode, headers } from "next/headers";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import rehypeShiki from "@shikijs/rehype";
import { cache } from "react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import {
  getAllPostsMeta,
  getPostBySlug,
  getPreviewPostBySlug,
} from "@/lib/blog";
import { requireEditor } from "@/lib/editorial/http";
import { extractHeadings } from "@/lib/utils";
import { generateBlogPostSchema } from "@/lib/schema";
import { mdxComponents } from "@/components/blog/MDXComponents";
import PostHeader from "@/components/blog/PostHeader";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBox from "@/components/blog/AuthorBox";
import PostCTA from "@/components/blog/PostCTA";
import JsonLd from "@/components/shared/JsonLd";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const isAuthorizedDraftPreview = cache(async () => {
  const mode = await draftMode();
  if (!mode.isEnabled) return false;

  try {
    const requestHeaders = new Headers(await headers());
    await requireEditor(new Request(SITE_URL, { headers: requestHeaders }));
    return true;
  } catch {
    return false;
  }
});

async function getPostForRequest(slug: string) {
  const preview = await isAuthorizedDraftPreview();
  return {
    post: preview
      ? await getPreviewPostBySlug(slug)
      : await getPostBySlug(slug),
    preview,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPostsMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const { post, preview } = await getPostForRequest(resolvedParams.slug);
    const { meta } = post;

    // Priority chain: ogImage → featuredImage → dynamic /api/og card
    const ogImageUrl = meta.ogImage
      ? meta.ogImage.startsWith("http")
        ? meta.ogImage
        : `${SITE_URL}${meta.ogImage}`
      : meta.featuredImage
        ? `${SITE_URL}${meta.featuredImage}`
        : getOgImageUrl(meta.title, { author: meta.author });

    return {
      title: meta.title,
      description: meta.excerpt,
      robots: preview
        ? { index: false, follow: false, noarchive: true }
        : undefined,
      alternates: {
        canonical: `${SITE_URL}/blog/${meta.slug}`,
      },
      openGraph: {
        title: `${meta.title} | ShruggieTech`,
        description: meta.excerpt,
        url: `${SITE_URL}/blog/${meta.slug}`,
        type: "article",
        publishedTime: meta.date,
        authors: [meta.author],
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: meta.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${meta.title} | ShruggieTech`,
        description: meta.excerpt,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;

  let post;
  let preview = false;
  try {
    const result = await getPostForRequest(resolvedParams.slug);
    post = result.post;
    preview = result.preview;
  } catch {
    notFound();
  }

  const { meta, content } = post;

  // In production, don't render unpublished posts
  if (process.env.NODE_ENV === "production" && !meta.published && !preview) {
    notFound();
  }

  const headings = extractHeadings(content);

  return (
    <>
      {!preview && <JsonLd data={generateBlogPostSchema(meta)} />}
      {preview && (
        <div className="border-accent/30 bg-accent/10 border-b">
          <div className="mx-auto flex max-w-[var(--max-width-content)] flex-wrap items-center justify-between gap-3 px-[var(--padding-x)] py-3">
            <p className="text-body-sm font-medium">
              Draft preview — this saved revision has not been published.
            </p>
            <a
              href="/api/admin/preview/exit"
              className="focus-visible:outline-focus border-border hover:border-accent hover:text-accent rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Exit preview
            </a>
          </div>
        </div>
      )}
      <article className="py-20">
        {/* Header — always centered */}
        <div className="mx-auto max-w-[900px] px-[var(--padding-x)]">
          <PostHeader meta={meta} />
        </div>

        {/* Featured image — full container width */}
        {meta.featuredImage && (
          <div className="mx-auto mt-12 max-w-[var(--max-width-content)] px-[var(--padding-x)]">
            <div className="border-border bg-bg-secondary overflow-hidden rounded-lg border">
              <Image
                src={meta.featuredImage!}
                alt={meta.featuredImageAlt ?? meta.title}
                width={1400}
                height={788}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[900px] px-[var(--padding-x)]">
          <div className="border-accent/10 mt-12 border-t" />
        </div>

        {/* Collapsible ToC for screens below xl — sticky below header */}
        {headings.length > 0 && (
          <div className="bg-bg-primary sticky top-16 z-10 mt-8 py-3 xl:hidden">
            <div className="mx-auto max-w-[900px] px-[var(--padding-x)]">
              <TableOfContents headings={headings} collapsible />
            </div>
          </div>
        )}

        {/* Content area with optional desktop ToC sidebar */}
        <div className="mx-auto mt-12 max-w-[900px] px-[var(--padding-x)] xl:flex xl:max-w-[1400px] xl:gap-16">
          {headings.length > 0 && (
            <aside className="hidden w-[260px] shrink-0 xl:block">
              <TableOfContents headings={headings} className="sticky top-24" />
            </aside>
          )}
          <div className="prose prose-lg dark:prose-invert prose-pre:bg-transparent prose-pre:m-0 prose-pre:border-0 mx-auto max-w-[900px] min-w-0 flex-1 xl:mx-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_span]:!bg-transparent">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
                },
              }}
            />
            <PostCTA />
            <AuthorBox authorName={meta.author} />
          </div>
        </div>
      </article>
    </>
  );
}
