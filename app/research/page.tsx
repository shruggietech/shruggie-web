/**
 * Research Page — /research
 *
 * Three publication cards displayed vertically with TechArticle JSON-LD
 * for each publication. Links to hosted papers are placeholder (#) until
 * PDF/Markdown versions are available.
 *
 * Spec reference: §6.4 (Research and Publications), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { SITE_URL } from "@/lib/constants";
import { generateTechArticleSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";

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
    href: "#",
  },
  {
    id: "multi-agent-guide",
    title:
      "Multi-Agent Coding Workflows for Solo Developers and Small Teams",
    author: "William Thompson",
    description:
      "A practical field manual for multi-agent coding workflows: sequential sessions, parallel independent agents, coordinated teams, and the admin-coding divide that makes it all work.",
    datePublished: "2025-02-20",
    href: "#",
  },
  {
    id: "rustif-declaration",
    title: "rustif: A Next-Generation Metadata Processing Engine",
    author: "William Thompson",
    description:
      "The case for building a Rust-native metadata processing engine to succeed ExifTool. Ecosystem analysis, architectural specification, security threat model, and a call for contributors.",
    datePublished: "2025-03-01",
    href: "#",
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
      <section className="container-content py-24 md:py-32">
        <ScrollReveal>
          <SectionHeading
            title="Research"
            description="Original research and technical writing from the ShruggieTech team. We publish what we learn."
            align="center"
          />
        </ScrollReveal>
      </section>

      {/* Publication Cards */}
      <section className="container-narrow pb-24 md:pb-32">
        <div className="flex flex-col gap-8 md:gap-12">
          {PUBLICATIONS.map((pub, i) => (
            <ScrollReveal key={pub.id} delay={i * 0.08}>
              <Card hover>
                <h3 className="font-display text-display-xs font-bold text-text-primary">
                  {pub.title}
                </h3>
                <p className="mt-2 text-body-sm text-text-muted">
                  {pub.author}
                </p>
                <p className="mt-4 text-body-md text-text-secondary">
                  {pub.description}
                </p>
                <a
                  href={pub.href}
                  className="mt-6 inline-flex items-center gap-2 font-display text-body-md font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  Read paper
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
