/**
 * AnimatedIcon — Stroke-draw icon with a soft brand-green glow.
 *
 * Wraps any Lucide icon and applies a one-time stroke-dashoffset
 * "draw" animation controlled by a `draw` prop. The parent component
 * decides *when* to trigger the draw (e.g. when its card becomes
 * visible via scroll progress).
 *
 * The glow ring expands alongside the draw via a CSS transition.
 *
 * Respects prefers-reduced-motion — renders a static icon with a
 * subtle glow halo when motion is disabled.
 *
 * Spec reference: §2.5 (Motion and Scroll Behavior)
 */

"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/** SVG element selector covering all stroke-based shapes Lucide uses */
const SVG_STROKE_SELECTOR =
  "path, line, circle, polyline, rect, ellipse" as const;

interface AnimatedIconProps {
  /** The icon element to animate (e.g. a Lucide <Icon /> JSX) */
  children: ReactNode;
  /** When true, triggers the stroke-draw animation */
  draw?: boolean;
}

export default function AnimatedIcon({
  children,
  draw = false,
}: AnimatedIconProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const hasDrawnRef = useRef(false);

  /* ── 1. Set initial hidden-stroke state on mount ────────────────── */
  useEffect(() => {
    if (!wrapperRef.current || shouldReduce) return;

    const elements =
      wrapperRef.current.querySelectorAll<SVGGeometryElement>(
        SVG_STROKE_SELECTOR,
      );

    elements.forEach((el) => {
      const len =
        typeof el.getTotalLength === "function" ? el.getTotalLength() : 100;
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.style.transition = "none";
    });
  }, [shouldReduce]);

  /* ── 2. Animate strokes when draw becomes true ──────────────────── */
  useEffect(() => {
    if (!draw || !wrapperRef.current || shouldReduce || hasDrawnRef.current)
      return;

    const elements =
      wrapperRef.current.querySelectorAll<SVGGeometryElement>(
        SVG_STROKE_SELECTOR,
      );

    requestAnimationFrame(() => {
      elements.forEach((el, i) => {
        el.style.transition =
          `stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08}s`;
        el.style.strokeDashoffset = "0";
      });
    });

    hasDrawnRef.current = true;
  }, [draw, shouldReduce]);

  /* ── Reduced-motion fallback ────────────────────────────────────── */
  if (shouldReduce) {
    return (
      <div className="relative mb-4 inline-flex">
        <span
          className="absolute inset-0 scale-[2.5] rounded-full bg-accent/10 blur-lg"
          aria-hidden="true"
        />
        <span className="relative">{children}</span>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative mb-4 inline-flex">
      {/* Glow ring — fades in alongside the stroke draw */}
      <span
        className={[
          "absolute inset-0 rounded-full bg-accent/10 blur-lg",
          "transition-all duration-700 ease-out",
          draw ? "scale-[2.5] opacity-30" : "scale-0 opacity-0",
        ].join(" ")}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </div>
  );
}
