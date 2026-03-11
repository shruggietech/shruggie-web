/**
 * SEOHead — Convenience wrapper for page-level head metadata.
 *
 * A thin helper that accepts metadata props and returns Next.js-compatible
 * head elements. Pages that export `generateMetadata` directly do not need
 * this component. This provides a fallback pattern for client components
 * that cannot export metadata.
 *
 * In Next.js App Router, metadata is typically handled via the exported
 * `metadata` or `generateMetadata` from page/layout server components.
 * This component uses the <head> element approach for cases where that
 * pattern is not available (e.g., client-only rendered metadata).
 *
 * Spec reference: §8.1 (Metadata Strategy)
 */

import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/constants";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const resolvedOgImage = ogImage ?? DEFAULT_OG_IMAGE;
  const resolvedCanonical = canonical ?? SITE_URL;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />
    </>
  );
}

export { SEOHead };
export type { SEOHeadProps };
