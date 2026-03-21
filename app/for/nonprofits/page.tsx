/**
 * Nonprofits landing page — Segment B.
 *
 * Targeted entry point for nonprofits and mission-driven organizations
 * reached via paid advertising, email campaigns, and organic search.
 *
 * Spec reference: §6.9 (Audience Landing Pages — Landing Page B)
 */

import type { Metadata } from "next";

import { getOgImageUrl } from "@/lib/constants";
import LandingPageTemplate from "@/components/shared/LandingPageTemplate";

export const metadata: Metadata = {
  title: "Your mission is too important for a bad website",
  description:
    "You need a digital presence that reflects the seriousness of your work, meets accessibility standards, and stays within a grant-funded budget. We build exactly that.",
  alternates: { canonical: "/for/nonprofits" },
  openGraph: {
    title: "Your mission is too important for a bad website",
    description:
      "You need a digital presence that reflects the seriousness of your work, meets accessibility standards, and stays within a grant-funded budget. We build exactly that.",
    url: "/for/nonprofits",
    type: "website",
    images: [
      {
        url: getOgImageUrl("Nonprofits", { description: "You need a digital presence that reflects the seriousness of your work, meets accessibility standards, and stays within a grant-funded budget. We build exactly that." }),
        width: 1200,
        height: 630,
        alt: "Nonprofits | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nonprofits | ShruggieTech",
    description:
      "You need a digital presence that reflects the seriousness of your work, meets accessibility standards, and stays within a grant-funded budget. We build exactly that.",
    images: [getOgImageUrl("Nonprofits", { description: "You need a digital presence that reflects the seriousness of your work, meets accessibility standards, and stays within a grant-funded budget. We build exactly that." })],
  },
};

export default function NonprofitsPage() {
  return (
    <LandingPageTemplate
      headline="Your mission is too important for a bad website."
      subheadline="You need a digital presence that reflects the seriousness of your work, meets accessibility standards, and stays within a grant-funded budget. We build exactly that."
      painPoints={[
        {
          title: "Outdated and inaccessible.",
          description:
            "Your website does not meet accessibility standards, and your team does not have the technical staff to fix it.",
        },
        {
          title: "Brand inconsistency.",
          description:
            "Your parent organization has brand guidelines, but your local site does not follow them. It undermines credibility with donors and partners.",
        },
        {
          title: "Maintenance limbo.",
          description:
            "Nobody on staff knows how to update the site. Content goes stale. Plugins go unpatched. Security vulnerabilities accumulate.",
        },
      ]}
      relevantServices={[
        "Website Redesign",
        "Accessibility Compliance",
        "Brand Guideline Alignment",
        "Ongoing Maintenance",
      ]}
      socialProof={[
        {
          type: "case-study",
          title: "United Way of Anderson County",
          description:
            "A nonprofit that needed an accessible, brand-aligned website to serve their community.",
          href: "/work/united-way",
        },
      ]}
    />
  );
}
