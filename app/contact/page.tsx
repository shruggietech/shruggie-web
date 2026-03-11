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
      <section className="pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="container-content">
          <ScrollReveal>
            <h1 className="font-display text-display-xl font-bold text-text-primary">
              Get in Touch
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-text-secondary">
              Whether you have a project in mind or just want to explore what is
              possible, the first step is a conversation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 2: Contact Form ──────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container-narrow">
          <ScrollReveal>
            <ContactForm />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 3: Direct Contact ────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="rounded-xl border border-border bg-bg-elevated p-6 md:p-8">
              <h2 className="font-display text-display-sm font-bold text-text-primary">
                Direct Contact
              </h2>

              <div className="mt-6 space-y-4 text-body-md text-text-secondary">
                <p>
                  <span className="font-medium text-text-primary">
                    Address:
                  </span>{" "}
                  116 Agnes Rd, Ste 200, Knoxville, TN 37919
                </p>

                <p>
                  <span className="font-medium text-text-primary">
                    Email:
                  </span>{" "}
                  {/* §1.4 item 7: Contact email pending confirmation */}
                  <span className="text-text-muted">
                    Email address coming soon
                  </span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
