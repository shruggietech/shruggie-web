/**
 * Technical Teams landing page — Segment C.
 *
 * Targeted entry point for technical founders and product teams
 * reached via paid advertising, email campaigns, and organic search.
 *
 * Spec reference: §6.9 (Audience Landing Pages — Landing Page C)
 */

import type { Metadata } from "next";

import { getOgImageUrl } from "@/lib/constants";
import LandingPageTemplate from "@/components/shared/LandingPageTemplate";

export const metadata: Metadata = {
  title: "You need an engineering partner, not another agency",
  description:
    "We speak your language. AI integrations, custom tooling, RAG architectures, and automation pipelines, built by engineers with published research and production experience.",
  alternates: { canonical: "/for/technical-teams" },
  openGraph: {
    title: "You need an engineering partner, not another agency",
    description:
      "We speak your language. AI integrations, custom tooling, RAG architectures, and automation pipelines, built by engineers with published research and production experience.",
    url: "/for/technical-teams",
    type: "website",
    images: [
      {
        url: getOgImageUrl("Technical Teams", { description: "We speak your language. AI integrations, custom tooling, RAG architectures, and automation pipelines, built by engineers with published research and production experience." }),
        width: 1200,
        height: 630,
        alt: "Technical Teams | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technical Teams | ShruggieTech",
    description:
      "We speak your language. AI integrations, custom tooling, RAG architectures, and automation pipelines, built by engineers with published research and production experience.",
    images: [getOgImageUrl("Technical Teams", { description: "We speak your language. AI integrations, custom tooling, RAG architectures, and automation pipelines, built by engineers with published research and production experience." })],
  },
};

export default function TechnicalTeamsPage() {
  return (
    <LandingPageTemplate
      headline="You need an engineering partner, not another agency."
      subheadline="We speak your language. AI integrations, custom tooling, RAG architectures, and automation pipelines, built by engineers with published research and production experience."
      painPoints={[
        {
          title: "AI hype, no delivery.",
          description:
            "Every vendor promises AI transformation. Few can actually architect a RAG system, deploy a vector search pipeline, or debug a prompt chain.",
        },
        {
          title: "Scaling without headcount.",
          description:
            "You need more engineering throughput but cannot justify full-time hires. You need a team that can absorb specification-driven work and deliver.",
        },
        {
          title: "Vendor skill mismatch.",
          description:
            "Your existing agency can build landing pages but cannot touch your API layer, your data pipeline, or your deployment infrastructure.",
        },
      ]}
      relevantServices={[
        "AI Consulting",
        "Chatbot Development",
        "RAG Systems",
        "Workflow Automation",
        "Custom Tool Development",
      ]}
      socialProof={[
        {
          type: "research",
          title: "Agent-Driven Framework (ADF)",
          description:
            "A structured framework for orchestrating multi-agent AI workflows with specification-driven development.",
          href: "/research",
        },
      ]}
    />
  );
}
