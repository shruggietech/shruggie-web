"use client";

/**
 * HeroBackground — Interactive animated dot grid on HTML5 Canvas.
 *
 * Renders a grid of dots in brand green (#2BCC73) at low opacity.
 * Dots near the mouse cursor brighten and connect with thin lines,
 * forming a localized mesh. On mobile, a slow ambient focal point
 * drifts to provide subtle motion without cursor interaction.
 *
 * A hidden shruggie emoji lurks in the grid — it reveals when the
 * spotlight passes over it, then repositions after a few seconds.
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

/** Radius of ambient drift orbit — multiplied by canvas dimensions */
const AMBIENT_DRIFT_RADIUS = { x: 0.25, y: 0.2 };

/* ── Shruggie Configuration ─────────────────────────────────────────────── */

/** How close the focal point must be to a shruggie dot to count as "revealed" */
const SHRUGGIE_REVEAL_RADIUS = 140;

/** Percentage of shruggie dots that must be illuminated to trigger "found" */
const SHRUGGIE_REVEAL_THRESHOLD = 0.35;

/** Seconds after reveal before shruggie starts wiggling (scared) */
const SHRUGGIE_WIGGLE_START = 1.5;

/** Seconds after reveal before shruggie hides and repositions */
const SHRUGGIE_HIDE_DELAY = 2.5;

/** Duration of the flee animation in seconds */
const SHRUGGIE_FLEE_DURATION = 0.6;

/** Max wiggle displacement in pixels */
const SHRUGGIE_WIGGLE_AMPLITUDE = 3.0;

/** Wiggle frequency — oscillations per second */
const SHRUGGIE_WIGGLE_FREQ = 18;

/** Path to the shruggie icon image */
const SHRUGGIE_IMAGE_SRC = "/images/logo-icon-only-green.png";

/** Rendered size of the shruggie icon in CSS pixels */
const SHRUGGIE_RENDER_SIZE = 85;

/** Dot sampling step — smaller = more dots = sharper image */
const SHRUGGIE_SAMPLE_STEP = 2;

/** Shruggie dot color — brand green regardless of theme */
const SHRUGGIE_COLOR = { r: 43, g: 204, b: 115 };

/** Max opacity of shruggie dots when fully revealed */
const SHRUGGIE_MAX_ALPHA = 0.95;

/** Corner inset from canvas edge for shruggie positioning */
const SHRUGGIE_CORNER_INSET = 65;

/** Mobile breakpoint — canvas width below which mobile mode is active */
const MOBILE_CANVAS_BREAKPOINT = 768;

/* ── Shruggie Dot Sampling ──────────────────────────────────────────────── */

interface Point {
  x: number;
  y: number;
}

/**
 * Loads an image and returns a promise that resolves with the HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draws the shruggie icon image to an offscreen canvas at the target
 * render size and samples filled pixels to produce dot positions.
 */
function sampleShruggieFromImage(img: HTMLImageElement): Point[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  // Scale image to target render size, preserving aspect ratio
  const aspect = img.width / img.height;
  let drawW: number;
  let drawH: number;
  if (aspect >= 1) {
    drawW = SHRUGGIE_RENDER_SIZE;
    drawH = SHRUGGIE_RENDER_SIZE / aspect;
  } else {
    drawH = SHRUGGIE_RENDER_SIZE;
    drawW = SHRUGGIE_RENDER_SIZE * aspect;
  }

  canvas.width = Math.ceil(drawW);
  canvas.height = Math.ceil(drawH);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const points: Point[] = [];

  for (let y = 0; y < canvas.height; y += SHRUGGIE_SAMPLE_STEP) {
    for (let x = 0; x < canvas.width; x += SHRUGGIE_SAMPLE_STEP) {
      const idx = (y * canvas.width + x) * 4;
      // Check alpha channel — any non-transparent pixel counts
      if (data[idx + 3] > 80) {
        points.push({
          x: x - canvas.width / 2,
          y: y - canvas.height / 2,
        });
      }
    }
  }

  return points;
}

/**
 * Compute (x, y) for a corner index (0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right).
 * Accounts for the shruggie point cloud bounding box so the entire image stays visible.
 */
function cornerPosition(
  corner: number,
  w: number,
  h: number,
  points: Point[]
): { x: number; y: number } {
  // Find the bounding box of the point cloud
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const halfW = (maxX - minX) / 2;
  const halfH = (maxY - minY) / 2;

  const left = SHRUGGIE_CORNER_INSET + halfW;
  const right = w - SHRUGGIE_CORNER_INSET - halfW;
  const top = SHRUGGIE_CORNER_INSET + halfH;
  const bottom = h - SHRUGGIE_CORNER_INSET - halfH;

  switch (corner) {
    case 0: return { x: left, y: top };       // top-left
    case 1: return { x: right, y: top };      // top-right
    case 2: return { x: left, y: bottom };    // bottom-left
    case 3: return { x: right, y: bottom };   // bottom-right
    default: return { x: left, y: top };
  }
}

/** Pick a random corner (0-3), optionally excluding a specific corner */
function pickCorner(excludeCorner?: number): number {
  if (excludeCorner === undefined) {
    return Math.floor(Math.random() * 4);
  }
  const options = [0, 1, 2, 3].filter((c) => c !== excludeCorner);
  return options[Math.floor(Math.random() * options.length)];
}

/* ── Shruggie State ─────────────────────────────────────────────────────── */

interface ShruggieState {
  /** Sampled dot offsets (relative to center) */
  points: Point[];
  /** Current center position */
  x: number;
  y: number;
  /** Has the shruggie been found this cycle? */
  revealed: boolean;
  /** Timestamp when revealed */
  revealedAt: number;
  /** Is it currently fleeing to a new position? */
  fleeing: boolean;
  /** Flee animation start time */
  fleeStartTime: number;
  /** Flee source position */
  fleeFromX: number;
  fleeFromY: number;
  /** Flee destination position */
  fleeToX: number;
  fleeToY: number;
  /** Global reveal amount 0-1 for smooth fade-in */
  revealAmount: number;
  /** Current wiggle offset X */
  wiggleX: number;
  /** Current wiggle offset Y */
  wiggleY: number;
  /** Has been initialized */
  initialized: boolean;
  /** Current corner index (0-3) */
  currentCorner: number;
}

/* ── Component ──────────────────────────────────────────────────────────── */

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const driftRef = useRef({ x: 0, y: 0, angle: 0 });
  const reducedMotionRef = useRef(false);
  const isTouchRef = useRef(false);
  const isDarkRef = useRef(true);

  const isMobileCanvasRef = useRef(false);

  const shruggieRef = useRef<ShruggieState>({
    points: [],
    x: 0,
    y: 0,
    revealed: false,
    revealedAt: 0,
    fleeing: false,
    fleeStartTime: 0,
    fleeFromX: 0,
    fleeFromY: 0,
    fleeToX: 0,
    fleeToY: 0,
    revealAmount: 0,
    wiggleX: 0,
    wiggleY: 0,
    initialized: false,
    currentCorner: 0,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const now = performance.now() / 1000;

    // Shruggie is initialized asynchronously via image load (see useEffect)
    const shrug = shruggieRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const isMobile = isMobileCanvasRef.current;

    // Mobile multipliers for reduced spotlight
    const driftRadiusMult = isMobile ? 0.6 : 1;
    const hoverAlphaMult = isMobile ? 0.7 : 1;
    const effectiveHoverAlpha = DOT_HOVER_ALPHA * hoverAlphaMult;
    const effectiveInteractionRadius = isMobile ? INTERACTION_RADIUS * 0.55 : INTERACTION_RADIUS;

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
      if (isMobile) {
        // Mobile: top-right area, horizontal drift only
        drift.x = w * 0.7 + Math.cos(drift.angle) * w * 0.2;
        drift.y = h * 0.12;
      } else {
        drift.x = w * 0.5 + Math.cos(drift.angle) * w * AMBIENT_DRIFT_RADIUS.x * driftRadiusMult;
        drift.y = h * 0.5 + Math.sin(drift.angle * 0.7) * h * AMBIENT_DRIFT_RADIUS.y * driftRadiusMult;
      }
      focalX = drift.x;
      focalY = drift.y;
      hasFocus = true;
    } else {
      focalX = -9999;
      focalY = -9999;
      hasFocus = false;
    }

    // ── Shruggie logic (desktop only) ─────────────────────────────────
    // Handle flee animation
    if (!isMobile && shrug.fleeing) {
      const elapsed = now - shrug.fleeStartTime;
      const t = Math.min(elapsed / SHRUGGIE_FLEE_DURATION, 1);
      // Ease-in-out cubic
      const ease =
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      shrug.x =
        shrug.fleeFromX + (shrug.fleeToX - shrug.fleeFromX) * ease;
      shrug.y =
        shrug.fleeFromY + (shrug.fleeToY - shrug.fleeFromY) * ease;

      // Fade out during flee
      shrug.revealAmount = Math.max(0, 1 - ease);

      if (t >= 1) {
        shrug.fleeing = false;
        shrug.revealed = false;
        shrug.revealAmount = 0;
      }
    }

    // Check if spotlight is over any shruggie dots
    if (!isMobile && shrug.initialized && hasFocus && !shrug.fleeing) {
      let illuminatedCount = 0;
      for (const p of shrug.points) {
        const px = shrug.x + p.x;
        const py = shrug.y + p.y;
        const dx = px - focalX;
        const dy = py - focalY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SHRUGGIE_REVEAL_RADIUS) {
          illuminatedCount++;
        }
      }

      const illuminatedRatio =
        shrug.points.length > 0
          ? illuminatedCount / shrug.points.length
          : 0;

      if (illuminatedRatio >= SHRUGGIE_REVEAL_THRESHOLD && !shrug.revealed) {
        shrug.revealed = true;
        shrug.revealedAt = now;
      }

      // Smooth reveal
      if (illuminatedRatio > 0.1 || shrug.revealed) {
        shrug.revealAmount = Math.min(1, shrug.revealAmount + 0.04);
      } else if (!shrug.revealed) {
        shrug.revealAmount = Math.max(0, shrug.revealAmount - 0.02);
      }

      // Wiggle when scared (between WIGGLE_START and HIDE_DELAY)
      const timeSinceReveal = now - shrug.revealedAt;
      if (shrug.revealed && timeSinceReveal > SHRUGGIE_WIGGLE_START && timeSinceReveal <= SHRUGGIE_HIDE_DELAY) {
        // Intensity ramps up from 0 to 1 as we approach flee time
        const wiggleProgress = (timeSinceReveal - SHRUGGIE_WIGGLE_START) / (SHRUGGIE_HIDE_DELAY - SHRUGGIE_WIGGLE_START);
        const intensity = wiggleProgress * wiggleProgress; // ease-in quadratic
        const amp = SHRUGGIE_WIGGLE_AMPLITUDE * intensity;
        shrug.wiggleX = Math.sin(now * SHRUGGIE_WIGGLE_FREQ * Math.PI * 2) * amp;
        shrug.wiggleY = Math.cos(now * SHRUGGIE_WIGGLE_FREQ * Math.PI * 2 * 0.7) * amp * 0.5;
      } else {
        shrug.wiggleX = 0;
        shrug.wiggleY = 0;
      }

      // After delay, trigger flee to a different corner
      if (shrug.revealed && timeSinceReveal > SHRUGGIE_HIDE_DELAY) {
        const newCorner = pickCorner(shrug.currentCorner);
        const newPos = cornerPosition(newCorner, w, h, shrug.points);
        shrug.fleeing = true;
        shrug.fleeStartTime = now;
        shrug.fleeFromX = shrug.x;
        shrug.fleeFromY = shrug.y;
        shrug.fleeToX = newPos.x;
        shrug.fleeToY = newPos.y;
        shrug.currentCorner = newCorner;
      }
    }

    // Build dot grid
    const cols = Math.ceil(w / DOT_SPACING) + 1;
    const rows = Math.ceil(h / DOT_SPACING) + 1;
    const offsetX = (w - (cols - 1) * DOT_SPACING) / 2;
    const offsetY = (h - (rows - 1) * DOT_SPACING) / 2;

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

          if (dist < effectiveInteractionRadius) {
            const t = 1 - dist / effectiveInteractionRadius;
            // Ease-out cubic
            const ease = 1 - (1 - t) * (1 - t) * (1 - t);
            alpha =
              DOT_BASE_ALPHA + (effectiveHoverAlpha - DOT_BASE_ALPHA) * ease;
            radius = DOT_RADIUS + 1.0 * ease;
            activeDots.push({ x, y, alpha });
          }
        }

        // Draw glow for active dots
        if (alpha > DOT_BASE_ALPHA + 0.05) {
          const glowRadius = radius * 4;
          const gradient = ctx.createRadialGradient(
            x,
            y,
            radius,
            x,
            y,
            glowRadius
          );
          gradient.addColorStop(
            0,
            `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha * 0.25})`
          );
          gradient.addColorStop(
            1,
            `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, 0)`
          );
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
            (1 / effectiveHoverAlpha);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // ── Draw shruggie dots (desktop only) ────────────────────────────
    if (!isMobile && shrug.initialized && shrug.revealAmount > 0) {
      for (const p of shrug.points) {
        const px = shrug.x + p.x + shrug.wiggleX;
        const py = shrug.y + p.y + shrug.wiggleY;

        // Per-dot proximity-based reveal
        let dotReveal = shrug.revealAmount;
        if (hasFocus && !shrug.fleeing) {
          const dx = px - focalX;
          const dy = py - focalY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(
            0,
            1 - dist / SHRUGGIE_REVEAL_RADIUS
          );
          dotReveal =
            shrug.revealAmount *
            Math.max(proximity, shrug.revealed ? 0.7 : 0);
        }

        if (dotReveal <= 0) continue;

        const alpha = SHRUGGIE_MAX_ALPHA * dotReveal;
        const radius = 0.8 + 0.4 * dotReveal;

        // Brand green shruggie dots regardless of theme
        // Crisp dot — no glow, just a clean circle
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${SHRUGGIE_COLOR.r}, ${SHRUGGIE_COLOR.g}, ${SHRUGGIE_COLOR.b}, ${alpha})`;
        ctx.fill();
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

    // Detect dark/light mode from <html> class
    isDarkRef.current = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Detect reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    // Detect touch device
    isTouchRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

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

      // Detect mobile canvas
      isMobileCanvasRef.current = rect.width < MOBILE_CANVAS_BREAKPOINT;

      // Re-initialize shruggie position on resize
      const shrug = shruggieRef.current;
      if (shrug.initialized) {
        if (isMobileCanvasRef.current) {
          // Reset shruggie state on mobile — it won't render
          shrug.revealed = false;
          shrug.revealAmount = 0;
          shrug.fleeing = false;
        } else {
          const w = rect.width;
          const h = rect.height;
          const corner = pickCorner();
          const pos = cornerPosition(corner, w, h, shrug.points);
          shrug.x = pos.x;
          shrug.y = pos.y;
          shrug.currentCorner = corner;
          shrug.revealed = false;
          shrug.revealAmount = 0;
          shrug.fleeing = false;
        }
      }

      // If reduced motion, just re-draw the static grid
      if (reducedMotionRef.current) {
        draw();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // Load shruggie icon image and initialize point cloud (skip on mobile)
    if (!isMobileCanvasRef.current) {
      loadImage(SHRUGGIE_IMAGE_SRC)
        .then((img) => {
          // Skip initialization if viewport became mobile while loading
          if (isMobileCanvasRef.current) return;
          const shrug = shruggieRef.current;
          shrug.points = sampleShruggieFromImage(img);
          const rect = canvas.getBoundingClientRect();
          const corner = pickCorner();
          const pos = cornerPosition(
            corner,
            rect.width,
            rect.height,
            shrug.points
          );
          shrug.x = pos.x;
          shrug.y = pos.y;
          shrug.currentCorner = corner;
          shrug.initialized = true;
        })
        .catch(() => {
          // Silently ignore — easter egg just won't appear
        });
    }

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
      themeObserver.disconnect();
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
