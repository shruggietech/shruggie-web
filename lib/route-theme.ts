/**
 * Route-aware dark mode utility.
 *
 * Light mode is intentionally limited to the blog reading surface. Every
 * other route uses the dark brand presentation and exposes no theme toggle.
 *
 * Spec reference: ShruggieTech-Website-Redesign-Plan.md §2
 */

const LIGHT_MODE_ROOT = "/blog";

export function isLightModeAvailable(pathname: string): boolean {
  return (
    pathname === LIGHT_MODE_ROOT || pathname.startsWith(`${LIGHT_MODE_ROOT}/`)
  );
}

/**
 * Returns true if the given pathname should force dark mode
 * (no toggle visible, dark class always applied).
 */
export function isDarkModeForced(pathname: string): boolean {
  return !isLightModeAvailable(pathname);
}

/**
 * Exported for embedding in the inline theme script to prevent FOUC.
 */
export const LIGHT_MODE_ROOT_PATH = LIGHT_MODE_ROOT;
