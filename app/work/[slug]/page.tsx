/**
 * Individual case study page — /work/[slug]
 *
 * Renders a full case study with hero header, MDX body (via next-mdx-remote/rsc),
 * Shiki syntax highlighting, and services used section.
 *
 * Uses generateStaticParams to pre-render all published case studies at build time.
 * Reuses MDXComponents from the blog pipeline per sprint plan Item 9.
 *
 * Spec reference: §6.3 (Work / Case Studies)
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import Image from "next/image";
import fs from "fs";
import path from "path";

import { SITE_URL } from "@/lib/constants";
import { getAllCaseStudiesMeta, getCaseStudyBySlug } from "@/lib/work";
import { mdxComponents } from "@/components/blog/MDXComponents";
import Badge from "@/components/ui/Badge";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const studies = getAllCaseStudiesMeta();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const { meta } = getCaseStudyBySlug(resolvedParams.slug);

    return {
      title: `${meta.client} — ${meta.title}`,
      description: meta.summary,
      alternates: {
        canonical: `${SITE_URL}/work/${meta.slug}`,
      },
      openGraph: {
        title: `${meta.client} — ${meta.title} | ShruggieTech`,
        description: meta.summary,
        url: `${SITE_URL}/work/${meta.slug}`,
        type: "article",
        images: meta.heroImage
          ? [{ url: `${SITE_URL}${meta.heroImage}` }]
          : [{ url: `${SITE_URL}/images/og/default.png` }],
      },
    };
  } catch {
    return {
      title: "Case Study Not Found",
    };
  }
}

function heroImageExists(heroImage: string): boolean {
  if (!heroImage) return false;
  const absolutePath = path.join(process.cwd(), "public", heroImage);
  return fs.existsSync(absolutePath);
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const resolvedParams = await params;

  let study;
  try {
    study = getCaseStudyBySlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  const { meta, content } = study;

  // In production, don't render unpublished case studies
  if (process.env.NODE_ENV === "production" && !meta.published) {
    notFound();
  }

  const hasHeroImage = heroImageExists(meta.heroImage);

  return (
    <article className="py-20">
      {/* Header */}
      <header className="container-narrow mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge>{meta.industry}</Badge>
          <span className="text-body-sm text-text-muted">
            {new Date(meta.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="font-display text-display-lg font-bold text-text-primary">
          {meta.title}
        </h1>
        <p className="mt-2 font-display text-display-xs text-accent">
          {meta.client}
        </p>
        <p className="mt-4 text-body-lg text-text-secondary">{meta.summary}</p>
      </header>

      {/* Hero Image */}
      {hasHeroImage && (
        <div className="container-content mb-12">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
            <Image
              src={meta.heroImage}
              alt={`${meta.client} case study screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      {/* MDX Body */}
      <div className="container-narrow">
        <div className="prose prose-lg dark:prose-invert max-w-none">
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
      </div>

      {/* Services Used */}
      {meta.services.length > 0 && (
        <div className="container-narrow mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-display text-display-xs font-bold text-text-primary">
            Services Used
          </h2>
          <div className="flex flex-wrap gap-2">
            {meta.services.map((service: string) => (
              <Badge key={service}>{service}</Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
