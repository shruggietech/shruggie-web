/**
 * Contact Page — /contact
 *
 * Hero section, contact form (client component), and direct contact
 * information. The form integrates Formspree + React Hook Form + Zod.
 *
 * Spec reference: §6.8 (Contact), §1.4 item 7 (contact email)
 */

import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/shared/PageHero";
import Card from "@/components/ui/Card";
import CTABackground from "@/components/shared/CTABackground";

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Get in Touch",
  description:
    "Whether you have a project in mind or just want to explore what is possible, the first step is a conversation.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Get in Touch | ShruggieTech",
    description:
      "Whether you have a project in mind or just want to explore what is possible, the first step is a conversation.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
};

/* ── Page Component ─────────────────────────────────────────────────────── */

export default function ContactPage() {
  return (
    <>
      {/* ── Section 1: Hero ──────────────────────────────────────────── */}
      <PageHero
        headline="Get in Touch"
        subheadline="Whether you have a project in mind or just want to explore what is possible, the first step is a conversation."
        bgClass="section-bg-cta"
      />

      {/* ── Section 2: Contact Form ──────────────────────────────────── */}
      <CTABackground className="pt-8 pb-52 md:pt-12 md:pb-96">
        <div className="container-content">
          <ScrollReveal>
            <Card hover={false}>
              <ContactForm />
            </Card>
          </ScrollReveal>
        </div>
      </CTABackground>


    </>
  );
}
