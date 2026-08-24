/**
 * LenisProvider — Smooth scrolling provider.
 *
 * Initializes Lenis with configuration from spec §4.1.
 * Bails out entirely when prefers-reduced-motion is active (§4.2).
 * Listens for reduced-motion changes during session and destroys
 * Lenis if the preference is activated mid-session.
 *
 * Spec references: §4.1 (Configuration), §4.2 (Accessibility Safeguards), §4.3 (Provider Implementation)
 */

"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Bail out entirely if user prefers reduced motion (§4.2)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Route in-page anchor clicks (e.g. the research paper TOCs) through Lenis
    // so its virtual scroll position stays in sync — a native hash jump would
    // desync Lenis and make the next scroll "snap back". We resolve targets
    // with getElementById and hand the *element* to scrollTo (never a selector
    // string), so numeric-leading ids like "#2-exiftool-..." don't trip Lenis's
    // internal querySelector, which rejects ids that start with a digit. The
    // offset clears the sticky header.
    const HEADER_OFFSET = -96;

    const scrollToHash = (hash: string, immediate = false) => {
      if (!hash || hash === "#") return false;
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return false;
      lenis.scrollTo(el, { offset: HEADER_OFFSET, immediate });
      return true;
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href") ?? "";
      if (scrollToHash(hash)) {
        event.preventDefault();
        history.pushState(null, "", hash);
      }
    };
    document.addEventListener("click", handleAnchorClick);

    // Honor a hash present on initial load (e.g. a shared deep link).
    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash, true));
    }

    // Listen for reduced motion changes during session (§4.2)
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On client-side navigation, reset Lenis to the top. Next scrolls the window
  // to 0 on route change, but Lenis keeps its own virtual scroll position — if
  // we don't resync it, the new page inherits the previous page's scroll state
  // and "jumps". Skip the first render (initial load / deep links are handled
  // above) and skip when navigating to a hash target.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const lenis = lenisRef.current;
    if (!lenis) return;

    // If the destination carries a hash (e.g. /services#development from a case
    // study), scroll to that target through Lenis; otherwise reset to the top.
    // Deferred a frame so the freshly navigated DOM is in place.
    requestAnimationFrame(() => {
      const hash = window.location.hash;
      const el = hash
        ? document.getElementById(decodeURIComponent(hash.slice(1)))
        : null;
      if (el) {
        lenis.scrollTo(el, { offset: -96, immediate: true });
      } else {
        lenis.scrollTo(0, { immediate: true });
      }
    });
  }, [pathname]);

  return <>{children}</>;
}

export { LenisProvider };
