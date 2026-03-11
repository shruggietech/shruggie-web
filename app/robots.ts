/**
 * Robots.txt generator — Produces /robots.txt for search engine crawlers.
 *
 * Allows all user agents on all paths. Includes sitemap URL.
 *
 * Spec reference: §8.3 (Sitemap and Robots)
 */

import { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
