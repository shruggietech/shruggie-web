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
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";

import { SITE_URL } from "@/lib/constants";
import { getAllPostsMeta, getPostBySlug } from "@/lib/blog";
import { generateBlogPostSchema } from "@/lib/schema";
import { mdxComponents } from "@/components/blog/MDXComponents";
import PostHeader from "@/components/blog/PostHeader";
import JsonLd from "@/components/shared/JsonLd";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPostsMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const { meta } = getPostBySlug(resolvedParams.slug);

    return {
      title: meta.title,
      description: meta.excerpt,
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
        images: meta.ogImage
          ? [{ url: meta.ogImage }]
          : [{ url: `${SITE_URL}/images/og/default.png` }],
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
  try {
    post = getPostBySlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  const { meta, content } = post;

  // In production, don't render unpublished posts
  if (process.env.NODE_ENV === "production" && !meta.published) {
    notFound();
  }

  return (
    <>
      <JsonLd data={generateBlogPostSchema(meta)} />
      <article className="container-narrow py-20">
        <PostHeader meta={meta} />
        <div className="border-t border-accent/10 mt-12" />
        <div className="prose prose-lg dark:prose-invert mt-12 max-w-none">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
              },
            }}
          />
        </div>
      </article>
    </>
  );
}
