/**
 * scroll-state.ts — Shared mutable scroll state for the homepage.
 *
 * A plain object (not React state) that ScrollOrchestrator writes to
 * via GSAP ScrollTrigger callbacks and HomeCanvas reads from every
 * frame in its draw loop. This avoids React re-renders for scroll-
 * driven animation values that change 60× per second.
 */

export const scrollState = {
  /** 0 = hero fully visible, 1 = hero fully exited */
  heroExitProgress: 0,
  /** 0–1 within the pinned services section */
  servicesProgress: 0,
  /** true when the services section is pinned */
  servicesActive: false,
  /** 0 = services pinned, 1 = fully transitioned to work */
  servicesExitProgress: 0,
  /** 0–1 within the pinned work section */
  workProgress: 0,
  /** true when the work section is pinned */
  workActive: false,
  /** 0 = work pinned, 1 = transitioned to research */
  workExitProgress: 0,
  /** 0–1 within the research section scroll */
  researchProgress: 0,
  /** 0 = in research, 1 = fully transitioned to CTA */
  researchExitProgress: 0,
  /** true when CTA section is in viewport */
  ctaVisible: false,
};
