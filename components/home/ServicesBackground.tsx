/**
 * ServicesBackground — Fading dot grid that bridges the hero canvas
 * into the "What We Do" section.
 *
 * Reuses the same spacing, colour, and radius as HeroBackground so
 * the two grids feel like one continuous surface. Dots fade out
 * vertically (strongest at the top, invisible at the bottom) and
 * also respect prefers-reduced-motion by rendering a single static
 * frame instead of using requestAnimationFrame.
 *
 * Zero external dependencies — pure canvas.
 */

"use client";

import { useEffect, useRef } from "react";

/* ── Shared visual constants (mirror HeroBackground) ──────────────── */

/** Spacing between dots — matches HeroBackground.DOT_SPACING */
const DOT_SPACING = 38;

/** Brand green RGB — matches HeroBackground.DOT_COLOR */
const DOT_COLOR = { r: 43, g: 204, b: 115 };

/** Dot radius — slightly smaller than hero for a natural taper */
const DOT_RADIUS = 1.2;

/** Peak opacity at the very top of the section */
const MAX_ALPHA = 0.14;

/** Fraction of section height where the dots fully disappear (0–1) */
const FADE_EXTENT = 0.85;

/* ── Component ──────────────────────────────────────────────────────── */

export default function ServicesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;

      const cols = Math.ceil(w / DOT_SPACING) + 1;
      const rows = Math.ceil(h / DOT_SPACING) + 1;
      const offsetX = (w - (cols - 1) * DOT_SPACING) / 2;
      const offsetY = (h - (rows - 1) * DOT_SPACING) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * DOT_SPACING;
          const y = offsetY + row * DOT_SPACING;

          // Vertical fade: 1 at the top → 0 at FADE_EXTENT of the height
          const verticalT = Math.min(y / (h * FADE_EXTENT), 1);
          const fade = 1 - verticalT * verticalT; // ease-in quadratic
          const alpha = MAX_ALPHA * fade;

          if (alpha < 0.003) continue;

          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha})`;
          ctx.fill();
        }
      }
    };

    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();

    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
