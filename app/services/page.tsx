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

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
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
    "Strategy, design, development, and marketing, shaped around how your business actually operates.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: "Services | ShruggieTech",
    description:
      "Strategy, design, development, and marketing, shaped around how your business actually operates.",
    url: `${SITE_URL}/services`,
    type: "website",
    images: [
      {
        url: getOgImageUrl("Services", { description: "Strategy, design, development, and marketing, shaped around how your business actually operates." }),
        width: 1200,
        height: 630,
        alt: "Services | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | ShruggieTech",
    description:
      "Strategy, design, development, and marketing, shaped around how your business actually operates.",
    images: [getOgImageUrl("Services", { description: "Strategy, design, development, and marketing, shaped around how your business actually operates." })],
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
    body: "We build visual identity systems, brand standards kits, and content architecture from scratch, or refresh what already exists. Your brand should translate consistently across every platform and touchpoint, and we make sure it does.",
    capabilities: [
      "Logo design and visual identity systems",
      "Color palette and typography systems",
      "Brand standards kits",
      "Website strategy and content architecture",
      "Marketing collateral and print materials",
    ],
  },
  {
    id: "development",
    title: "Development & Integration",
    lead: "We build, migrate, and integrate. From marketing sites to custom applications, we handle the full technical stack.",
    body: "We work across whatever stack fits the project, not whatever stack we prefer. New build, migration, or a compatibility layer over systems you can't replace, the approach is shaped by your situation, not ours.",
    capabilities: [
      "Custom website design and development",
      "Modern web applications",
      "CMS deployment, configuration, and migration",
      "Third-party integrations",
      "DNS management and hosting configuration",
      "Vendor displacement and replatforming",
    ],
  },
  {
    id: "marketing",
    title: "Revenue Flows & Marketing Operations",
    lead: "Visibility means nothing without conversion. We build the systems that turn attention into revenue.",
    body: "Every business converts differently. A tour operator needs marketplace visibility. A local shop needs to own local search. An e-commerce brand needs a conversion funnel that doesn't leak. We tailor the strategy to how your customers actually find and buy from you.",
    capabilities: [
      "SEO strategy and execution",
      "Answer Engine Optimization (AEO) with schema markup",
      "Google Ads and Meta advertising",
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
    body: "Most businesses don't need a custom model. They need AI wired into the systems they already use: answering customer questions, automating repetitive workflows, or surfacing the right data at the right time. We figure out where AI actually helps and build it into your operations.",
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
        subheadline="Strategy, design, development, and marketing, shaped around how your business actually operates."
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
