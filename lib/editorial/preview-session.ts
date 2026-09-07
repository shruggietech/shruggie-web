import "server-only";

import { articleSlugSchema } from "./domain";

export const EDITOR_PREVIEW_COOKIE = "__Host-shruggie_preview";
export const EDITOR_PREVIEW_MAX_AGE_SECONDS = 8 * 60 * 60;

export function readEditorialPreviewSlug(
  cookieHeader: string | null,
): string | null {
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName !== EDITOR_PREVIEW_COOKIE) continue;

    try {
      const parsed = articleSlugSchema.safeParse(
        decodeURIComponent(rawValue.join("=")),
      );
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  return null;
}
