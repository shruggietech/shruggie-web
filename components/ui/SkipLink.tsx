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
        "fixed left-4 top-4 z-[9999]",
        "rounded-lg bg-accent px-4 py-2 font-display text-body-sm font-medium text-black",
        "opacity-0 -translate-y-full transition-all duration-200",
        "focus-visible:opacity-100 focus-visible:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      )}
    >
      Skip to main content
    </a>
  );
}

export { SkipLink };
