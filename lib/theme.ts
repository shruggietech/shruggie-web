/**
 * Theme initialization script for FOUC-free dark/light mode.
 *
 * Returns an inline IIFE that reads a "theme" cookie before first paint,
 * falls back to prefers-color-scheme, and defaults to dark mode.
 * On forced-dark routes (/, /services, /about, /contact) the dark class
 * is always applied regardless of the cookie or system preference.
 * Injected into <head> via dangerouslySetInnerHTML in app/layout.tsx.
 *
 * Spec reference: §2.6 (Dark and Light Mode),
 *   ShruggieTech-Website-Redesign-Plan.md §2
 */

import { FORCED_DARK_ROUTES_LIST } from "./route-theme";

export function getThemeScript(): string {
  const routes = JSON.stringify(FORCED_DARK_ROUTES_LIST);
  return `
    (function() {
      var forcedDark = ${routes};
      var path = window.location.pathname;
      if (forcedDark.indexOf(path) !== -1) {
        document.documentElement.classList.add('dark');
        return;
      }
      var cookie = document.cookie.match(/theme=(light|dark)/);
      var theme = cookie ? cookie[1] : null;
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })();
  `;
}
