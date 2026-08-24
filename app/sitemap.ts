/**
 * Sitemap generator — Produces /sitemap.xml for search engine crawlers.
 *
 * Includes all static pages, blog post slugs, and case study slugs.
 * Priorities: 1.0 homepage, 0.8 static pages, 0.6 blog posts.
 *
 * Spec reference: §8.3 (Sitemap and Robots)
 */

import { MetadataRoute } from "next";

import { getAllPostsMeta } from "@/lib/blog";
import { getAllCaseStudiesMeta } from "@/lib/work";
import { getAllResearchMeta } from "@/lib/research";
import { SITE_URL } from "@/lib/constants";
import { SERVICE_SLUGS } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/services",
    ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
    "/work",
    "/research",
    ...getAllResearchMeta().map((paper) => `/research/${paper.slug}`),
    "/products",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/for/small-business",
    "/for/nonprofits",
    "/for/technical-teams",
    "/for/developers",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const blogPosts = getAllPostsMeta().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const caseStudies = getAllCaseStudiesMeta().map((study) => ({
    url: `${SITE_URL}/work/${study.slug}`,
    lastModified: study.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPosts, ...caseStudies];
}
