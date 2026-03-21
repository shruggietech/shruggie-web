/**
 * Individual case study page — /work/[slug]
 *
 * Premium dark layout with PageHero, full-width DeviceMockup screenshot,
 * MDX body with dark-mode optimized typography, service badges in a
 * glassmorphism card, and ShruggieCTA at the bottom.
 *
 * Spec reference: §6.3 (Work / Case Studies),
 * ShruggieTech-Site-Design-Consistency-Plan §3.4
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import fs from "fs";
import path from "path";

import Link from "next/link";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { SERVICE_ANCHOR_MAP } from "@/lib/service-links";
import { getAllCaseStudiesMeta, getCaseStudyBySlug } from "@/lib/work";
import { mdxComponents } from "@/components/blog/MDXComponents";
import CTABackground from "@/components/shared/CTABackground";
import PageHero from "@/components/shared/PageHero";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";

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

    // Priority chain: heroImage (if non-empty) → dynamic /api/og card
    const ogImageUrl = meta.heroImage
      ? `${SITE_URL}${meta.heroImage}`
      : getOgImageUrl(`${meta.client} — ${meta.title}`);

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
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${meta.client} case study`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${meta.client} — ${meta.title} | ShruggieTech`,
        description: meta.summary,
        images: [ogImageUrl],
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
    <article>
      {/* PageHero */}
      <PageHero
        headline={meta.title}
        subheadline={meta.summary}
        bgClass="section-bg-work"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge>{meta.industry}</Badge>
          <span className="text-body-sm dark:text-[var(--text-muted-warm)] text-text-muted">
            {meta.client}
          </span>
        </div>
      </PageHero>

      {/* Full-Width DeviceMockup Screenshot */}
      <section className="section-bg-work py-8 md:py-12">
        <div className="container-content">
          <ScrollReveal>
            <DeviceMockup
              variant="browser"
              src={hasHeroImage ? meta.heroImage : undefined}
              alt={`${meta.client} case study screenshot`}
              placeholderLabel={meta.client}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* MDX Body */}
      <section className="bg-bg-primary py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-[var(--padding-x)]">
          <div className="prose prose-lg dark:prose-invert max-w-none dark:text-[var(--text-body-light)]">
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
      </section>

      {/* Services Used */}
      {meta.services.length > 0 && (
        <section className="bg-bg-primary pb-12 md:pb-16">
          <div className="mx-auto max-w-[900px] px-[var(--padding-x)]">
            <ScrollReveal>
              <Card>
                <h2 className="mb-4 font-display text-display-xs font-bold text-text-primary dark:text-[var(--text-hero)]">
                  Services Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {meta.services.map((service: string) => {
                    const anchor = SERVICE_ANCHOR_MAP[service];
                    return anchor ? (
                      <Link key={service} href={anchor}>
                        <Badge className="transition-colors hover:bg-accent/30 hover:text-white cursor-pointer">
                          {service}
                        </Badge>
                      </Link>
                    ) : (
                      <Badge key={service}>{service}</Badge>
                    );
                  })}
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-sm font-bold text-text-primary dark:text-[var(--text-hero)] mb-6">
              Ready to see results like these?
            </h2>
            <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
          </ScrollReveal>
        </div>
      </CTABackground>
    </article>
  );
}
