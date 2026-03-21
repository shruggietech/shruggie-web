/**
 * Small Business landing page — Segment A.
 *
 * Targeted entry point for small business owners reached via
 * paid advertising, email campaigns, and organic search.
 *
 * Spec reference: §6.9 (Audience Landing Pages — Landing Page A)
 */

import type { Metadata } from "next";

import { getOgImageUrl } from "@/lib/constants";
import LandingPageTemplate from "@/components/shared/LandingPageTemplate";

export const metadata: Metadata = {
  title:
    "Your business deserves technology that works for you, not against you",
  description:
    "If your website was built by someone who disappeared, your marketing vendor charges you monthly for things you cannot see, or you are not sure who actually owns your domain, we can help.",
  alternates: { canonical: "/for/small-business" },
  openGraph: {
    title:
      "Your business deserves technology that works for you, not against you",
    description:
      "If your website was built by someone who disappeared, your marketing vendor charges you monthly for things you cannot see, or you are not sure who actually owns your domain, we can help.",
    url: "/for/small-business",
    type: "website",
    images: [
      {
        url: getOgImageUrl("Small Business", { description: "If your website was built by someone who disappeared, your marketing vendor charges you monthly for things you cannot see, or you are not sure who actually owns your domain, we can help." }),
        width: 1200,
        height: 630,
        alt: "Small Business | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Small Business | ShruggieTech",
    description:
      "If your website was built by someone who disappeared, your marketing vendor charges you monthly for things you cannot see, or you are not sure who actually owns your domain, we can help.",
    images: [getOgImageUrl("Small Business", { description: "If your website was built by someone who disappeared, your marketing vendor charges you monthly for things you cannot see, or you are not sure who actually owns your domain, we can help." })],
  },
};

export default function SmallBusinessPage() {
  return (
    <LandingPageTemplate
      headline="Your business deserves technology that works for you, not against you."
      subheadline="If your website was built by someone who disappeared, your marketing vendor charges you monthly for things you cannot see, or you are not sure who actually owns your domain, we can help."
      painPoints={[
        {
          title: "Trapped by your vendor.",
          description:
            "You pay a monthly fee but do not own your website, your domain, or your data. Canceling feels impossible.",
        },
        {
          title: "Invisible online.",
          description:
            "Your competitors show up on Google. You do not. Your website looks like it was built in 2015 because it was.",
        },
        {
          title: "No one to call.",
          description:
            "When something breaks or needs updating, you do not have a reliable technical partner. You have a ticket queue.",
        },
      ]}
      relevantServices={[
        "Rescue & Replatform",
        "Web Development",
        "Local SEO",
        "Google Ads",
        "Review Generation",
      ]}
      socialProof={[
        {
          type: "case-study",
          title: "Scruggs Tire & Alignment",
          description:
            "A family-owned tire shop that needed a modern web presence and local search visibility.",
          href: "/work/scruggs-tire",
        },
      ]}
    />
  );
}
