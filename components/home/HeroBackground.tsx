"use client";

/**
 * HeroBackground — Interactive animated dot grid on HTML5 Canvas.
 *
 * Renders a grid of dots in brand green (#2BCC73) at low opacity.
 * Dots near the mouse cursor brighten and connect with thin lines,
 * forming a localized mesh. On mobile, a slow ambient focal point
 * drifts to provide subtle motion without cursor interaction.
 *
 * Respects prefers-reduced-motion by rendering a static grid.
 *
 * Zero external dependencies — pure canvas + requestAnimationFrame.
 */

import { useCallback, useEffect, useRef } from "react";

/* ── Configuration ──────────────────────────────────────────────────────── */

/** Spacing between dots in pixels */
const DOT_SPACING = 38;

/** Base dot radius */
const DOT_RADIUS = 1.6;

/** Brand green in RGB */
const DOT_COLOR = { r: 43, g: 204, b: 115 };

/** Resting opacity for dots */
const DOT_BASE_ALPHA = 0.18;

/** Max opacity when cursor is closest */
const DOT_HOVER_ALPHA = 0.7;

/** Radius (px) around cursor where dots react */
const INTERACTION_RADIUS = 240;

/** Max distance for drawing connecting lines between activated dots */
const LINE_MAX_DISTANCE = 90;

/** Line opacity at closest range */
const LINE_ALPHA = 0.18;

/** Ambient drift speed (px/frame at 60fps) — used on mobile / reduced motion fallback */
const DRIFT_SPEED = 0.4;

/* ── Component ──────────────────────────────────────────────────────────── */

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const driftRef = useRef({ x: 0, y: 0, angle: 0 });
  const reducedMotionRef = useRef(false);
  const isTouchRef = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Determine focal point: mouse position or ambient drift
    let focalX: number;
    let focalY: number;
    let hasFocus: boolean;

    if (mouseRef.current && !isTouchRef.current) {
      focalX = mouseRef.current.x;
      focalY = mouseRef.current.y;
      hasFocus = true;
    } else if (!reducedMotionRef.current) {
      // Ambient drift for touch / no-mouse
      const drift = driftRef.current;
      drift.angle += DRIFT_SPEED * 0.005;
      drift.x = w * 0.5 + Math.cos(drift.angle) * w * 0.25;
      drift.y = h * 0.5 + Math.sin(drift.angle * 0.7) * h * 0.2;
      focalX = drift.x;
      focalY = drift.y;
      hasFocus = true;
    } else {
      focalX = -9999;
      focalY = -9999;
      hasFocus = false;
    }

    // Build dot grid
    const cols = Math.ceil(w / DOT_SPACING) + 1;
    const rows = Math.ceil(h / DOT_SPACING) + 1;
    const offsetX = ((w - (cols - 1) * DOT_SPACING) / 2);
    const offsetY = ((h - (rows - 1) * DOT_SPACING) / 2);

    interface DotInfo {
      x: number;
      y: number;
      alpha: number;
    }

    const activeDots: DotInfo[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * DOT_SPACING;
        const y = offsetY + row * DOT_SPACING;

        let alpha = DOT_BASE_ALPHA;
        let radius = DOT_RADIUS;

        if (hasFocus) {
          const dx = x - focalX;
          const dy = y - focalY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < INTERACTION_RADIUS) {
            const t = 1 - dist / INTERACTION_RADIUS;
            // Ease-out cubic
            const ease = 1 - (1 - t) * (1 - t) * (1 - t);
            alpha = DOT_BASE_ALPHA + (DOT_HOVER_ALPHA - DOT_BASE_ALPHA) * ease;
            radius = DOT_RADIUS + 1.0 * ease;
            activeDots.push({ x, y, alpha });
          }
        }

        // Draw glow for active dots
        if (alpha > DOT_BASE_ALPHA + 0.05) {
          const glowRadius = radius * 4;
          const gradient = ctx.createRadialGradient(x, y, radius, x, y, glowRadius);
          gradient.addColorStop(0, `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha * 0.25})`);
          gradient.addColorStop(1, `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, 0)`);
          ctx.beginPath();
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha})`;
        ctx.fill();
      }
    }

    // Draw connecting lines between nearby active dots
    for (let i = 0; i < activeDots.length; i++) {
      for (let j = i + 1; j < activeDots.length; j++) {
        const a = activeDots[i];
        const b = activeDots[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINE_MAX_DISTANCE) {
          const lineAlpha =
            LINE_ALPHA *
            (1 - dist / LINE_MAX_DISTANCE) *
            Math.min(a.alpha, b.alpha) *
            (1 / DOT_HOVER_ALPHA);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    ctx.restore();

    if (!reducedMotionRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    // Detect touch device
    isTouchRef.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        cancelAnimationFrame(animationRef.current);
        // Draw one static frame
        draw();
      } else {
        animationRef.current = requestAnimationFrame(draw);
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Sizing
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // If reduced motion, just re-draw the static grid
      if (reducedMotionRef.current) {
        draw();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // Mouse tracking on window — works even when cursor is over hero text
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only activate when the cursor is within the canvas bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y };
      } else {
        mouseRef.current = null;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Start animation loop
    if (!reducedMotionRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      draw(); // single static frame
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
