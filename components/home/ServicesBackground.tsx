/**
 * ServicesBackground — Dot grid → morphing lava blobs transition.
 *
 * The top of the section continues the hero's dot grid for seamless
 * visual continuity. As the eye moves down, the dots fade out and
 * 3–4 large, amorphous blobs of brand green slowly morph and drift.
 * This gives a premium, organic "lava lamp" feel that contrasts
 * nicely with the precise digital grid above.
 *
 * The blobs are rendered as radial gradients animated with
 * requestAnimationFrame. Each blob has its own wobble frequency so
 * they don't move in lockstep. Respects prefers-reduced-motion.
 *
 * Zero external dependencies — pure canvas.
 */

"use client";

import { useEffect, useRef } from "react";

/* ── Dot grid constants (mirror HeroBackground) ───────────────────── */

const DOT_SPACING = 38;
const DOT_COLOR = { r: 43, g: 204, b: 115 };
const DOT_RADIUS = 1.2;
const DOT_MAX_ALPHA = 0.14;

/** Dots fully gone by this fraction of section height */
const DOT_FADE_END = 0.45;

/* ── Blob constants ──────────────────────────────────────────────── */

const BLOB_COLOR = DOT_COLOR;

/** Peak opacity of the blob centres */
const BLOB_MAX_ALPHA = 0.10;

/** Blobs invisible at top, fully visible from this fraction down */
const BLOB_FADE_START = 0.12;
const BLOB_FADE_FULL = 0.42;

interface Blob {
  /** Base position (fraction of viewport, 0–1) */
  bx: number;
  by: number;
  /** Base radius (fraction of viewport width) */
  br: number;
  /** Wobble speed multipliers (radians/s) */
  wx: number;
  wy: number;
  wr: number;
  /** Wobble amplitude (px for position, fraction for radius) */
  ax: number;
  ay: number;
  ar: number;
  /** Phase offsets so blobs start at different positions */
  px: number;
  py: number;
  pr: number;
}

/** Pre-defined blob configs — positions in normalised coords */
const BLOBS: Blob[] = [
  {
    bx: 0.20, by: 0.52, br: 0.22,
    wx: 0.15, wy: 0.12, wr: 0.10,
    ax: 40,   ay: 30,   ar: 0.08,
    px: 0,    py: 0.5,  pr: 0,
  },
  {
    bx: 0.72, by: 0.60, br: 0.26,
    wx: 0.10, wy: 0.14, wr: 0.08,
    ax: 50,   ay: 35,   ar: 0.10,
    px: 1.2,  py: 0.8,  pr: 2.0,
  },
  {
    bx: 0.45, by: 0.78, br: 0.20,
    wx: 0.13, wy: 0.09, wr: 0.11,
    ax: 35,   ay: 45,   ar: 0.07,
    px: 2.5,  py: 1.5,  pr: 1.0,
  },
  {
    bx: 0.85, by: 0.85, br: 0.16,
    wx: 0.11, wy: 0.16, wr: 0.09,
    ax: 30,   ay: 25,   ar: 0.06,
    px: 3.8,  py: 2.8,  pr: 3.0,
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

/** Quadratic ease-out: 1 → 0 */
function dotFade(y: number, h: number): number {
  const t = Math.min(y / (h * DOT_FADE_END), 1);
  return 1 - t * t;
}

/** Linear ramp: 0 → 1 between BLOB_FADE_START and BLOB_FADE_FULL */
function blobRegionFade(y: number, h: number): number {
  const start = h * BLOB_FADE_START;
  const full = h * BLOB_FADE_FULL;
  if (y <= start) return 0;
  if (y >= full) return 1;
  return (y - start) / (full - start);
}

/* ── Component ───────────────────────────────────────────────────── */

export default function ServicesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const render = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number,
    ) => {
      ctx.clearRect(0, 0, w, h);

      // ── Dot grid layer (top) ──────────────────────────────────────
      const cols = Math.ceil(w / DOT_SPACING) + 1;
      const rows = Math.ceil(h / DOT_SPACING) + 1;
      const offsetX = (w - (cols - 1) * DOT_SPACING) / 2;
      const offsetY = (h - (rows - 1) * DOT_SPACING) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * DOT_SPACING;
          const y = offsetY + row * DOT_SPACING;
          const fade = dotFade(y, h);
          const alpha = DOT_MAX_ALPHA * fade;
          if (alpha < 0.003) continue;

          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha})`;
          ctx.fill();
        }
      }

      // ── Blob / orb layer (bottom) ─────────────────────────────────
      // Use "lighter" composite so overlapping blobs glow brighter
      ctx.globalCompositeOperation = "lighter";

      for (const blob of BLOBS) {
        const cx = blob.bx * w + Math.sin(t * blob.wx + blob.px) * blob.ax;
        const cy = blob.by * h + Math.sin(t * blob.wy + blob.py) * blob.ay;
        const radius =
          blob.br * w * (1 + Math.sin(t * blob.wr + blob.pr) * blob.ar);

        // Fade blob based on its centre's vertical position
        const regionFade = blobRegionFade(cy, h);
        if (regionFade < 0.01) continue;

        const alpha = BLOB_MAX_ALPHA * regionFade;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(
          0,
          `rgba(${BLOB_COLOR.r}, ${BLOB_COLOR.g}, ${BLOB_COLOR.b}, ${alpha})`,
        );
        grad.addColorStop(
          0.5,
          `rgba(${BLOB_COLOR.r}, ${BLOB_COLOR.g}, ${BLOB_COLOR.b}, ${alpha * 0.4})`,
        );
        grad.addColorStop(
          1,
          `rgba(${BLOB_COLOR.r}, ${BLOB_COLOR.g}, ${BLOB_COLOR.b}, 0)`,
        );

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    /** Set canvas buffer to match CSS size at device pixel ratio */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      return { dpr, w: rect.width, h: rect.height };
    };

    let { dpr, w, h } = resize();

    if (prefersReduced) {
      // Render a single static frame (t = 0)
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        render(ctx, w, h, 0);
      }
      const observer = new ResizeObserver(() => {
        ({ dpr, w, h } = resize());
        const c = canvas.getContext("2d");
        if (c) {
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
          render(c, w, h, 0);
        }
      });
      observer.observe(canvas);
      return () => observer.disconnect();
    }

    // Animated path
    const animate = (time: number) => {
      const t = time / 1000; // seconds
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(ctx, w, h, t);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const observer = new ResizeObserver(() => {
      ({ dpr, w, h } = resize());
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
