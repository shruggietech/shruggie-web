/**
 * Homepage — ShruggieTech public website root page.
 *
 * Five sections: Hero, Services Preview, Work Preview, Research Preview,
 * and Bottom CTA. Includes WebSite JSON-LD schema for AEO.
 *
 * Spec reference: §6.1 (Homepage), §8.1 (Metadata), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { generateWebSiteSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WorkSection from "@/components/home/WorkSection";
import ResearchSection from "@/components/home/ResearchSection";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "ShruggieTech - Modern Digital Systems, Software, and AI",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ShruggieTech - Modern Digital Systems, Software, and AI",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      <HeroSection />
      <ServicesSection />
      <WorkSection />
      <ResearchSection />
      <CTASection />
    </>
  );
}
