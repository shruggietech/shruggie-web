/**
 * ProcessAccordion — Accordion + arrow cycle for the "How We Work" section.
 *
 * Left side (desktop) / Top (mobile): Three accordion panels showing
 * phase details. Only one panel open at a time. Fixed min-height to
 * eliminate page jumps.
 *
 * Right side (desktop) / Bottom (mobile): SVG cycle diagram with three
 * curved arrow segments connecting Discuss → Create → Deliver in a
 * continuous loop, reinforcing the iterative Agile nature.
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
    title: "Discuss",
    description:
      "Every cycle begins with open conversation. We align on goals, review priorities, and define the scope of what comes next. Your input drives every decision.",
    deliverables: [
      "Requirements gathering and discovery",
      "Sprint planning and backlog refinement",
      "Stakeholder alignment and feedback review",
      "Priority definition and scope agreement",
    ],
  },
  {
    number: "02",
    title: "Create",
    description:
      "We design, build, and iterate. From wireframes to working code, your requirements become tangible results through focused, rapid development.",
    deliverables: [
      "UI/UX design and prototyping",
      "Development and integration",
      "Quality assurance and testing",
      "Iterative refinement and demos",
    ],
  },
  {
    number: "03",
    title: "Deliver",
    description:
      "When the work is ready, we deploy, measure, and optimize. Every delivery closes a loop: review the results, gather feedback, and feed it back into the next cycle.",
    deliverables: [
      "Deployment and launch",
      "Performance monitoring and analytics",
      "Stakeholder review and sign-off",
      "Retrospective and continuous improvement",
    ],
  },
];

/* ── Arrow Cycle Diagram SVG — "Process Cycle Blueprint" ──────────────── */

function CycleDiagram({ activePhase }: { activePhase: number }) {
  /* Node positions on orbit circle (center 200,195 r≈140) */
  const nodes = [
    { cx: 200, cy: 55, label: "Discuss", number: "01" },
    { cx: 325, cy: 265, label: "Create", number: "02" },
    { cx: 75, cy: 265, label: "Deliver", number: "03" },
  ];

  /* Clockwise arrow segments: cubic béziers offset slightly outside orbit */
  const arrows = [
    {
      d: "M 215,60 C 300,55 355,155 320,250",
      startX: 215, startY: 60,
      tipX: 320, tipY: 250,
      tipAngle: 110,
    },
    {
      d: "M 318,280 C 290,365 110,365 82,280",
      startX: 318, startY: 280,
      tipX: 82, tipY: 280,
      tipAngle: 252,
    },
    {
      d: "M 68,250 C 40,155 105,55 185,60",
      startX: 68, startY: 250,
      tipX: 185, tipY: 60,
      tipAngle: 4,
    },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-[320px] mx-auto md:max-w-none"
      aria-hidden="true"
    >
      <defs>
        {/* Arrow glow filter */}
        <filter id="arrow-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <style>{`
          @keyframes processCyclePulse {
            0%, 100% { opacity: 0; transform: scale(1); }
            50% { opacity: 0.15; transform: scale(1.08); }
          }
          .process-cycle-pulse {
            transform-box: fill-box;
            transform-origin: center;
            animation: processCyclePulse 3s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .process-cycle-pulse {
              animation: none !important;
              opacity: 0.1 !important;
              transform: none !important;
            }
          }
        `}</style>
      </defs>

      {/* ── Layer 1: Background Scaffold ── */}

      {/* Orbit circle (dashed) */}
      <circle
        cx={200} cy={195} r={140}
        fill="none" stroke="white" strokeWidth={0.5}
        opacity={0.08} strokeDasharray="6 8"
      />

      {/* Center crosshair */}
      <line x1={200} y1={175} x2={200} y2={215} stroke="white" strokeWidth={0.5} opacity={0.06} />
      <line x1={180} y1={195} x2={220} y2={195} stroke="white" strokeWidth={0.5} opacity={0.06} />

      {/* Radial spoke lines to each node */}
      {nodes.map((node, i) => (
        <line
          key={`spoke-${i}`}
          x1={200} y1={195} x2={node.cx} y2={node.cy}
          stroke="white" strokeWidth={0.5} opacity={0.05}
          strokeDasharray="3 5"
        />
      ))}

      {/* ── Layer 2: Curved Arrow Segments ── */}
      {arrows.map((arrow, i) => {
        const isActive = activePhase === i;
        return (
          <g key={`arrow-${i}`}>
            {/* Track layer (always visible rail) */}
            <path
              d={arrow.d} fill="none"
              stroke="white" strokeWidth={1.5} opacity={0.08}
              strokeLinecap="round"
            />
            {/* Active layer */}
            <path
              d={arrow.d} fill="none"
              stroke="#2BCC73"
              strokeWidth={isActive ? 2 : 1.5}
              strokeLinecap="round"
              filter={isActive ? "url(#arrow-glow)" : undefined}
              style={{
                opacity: isActive ? 0.7 : 0.15,
                transition: "stroke-opacity 0.4s ease, opacity 0.4s ease, filter 0.4s ease, stroke-width 0.3s ease",
              }}
            />
            {/* Arrowhead */}
            <g transform={`translate(${arrow.tipX},${arrow.tipY}) rotate(${arrow.tipAngle})`}>
              <polygon
                points="0,0 -8,-3.5 -8,3.5"
                fill="#2BCC73"
                style={{
                  opacity: isActive ? 0.7 : 0.15,
                  transition: "opacity 0.4s ease",
                }}
              />
            </g>
          </g>
        );
      })}

      {/* ── Layer 3: Node Circles ── */}
      {nodes.map((node, i) => {
        const isActive = activePhase === i;
        return (
          <g key={`node-${i}`}>
            {/* Outer ring */}
            <circle
              cx={node.cx} cy={node.cy} r={32}
              fill={isActive ? "#2BCC73" : "none"}
              stroke={isActive ? "#2BCC73" : "white"}
              strokeWidth={isActive ? 2 : 1}
              style={{
                fillOpacity: isActive ? 0.06 : 0,
                strokeOpacity: isActive ? 0.6 : 0.12,
                transition: "stroke 0.4s ease, stroke-opacity 0.4s ease, fill 0.4s ease, fill-opacity 0.4s ease, stroke-width 0.3s ease",
              }}
            />
            {/* Inner ring */}
            <circle
              cx={node.cx} cy={node.cy} r={20}
              fill="none"
              stroke={isActive ? "#14B8A6" : "white"}
              strokeWidth={isActive ? 1 : 0.5}
              style={{
                strokeOpacity: isActive ? 0.35 : 0.06,
                transition: "stroke 0.4s ease, stroke-opacity 0.4s ease, stroke-width 0.3s ease",
              }}
            />
            {/* Phase number */}
            <text
              x={node.cx} y={node.cy}
              fontFamily="monospace" fontSize={14} fontWeight="bold"
              textAnchor="middle" dominantBaseline="central"
              fill={isActive ? "#2BCC73" : "white"}
              style={{
                opacity: isActive ? 0.9 : 0.25,
                transition: "fill 0.4s ease, opacity 0.4s ease",
              }}
            >
              {node.number}
            </text>
            {/* Label below ring */}
            <text
              x={node.cx} y={node.cy + 50}
              fontSize={12} fontWeight={500}
              textAnchor="middle" letterSpacing="0.05em"
              fill={isActive ? "#2BCC73" : "white"}
              style={{
                opacity: isActive ? 0.8 : 0.2,
                transition: "fill 0.4s ease, opacity 0.4s ease",
              }}
            >
              {node.label}
            </text>
          </g>
        );
      })}

      {/* ── Layer 4: Connection Dots ── */}
      {arrows.map((arrow, i) => {
        const isActive = activePhase === i;
        return (
          <g key={`dots-${i}`}>
            <circle
              cx={arrow.startX} cy={arrow.startY} r={2.5}
              fill={isActive ? "#2BCC73" : "white"}
              style={{
                opacity: isActive ? 0.5 : 0.1,
                transition: "fill 0.4s ease, opacity 0.4s ease",
              }}
            />
            <circle
              cx={arrow.tipX} cy={arrow.tipY} r={2.5}
              fill={isActive ? "#2BCC73" : "white"}
              style={{
                opacity: isActive ? 0.5 : 0.1,
                transition: "fill 0.4s ease, opacity 0.4s ease",
              }}
            />
          </g>
        );
      })}

      {/* ── Layer 5: Active Phase Pulse Ring ── */}
      {nodes.map((node, i) => (
        <g
          key={`pulse-${i}`}
          style={{
            opacity: activePhase === i ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <circle
            cx={node.cx} cy={node.cy} r={38}
            fill="none" stroke="#2BCC73" strokeWidth={1}
            className="process-cycle-pulse"
          />
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
      <div className="flex items-center justify-center order-first md:order-last">
        <CycleDiagram activePhase={activePhase} />
      </div>
    </div>
  );
}
