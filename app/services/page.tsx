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
import { SERVICES } from "@/lib/services";
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

/* ── Page Component ─────────────────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <>
      {/* JSON-LD: Service schema for each pillar */}
      {SERVICES.map((service) => (
        <JsonLd
          key={service.slug}
          data={generateServiceSchema({
            name: service.title,
            description: service.lead,
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
      {SERVICES.map((service, index) => (
        <ServicePillarSection
          key={service.slug}
          id={service.slug}
          title={service.title}
          lead={service.lead}
          body={service.body}
          capabilities={service.capabilities}
          index={index}
          bgClass={index % 2 === 0 ? "bg-bg-primary" : "section-bg-services"}
          detailHref={`/services/${service.slug}`}
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
