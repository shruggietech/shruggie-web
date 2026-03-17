/**
 * ProcessAccordion — Accordion + cycle diagram for the "How We Work" section.
 *
 * Left side (desktop) / Top (mobile): Three accordion panels showing
 * phase details. Only one panel open at a time. Fixed min-height to
 * eliminate page jumps.
 *
 * Right side (desktop) / Bottom (mobile): SVG cycle diagram with three
 * curved arrow segments. Active phase fills with brand green; inactive
 * arrows stay muted gray.
 *
 * Spec reference: ShruggieTech-Site-Updates-Plan-v2 §2.3
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

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

/* ── Cycle Diagram SVG ──────────────────────────────────────────────────── */

function CycleDiagram({ activePhase }: { activePhase: number }) {
  const INACTIVE = "var(--color-gray-600, #52525b)";
  const ACTIVE = "#2BCC73";

  // Node positions (on a circle, top-centered)
  // Phase 01 at top, 02 at bottom-right, 03 at bottom-left
  const nodes = [
    { cx: 150, cy: 40, label: "01", title: "Foundation" },
    { cx: 260, cy: 220, label: "02", title: "Optimization" },
    { cx: 40, cy: 220, label: "03", title: "Partnership" },
  ];

  // Curved arrow paths between nodes (clockwise)
  const arrows = [
    // Phase 01: top → bottom-right
    "M 168,56 C 220,80 260,140 262,200",
    // Phase 02: bottom-right → bottom-left
    "M 244,236 C 200,280 100,280 56,236",
    // Phase 03: bottom-left → top
    "M 38,200 C 36,140 76,80 132,56",
  ];

  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full max-w-[280px] mx-auto md:max-w-none"
      aria-hidden="true"
    >
      <defs>
        {/* Arrowhead markers for each phase */}
        {[0, 1, 2].map((i) => (
          <marker
            key={i}
            id={`arrow-${i}`}
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
          >
            <path
              d="M 0 0 L 10 4 L 0 8 Z"
              fill={activePhase === i ? ACTIVE : INACTIVE}
              style={{ transition: "fill 0.4s ease" }}
            />
          </marker>
        ))}
      </defs>

      {/* Arrow paths */}
      {arrows.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={activePhase === i ? ACTIVE : INACTIVE}
          strokeWidth={2.5}
          strokeLinecap="round"
          markerEnd={`url(#arrow-${i})`}
          style={{ transition: "stroke 0.4s ease" }}
        />
      ))}

      {/* Phase nodes */}
      {nodes.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r={28}
            fill={activePhase === i ? "rgba(43,204,115,0.12)" : "rgba(255,255,255,0.03)"}
            stroke={activePhase === i ? ACTIVE : INACTIVE}
            strokeWidth={2}
            style={{ transition: "fill 0.4s ease, stroke 0.4s ease" }}
          />
          <text
            x={node.cx}
            y={node.cy - 4}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-text-primary font-display text-[14px] font-bold"
          >
            {node.label}
          </text>
          <text
            x={node.cx}
            y={node.cy + 12}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-[9px] font-medium"
            fill={activePhase === i ? ACTIVE : "var(--color-text-secondary, #a1a1aa)"}
            style={{ transition: "fill 0.4s ease" }}
          >
            {node.title}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Component ──────────────────────────────────────────────────────────── */

export default function ProcessAccordion() {
  const [activePhase, setActivePhase] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (index: number) => {
    setActivePhase((prev) => (prev === index ? prev : index));
  };

  return (
    <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* ── Accordion ────────────────────────────────────────────────── */}
      <div className="min-h-[420px] md:min-h-[460px]">
        <div className="space-y-3">
          {phases.map((phase, index) => {
            const isOpen = activePhase === index;

            return (
              <div
                key={phase.number}
                className={cn(
                  "rounded-xl border transition-colors duration-300",
                  isOpen
                    ? "border-accent/40 bg-accent/[0.04]"
                    : "border-border dark:border-white/[0.06] bg-bg-elevated dark:bg-white/[0.02]",
                )}
              >
                {/* Panel header / trigger */}
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`phase-panel-${index}`}
                >
                  <span className="font-display text-display-sm font-bold text-accent shrink-0">
                    {phase.number}
                  </span>
                  <span className="font-display text-body-lg font-bold text-text-primary flex-1">
                    {phase.title}
                  </span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "text-text-secondary shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Expandable panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`phase-panel-${index}`}
                      role="region"
                      aria-labelledby={`phase-trigger-${index}`}
                      initial={shouldReduceMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: shouldReduceMotion ? 0 : 0.3, ease: [0.25, 0.1, 0.25, 1] },
                        opacity: { duration: shouldReduceMotion ? 0 : 0.2, delay: shouldReduceMotion ? 0 : 0.1 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-body-md text-text-secondary">
                          {phase.description}
                        </p>

                        <div className="mt-4 border-t border-border/50 pt-4">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Cycle Diagram ────────────────────────────────────────────── */}
      <div className="flex items-center justify-center">
        <CycleDiagram activePhase={activePhase} />
      </div>
    </div>
  );
}
