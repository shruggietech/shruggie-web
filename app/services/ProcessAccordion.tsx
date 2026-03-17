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
      "Every cycle begins with open conversation. We align on goals, review priorities, and define the scope of what comes next. Your input drives every decision — no assumptions, no black boxes.",
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
      "We design, build, and iterate. From wireframes to working code, the create phase turns your requirements into tangible results through focused, rapid development.",
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
      "When the work is ready, we deploy, measure, and optimize. Every delivery is a checkpoint — review the results, gather feedback, and feed it back into the next cycle.",
    deliverables: [
      "Deployment and launch",
      "Performance monitoring and analytics",
      "Stakeholder review and sign-off",
      "Retrospective and continuous improvement",
    ],
  },
];

/* ── Arrow Cycle Diagram SVG ──────────────────────────────────────────── */

/** Small speech-bubble icon */
function DiscussIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.4s ease" }}>
      <path d={`M${x - 8},${y - 7} h16 a3,3 0 0,1 3,3 v6 a3,3 0 0,1 -3,3 h-4 l-2.5,3 v-3 h-9.5 a3,3 0 0,1 -3,-3 v-6 a3,3 0 0,1 3,-3 z`} />
      <circle cx={x - 3} cy={y - 1} r="1" fill={color} stroke="none" />
      <circle cx={x} cy={y - 1} r="1" fill={color} stroke="none" />
      <circle cx={x + 3} cy={y - 1} r="1" fill={color} stroke="none" />
    </g>
  );
}

/** Small lightbulb icon */
function CreateIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.4s ease" }}>
      <circle cx={x} cy={y - 3} r="7" />
      <path d={`M${x - 3},${y + 4} a4,4 0 0,0 6,0`} />
      <line x1={x - 2} y1={y + 6} x2={x + 2} y2={y + 6} />
      <line x1={x} y1={y - 12} x2={x} y2={y - 14} />
      <line x1={x + 7} y1={y - 9} x2={x + 9} y2={y - 10.5} />
      <line x1={x - 7} y1={y - 9} x2={x - 9} y2={y - 10.5} />
    </g>
  );
}

/** Small rocket icon */
function RocketIcon({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.4s ease" }}>
      <path d={`M${x},${y - 10} c-6,4 -7,10 -7,15 l4.5,3 h5 l4.5,-3 c0,-5 -1,-11 -7,-15 z`} />
      <circle cx={x} cy={y - 1} r="1.8" />
      <path d={`M${x - 7},${y + 5} l-3,3 l4.5,0.5`} />
      <path d={`M${x + 7},${y + 5} l3,3 l-4.5,0.5`} />
      <line x1={x - 2} y1={y + 8} x2={x - 2.5} y2={y + 11} />
      <line x1={x} y1={y + 8} x2={x} y2={y + 12} />
      <line x1={x + 2} y1={y + 8} x2={x + 2.5} y2={y + 11} />
    </g>
  );
}

function CycleDiagram({ activePhase }: { activePhase: number }) {
  const ORANGE = "#F09040";
  const ORANGE_DIM = "rgba(240, 144, 64, 0.50)";

  // Nodes: Discuss (top), Create (bottom-right), Deliver (bottom-left)
  const nodes = [
    { cx: 195, cy: 112, label: "Discuss" },
    { cx: 280, cy: 248, label: "Create" },
    { cx: 110, cy: 248, label: "Deliver" },
  ];

  const R = 100;
  const STROKE_W = 20;
  const ICON_SCALE = 2.8;

  // Z-order: Deliver (back), Create (mid), Discuss (front)
  const drawOrder = [2, 1, 0];

  return (
    <svg
      viewBox="0 0 390 365"
      className="w-full max-w-[320px] mx-auto md:max-w-none"
      aria-hidden="true"
    >
      {drawOrder.map((i) => {
        const node = nodes[i];
        const isActive = activePhase === i;
        const iconColor = isActive
          ? "var(--text-primary, #333)"
          : "var(--text-muted, #9A9A9A)";

        return (
          <g key={i}>
            {/* Circle with thick orange border */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r={R}
              className="fill-[#E5E5E5] dark:fill-[#1A1A1E]"
              stroke={isActive ? ORANGE : ORANGE_DIM}
              strokeWidth={STROKE_W}
              style={{ transition: "stroke 0.4s ease" }}
            />

            {/* Icon (scaled up) */}
            <g transform={`translate(${node.cx}, ${node.cy - 12}) scale(${ICON_SCALE})`}>
              {i === 0 && <DiscussIcon x={0} y={0} color={iconColor} />}
              {i === 1 && <CreateIcon x={0} y={0} color={iconColor} />}
              {i === 2 && <RocketIcon x={0} y={0} color={iconColor} />}
            </g>

            {/* Label */}
            <text
              x={node.cx}
              y={node.cy + 38}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[16px] font-bold"
              fill={isActive ? "var(--text-primary, #333)" : "var(--text-secondary, #6B6B6B)"}
              style={{ transition: "fill 0.4s ease" }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
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
