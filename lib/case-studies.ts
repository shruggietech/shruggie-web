/**
 * Shared case study data for homepage Work section components.
 *
 * Single source of truth imported by WorkScroll, WorkCarousel,
 * and WorkPreview. Image paths follow the slug convention:
 * /images/work/${slug}.png
 */

export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  summary: string;
  image: string;
  metric: string;
  logo: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "united-way",
    client: "United Way of Anderson County",
    industry: "Nonprofit",
    summary:
      "Complete rebrand and website redesign for a community nonprofit, delivered right the first time, from design to content to brand implementation.",
    image: "/images/work/united-way.png",
    metric: "Minimal revision cycles",
    logo: "/images/logos/united-way.svg",
  },
  {
    slug: "scruggs-tire",
    client: "Scruggs Tire & Alignment",
    industry: "Automotive Services",
    summary:
      "Forensic vendor audit, contract disentanglement, and full replatform onto client-owned infrastructure for a local auto shop.",
    image: "/images/work/scruggs-tire.png",
    metric: "Full ownership restored",
    logo: "/images/logos/scruggs-tire.svg",
  },
  {
    slug: "i-heart-pr-tours",
    client: "I Heart PR Tours",
    industry: "Tourism & Hospitality",
    summary:
      "Ground-up brand identity, website, social media management, and multi-platform booking integration for a Puerto Rico tour operator, backed by a partnership structured around growth.",
    image: "/images/work/i-heart-pr-tours.png",
    metric: "Flexible engagement model",
    logo: "/images/logos/i-heart-pr-tours.svg",
  },
];
