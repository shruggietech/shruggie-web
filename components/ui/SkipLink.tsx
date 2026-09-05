/**
 * SkipLink — "Skip to main content" accessibility link.
 *
 * Fixed-position link hidden by default, becomes visible on focus-visible.
 * Must be the first focusable element on every page.
 *
 * Spec reference: §3.2 (Implementation Patterns)
 */

import { cn } from "@/lib/utils";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        "fixed top-4 left-4 z-[9999]",
        "bg-accent font-display text-body-sm rounded-lg px-4 py-2 font-medium text-white dark:text-black",
        "-translate-y-full opacity-0 transition-all duration-200",
        "focus-visible:translate-y-0 focus-visible:opacity-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      )}
    >
      Skip to main content
    </a>
  );
}

export { SkipLink };
