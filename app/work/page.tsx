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

import { SITE_URL } from "@/lib/constants";
import { getAllCaseStudiesMeta, type CaseStudyMeta } from "@/lib/work";
import PageHero from "@/components/shared/PageHero";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CTABackground from "@/components/shared/CTABackground";

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
      <Card className="overflow-hidden transition-all duration-300 group-hover:border-accent/40 h-full flex flex-col">
        {/* DeviceMockup Screenshot */}
        <div className="-mx-6 -mt-6 mb-6 md:-mx-8 md:-mt-8 md:mb-8 p-4 md:p-6 bg-black/20">
          <DeviceMockup
            variant="browser"
            src={hasHeroImage ? study.heroImage : undefined}
            alt={`${study.client} case study screenshot`}
            placeholderLabel={study.client}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{study.industry}</Badge>
          </div>

          <h3 className="font-display text-display-xs font-bold text-text-primary dark:text-[var(--text-hero)] transition-colors group-hover:text-accent">
            {study.client}
          </h3>

          <p className="text-body-md text-text-secondary dark:text-[var(--text-body-light)]">
            {study.summary}
          </p>

          <span className="text-body-sm font-medium text-accent transition-colors group-hover:text-[#FF5300] mt-auto">
            Read case study &rarr;
          </span>
        </div>
      </Card>
    </Link>
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
          {studies.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {studies.map((study, i) => (
                <ScrollReveal key={study.slug} delay={i * 0.1} className="h-full">
                  <CaseStudyCard study={study} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-body-lg text-text-muted">
              No case studies yet. Check back soon!
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md font-bold text-text-primary">
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
