/**
 * Route-aware dark mode utility.
 *
 * Determines which routes force dark mode (no theme toggle)
 * vs. which allow the user to toggle between dark and light.
 *
 * Spec reference: ShruggieTech-Website-Redesign-Plan.md §2
 */

const FORCED_DARK_ROUTES = ["/", "/services", "/about", "/contact"];

/**
 * Returns true if the given pathname should force dark mode
 * (no toggle visible, dark class always applied).
 */
export function isDarkModeForced(pathname: string): boolean {
  return FORCED_DARK_ROUTES.includes(pathname);
}

/**
 * Exported for embedding in the inline theme script to prevent FOUC.
 */
export const FORCED_DARK_ROUTES_LIST = FORCED_DARK_ROUTES;
