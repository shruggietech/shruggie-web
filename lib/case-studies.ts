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
      "Accessibility-compliant website redesign aligned with global United Way brand guidelines, built on infrastructure the client owns.",
    image: "/images/work/united-way.png",
    metric: "100% client-owned infrastructure",
    logo: "/images/logos/united-way.svg",
  },
  {
    slug: "scruggs-tire",
    client: "Scruggs Tire & Alignment",
    industry: "Automotive Services",
    summary:
      "Forensic vendor audit, contract disentanglement, and full replatform onto client-owned infrastructure for a Knoxville auto shop.",
    image: "/images/work/scruggs-tire.png",
    metric: "Launched in 6 weeks",
    logo: "/images/logos/scruggs-tire.svg",
  },
  {
    slug: "i-heart-pr-tours",
    client: "I Heart PR Tours",
    industry: "Tourism & Hospitality",
    summary:
      "Multi-platform booking integration, OTA optimization, and brand identity for a Puerto Rico tour operator.",
    image: "/images/work/i-heart-pr-tours.png",
    metric: "5 booking platforms unified",
    logo: "/images/logos/i-heart-pr-tours.svg",
  },
];
