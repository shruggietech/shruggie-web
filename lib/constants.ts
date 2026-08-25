/**
 * Site-wide constants.
 * Spec reference: §8.1 (Metadata Strategy)
 */

export const SITE_URL = "https://shruggie.tech";
export const SITE_NAME = "ShruggieTech";
export const SITE_DESCRIPTION =
  "ShruggieTech builds modern digital systems, software, and AI-driven experiences that help businesses present sharper, operate smarter, and scale further.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og/default.png`;

/**
 * Public business contact info (NAP). Single source of truth for the
 * Contact page, Privacy policy, and JSON-LD structured data — keeping them
 * consistent is what makes the NAP legible to Google Business Profile and AI
 * agents. There is no public mailing address (the LLC's registered-agent
 * address is not a place to send mail), so the location is city/state only.
 *
 * `CONTACT_EMAIL` is the general inbox (Contact page + Organization schema).
 * `PRIVACY_EMAIL` is the GDPR/CCPA data-subject-request address on the
 * Privacy policy.
 */
export const CONTACT_EMAIL = "info@shruggie.tech";
export const PRIVACY_EMAIL = "admin@shruggie.tech";
export const BUSINESS_LOCALITY = "Knoxville";
export const BUSINESS_REGION = "TN";
export const BUSINESS_LOCATION = "Knoxville, TN, USA";

/**
 * Generate a dynamic OG image URL for a given page title.
 * Falls back to the static default if no title is provided.
 */
export function getOgImageUrl(
  title?: string,
  opts?: { description?: string; author?: string },
): string {
  if (!title) return DEFAULT_OG_IMAGE;
  const params = new URLSearchParams({ title });
  if (opts?.description) params.set("description", opts.description);
  if (opts?.author) params.set("author", opts.author);
  return `${SITE_URL}/api/og?${params.toString()}`;
}
