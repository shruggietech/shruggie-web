/**
 * Route-aware dark mode utility.
 *
 * Determines which routes force dark mode (no theme toggle)
 * vs. which allow the user to toggle between dark and light.
 *
 * Spec reference: ShruggieTech-Website-Redesign-Plan.md §2
 */

const FORCED_DARK_EXACT = ["/", "/services", "/about", "/contact", "/research", "/products"];
const FORCED_DARK_PREFIXES = ["/work", "/for/"];

/**
 * Returns true if the given pathname should force dark mode
 * (no toggle visible, dark class always applied).
 */
export function isDarkModeForced(pathname: string): boolean {
  if (FORCED_DARK_EXACT.includes(pathname)) return true;
  return FORCED_DARK_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Exported for embedding in the inline theme script to prevent FOUC.
 */
export const FORCED_DARK_EXACT_LIST = FORCED_DARK_EXACT;
export const FORCED_DARK_PREFIXES_LIST = FORCED_DARK_PREFIXES;
