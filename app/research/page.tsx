/**
 * Research Page — /research
 *
 * Three publication cards with decorative SVG visuals, glassmorphism
 * treatment, full-card clickability, and section-bg-research background.
 *
 * Spec reference: §6.4 (Research and Publications), §8.2 (JSON-LD),
 *                 Design-Consistency-Plan §4
 */

import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { getAllResearchMeta } from "@/lib/research";
import { generateResearchSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import {
  ADFVisual,
  RustifVisual,
} from "@/components/shared/ResearchVisuals";
import Card from "@/components/ui/Card";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import CTABackground from "@/components/shared/CTABackground";

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Research",
  description:
    "Technical writing and original research from real project work. We publish what we learn.",
  alternates: {
    canonical: `${SITE_URL}/research`,
  },
  openGraph: {
    title: "Research | ShruggieTech",
    description:
      "Technical writing and original research from real project work. We publish what we learn.",
    url: `${SITE_URL}/research`,
    type: "website",
    images: [
      {
        url: getOgImageUrl("Research", { description: "Technical writing and original research from real project work. We publish what we learn." }),
        width: 1200,
        height: 630,
        alt: "Research | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | ShruggieTech",
    description:
      "Technical writing and original research from real project work. We publish what we learn.",
    images: [getOgImageUrl("Research", { description: "Technical writing and original research from real project work. We publish what we learn." })],
  },
};

/* ── Publication Data (spec §6.4) ───────────────────────────────────────── */

/** Decorative visual per paper, keyed by slug. */
const VISUAL_MAP: Record<string, ComponentType> = {
  "affective-dynamics": ADFVisual,
  rustif: RustifVisual,
};

const PUBLICATIONS = getAllResearchMeta().map((meta) => ({
  ...meta,
  href: `/research/${meta.slug}`,
  Visual: VISUAL_MAP[meta.slug],
}));

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ResearchPage() {
  return (
    <>
      {/* JSON-LD for each publication — canonical on-site URL, gist as mirror */}
      {PUBLICATIONS.map((pub) => (
        <JsonLd
          key={pub.slug}
          data={generateResearchSchema({
            type: pub.schemaType,
            title: pub.title,
            author: pub.author,
            datePublished: pub.date,
            dateModified: pub.dateModified,
            description: pub.description,
            url: `${SITE_URL}${pub.href}`,
            sameAs: pub.gistUrl ? [pub.gistUrl] : undefined,
            keywords: pub.keywords,
          })}
        />
      ))}

      {/* Hero */}
      <PageHero
        headline="Research"
        subheadline="Technical writing and original research from real project work. We publish what we learn."
        bgClass="section-bg-research"
      />

      {/* Publication Cards */}
      <section className="section-bg-research pb-24 md:pb-32">
        <div className="container-content flex flex-col gap-8 md:gap-12">
          {PUBLICATIONS.map((pub, i) => (
            <ScrollReveal key={pub.slug} delay={i * 0.1}>
              <Link
                href={pub.href}
                className="group/card block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111318] rounded-xl"
              >
                <Card hover>
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Left column: text content */}
                    <div className="flex flex-1 flex-col gap-2 md:w-[60%] md:flex-none">
                      <h3 className="font-display text-display-xs font-bold text-text-primary">
                        {pub.title}
                      </h3>
                      <p className="mt-2 text-body-sm text-text-muted">
                        {pub.author}
                      </p>
                      <p className="mt-4 text-body-md text-text-secondary dark:text-[var(--text-body-light)]">
                        {pub.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 font-display text-body-md font-medium text-accent transition-colors group-hover/card:text-[#FF5300]">
                        Read paper
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover/card:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    {/* Right column: abstract visual (desktop only) */}
                    <div className="hidden md:flex md:w-[40%] md:items-center md:justify-center">
                      {pub.Visual && <pub.Visual />}
                    </div>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md font-bold text-text-primary">
              Interested in our research?
            </h2>
            <div className="mt-8">
              <ShruggieCTA href="/contact">Get in touch</ShruggieCTA>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
