/**
 * Services Page — /services
 *
 * Hero, four service pillar sections with anchor IDs, the interactive
 * three-phase engagement model, ownership thesis, and CTA.
 * Includes Service JSON-LD schemas for each pillar.
 *
 * Spec reference: §6.2 (Services), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";
import { generateServiceSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CTABackground from "@/components/shared/CTABackground";
import SectionHeading from "@/components/ui/SectionHeading";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ProcessAccordion from "./ProcessAccordion";
import ServicePillarSection from "./ServicePillarSection";
import OwnershipSection from "./OwnershipSection";

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Services",
  description:
    "We combine deep technical execution with design instinct and business judgment to deliver work that exceeds expectations.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: "Services | ShruggieTech",
    description:
      "We combine deep technical execution with design instinct and business judgment to deliver work that exceeds expectations.",
    url: `${SITE_URL}/services`,
    type: "website",
  },
};

/* ── Service Pillar Data ────────────────────────────────────────────────── */

interface ServicePillar {
  id: string;
  title: string;
  lead: string;
  body: string;
  capabilities: string[];
}

const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: "strategy-brand",
    title: "Digital Strategy & Brand",
    lead: "Your brand is the first thing people see and the last thing they remember. We make both count.",
    body: "We build visual identity systems, brand standards kits, and content architecture from scratch or refresh what already exists. Every logo, color choice, and typographic decision is made with purpose. We plan sitemaps, define content hierarchy, and ensure your brand translates consistently across every platform and touchpoint.",
    capabilities: [
      "Logo design and visual identity systems",
      "Color palette and typography systems",
      "Brand standards kits for cross-platform consistency",
      "Website strategy and content architecture",
      "Marketing collateral (business cards, print materials)",
    ],
  },
  {
    id: "development",
    title: "Development & Integration",
    lead: "We build, migrate, and integrate. From marketing sites to custom applications, we handle the full technical stack.",
    body: "Our development work spans custom website builds, modern web applications, CMS evaluation and migration, DNS and hosting configuration, third-party system integrations, payment processing setup, and full platform replatforming. We work across whatever stack fits the project, from static marketing sites to interactive Next.js applications. We are particularly experienced at rescuing businesses from legacy vendor lock-in: extracting domains, migrating data, and rebuilding onto infrastructure the client actually owns.",
    capabilities: [
      "Custom website design and development",
      "Modern web applications (React, Next.js, and beyond)",
      "CMS deployment, configuration, and migration",
      "Third-party integrations (booking, payment, scheduling, and other business systems)",
      "DNS management and hosting configuration",
      "Vendor displacement and replatforming (Rescue & Replatform)",
    ],
  },
  {
    id: "marketing",
    title: "Revenue Flows & Marketing Operations",
    lead: "Visibility means nothing without conversion. We build the systems that turn attention into revenue.",
    body: "We implement SEO strategy, Answer Engine Optimization (AEO) for AI-mediated search, Google and Meta ad campaigns, social media content calendars, review generation workflows, analytics architecture (GA4, GTM, Search Console), and multi-platform content planning. We tailor our approach to your industry, whether that means optimizing marketplace listings, building local search visibility, or engineering conversion funnels for e-commerce.",
    capabilities: [
      "SEO strategy and execution",
      "Answer Engine Optimization (AEO) with advanced schema markup",
      "Google Ads and Meta/Facebook advertising",
      "Social media strategy and content planning",
      "Analytics implementation (GA4, GTM, Search Console)",
      "Review generation and reputation management",
      "Marketplace and platform listing optimization",
    ],
  },
  {
    id: "ai-data",
    title: "AI & Data Analysis",
    lead: "AI is not magic. It is infrastructure. We help you build AI systems that solve real problems.",
    body: "We design and deploy conversational AI assistants, retrieval-augmented generation (RAG) systems, semantic search implementations, and workflow automation pipelines. Our AI work is grounded in published research (including the Affective Dynamics Framework for emotional state simulation in AI agents) and production experience across cloud and local inference environments. We also provide strategic consulting on AI adoption for businesses exploring how to integrate AI into existing operations.",
    capabilities: [
      "Conversational AI and chatbot development",
      "RAG system design and implementation",
      "Semantic and vector search integration",
      "Workflow automation (email/SMS pipelines, process optimization)",
      "AI adoption consulting",
      "Multi-agent coding workflow design",
    ],
  },
];

/* ── Page Component ─────────────────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <>
      {/* JSON-LD: Service schema for each pillar */}
      {SERVICE_PILLARS.map((pillar) => (
        <JsonLd
          key={pillar.id}
          data={generateServiceSchema({
            name: pillar.title,
            description: pillar.lead,
          })}
        />
      ))}

      {/* ── Section 1: Hero ──────────────────────────────────────────── */}
      <PageHero
        headline="Services"
        subheadline="We combine deep technical execution with design instinct and business judgment to deliver work that exceeds expectations."
        bgClass="section-bg-services"
      />

      {/* ── Section 2: Service Pillars ───────────────────────────────── */}
      {SERVICE_PILLARS.map((pillar, index) => (
        <ServicePillarSection
          key={pillar.id}
          id={pillar.id}
          title={pillar.title}
          lead={pillar.lead}
          body={pillar.body}
          capabilities={pillar.capabilities}
          index={index}
          bgClass={index % 2 === 0 ? "bg-bg-primary" : "section-bg-services"}
        />
      ))}

      {/* ── Section 3: Engagement Model ──────────────────────────────── */}
      <section className="section-bg-work py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="OUR PROCESS"
              title="How We Work"
              description="Every engagement follows an iterative Discuss, Create, Deliver cycle."
              align="center"
            />
          </ScrollReveal>

          <ProcessAccordion />
        </div>
      </section>

      {/* ── Section 4: Ownership Thesis ──────────────────────────────── */}
      <OwnershipSection />

      {/* ── Section 5: CTA ───────────────────────────────────────────── */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md font-bold text-text-primary">
              Let&apos;s scope your project.
            </h2>

            <div className="mt-8">
              <ShruggieCTA href="/contact">Get in Touch</ShruggieCTA>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
