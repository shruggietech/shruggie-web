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
import { ExternalLink } from "lucide-react";

import { SITE_URL } from "@/lib/constants";
import { generateTechArticleSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import {
  ADFVisual,
  MultiAgentVisual,
  RustifVisual,
} from "@/components/shared/ResearchVisuals";
import Card from "@/components/ui/Card";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import CTABackground from "@/components/shared/CTABackground";

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Research",
  description:
    "Original research and technical writing from the ShruggieTech team. We publish what we learn.",
  alternates: {
    canonical: `${SITE_URL}/research`,
  },
  openGraph: {
    title: "Research | ShruggieTech",
    description:
      "Original research and technical writing from the ShruggieTech team. We publish what we learn.",
    url: `${SITE_URL}/research`,
    type: "website",
  },
};

/* ── Publication Data (spec §6.4) ───────────────────────────────────────── */

interface Publication {
  id: string;
  title: string;
  author: string;
  description: string;
  datePublished: string;
  href: string;
  Visual: ComponentType;
}

const PUBLICATIONS: Publication[] = [
  {
    id: "adf",
    title:
      "Affective Dynamics Framework: A Systematic Approach to Simulating Human-Like Emotional States and Relational Bonding in AI Agents",
    author: "William Thompson",
    description:
      "A mathematically grounded specification for producing emergent, non-linear emotional behavior and relational bonding in AI agents. Extends Brian Roemmele's Love Equation into a real-time personality engine for agentic architectures.",
    datePublished: "2025-01-15",
    href: "https://gist.github.com/h8rt3rmin8r/f4589f0afb6fcd10d4c499e4a29247ad",
    Visual: ADFVisual,
  },
  {
    id: "multi-agent-guide",
    title:
      "Multi-Agent Coding Workflows for Solo Developers and Small Teams",
    author: "William Thompson",
    description:
      "A practical field manual for multi-agent coding workflows: sequential sessions, parallel independent agents, coordinated teams, and the admin-coding divide that makes it all work.",
    datePublished: "2025-02-20",
    href: "https://gist.github.com/h8rt3rmin8r/eebd74f49b0ff5325148105b80fcf37b",
    Visual: MultiAgentVisual,
  },
  {
    id: "rustif-declaration",
    title: "rustif: A Next-Generation Metadata Processing Engine",
    author: "William Thompson",
    description:
      "The case for building a Rust-native metadata processing engine to succeed ExifTool. Ecosystem analysis, architectural specification, security threat model, and a call for contributors.",
    datePublished: "2025-03-01",
    href: "https://gist.github.com/h8rt3rmin8r/b20a59e60f039b7a8bccbf67288226de",
    Visual: RustifVisual,
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ResearchPage() {
  return (
    <>
      {/* JSON-LD for each publication */}
      {PUBLICATIONS.map((pub) => (
        <JsonLd
          key={pub.id}
          data={generateTechArticleSchema({
            title: pub.title,
            author: pub.author,
            datePublished: pub.datePublished,
            description: pub.description,
            url: pub.href === "#" ? `${SITE_URL}/research` : pub.href,
          })}
        />
      ))}

      {/* Hero */}
      <PageHero
        headline="Research"
        subheadline="Original research and technical writing from the ShruggieTech team. We publish what we learn."
        bgClass="section-bg-research"
      />

      {/* Publication Cards */}
      <section className="section-bg-research pb-24 md:pb-32">
        <div className="container-content flex flex-col gap-8 md:gap-12">
          {PUBLICATIONS.map((pub, i) => (
            <ScrollReveal key={pub.id} delay={i * 0.1}>
              <a
                href={pub.href}
                target="_blank"
                rel="noopener noreferrer"
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
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>

                    {/* Right column: abstract visual (desktop only) */}
                    <div className="hidden md:flex md:w-[40%] md:items-center md:justify-center">
                      <pub.Visual />
                    </div>
                  </div>
                </Card>
              </a>
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
