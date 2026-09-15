/**
 * Theme initialization script for FOUC-free dark/light mode.
 *
 * Returns an inline IIFE that reads a "theme" cookie before first paint,
 * defaults to dark mode. The saved preference is honored only on `/blog` and
 * its article routes. Every other route forces the dark class regardless of
 * cookie or operating-system preference.
 * Injected into <head> via dangerouslySetInnerHTML in app/layout.tsx.
 *
 * Spec reference: §2.6 (Dark and Light Mode),
 *   ShruggieTech-Website-Redesign-Plan.md §2
 */

import { LIGHT_MODE_ROOT_PATH } from "./route-theme";

export function getThemeScript(): string {
  const blogRoot = JSON.stringify(LIGHT_MODE_ROOT_PATH);
  return `
    (function() {
      var path = window.location.pathname;
      var blogRoot = ${blogRoot};
      var lightModeAvailable = path === blogRoot || path.indexOf(blogRoot + '/') === 0;
      if (!lightModeAvailable) {
        document.documentElement.classList.add('dark');
        return;
      }
      var cookie = document.cookie.match(/theme=(light|dark)/);
      var theme = cookie ? cookie[1] : 'dark';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })();
  `;
}
