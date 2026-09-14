/**
 * AI skill detail page — /skills/[slug]
 *
 * Seven statically generated, indexable pages derived from lib/skills.ts.
 * Each page publishes SoftwareSourceCode and BreadcrumbList JSON-LD without
 * presenting the repository-wide collection release as a per-skill version.
 *
 * Spec reference: §6.12 (AI Skills Catalog), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Download,
  ExternalLink,
  GitBranch,
  Scale,
} from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { SKILLS, SKILLS_COLLECTION, getSkillBySlug } from "@/lib/skills";
import { generateBreadcrumbSchema, generateSoftwareSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CTABackground from "@/components/shared/CTABackground";

interface SkillDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SKILLS.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: SkillDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getSkillBySlug(slug);

  if (!entry) return { title: "Skill Not Found" };

  const url = `${SITE_URL}/skills/${entry.slug}`;
  const ogImage = getOgImageUrl(entry.name, { description: entry.purpose });

  return {
    title: entry.name,
    description: entry.purpose,
    alternates: { canonical: url },
    openGraph: {
      title: `${entry.name} | ShruggieTech`,
      description: entry.purpose,
      url,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${entry.name} | ShruggieTech`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.name} | ShruggieTech`,
      description: entry.purpose,
      images: [ogImage],
    },
  };
}

export default async function SkillDetailPage({
  params,
}: SkillDetailPageProps) {
  const { slug } = await params;
  const entry = getSkillBySlug(slug);

  if (!entry) notFound();

  const url = `${SITE_URL}/skills/${entry.slug}`;
  const otherSkills = SKILLS.filter(
    (candidate) => candidate.slug !== entry.slug,
  );

  return (
    <>
      <JsonLd
        data={generateSoftwareSchema({
          name: entry.name,
          description: entry.purpose,
          url,
          codeRepository: SKILLS_COLLECTION.repositoryUrl,
          programmingLanguage: "Markdown",
        })}
      />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "AI Skills", url: `${SITE_URL}/skills` },
          { name: entry.name, url },
        ])}
      />

      <PageHero
        headline={entry.name}
        subheadline={entry.purpose}
        bgClass="section-bg-products"
      >
        <nav aria-label="Breadcrumb" className="mt-8">
          <ol className="text-body-sm text-text-secondary flex items-center gap-2">
            <li>
              <Link href="/skills" className="hover:text-accent">
                AI Skills
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="text-text-muted h-3.5 w-3.5" />
            </li>
            <li className="text-text-primary font-medium">{entry.name}</li>
          </ol>
        </nav>
      </PageHero>

      <section className="bg-bg-primary py-16 md:py-24">
        <div className="container-content grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-start">
          <div>
            <ScrollReveal>
              <h2 className="font-display text-display-sm text-text-primary font-bold">
                When it runs
              </h2>
              <p className="text-body-lg text-text-secondary mt-5 max-w-3xl leading-relaxed">
                {entry.triggerSummary}
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-14">
                <h2 className="font-display text-display-sm text-text-primary font-bold">
                  What it enforces
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {entry.enforces.map((rule) => (
                    <li
                      key={rule}
                      className="border-border bg-bg-elevated text-body-md text-text-secondary flex items-start gap-3 rounded-xl border p-5 dark:border-white/[0.06] dark:bg-white/[0.025]"
                    >
                      <Check
                        aria-hidden="true"
                        className="text-accent mt-0.5 h-5 w-5 shrink-0"
                      />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.08}>
            <Card className="lg:sticky lg:top-24">
              <Badge>Collection v{SKILLS_COLLECTION.collectionRelease}</Badge>
              <p className="text-body-sm text-text-secondary mt-5 leading-relaxed">
                This is the shared collection release that packages the skill,
                not a claim that this skill changed in every repository release.
              </p>

              <dl className="border-border mt-6 space-y-4 border-t pt-6 dark:border-white/[0.08]">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    aria-hidden="true"
                    className="text-accent mt-0.5 h-4 w-4 shrink-0"
                  />
                  <div>
                    <dt className="text-body-xs text-text-muted tracking-wide uppercase">
                      Skill updated
                    </dt>
                    <dd className="text-body-sm text-text-primary mt-1">
                      <time dateTime={entry.lastUpdated}>
                        {entry.lastUpdated}
                      </time>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scale
                    aria-hidden="true"
                    className="text-accent mt-0.5 h-4 w-4 shrink-0"
                  />
                  <div>
                    <dt className="text-body-xs text-text-muted tracking-wide uppercase">
                      License
                    </dt>
                    <dd className="text-body-sm text-text-primary mt-1">
                      {SKILLS_COLLECTION.license}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={entry.downloadUrl}
                  className="bg-cta font-display focus-visible:outline-focus inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium text-white transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Download zip
                </a>
                <a
                  href={entry.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border font-display text-text-primary hover:border-accent hover:text-accent focus-visible:outline-focus inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <GitBranch aria-hidden="true" className="h-4 w-4" />
                  Inspect source
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-bg-products py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <h2 className="font-display text-display-sm text-text-primary font-bold">
              Explore the rest of the collection
            </h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherSkills.map((other, index) => (
              <ScrollReveal key={other.slug} delay={index * 0.04}>
                <Link
                  href={`/skills/${other.slug}`}
                  className="border-border bg-bg-elevated group hover:border-accent/40 flex items-center justify-between gap-3 rounded-xl border p-5 transition-colors dark:border-white/[0.06] dark:bg-white/[0.025]"
                >
                  <span className="font-display text-body-md text-text-primary font-bold">
                    {other.name}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="text-accent h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md text-text-primary font-bold">
              Start with the full collection.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/skills"
                className="bg-cta font-display focus-visible:outline-focus inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Browse all skills
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href={SKILLS_COLLECTION.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border font-display text-text-primary hover:border-accent hover:text-accent focus-visible:outline-focus inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                GitHub repository
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
