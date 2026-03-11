/**
 * EngagementModel — Interactive three-phase engagement model section.
 *
 * Displays three phase cards (Foundation & Setup, Optimization & Growth,
 * Ongoing Partnership) in a horizontal step-flow on desktop and vertical
 * on mobile. Cards are connected by an animated SVG dashed line that
 * "draws" itself via Framer Motion pathLength as the section enters
 * the viewport. Cards expand on hover (desktop) or tap (mobile) to
 * reveal deliverables. Active card border transitions to brand green
 * and the connecting line segment pulses with a brief glow.
 *
 * Reduced motion fallback: lines render statically, cards are fully
 * expanded by default, no animations fire.
 *
 * Spec reference: §6.2 (Services — Engagement Model)
 */

"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion, useInView, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

/* ── Phase Data ─────────────────────────────────────────────────────────── */

interface Phase {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

const phases: Phase[] = [
  {
    number: "01",
    title: "Foundation & Setup",
    description:
      "We establish your brand assets, deploy modern web infrastructure, and integrate the systems your business needs to operate independently. The goal is a functional, consistently branded digital presence.",
    deliverables: [
      "Brand identity system",
      "Website build and deployment",
      "DNS and hosting on infrastructure you own",
      "Booking/payment integrations",
    ],
  },
  {
    number: "02",
    title: "Optimization & Growth",
    description:
      "Once systems are in place, we make them perform. Algorithm analysis, content freshness, A/B testing, and conversion optimization across every relevant platform.",
    deliverables: [
      "SEO and AEO implementation",
      "Analytics architecture (GA4, GTM)",
      "Ad campaign setup and tuning",
      "Review generation workflows",
    ],
  },
  {
    number: "03",
    title: "Ongoing Partnership",
    description:
      "Continuous storytelling, community engagement, channel expansion, and reputation management. We grow with you.",
    deliverables: [
      "Social media content calendar",
      "Monthly performance reporting",
      "Content refresh cycles",
      "Channel expansion strategy",
    ],
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */

export default function EngagementModel() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const isExpanded = (index: number): boolean =>
    !!shouldReduceMotion || activeCard === index;

  const handlePointerEnter = (
    index: number,
    pointerType: string,
  ) => {
    if (shouldReduceMotion) return;
    if (pointerType === "mouse") setActiveCard(index);
  };

  const handlePointerLeave = (pointerType: string) => {
    if (shouldReduceMotion) return;
    if (pointerType === "mouse") setActiveCard(null);
  };

  const handleClick = (index: number) => {
    if (shouldReduceMotion) return;
    setActiveCard((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (shouldReduceMotion) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(index);
    }
  };

  return (
    <div ref={sectionRef} className="relative mt-16 md:mt-20">
      {/* ── Desktop SVG connecting lines ─────────────────────────────── */}
      <svg
        className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-14 hidden h-[2px] md:block"
        viewBox="0 0 200 2"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static dashed track (always visible) */}
        <path
          d="M 0 1 L 200 1"
          stroke="var(--accent-color)"
          strokeOpacity={0.12}
          strokeWidth={2}
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Animated segment 1: card 0 → card 1 */}
        <motion.path
          d="M 0 1 L 100 1"
          stroke="var(--accent-color)"
          strokeWidth={2}
          fill="none"
          initial={
            shouldReduceMotion
              ? { pathLength: 1, strokeOpacity: 0.4 }
              : { pathLength: 0, strokeOpacity: 0.4 }
          }
          animate={
            isInView
              ? {
                  pathLength: 1,
                  strokeOpacity: activeCard === 1 ? 0.8 : 0.4,
                }
              : undefined
          }
          transition={{ duration: 1, ease: "easeInOut" }}
          filter={activeCard === 1 ? "url(#line-glow)" : "none"}
        />

        {/* Animated segment 2: card 1 → card 2 */}
        <motion.path
          d="M 100 1 L 200 1"
          stroke="var(--accent-color)"
          strokeWidth={2}
          fill="none"
          initial={
            shouldReduceMotion
              ? { pathLength: 1, strokeOpacity: 0.4 }
              : { pathLength: 0, strokeOpacity: 0.4 }
          }
          animate={
            isInView
              ? {
                  pathLength: 1,
                  strokeOpacity: activeCard === 2 ? 0.8 : 0.4,
                }
              : undefined
          }
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: shouldReduceMotion ? 0 : 0.75,
          }}
          filter={activeCard === 2 ? "url(#line-glow)" : "none"}
        />
      </svg>

      {/* ── Mobile SVG connecting line ────────────────────────────────── */}
      <svg
        className="pointer-events-none absolute bottom-8 left-8 top-8 w-[2px] md:hidden"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Static dashed track */}
        <path
          d="M 1 0 L 1 100"
          stroke="var(--accent-color)"
          strokeOpacity={0.12}
          strokeWidth={2}
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Animated vertical line */}
        <motion.path
          d="M 1 0 L 1 100"
          stroke="var(--accent-color)"
          strokeOpacity={0.3}
          strokeWidth={2}
          fill="none"
          initial={
            shouldReduceMotion
              ? { pathLength: 1 }
              : { pathLength: 0 }
          }
          animate={isInView ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>

      {/* ── Phase Cards ──────────────────────────────────────────────── */}
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {phases.map((phase, index) => {
          const expanded = isExpanded(index);

          return (
            <motion.div
              key={phase.number}
              className={cn(
                "rounded-xl border bg-bg-elevated p-6 md:p-8",
                "transition-colors duration-300",
                expanded
                  ? "border-accent shadow-[0_4px_16px_rgba(43,204,115,0.08)]"
                  : "border-border",
                !shouldReduceMotion && "cursor-pointer",
              )}
              onPointerEnter={(e) =>
                handlePointerEnter(index, e.pointerType)
              }
              onPointerLeave={(e) => handlePointerLeave(e.pointerType)}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={shouldReduceMotion ? undefined : 0}
              role={shouldReduceMotion ? undefined : "button"}
              aria-expanded={shouldReduceMotion ? undefined : expanded}
              aria-label={
                shouldReduceMotion
                  ? undefined
                  : `Phase ${phase.number}: ${phase.title}. ${expanded ? "Collapse" : "Expand"} to ${expanded ? "hide" : "show"} deliverables.`
              }
              initial={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, y: 24 }
              }
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: 24 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: index * 0.15,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <span className="font-display text-display-lg font-bold text-accent">
                {phase.number}
              </span>

              <h3 className="mt-2 font-display text-display-sm font-bold text-text-primary">
                {phase.title}
              </h3>

              <p className="mt-3 text-body-md text-text-secondary">
                {phase.description}
              </p>

              {/* Expandable deliverables panel */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows] motion-reduce:transition-none",
                  expanded
                    ? "grid-rows-[1fr] duration-300 ease-out"
                    : "grid-rows-[0fr] duration-200 ease-in",
                )}
              >
                <div className="overflow-hidden">
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-body-sm font-medium uppercase tracking-wider text-accent">
                      Deliverables
                    </p>
                    <ul className="mt-3 space-y-2">
                      {phase.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-body-sm text-text-secondary"
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export { EngagementModel };
