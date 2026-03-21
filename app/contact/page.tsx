/**
 * Contact Page — /contact
 *
 * Hero section, contact form (client component), and direct contact
 * information. The form integrates Formspree + React Hook Form + Zod.
 *
 * Spec reference: §6.8 (Contact), §1.4 item 7 (contact email)
 */

import type { Metadata } from "next";
import { Github, Facebook, Instagram, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/shared/PageHero";
import Card from "@/components/ui/Card";
import CTABackground from "@/components/shared/CTABackground";

const SOCIAL_LINKS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "https://github.com/shruggietech", label: "GitHub", Icon: Github },
  { href: "https://www.facebook.com/shruggietech", label: "Facebook", Icon: Facebook },
  { href: "https://www.instagram.com/shruggietech", label: "Instagram", Icon: Instagram },
  { href: "https://x.com/shruggietech", label: "X (Twitter)", Icon: Twitter },
];

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
    images: [
      {
        url: getOgImageUrl("Contact"),
        width: 1200,
        height: 630,
        alt: "Contact | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | ShruggieTech",
    description:
      "Whether you have a project in mind or just want to explore what is possible, the first step is a conversation.",
    images: [getOgImageUrl("Contact")],
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

      {/* ── Section 2: Social Media + Contact Form ────────────────────── */}
      <CTABackground className="pt-8 pb-52 md:pt-12 md:pb-96">
        <div className="container-content">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mx-auto mt-12 max-w-lg text-body text-text-secondary">
                Stay up to date with our latest work, research, and insights.
              </p>
              <div className="mt-8 flex items-center justify-center gap-6">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-text-secondary transition-colors duration-200 hover:border-brand-green-bright hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright"
                  >
                    <link.Icon size={20} aria-hidden="true" />
                    <span className="text-body-sm font-medium hidden sm:inline">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
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
