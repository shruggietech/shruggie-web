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
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

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
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

export { LenisProvider };
