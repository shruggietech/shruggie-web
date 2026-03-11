/**
 * JSON-LD Schema generators for structured data / AEO.
 *
 * Provides factory functions for all schema types used across the site.
 * Each function returns a plain object suitable for serialization via
 * the JsonLd component.
 *
 * Spec reference: §8.2 (JSON-LD Schema Markup)
 */

import { SITE_URL, SITE_NAME } from "./constants";

/** Organization schema — injected on every page via root layout */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Shruggie LLC",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    description:
      "A modern technical studio that builds digital systems, software, and AI-driven experiences.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "116 Agnes Rd, Ste 200",
      addressLocality: "Knoxville",
      addressRegion: "TN",
      postalCode: "37919",
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
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${SITE_URL}/about`,
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
  programmingLanguage: string;
  version?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: product.name,
    description: product.description,
    url: product.url,
    codeRepository: product.codeRepository,
    programmingLanguage: product.programmingLanguage,
    ...(product.version && { version: product.version }),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
  };
}
