/**
 * ScrollOrchestrator — Top-level component that initializes GSAP
 * ScrollTrigger and wires it to the Lenis smooth scrolling already
 * active via LenisProvider.
 *
 * Responsibilities:
 *   - Register GSAP ScrollTrigger plugin
 *   - Create placeholder ScrollTrigger instances for sections that will
 *     be scroll-locked in future phases (Services, Work)
 *   - Render HomeCanvas (the page-level dot-grid canvas)
 *   - Wrap homepage children so canvas + scroll triggers coexist
 *   - prefers-reduced-motion: skip ScrollTrigger initialization entirely
 *
 * Lenis integration: Lenis is already initialized in LenisProvider
 * (layout-level). ScrollTrigger's default scroll listener picks up
 * the scroll events that Lenis triggers via window.scrollTo(). For
 * optimal synchronization, we also call ScrollTrigger.update() on
 * each scroll event.
 */

"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HomeCanvas from "@/components/home/HomeCanvas";
import { scrollState } from "@/lib/canvas/scroll-state";

// Register the plugin once at module level
gsap.registerPlugin(ScrollTrigger);

interface ScrollOrchestratorProps {
  children: ReactNode;
}

export default function ScrollOrchestrator({
  children,
}: ScrollOrchestratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggersCreated = useRef(false);

  useEffect(() => {
    // Bail out entirely if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    // ── Wire scroll events to ScrollTrigger ───────────────────────────
    // Lenis triggers native scroll events via window.scrollTo().
    // Explicitly calling ScrollTrigger.update() ensures it stays in sync
    // with the smooth-scrolled position on every scroll frame.
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Create placeholder ScrollTrigger instances ────────────────────
    // These will be replaced with real pinning/scrub triggers in later
    // phases. For now they just log scroll progress to the console.
    if (!triggersCreated.current) {
      triggersCreated.current = true;

      // Wait a tick for sections to render and be measurable
      requestAnimationFrame(() => {
        const heroEl = document.getElementById("hero-section");
        const servicesEl = document.getElementById("services-section");
        const workEl = document.getElementById("work-section");
        const researchEl = document.getElementById("research-section");

        // ── Hero-to-Services transition ─────────────────────────────
        // Starts when hero bottom reaches ~70% of viewport, ends at ~20%.
        if (heroEl) {
          ScrollTrigger.create({
            trigger: heroEl,
            start: "bottom 70%",
            end: "bottom 20%",
            scrub: true,
            onUpdate: (self) => {
              scrollState.heroExitProgress = self.progress;
            },
            onLeaveBack: () => {
              scrollState.heroExitProgress = 0;
            },
            onLeave: () => {
              scrollState.heroExitProgress = 1;
            },
          });
        }

        // ── Services → Work transition ──────────────────────────────
        // Fires between services unpin and work section pin.
        // Uses a spacer element between the two sections.
        if (servicesEl && workEl) {
          ScrollTrigger.create({
            trigger: workEl,
            start: "top bottom",
            end: "top 25%",
            scrub: 1,
            onUpdate: (self) => {
              scrollState.servicesExitProgress = self.progress;
            },
            onLeaveBack: () => {
              scrollState.servicesExitProgress = 0;
            },
            onLeave: () => {
              scrollState.servicesExitProgress = 1;
            },
          });
        }

        // Work section pin is handled by WorkScroll.tsx itself.

        // ── Work → Research transition ──────────────────────────────
        // As work section unpins, the node graph contracts.
        // ~0.5 viewport height transition.
        if (workEl && researchEl) {
          ScrollTrigger.create({
            trigger: researchEl,
            start: "top bottom",
            end: "top 50%",
            scrub: 1,
            onUpdate: (self) => {
              scrollState.workExitProgress = self.progress;
            },
            onLeaveBack: () => {
              scrollState.workExitProgress = 0;
            },
            onLeave: () => {
              scrollState.workExitProgress = 1;
            },
          });
        }

        // ── Research section progress ───────────────────────────────
        // Tracks 0–1 over the full height of the research section.
        if (researchEl) {
          ScrollTrigger.create({
            trigger: researchEl,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
              scrollState.researchProgress = self.progress;
            },
            onLeaveBack: () => {
              scrollState.researchProgress = 0;
            },
            onLeave: () => {
              scrollState.researchProgress = 1;
            },
          });
        }

        // ── Research → CTA zoom-out transition ──────────────────────
        const ctaEl = document.getElementById("cta-section");
        if (researchEl && ctaEl) {
          ScrollTrigger.create({
            trigger: ctaEl,
            start: "top bottom",
            end: "top 20%",
            scrub: 1,
            onUpdate: (self) => {
              scrollState.researchExitProgress = self.progress;
            },
            onLeaveBack: () => {
              scrollState.researchExitProgress = 0;
            },
            onLeave: () => {
              scrollState.researchExitProgress = 1;
            },
          });
        }

        // ── CTA section visibility ──────────────────────────────────
        if (ctaEl) {
          ScrollTrigger.create({
            trigger: ctaEl,
            start: "top 80%",
            end: "bottom bottom",
            onEnter: () => {
              scrollState.ctaVisible = true;
            },
            onLeaveBack: () => {
              scrollState.ctaVisible = false;
            },
          });
        }
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Kill all ScrollTrigger instances created by this component
      ScrollTrigger.getAll().forEach((t) => t.kill());
      triggersCreated.current = false;
    };
  }, []);

  return (
    <div ref={containerRef}>
      <HomeCanvas />
      {children}
    </div>
  );
}
