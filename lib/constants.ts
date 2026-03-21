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
