/**
 * Work (Case Studies) index page — /work
 *
 * Premium dark layout matching the homepage "Our Work" section:
 * PageHero with section-bg-work, DeviceMockup browser frames,
 * glassmorphism cards, orange hover on "Read case study" links,
 * and ShruggieCTA at the bottom.
 *
 * Spec reference: §6.3 (Work / Case Studies),
 * ShruggieTech-Site-Design-Consistency-Plan §3
 */

import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ExternalLink } from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { BRAND_PORTFOLIO } from "@/lib/company-work";
import { getAllCaseStudiesMeta, type CaseStudyMeta } from "@/lib/work";
import PageHero from "@/components/shared/PageHero";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CTABackground from "@/components/shared/CTABackground";
import BrandPortfolioVisual from "@/components/shared/BrandPortfolioVisual";

export const metadata: Metadata = {
  title: "Work",
  description:
    "No mock-ups. No hypotheticals. Every project on this page shipped.",
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "Work | ShruggieTech",
    description:
      "No mock-ups. No hypotheticals. Every project on this page shipped.",
    url: `${SITE_URL}/work`,
    type: "website",
    images: [
      {
        url: getOgImageUrl("Our Work", {
          description:
            "No mock-ups. No hypotheticals. Every project on this page shipped.",
        }),
        width: 1200,
        height: 630,
        alt: "Our Work | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | ShruggieTech",
    description:
      "No mock-ups. No hypotheticals. Every project on this page shipped.",
    images: [
      getOgImageUrl("Our Work", {
        description:
          "No mock-ups. No hypotheticals. Every project on this page shipped.",
      }),
    ],
  },
};

function heroImageExists(heroImage: string): boolean {
  if (!heroImage) return false;
  const absolutePath = path.join(process.cwd(), "public", heroImage);
  return fs.existsSync(absolutePath);
}

function CaseStudyCard({ study }: { study: CaseStudyMeta }) {
  const hasHeroImage = heroImageExists(study.heroImage);

  return (
    <Link href={`/work/${study.slug}`} className="group block h-full">
      <Card className="group-hover:border-accent/40 flex h-full flex-col overflow-hidden transition-all duration-300">
        {/* DeviceMockup Screenshot */}
        <div className="-mx-6 -mt-6 mb-6 bg-black/20 p-4 md:-mx-8 md:-mt-8 md:mb-8 md:p-6">
          <DeviceMockup
            variant="browser"
            src={hasHeroImage ? study.heroImage : undefined}
            alt={`${study.client} case study screenshot`}
            placeholderLabel={study.client}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{study.industry}</Badge>
          </div>

          <h3 className="font-display text-display-xs text-text-primary group-hover:text-accent font-bold transition-colors dark:text-[var(--text-hero)]">
            {study.client}
          </h3>

          <p className="text-body-md text-text-secondary dark:text-[var(--text-body-light)]">
            {study.summary}
          </p>

          <span className="text-body-sm text-accent group-hover:text-orange-foreground mt-auto font-medium transition-colors">
            Read case study &rarr;
          </span>
        </div>
      </Card>
    </Link>
  );
}

function BrandPortfolioCard() {
  return (
    <a
      href={BRAND_PORTFOLIO.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group focus-visible:outline-focus block h-full focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Card className="group-hover:border-accent/40 flex h-full flex-col overflow-hidden transition-all duration-300">
        <div className="-mx-6 -mt-6 mb-6 aspect-video border-b border-white/[0.06] md:-mx-8 md:-mt-8 md:mb-8">
          <BrandPortfolioVisual />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{BRAND_PORTFOLIO.typeLabel}</Badge>
          </div>

          <h3 className="font-display text-display-xs text-text-primary group-hover:text-accent font-bold transition-colors dark:text-[var(--text-hero)]">
            {BRAND_PORTFOLIO.name}
          </h3>

          <p className="text-body-md text-text-secondary dark:text-[var(--text-body-light)]">
            {BRAND_PORTFOLIO.description}
          </p>

          <span className="text-body-sm text-accent group-hover:text-orange-foreground mt-auto inline-flex items-center gap-2 font-medium transition-colors">
            {BRAND_PORTFOLIO.linkLabel}
            <ExternalLink size={16} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </span>
        </div>
      </Card>
    </a>
  );
}

export default function WorkPage() {
  const studies = getAllCaseStudiesMeta();

  return (
    <div>
      {/* Hero */}
      <PageHero
        headline="Work"
        subheadline="Real results for real businesses. See for yourself."
        bgClass="section-bg-work"
      />

      {/* Case Study Grid */}
      <section className="bg-bg-primary py-16 md:py-24">
        <div className="container-content">
          <h2 className="sr-only">Featured work</h2>
          {studies.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <ScrollReveal className="h-full">
                <BrandPortfolioCard />
              </ScrollReveal>
              {studies.map((study, i) => (
                <ScrollReveal
                  key={study.slug}
                  delay={(i + 1) * 0.1}
                  className="h-full"
                >
                  <CaseStudyCard study={study} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="text-body-lg text-text-muted text-center">
              No case studies yet. Check back soon!
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md text-text-primary font-bold">
              Ready to see results like these?
            </h2>
            <div className="mt-8">
              <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </div>
  );
}
