"use client";

/**
 * SpecToShipIllustration — Inline SVG illustration for the Products page
 * "How We Build Software" section.
 *
 * Visualises the spec → AI agent → production code pipeline using the
 * same geometric, minimal, Stripe/Linear-inspired line-art style as
 * ServiceIllustrationsLarge.
 *
 * Entrance animations are triggered via IntersectionObserver (useInView)
 * and gated behind the `.is-animating` CSS class.
 */

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import styles from "./SpecToShipIllustration.module.css";

export default function SpecToShipIllustration() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { once: true, margin: "-80px" });
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isInView) setAnimating(true);
  }, [isInView]);

  return (
    <div
      ref={wrapperRef}
      className={`w-full max-w-[360px] mx-auto h-[280px] md:h-auto md:mx-0${animating ? " is-animating" : ""}`}
    >
      <svg
        viewBox="0 0 480 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full mx-auto md:w-full md:h-auto"
        aria-hidden="true"
      >
        {/* ── Layer 1: Background Scaffold ───────────────────────────── */}

        {/* Vertical dashed guide lines */}
        <line
          x1="120" y1="0" x2="120" y2="560"
          stroke="white" strokeWidth="0.5" opacity="0.07"
          strokeDasharray="6 8"
          className={styles.guideV1}
        />
        <line
          x1="360" y1="0" x2="360" y2="560"
          stroke="white" strokeWidth="0.5" opacity="0.07"
          strokeDasharray="6 8"
          className={styles.guideV2}
        />

        {/* Horizontal dashed guide lines */}
        <line
          x1="0" y1="180" x2="480" y2="180"
          stroke="white" strokeWidth="0.5" opacity="0.07"
          strokeDasharray="6 8"
          className={styles.guideH1}
        />
        <line
          x1="0" y1="380" x2="480" y2="380"
          stroke="white" strokeWidth="0.5" opacity="0.07"
          strokeDasharray="6 8"
          className={styles.guideH2}
        />

        {/* Corner crop marks */}
        {/* Top-left */}
        <g className={styles.cornerMark}>
          <line x1="30" y1="30" x2="48" y2="30" stroke="white" strokeWidth="0.75" opacity="0.06" />
          <line x1="30" y1="30" x2="30" y2="48" stroke="white" strokeWidth="0.75" opacity="0.06" />
        </g>
        {/* Top-right */}
        <g className={styles.cornerMark}>
          <line x1="450" y1="30" x2="432" y2="30" stroke="white" strokeWidth="0.75" opacity="0.06" />
          <line x1="450" y1="30" x2="450" y2="48" stroke="white" strokeWidth="0.75" opacity="0.06" />
        </g>
        {/* Bottom-left */}
        <g className={styles.cornerMark}>
          <line x1="30" y1="530" x2="48" y2="530" stroke="white" strokeWidth="0.75" opacity="0.06" />
          <line x1="30" y1="530" x2="30" y2="512" stroke="white" strokeWidth="0.75" opacity="0.06" />
        </g>
        {/* Bottom-right */}
        <g className={styles.cornerMark}>
          <line x1="450" y1="530" x2="432" y2="530" stroke="white" strokeWidth="0.75" opacity="0.06" />
          <line x1="450" y1="530" x2="450" y2="512" stroke="white" strokeWidth="0.75" opacity="0.06" />
        </g>

        {/* ── Layer 2: Zone A — Specification Document ──────────────── */}

        {/* Document frame */}
        <rect
          x="110" y="50" width="260" height="140" rx="12"
          stroke="#2BCC73" strokeWidth="1.5" opacity="0.5"
          className={styles.docFrame}
        />

        {/* Title bar fill */}
        <rect
          x="111" y="51" width="258" height="28" rx="11"
          fill="#2BCC73" opacity="0.05"
          className={styles.docTitleBar}
        />

        {/* Traffic-light dots */}
        <circle cx="126" cy="64" r="3" fill="#FF5300" opacity="0.5" className={styles.docDot} />
        <circle cx="138" cy="64" r="3" fill="#14B8A6" opacity="0.35" className={styles.docDot} />
        <circle cx="150" cy="64" r="3" fill="#2BCC73" opacity="0.35" className={styles.docDot} />

        {/* Heading line */}
        <rect
          x="130" y="90" width="140" height="5" rx="2.5"
          fill="#2BCC73" opacity="0.45"
          className={styles.docHeading}
        />

        {/* Body lines */}
        <rect x="130" y="104" width="120" height="3" rx="1.5" fill="#2BCC73" opacity="0.25" className={styles.docBody0} />
        <rect x="130" y="118" width="100" height="3" rx="1.5" fill="#2BCC73" opacity="0.2" className={styles.docBody1} />
        <rect x="130" y="132" width="140" height="3" rx="1.5" fill="#2BCC73" opacity="0.15" className={styles.docBody2} />
        <rect x="130" y="146" width="80" height="3" rx="1.5" fill="#2BCC73" opacity="0.2" className={styles.docBody3} />

        {/* Section divider */}
        <line
          x1="130" y1="155" x2="350" y2="155"
          stroke="#2BCC73" strokeWidth="0.5" opacity="0.1"
          className={styles.docDivider}
        />

        {/* Body lines below divider */}
        <rect x="130" y="164" width="110" height="3" rx="1.5" fill="#2BCC73" opacity="0.15" className={styles.docBody4} />
        <rect x="130" y="176" width="90" height="3" rx="1.5" fill="#2BCC73" opacity="0.15" className={styles.docBody5} />

        {/* Label */}
        <text
          x="240" y="208" textAnchor="middle"
          fontSize="10" fontFamily="monospace"
          fill="#2BCC73" opacity="0.35" letterSpacing="0.08em"
          className={styles.docLabel}
        >
          SPECIFICATION
        </text>

        {/* ── Layer 3: Pipeline Connector A→B ───────────────────────── */}

        <line
          x1="240" y1="210" x2="240" y2="260"
          stroke="#2BCC73" strokeWidth="1" opacity="0.2"
          className={styles.pipeA}
        />
        <polyline
          points="232,250 240,260 248,250"
          stroke="#2BCC73" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" opacity="0.35"
          className={styles.pipeAChevron}
        />
        <circle cx="240" cy="210" r="2.5" fill="#2BCC73" opacity="0.3" className={styles.pipeDotA0} />
        <circle cx="240" cy="260" r="2.5" fill="#2BCC73" opacity="0.3" className={styles.pipeDotA1} />

        {/* ── Layer 4: Zone B — AI Agent Processing ─────────────────── */}

        {/* Processing frame */}
        <rect
          x="90" y="270" width="300" height="110" rx="14"
          stroke="#14B8A6" strokeWidth="2" opacity="0.4"
          className={styles.procFrame}
        />

        {/* Neural nodes */}
        <circle cx="140" cy="310" r="5" stroke="#14B8A6" strokeWidth="1" fill="none" opacity="0.4" className={styles.neuralNode0} />
        <circle cx="190" cy="295" r="4.5" stroke="#14B8A6" strokeWidth="1" fill="none" opacity="0.35" className={styles.neuralNode1} />
        <circle cx="240" cy="325" r="7" stroke="#14B8A6" strokeWidth="1" fill="#14B8A6" fillOpacity="0.08" opacity="0.5" className={styles.neuralNode2} />
        <circle cx="290" cy="300" r="5" stroke="#14B8A6" strokeWidth="1" fill="none" opacity="0.35" className={styles.neuralNode3} />
        <circle cx="340" cy="315" r="4" stroke="#14B8A6" strokeWidth="1" fill="none" opacity="0.3" className={styles.neuralNode4} />

        {/* Connection lines between adjacent nodes */}
        <line x1="145" y1="308" x2="185" y2="297" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" className={styles.neuralConn0} />
        <line x1="195" y1="298" x2="234" y2="320" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" className={styles.neuralConn1} />
        <line x1="247" y1="322" x2="285" y2="303" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" className={styles.neuralConn2} />
        <line x1="295" y1="302" x2="336" y2="313" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" className={styles.neuralConn3} />
        <line x1="190" y1="300" x2="240" y2="319" stroke="#14B8A6" strokeWidth="0.75" opacity="0.12" className={styles.neuralConn4} />
        <line x1="245" y1="320" x2="290" y2="303" stroke="#14B8A6" strokeWidth="0.75" opacity="0.12" className={styles.neuralConn5} />

        {/* Data pulse dots along connections */}
        <circle cx="165" cy="303" r="1.5" fill="#2BCC73" opacity="0.4" className={styles.dataPulse0} />
        <circle cx="262" cy="312" r="1.5" fill="#2BCC73" opacity="0.4" className={styles.dataPulse1} />
        <circle cx="315" cy="308" r="1.5" fill="#2BCC73" opacity="0.4" className={styles.dataPulse2} />

        {/* Bracket accents */}
        <polyline
          points="105,285 95,325 105,365"
          stroke="#14B8A6" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" opacity="0.2"
          className={styles.bracketL}
        />
        <polyline
          points="375,285 385,325 375,365"
          stroke="#14B8A6" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" opacity="0.2"
          className={styles.bracketR}
        />

        {/* Label */}
        <text
          x="240" y="398" textAnchor="middle"
          fontSize="10" fontFamily="monospace"
          fill="#14B8A6" opacity="0.35" letterSpacing="0.08em"
          className={styles.procLabel}
        >
          AI AGENT
        </text>

        {/* ── Layer 5: Pipeline Connector B→C ───────────────────────── */}

        <line
          x1="240" y1="400" x2="240" y2="440"
          stroke="#2BCC73" strokeWidth="1" opacity="0.2"
          className={styles.pipeB}
        />
        <polyline
          points="232,430 240,440 248,430"
          stroke="#2BCC73" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" opacity="0.35"
          className={styles.pipeBChevron}
        />
        <circle cx="240" cy="400" r="2.5" fill="#2BCC73" opacity="0.3" className={styles.pipeDotB0} />
        <circle cx="240" cy="440" r="2.5" fill="#2BCC73" opacity="0.3" className={styles.pipeDotB1} />

        {/* ── Layer 6: Zone C — Production Output ───────────────────── */}

        {/* Terminal frame */}
        <rect
          x="120" y="445" width="240" height="76" rx="10"
          stroke="#2BCC73" strokeWidth="1.5" opacity="0.5"
          className={styles.termFrame}
        />

        {/* Title bar fill */}
        <rect
          x="121" y="446" width="238" height="22" rx="9"
          fill="#2BCC73" opacity="0.05"
          className={styles.termTitleBar}
        />

        {/* Traffic-light dots */}
        <circle cx="135" cy="457" r="2.5" fill="#FF5300" opacity="0.5" className={styles.termDot} />
        <circle cx="145" cy="457" r="2.5" fill="#14B8A6" opacity="0.35" className={styles.termDot} />
        <circle cx="155" cy="457" r="2.5" fill="#2BCC73" opacity="0.35" className={styles.termDot} />

        {/* Prompt indicator */}
        <text
          x="140" y="485"
          fontSize="10" fontFamily="monospace"
          fill="#2BCC73" opacity="0.5"
          className={styles.termPrompt}
        >
          &gt;
        </text>

        {/* Output lines */}
        <rect x="155" y="480" width="100" height="3" rx="1.5" fill="#2BCC73" opacity="0.35" className={styles.termLine0} />
        <rect x="140" y="492" width="70" height="3" rx="1.5" fill="#2BCC73" opacity="0.25" className={styles.termLine1} />
        <rect x="140" y="504" width="120" height="3" rx="1.5" fill="#2BCC73" opacity="0.2" className={styles.termLine2} />

        {/* Success dot */}
        <circle cx="268" cy="505" r="3" fill="#2BCC73" opacity="0.6" className={styles.successDot} />

        {/* Label */}
        <text
          x="240" y="540" textAnchor="middle"
          fontSize="10" fontFamily="monospace"
          fill="#2BCC73" opacity="0.35" letterSpacing="0.08em"
          className={styles.termLabel}
        >
          PRODUCTION CODE
        </text>

        {/* ── Layer 7: Side Annotations ─────────────────────────────── */}

        <text
          x="375" y="505"
          fontSize="8" fontFamily="monospace"
          fill="white" opacity="0.1"
          className={styles.annotationVersion}
        >
          v1.0.0
        </text>
        <text
          x="385" y="80"
          fontSize="8" fontFamily="monospace"
          fill="white" opacity="0.1"
          className={styles.annotationHash}
        >
          #spec
        </text>

        {/* Structural noise squares */}
        <rect x="70" y="310" width="4" height="4" rx="1" stroke="white" strokeWidth="0.5" fill="none" opacity="0.06" className={styles.noiseDot0} />
        <rect x="410" y="160" width="4" height="4" rx="1" stroke="white" strokeWidth="0.5" fill="none" opacity="0.06" className={styles.noiseDot1} />
      </svg>
    </div>
  );
}
