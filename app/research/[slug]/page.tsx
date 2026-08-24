/**
 * Research paper page — /research/[slug]
 *
 * Canonical, on-site version of each publication (previously only on GitHub
 * gists). Renders the full paper as Markdown, emits ScholarlyArticle or
 * TechArticle JSON-LD whose canonical `url` is this page, and links the gist
 * as a mirror (`sameAs`). Statically generated from content/research/.
 *
 * Spec reference: §6.4 (Research and Publications), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github } from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import {
  getAllResearchMeta,
  getResearchBySlug,
} from "@/lib/research";
import { renderMarkdown } from "@/lib/markdown";
import { generateResearchSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import TableOfContents from "@/components/blog/TableOfContents";

interface ResearchPageProps {
  params: Promise<{ slug: string }>;
}

/* ── Static generation ──────────────────────────────────────────────────── */

export function generateStaticParams() {
  return getAllResearchMeta().map((paper) => ({ slug: paper.slug }));
}

/* ── Metadata ───────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: ResearchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const paper = getResearchBySlug(slug);

  if (!paper) {
    return { title: "Paper Not Found" };
  }

  const { meta } = paper;
  const url = `${SITE_URL}/research/${meta.slug}`;
  const ogImage = getOgImageUrl(meta.title, { author: meta.author });

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: meta.author }],
    alternates: { canonical: url },
    openGraph: {
      title: `${meta.title} | ShruggieTech`,
      description: meta.description,
      url,
      type: "article",
      publishedTime: meta.date,
      modifiedTime: meta.dateModified,
      authors: [meta.author],
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | ShruggieTech`,
      description: meta.description,
      images: [ogImage],
    },
  };
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function ResearchPaperPage({ params }: ResearchPageProps) {
  const { slug } = await params;
  const paper = getResearchBySlug(slug);

  if (!paper) {
    notFound();
  }

  const { meta, content } = paper;
  const { html, toc } = await renderMarkdown(content);
  const url = `${SITE_URL}/research/${meta.slug}`;

  const dateFormatted = new Date(meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <JsonLd
        data={generateResearchSchema({
          type: meta.schemaType,
          title: meta.title,
          author: meta.author,
          datePublished: meta.date,
          dateModified: meta.dateModified,
          description: meta.description,
          url,
          sameAs: meta.gistUrl ? [meta.gistUrl] : undefined,
          keywords: meta.keywords,
        })}
      />

      <article className="py-20">
        {/* Header */}
        <div className="mx-auto max-w-[900px] px-[var(--padding-x)]">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-body-sm text-text-secondary transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Research
          </Link>

          <h1 className="mt-8 font-display text-display-md font-bold text-text-primary">
            {meta.title}
          </h1>

          {meta.subtitle && (
            <p className="mt-4 text-body-lg text-text-secondary">
              {meta.subtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-text-muted">
            <span>{meta.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={meta.date}>{dateFormatted}</time>
            <span aria-hidden="true">·</span>
            <span>{meta.readingTime}</span>
          </div>

          {/* Mirror notice — this page is canonical; the gist is a mirror */}
          {meta.gistUrl && (
            <div className="mt-8 rounded-lg border border-border bg-bg-elevated p-4 text-body-sm text-text-secondary dark:border-white/[0.06] dark:bg-white/[0.02]">
              This is the canonical version of this paper. A mirror is also
              published on{" "}
              <a
                href={meta.gistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent hover:text-accent-hover"
              >
                <Github size={14} aria-hidden="true" />
                GitHub
              </a>
              .
            </div>
          )}

          <div className="mt-8 border-t border-accent/10" />
        </div>

        {/* Collapsible ToC for screens below xl — sticky below header */}
        {toc.length > 0 && (
          <div className="sticky top-16 z-10 mt-8 bg-bg-primary py-3 xl:hidden">
            <div className="mx-auto max-w-[900px] px-[var(--padding-x)]">
              <TableOfContents headings={toc} collapsible />
            </div>
          </div>
        )}

        {/* Body — optional desktop ToC sidebar */}
        <div className="mx-auto mt-10 max-w-[900px] px-[var(--padding-x)] xl:flex xl:max-w-[1400px] xl:gap-16">
          {toc.length > 0 && (
            <aside className="hidden w-[260px] shrink-0 xl:block">
              <TableOfContents headings={toc} className="sticky top-24" />
            </aside>
          )}
          <div
            className="prose prose-lg dark:prose-invert mx-auto min-w-0 max-w-none flex-1 xl:mx-0 prose-pre:bg-transparent prose-pre:m-0 prose-pre:border-0 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 [&_h4]:scroll-mt-24 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_span]:!bg-transparent [&_table]:block [&_table]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>
    </>
  );
}
