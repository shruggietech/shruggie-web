/**
 * OriginIllustration — "Origin Journey Blueprint"
 *
 * Animated inline SVG for the "Where We Come From" section on /about.
 * Three-chapter journey: earlier venture (teal) → transition (orange) →
 * ShruggieTech today (green). Matches the geometric, minimal, line-art
 * style of ServiceIllustrationsLarge.
 *
 * Uses IntersectionObserver (via Framer Motion useInView) to trigger the
 * .is-animating class for CSS keyframe entrance animations.
 */

"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import styles from "./OriginIllustration.module.css";

export default function OriginIllustration() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, {
    once: true,
    margin: "-15% 0px -15% 0px",
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "w-full max-w-[300px] md:max-w-xl mx-auto h-auto",
        (isInView || shouldReduceMotion) && "is-animating"
      )}
    >
      <svg
        viewBox="0 0 320 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        {/* ── Layer 1: Background Scaffold ──────────────────────────── */}

        {/* Vertical dashed guide lines */}
        <line x1="80" y1="20" x2="80" y2="500" stroke="white" strokeWidth="0.5" opacity="0.07" strokeDasharray="6 8" className={styles.guideV} />
        <line x1="240" y1="20" x2="240" y2="500" stroke="white" strokeWidth="0.5" opacity="0.07" strokeDasharray="6 8" className={styles.guideV} />

        {/* Horizontal dashed guide lines */}
        <line x1="20" y1="175" x2="300" y2="175" stroke="white" strokeWidth="0.5" opacity="0.07" strokeDasharray="6 8" className={styles.guideH} />
        <line x1="20" y1="345" x2="300" y2="345" stroke="white" strokeWidth="0.5" opacity="0.07" strokeDasharray="6 8" className={styles.guideH} />

        {/* Corner crop marks — four L-shapes */}
        {/* Top-left */}
        <line x1="20" y1="20" x2="34" y2="20" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />
        <line x1="20" y1="20" x2="20" y2="34" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />
        {/* Top-right */}
        <line x1="300" y1="20" x2="286" y2="20" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />
        <line x1="300" y1="20" x2="300" y2="34" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />
        {/* Bottom-left */}
        <line x1="20" y1="500" x2="34" y2="500" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />
        <line x1="20" y1="500" x2="20" y2="486" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />
        {/* Bottom-right */}
        <line x1="300" y1="500" x2="286" y2="500" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />
        <line x1="300" y1="500" x2="300" y2="486" stroke="white" strokeWidth="0.75" opacity="0.06" className={styles.cornerMark} />

        {/* ── Layer 2: Journey Spine ────────────────────────────────── */}

        {/* Main spine path — subtle S-curve */}
        <path
          d="M160 50 C160 120, 140 160, 135 190 C130 220, 145 280, 155 320 C165 360, 160 420, 160 470"
          stroke="#2BCC73"
          strokeWidth="1.5"
          opacity="0.2"
          strokeLinecap="round"
          className={styles.journeySpine}
        />
        {/* Dashed overlay for blueprint feel */}
        <path
          d="M160 50 C160 120, 140 160, 135 190 C130 220, 145 280, 155 320 C165 360, 160 420, 160 470"
          stroke="#2BCC73"
          strokeWidth="1"
          opacity="0.1"
          strokeDasharray="4 6"
          strokeLinecap="round"
          className={styles.journeySpineDash}
        />

        {/* ── Layer 3: Chapter A — The Earlier Venture ──────────────── */}

        {/* Milestone node A at (160, 65) */}
        <circle cx="160" cy="65" r="14" stroke="#14B8A6" strokeWidth="1.5" opacity="0.4" fill="none" className={styles.milestoneA} />
        <circle cx="160" cy="65" r="4" fill="#14B8A6" opacity="0.5" className={styles.milestoneADot} />

        {/* Globe/network mini-graphic centered at (70, 90) */}
        <circle cx="70" cy="90" r="28" stroke="#14B8A6" strokeWidth="1" opacity="0.25" fill="none" className={styles.globe} />
        {/* Latitude lines */}
        <path d="M44 82 Q70 74, 96 82" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" fill="none" className={styles.globeLatitude} />
        <path d="M44 98 Q70 106, 96 98" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" fill="none" className={styles.globeLatitude} />
        {/* Meridian */}
        <line x1="70" y1="62" x2="70" y2="118" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" className={styles.globeMeridian} />
        {/* Continent dots */}
        <circle cx="58" cy="80" r="2" fill="#14B8A6" opacity="0.4" className={styles.globeDot} />
        <circle cx="80" cy="95" r="2" fill="#14B8A6" opacity="0.4" className={styles.globeDot} />
        <circle cx="65" cy="103" r="2" fill="#14B8A6" opacity="0.4" className={styles.globeDot} />

        {/* Connection: globe → milestone A */}
        <path d="M100 90 Q120 78, 146 65" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" fill="none" className={styles.globeConn} />
        <circle cx="100" cy="90" r="2" fill="#14B8A6" opacity="0.3" className={styles.globeConnDot} />
        <circle cx="146" cy="65" r="2" fill="#14B8A6" opacity="0.3" className={styles.globeConnDot} />

        {/* Document/research icon centered at (245, 100) */}
        <rect x="225" y="75" width="40" height="50" rx="5" stroke="#14B8A6" strokeWidth="1" opacity="0.3" fill="none" className={styles.docFrame} />
        {/* Text lines inside document */}
        <rect x="233" y="87" width="24" height="2.5" rx="1" fill="#14B8A6" opacity="0.2" className={styles.docLine} />
        <rect x="233" y="97" width="18" height="2.5" rx="1" fill="#14B8A6" opacity="0.17" className={styles.docLine} />
        <rect x="233" y="107" width="22" height="2.5" rx="1" fill="#14B8A6" opacity="0.15" className={styles.docLine} />
        {/* Seal badge */}
        <circle cx="258" cy="118" r="6" stroke="#14B8A6" strokeWidth="0.75" opacity="0.25" fill="none" className={styles.docSeal} />

        {/* Connection: document → milestone A */}
        <path d="M225 100 Q200 82, 174 65" stroke="#14B8A6" strokeWidth="0.75" opacity="0.15" fill="none" className={styles.docConn} />
        <circle cx="225" cy="100" r="2" fill="#14B8A6" opacity="0.3" className={styles.docConnDot} />
        <circle cx="174" cy="65" r="2" fill="#14B8A6" opacity="0.3" className={styles.docConnDot} />

        {/* Chapter A label */}
        <text x="160" y="162" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#14B8A6" opacity="0.25" letterSpacing="0.1em" className={styles.labelA}>RESONOVA ERA</text>

        {/* ── Layer 4: Transition Zone ──────────────────────────────── */}

        {/* Transition diamond at ~(138, 195) */}
        <polygon points="138,181 152,195 138,209 124,195" stroke="#FF5300" strokeWidth="1.5" opacity="0.4" fill="#FF5300" fillOpacity="0.06" strokeLinejoin="round" className={styles.transitionDiamond} />
        <circle cx="138" cy="195" r="2" fill="#FF5300" opacity="0.5" className={styles.transitionDot} />

        {/* Radiating lines — NE, NW, SE, SW */}
        <line x1="152" y1="181" x2="172" y2="165" stroke="white" strokeWidth="0.5" opacity="0.08" className={styles.transitionRay} />
        <line x1="124" y1="181" x2="104" y2="165" stroke="white" strokeWidth="0.5" opacity="0.08" className={styles.transitionRay} />
        <line x1="152" y1="209" x2="172" y2="225" stroke="white" strokeWidth="0.5" opacity="0.08" className={styles.transitionRay} />
        <line x1="124" y1="209" x2="104" y2="225" stroke="white" strokeWidth="0.5" opacity="0.08" className={styles.transitionRay} />

        {/* ── Layer 5: Chapter B — ShruggieTech Today ───────────────── */}

        {/* Milestone node B at (155, 280) */}
        <circle cx="155" cy="280" r="16" stroke="#2BCC73" strokeWidth="2" opacity="0.5" fill="none" className={styles.milestoneB} />
        <circle cx="155" cy="280" r="8" stroke="#2BCC73" strokeWidth="1" opacity="0.3" fill="none" className={styles.milestoneBInner} />
        <circle cx="155" cy="280" r="3" fill="#2BCC73" opacity="0.6" className={styles.milestoneBDot} />

        {/* Service constellation — Icon 1: Web/code at (65, 290) */}
        <g className={styles.serviceIcon1}>
          <rect x="53" y="281" width="24" height="18" rx="3" stroke="#2BCC73" strokeWidth="1" opacity="0.3" fill="#2BCC73" fillOpacity="0.1" />
          <rect x="57" y="287" width="4" height="1.5" rx="0.5" fill="#2BCC73" opacity="0.3" />
          <rect x="63" y="287" width="6" height="1.5" rx="0.5" fill="#2BCC73" opacity="0.25" />
          <rect x="57" y="291" width="8" height="1.5" rx="0.5" fill="#2BCC73" opacity="0.2" />
        </g>

        {/* Icon 2: Strategy/brand crosshair at (250, 270) */}
        <g className={styles.serviceIcon2}>
          <circle cx="250" cy="270" r="10" stroke="#2BCC73" strokeWidth="0.75" opacity="0.25" fill="none" />
          <line x1="250" y1="258" x2="250" y2="282" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" />
          <line x1="238" y1="270" x2="262" y2="270" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" />
        </g>

        {/* Icon 3: Marketing/growth bars at (70, 360) */}
        <g className={styles.serviceIcon3}>
          <rect x="66" y="372" width="4" height="8" rx="1" fill="#2BCC73" opacity="0.15" />
          <rect x="72" y="366" width="4" height="14" rx="1" fill="#2BCC73" opacity="0.22" />
          <rect x="78" y="360" width="4" height="20" rx="1" fill="#2BCC73" opacity="0.3" />
        </g>

        {/* Icon 4: AI/data neural at (250, 370) */}
        <g className={styles.serviceIcon4}>
          <line x1="247" y1="365" x2="253" y2="375" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" />
          <line x1="253" y1="375" x2="247" y2="378" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" />
          <line x1="247" y1="365" x2="255" y2="367" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" />
          <circle cx="247" cy="365" r="3" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" fill="none" />
          <circle cx="253" cy="375" r="4" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" fill="none" />
          <circle cx="255" cy="367" r="3" stroke="#2BCC73" strokeWidth="0.75" opacity="0.2" fill="none" />
        </g>

        {/* Connection lines from icons to spine */}
        <line x1="77" y1="290" x2="139" y2="280" stroke="#2BCC73" strokeWidth="0.75" opacity="0.12" className={styles.serviceConn} />
        <line x1="240" y1="270" x2="171" y2="280" stroke="#2BCC73" strokeWidth="0.75" opacity="0.12" className={styles.serviceConn} />
        <line x1="82" y1="368" x2="148" y2="320" stroke="#2BCC73" strokeWidth="0.75" opacity="0.12" className={styles.serviceConn} />
        <line x1="244" y1="370" x2="162" y2="320" stroke="#2BCC73" strokeWidth="0.75" opacity="0.12" className={styles.serviceConn} />
        {/* Connection dots */}
        <circle cx="77" cy="290" r="2" fill="#2BCC73" opacity="0.2" className={styles.serviceConnDot} />
        <circle cx="240" cy="270" r="2" fill="#2BCC73" opacity="0.2" className={styles.serviceConnDot} />
        <circle cx="82" cy="368" r="2" fill="#2BCC73" opacity="0.2" className={styles.serviceConnDot} />
        <circle cx="244" cy="370" r="2" fill="#2BCC73" opacity="0.2" className={styles.serviceConnDot} />

        {/* Knoxville anchor — map pin at (160, 450) */}
        <path
          d="M160 462 C160 462, 150 452, 150 445 C150 439.5, 154.5 435, 160 435 C165.5 435, 170 439.5, 170 445 C170 452, 160 462, 160 462Z"
          stroke="#2BCC73"
          strokeWidth="1.5"
          opacity="0.45"
          fill="#2BCC73"
          fillOpacity="0.06"
          strokeLinejoin="round"
          className={styles.mapPin}
        />
        <circle cx="160" cy="445" r="4" stroke="#2BCC73" strokeWidth="0.75" opacity="0.3" fill="none" className={styles.mapPinDot} />

        {/* Chapter B label */}
        <text x="160" y="485" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#2BCC73" opacity="0.3" letterSpacing="0.1em" className={styles.labelB}>KNOXVILLE, TN</text>

        {/* ── Layer 6: Growth Trajectory ─────────────────────────────── */}

        <path
          d="M50 460 Q100 340, 130 260 Q160 180, 200 120 Q240 60, 280 40"
          stroke="#2BCC73"
          strokeWidth="1"
          opacity="0.08"
          strokeDasharray="3 6"
          fill="none"
          className={styles.growthCurve}
        />
        <circle cx="130" cy="260" r="2" fill="#2BCC73" opacity="0.12" className={styles.growthPoint} />
        <circle cx="200" cy="120" r="2" fill="#2BCC73" opacity="0.12" className={styles.growthPoint} />
        <circle cx="270" cy="50" r="2" fill="#2BCC73" opacity="0.12" className={styles.growthPoint} />

        {/* ── Layer 7: Side Annotations ──────────────────────────────── */}

        <text x="30" y="75" fontSize="7" fontFamily="monospace" fill="white" opacity="0.08" className={styles.yearLabel}>2017</text>
        <text x="285" y="195" fontSize="7" fontFamily="monospace" fill="white" opacity="0.08" className={styles.yearLabel}>2024</text>
        <text x="30" y="440" fontSize="7" fontFamily="monospace" fill="white" opacity="0.08" className={styles.yearLabel}>2025</text>

        {/* Tiny noise squares */}
        <rect x="290" y="310" width="3" height="3" rx="0.5" stroke="white" strokeWidth="0.5" opacity="0.05" fill="none" className={styles.noiseSquare} />
        <rect x="40" y="200" width="3" height="3" rx="0.5" stroke="white" strokeWidth="0.5" opacity="0.05" fill="none" className={styles.noiseSquare} />
      </svg>
    </div>
  );
}
