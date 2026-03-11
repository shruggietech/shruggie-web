/**
 * Theme initialization script for FOUC-free dark/light mode.
 *
 * Returns an inline IIFE that reads a "theme" cookie before first paint,
 * falls back to prefers-color-scheme, and defaults to dark mode.
 * Injected into <head> via dangerouslySetInnerHTML in app/layout.tsx.
 *
 * Spec reference: §2.6 (Dark and Light Mode)
 */

export function getThemeScript(): string {
  return `
    (function() {
      var cookie = document.cookie.match(/theme=(light|dark)/);
      var theme = cookie ? cookie[1] : null;
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })();
  `;
}
