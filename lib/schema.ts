/**
 * JSON-LD Schema generators for structured data / AEO.
 *
 * Provides factory functions for all schema types used across the site.
 * Each function returns a plain object suitable for serialization via
 * the JsonLd component.
 *
 * Spec reference: §8.2 (JSON-LD Schema Markup)
 */

import {
  SITE_URL,
  SITE_NAME,
  CONTACT_EMAIL,
  BUSINESS_LOCALITY,
  BUSINESS_REGION,
} from "./constants";
import { getAuthorByName } from "./team";

/** Organization schema — injected on every page via root layout */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Shruggie LLC",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    email: CONTACT_EMAIL,
    description:
      "A modern technical studio that builds digital systems, software, and AI-driven experiences.",
    // City/state only — ShruggieTech has no public mailing location, so we do
    // not assert a street address here (the LLC's registered-agent address is
    // not a business location). Keeps structured data consistent with the
    // visible NAP on /contact.
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_LOCALITY,
      addressRegion: BUSINESS_REGION,
      addressCountry: "US",
    },
    sameAs: ["https://github.com/shruggietech"],
    knowsAbout: [
      "Web Development",
      "AI Consulting",
      "Digital Marketing",
      "Search Engine Optimization",
      "Answer Engine Optimization",
    ],
  };
}

/** WebSite schema — injected on homepage */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

/** BlogPosting schema — injected on each blog post */
export function generateBlogPostSchema(post: {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  slug: string;
  ogImage?: string;
}) {
  // Enrich the author with role, photo, bio, and social profiles (sameAs)
  // when the byline maps to a known person — the signals Google's authorship
  // guidance and AI citation heuristics reward.
  const person = getAuthorByName(post.author);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${SITE_URL}/about`,
      ...(person?.title && { jobTitle: person.title }),
      ...(person?.image && { image: person.image }),
      ...(person?.description && { description: person.description }),
      ...(person?.socials.length && {
        sameAs: person.socials.map((s) => s.href),
      }),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    image: post.ogImage ?? `${SITE_URL}/images/og/default.png`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

/** Service schema — injected on services page */
export function generateServiceSchema(service: {
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    name: service.name,
    description: service.description,
    areaServed: {
      "@type": "Place",
      name: "Knoxville, Tennessee and surrounding regions",
    },
  };
}

/** FAQPage schema — injected on service detail pages with real FAQs */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** BreadcrumbList schema — injected on nested pages (e.g. service details) */
export function generateBreadcrumbSchema(
  crumbs: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * ScholarlyArticle / TechArticle schema for canonical research papers.
 *
 * `url` and `mainEntityOfPage` point at the on-site canonical version so the
 * page — not the GitHub gist — is credited. The gist is declared as `sameAs`,
 * marking it as a mirror of the same work.
 */
export function generateResearchSchema(paper: {
  type: "ScholarlyArticle" | "TechArticle";
  title: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  description: string;
  url: string; // canonical on-site URL
  sameAs?: string[]; // mirrors (e.g. the GitHub gist)
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": paper.type,
    headline: paper.title,
    name: paper.title,
    author: {
      "@type": "Person",
      name: paper.author,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.svg`,
    },
    datePublished: paper.datePublished,
    ...(paper.dateModified && { dateModified: paper.dateModified }),
    description: paper.description,
    url: paper.url,
    mainEntityOfPage: paper.url,
    ...(paper.sameAs && paper.sameAs.length > 0 && { sameAs: paper.sameAs }),
    ...(paper.keywords && paper.keywords.length > 0 && {
      keywords: paper.keywords.join(", "),
    }),
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}

/** TechArticle schema — injected on research/publication pages */
export function generateTechArticleSchema(paper: {
  title: string;
  author: string;
  datePublished: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: paper.title,
    author: {
      "@type": "Person",
      name: paper.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    datePublished: paper.datePublished,
    description: paper.description,
    url: paper.url,
  };
}

/** SoftwareSourceCode schema — injected on products page */
export function generateSoftwareSchema(product: {
  name: string;
  description: string;
  url: string;
  codeRepository: string;
  programmingLanguage?: string;
  version?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: product.name,
    description: product.description,
    url: product.url,
    codeRepository: product.codeRepository,
    ...(product.programmingLanguage && {
      programmingLanguage: product.programmingLanguage,
    }),
    ...(product.version && { version: product.version }),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
  };
}
