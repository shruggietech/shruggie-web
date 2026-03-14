/**
 * WorkScroll — Scroll-locked work section with case study card cycling.
 *
 * Replaces WorkPreview. Pins the section via GSAP ScrollTrigger and
 * cycles through case study cards as the user scrolls. Updates
 * scrollState.workProgress and scrollState.workActive so the canvas
 * work graph highlight syncs with the active card.
 *
 * Desktop: left 1/3 card + heading, right 2/3 canvas graph.
 * Mobile: top ~50% canvas, bottom ~50% heading + card.
 *
 * Click/tap targets overlay logo-icon hub nodes on the canvas so
 * clicking jumps to the corresponding case study.
 *
 * prefers-reduced-motion: horizontal scroll strip (WorkPreview style),
 * no pinning, no click targets.
 *
 * Spec reference: §6.1 (Homepage — Section 3: Our Work)
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { scrollState } from "@/lib/canvas/scroll-state";
import {
  generateWorkGraphLayout,
  HUB_SIZE_ACTIVE,
} from "@/lib/canvas/work-graph";

gsap.registerPlugin(ScrollTrigger);

/* ── Case study data ────────────────────────────────────────────────────── */

interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  summary: string;
}

const caseStudies: CaseStudy[] = [
  {
    slug: "united-way",
    client: "United Way of Anderson County",
    industry: "Nonprofit",
    summary:
      "Accessibility-compliant website redesign aligned with global United Way brand guidelines, built on infrastructure the client owns.",
  },
  {
    slug: "scruggs-tire",
    client: "Scruggs Tire & Alignment",
    industry: "Automotive Services",
    summary:
      "Forensic vendor audit, contract disentanglement, and full replatform onto client-owned infrastructure for a Knoxville auto shop.",
  },
  {
    slug: "i-heart-pr-tours",
    client: "I Heart PR Tours",
    industry: "Tourism",
    summary:
      "Multi-platform booking integration, OTA optimization, and brand identity for a Puerto Rico tour operator.",
  },
];

/* ── Canvas layout constants (must match HomeCanvas.tsx) ─────────────────── */

/** Fraction of viewport width for graph center X */
const WORK_CENTER_X_FRAC = 0.58;
/** Fraction of viewport height for graph center Y */
const WORK_CENTER_Y_FRAC = 0.5;
/** Fraction of viewport width for spread */
const WORK_SPREAD_FRAC = 0.35;

/* ── Card transition helpers ────────────────────────────────────────────── */

/** Half-width of each crossfade zone. */
const TRANSITION_HALF_WIDTH = 0.06;

/**
 * Compute opacity and translateY for a card based on workProgress.
 * Transition midpoints sit halfway between consecutive snap positions
 * (e.g. for 3 cards snapping at 0, 0.5, 1 → midpoints at 0.25, 0.75),
 * so each snap position is centered in the card's fully-visible zone.
 */
function getCardStyle(
  cardIndex: number,
  progress: number,
  totalCards: number,
) {
  const transitions = totalCards - 1;
  if (transitions <= 0) return { opacity: 1, translateY: 0 };

  const enterMid = cardIndex > 0
    ? (2 * cardIndex - 1) / (2 * transitions)
    : null;
  const exitMid = cardIndex < totalCards - 1
    ? (2 * cardIndex + 1) / (2 * transitions)
    : null;

  // Before enter zone — hidden
  if (enterMid !== null && progress < enterMid - TRANSITION_HALF_WIDTH) {
    return { opacity: 0, translateY: 30 };
  }

  // In enter crossfade
  if (enterMid !== null && progress < enterMid + TRANSITION_HALF_WIDTH) {
    const t =
      (progress - (enterMid - TRANSITION_HALF_WIDTH)) /
      (2 * TRANSITION_HALF_WIDTH);
    return { opacity: t, translateY: 30 * (1 - t) };
  }

  // Fully visible zone
  const exitStart =
    exitMid !== null ? exitMid - TRANSITION_HALF_WIDTH : Infinity;
  if (progress <= exitStart) {
    return { opacity: 1, translateY: 0 };
  }

  // In exit crossfade
  if (exitMid !== null && progress < exitMid + TRANSITION_HALF_WIDTH) {
    const t = (progress - exitStart) / (2 * TRANSITION_HALF_WIDTH);
    return { opacity: 1 - t, translateY: -30 * t };
  }

  // Past exit zone — hidden
  return { opacity: 0, translateY: -30 };
}

/* ── Hub position calculation ───────────────────────────────────────────── */

/**
 * Compute the viewport-pixel position of each hub node.
 * Uses the same layout generator and center/spread as HomeCanvas.
 */
function getHubPositions(
  viewportWidth: number,
  viewportHeight: number,
  count: number,
) {
  const layout = generateWorkGraphLayout(count);
  const centerX = viewportWidth * WORK_CENTER_X_FRAC;
  const centerY = viewportHeight * WORK_CENTER_Y_FRAC;
  const spread = viewportWidth * WORK_SPREAD_FRAC;

  return layout.hubNodes.map((hub) => ({
    x: centerX + hub.x * spread,
    y: centerY + hub.y * spread,
  }));
}

/* ── Component ──────────────────────────────────────────────────────────── */

export default function WorkScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  // ── Compute & update click target positions ─────────────────────────
  const updateButtonPositions = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const positions = getHubPositions(w, h, caseStudies.length);
    const hitSize = HUB_SIZE_ACTIVE + 16; // slightly larger than hub

    for (let i = 0; i < caseStudies.length; i++) {
      const btn = buttonRefs.current[i];
      if (!btn) continue;
      btn.style.left = `${positions[i].x - hitSize / 2}px`;
      btn.style.top = `${positions[i].y - hitSize / 2}px`;
      btn.style.width = `${hitSize}px`;
      btn.style.height = `${hitSize}px`;
    }
  }, []);

  // ── Click handler: jump to case study ───────────────────────────────
  const handleHubClick = useCallback((hubIndex: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const transitions = caseStudies.length - 1;
    if (transitions <= 0) return;

    const targetProgress = hubIndex / transitions;
    scrollState.workProgress = targetProgress;

    // Compute the scroll position corresponding to this progress.
    // Lenis intercepts window.scrollTo so smooth scrolling is automatic.
    const scrollStart = trigger.start;
    const scrollEnd = trigger.end;
    const targetScroll =
      scrollStart + targetProgress * (scrollEnd - scrollStart);

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      scrollState.workActive = false;
      return;
    }

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const transitions = caseStudies.length - 1;

    // ── ScrollTrigger: pin + snap ──────────────────────────────────────
    const trigger = ScrollTrigger.create({
      trigger: sectionEl,
      pin: true,
      scrub: 1,
      snap: transitions > 0 ? 1 / transitions : undefined,
      end: `+=${transitions * 100}%`,
      onUpdate: (self) => {
        scrollState.workProgress = self.progress;
        scrollState.workActive = self.isActive;
      },
      onLeave: () => {
        scrollState.workActive = false;
      },
      onLeaveBack: () => {
        scrollState.workActive = false;
        scrollState.workProgress = 0;
      },
    });

    triggerRef.current = trigger;

    // ── Position hub click targets ────────────────────────────────────
    updateButtonPositions();
    window.addEventListener("resize", updateButtonPositions);

    // ── rAF loop for card position updates ────────────────────────────
    let running = true;

    function updateCards() {
      if (!running) return;

      const progress = scrollState.workProgress;

      for (let i = 0; i < caseStudies.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const { opacity, translateY } = getCardStyle(
          i,
          progress,
          caseStudies.length,
        );
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${translateY}px)`;
        el.style.pointerEvents = opacity > 0.01 ? "auto" : "none";
        el.ariaHidden = opacity > 0.01 ? "false" : "true";
      }

      rafRef.current = requestAnimationFrame(updateCards);
    }

    rafRef.current = requestAnimationFrame(updateCards);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", updateButtonPositions);
      trigger.kill();
      triggerRef.current = null;
    };
  }, [updateButtonPositions]);

  return (
    <section
      id="work-section"
      ref={sectionRef}
      className="relative"
      data-case-study-count={caseStudies.length}
    >
      {/* ── Animated layout (scroll-locked) ───────────────────────────── */}
      <div className="work-scroll-animated flex h-screen flex-col md:flex-row">
        {/* Left 1/3 (desktop) / bottom 50% (mobile): heading + card */}
        <div className="order-2 flex flex-[0_0_50%] flex-col justify-start px-6 pb-8 pt-4 md:order-1 md:flex-[0_0_33.333%] md:justify-center md:px-12 md:py-16 lg:px-20">
          <SectionHeading
            label="OUR WORK"
            title="Real results for real businesses."
            description="We solve messy problems for businesses that need more than a template."
          />

          {/* Card stack — all cards stacked, opacity-controlled */}
          <div className="relative mt-8 md:mt-10">
            {caseStudies.map((study, index) => (
              <div
                key={study.slug}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`${index === 0 ? "relative" : "absolute inset-0"}`}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  transform:
                    index === 0 ? "translateY(0px)" : "translateY(30px)",
                }}
              >
                <Card className="flex flex-col">
                  <Badge className="mb-3 self-start">{study.industry}</Badge>
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    {study.client}
                  </h3>
                  <p className="mt-2 text-body-md text-text-secondary">
                    {study.summary}
                  </p>
                  <Link
                    href={`/work/${study.slug}`}
                    className="mt-4 inline-flex items-center font-display text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Read case study →
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2/3 (desktop) / top 50% (mobile): canvas + click targets */}
        <div className="relative order-1 flex-[0_0_50%] md:order-2 md:flex-[0_0_66.667%]">
          {/* Click/tap targets for logo-icon hub nodes */}
          {caseStudies.map((study, index) => (
            <button
              key={study.slug}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              className="absolute z-10 cursor-pointer rounded-full border-0 bg-transparent"
              style={{ opacity: 0 }}
              aria-label={`View ${study.client} case study`}
              onClick={() => handleHubClick(index)}
            />
          ))}
        </div>
      </div>

      {/* ── Static layout (reduced motion): horizontal scroll strip ──── */}
      <div className="work-scroll-static py-[var(--section-gap)]">
        <div className="container-content">
          <SectionHeading
            label="OUR WORK"
            title="Real results for real businesses."
            description="We solve messy problems for businesses that need more than a template."
          />
          <div className="mt-[var(--component-gap)] -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:-mx-0 md:px-0">
            {caseStudies.map((study) => (
              <div
                key={study.slug}
                className="w-[85vw] flex-shrink-0 snap-start sm:w-[400px]"
              >
                <Card className="flex h-full flex-col">
                  <Badge className="mb-3 self-start">{study.industry}</Badge>
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    {study.client}
                  </h3>
                  <p className="mt-2 flex-1 text-body-md text-text-secondary">
                    {study.summary}
                  </p>
                  <Link
                    href={`/work/${study.slug}`}
                    className="mt-4 inline-flex items-center font-display text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Read case study →
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { WorkScroll };
