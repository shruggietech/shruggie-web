/**
 * Developers landing page — Segment D.
 *
 * Targeted entry point for developers and the open source community
 * reached via organic search, GitHub, and community channels.
 *
 * Spec reference: §6.9 (Audience Landing Pages — Landing Page D)
 */

import type { Metadata } from "next";

import LandingPageTemplate from "@/components/shared/LandingPageTemplate";

export const metadata: Metadata = {
  title: "Built by engineers. Open by default.",
  description:
    "We build open-source tools for file indexing, metadata processing, and asset management. We publish our research. We share what we learn.",
  alternates: { canonical: "/for/developers" },
  openGraph: {
    title: "Built by engineers. Open by default.",
    description:
      "We build open-source tools for file indexing, metadata processing, and asset management. We publish our research. We share what we learn.",
    url: "/for/developers",
    type: "website",
  },
};

export default function DevelopersPage() {
  return (
    <LandingPageTemplate
      headline="Built by engineers. Open by default."
      subheadline="We build open-source tools for file indexing, metadata processing, and asset management. We publish our research. We share what we learn."
      painPoints={[
        {
          title: "Metadata is a mess.",
          description:
            "You manage large file collections and need structured indexing with content-addressed identity, not just filenames.",
        },
        {
          title: "ExifTool is showing its age.",
          description:
            "Thirty years of Perl-based metadata infrastructure is reaching its limits. The ecosystem needs a modern, embeddable successor.",
        },
        {
          title: "AI agents need better specs.",
          description:
            "You are experimenting with multi-agent coding workflows but struggling with context management, specification quality, and agent coordination.",
        },
      ]}
      relevantServices={[
        "Open Source Tools",
        "File Indexing",
        "Metadata Processing",
        "AI Research",
      ]}
      socialProof={[
        {
          type: "product",
          title: "shruggie-indexer",
          description:
            "Content-addressed file indexing with structured metadata extraction and deduplication.",
          href: "/products",
        },
        {
          type: "product",
          title: "metadexer",
          description:
            "A modern metadata extraction engine built to eventually succeed ExifTool.",
          href: "/products",
        },
        {
          type: "product",
          title: "rustif",
          description:
            "A Rust-native TIFF library for lossless metadata-preserving image operations.",
          href: "/products",
        },
        {
          type: "research",
          title: "Agent-Driven Framework (ADF)",
          description:
            "A structured framework for orchestrating multi-agent AI workflows.",
          href: "/research",
        },
        {
          type: "research",
          title: "Multi-Agent Coding Workflows",
          description:
            "A practical guide to coordinating multiple AI coding agents.",
          href: "/research",
        },
        {
          type: "research",
          title: "rustif Declaration",
          description:
            "The design philosophy and architectural rationale behind rustif.",
          href: "/research",
        },
      ]}
    />
  );
}
