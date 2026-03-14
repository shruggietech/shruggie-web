/**
 * shruggie-easter-egg.ts — Shruggie easter egg state machine + rendering.
 *
 * Faithfully extracted from HeroBackground.tsx. The shruggie is a hidden
 * image-sampled dot cloud from `/images/logo-icon-only-green.png` that
 * reveals when a spotlight (cursor or ambient drift) passes over it,
 * wiggles when "scared," then flees to a new position.
 *
 * ALL original behavior is preserved:
 *   - Image loading and dot sampling
 *   - Proximity-based reveal when spotlight passes over
 *   - Wiggle animation with ramping intensity when "scared"
 *   - Flee animation to a random new position after delay
 *   - Exclusion zones so it doesn't spawn over hero text
 *   - All configuration constants and timing
 *
 * Positions are in HERO-RELATIVE coordinates (= page coordinates since
 * the hero section starts at y=0). The focal point for update must be
 * in hero coordinates; the render function handles viewport conversion.
 *
 * Zero external dependencies — pure canvas rendering.
 */

/* ── Configuration ──────────────────────────────────────────────────────── */

/** How close the focal point must be to a shruggie dot to count as "revealed" */
export const SHRUGGIE_REVEAL_RADIUS = 180;

/** Percentage of shruggie dots that must be illuminated to trigger "found" */
export const SHRUGGIE_REVEAL_THRESHOLD = 0.35;

/** Seconds after reveal before shruggie starts wiggling (scared) */
export const SHRUGGIE_WIGGLE_START = 1.5;

/** Seconds after reveal before shruggie hides and repositions */
export const SHRUGGIE_HIDE_DELAY = 2.5;

/** Duration of the flee animation in seconds */
export const SHRUGGIE_FLEE_DURATION = 0.6;

/** Max wiggle displacement in pixels */
export const SHRUGGIE_WIGGLE_AMPLITUDE = 3.0;

/** Wiggle frequency — oscillations per second */
export const SHRUGGIE_WIGGLE_FREQ = 18;

/** Path to the shruggie icon image */
export const SHRUGGIE_IMAGE_SRC = "/images/logo-icon-only-green.png";

/** Rendered size of the shruggie icon in CSS pixels */
export const SHRUGGIE_RENDER_SIZE = 110;

/** Dot sampling step — smaller = more dots = sharper image */
export const SHRUGGIE_SAMPLE_STEP = 2;

/** Shruggie dot color — white to contrast against the green grid (dark mode) */
export const SHRUGGIE_COLOR_DARK = { r: 255, g: 255, b: 255 };

/** Shruggie dot color — dark ShruggieTech green for light backgrounds */
export const SHRUGGIE_COLOR_LIGHT = { r: 22, g: 130, b: 68 };

/** Max opacity of shruggie dots when fully revealed */
export const SHRUGGIE_MAX_ALPHA = 0.95;

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface Point {
  x: number;
  y: number;
}

export interface ShruggieState {
  /** Sampled dot offsets (relative to center) */
  points: Point[];
  /** Current center X position (hero-relative / page coordinates) */
  x: number;
  /** Current center Y position (hero-relative / page coordinates) */
  y: number;
  /** Has the shruggie been found this cycle? */
  revealed: boolean;
  /** Timestamp (seconds) when revealed */
  revealedAt: number;
  /** Is it currently fleeing to a new position? */
  fleeing: boolean;
  /** Flee animation start time (seconds) */
  fleeStartTime: number;
  /** Flee source position */
  fleeFromX: number;
  fleeFromY: number;
  /** Flee destination position */
  fleeToX: number;
  fleeToY: number;
  /** Global reveal amount 0–1 for smooth fade-in */
  revealAmount: number;
  /** Current wiggle offset X */
  wiggleX: number;
  /** Current wiggle offset Y */
  wiggleY: number;
  /** Has been initialized (image loaded, dots sampled) */
  initialized: boolean;
}

/* ── Image Loading & Dot Sampling ──────────────────────────────────────── */

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
 *
 * Returns an array of { x, y } offsets relative to the image center.
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

/* ── Position Helpers ──────────────────────────────────────────────────── */

/**
 * Pick a random position that keeps the shruggie fully in-bounds
 * and away from hero content.
 *
 * @param w       Hero section width in CSS pixels
 * @param h       Hero section height in CSS pixels
 * @param points  Sampled dot offsets (for bounding box calculation)
 * @param avoidX  Optional X to stay away from (current position)
 * @param avoidY  Optional Y to stay away from (current position)
 */
export function randomShruggiePosition(
  w: number,
  h: number,
  points: Point[],
  avoidX?: number,
  avoidY?: number,
): { x: number; y: number } {
  // Find the bounding box of the points
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

  const pad = 60;
  const halfW = (maxX - minX) / 2 + pad;
  const halfH = (maxY - minY) / 2 + pad;

  // Exclusion zone: hero content area (text + buttons) sits roughly
  // in the left-center of the canvas — avoid spawning there
  const exclusionLeft = w * 0.02;
  const exclusionRight = w * 0.65;
  const exclusionTop = h * 0.2;
  const exclusionBottom = h * 0.85;

  for (let attempts = 0; attempts < 100; attempts++) {
    const x = halfW + Math.random() * (w - 2 * halfW);
    const y = halfH + Math.random() * (h - 2 * halfH);

    // Avoid the hero content exclusion zone
    if (
      x > exclusionLeft &&
      x < exclusionRight &&
      y > exclusionTop &&
      y < exclusionBottom
    ) {
      continue;
    }

    // Try to avoid placing near the current avoid position
    if (avoidX !== undefined && avoidY !== undefined) {
      const dx = x - avoidX;
      const dy = y - avoidY;
      if (Math.sqrt(dx * dx + dy * dy) < Math.min(w, h) * 0.3) {
        continue;
      }
    }

    return { x, y };
  }

  // Fallback
  return {
    x: w * 0.3 + Math.random() * w * 0.4,
    y: h * 0.3 + Math.random() * h * 0.4,
  };
}

/* ── State Factory ─────────────────────────────────────────────────────── */

/** Create a fresh shruggie state (un-initialized). */
export function createShruggieState(): ShruggieState {
  return {
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
  };
}

/* ── Initialization ────────────────────────────────────────────────────── */

/**
 * Initialize the shruggie by loading its image and sampling dot positions.
 * On success, sets `state.initialized = true` and picks a random position.
 * On failure, silently ignores — the easter egg just won't appear.
 */
export async function initShruggie(
  state: ShruggieState,
  heroW: number,
  heroH: number,
): Promise<void> {
  try {
    const img = await loadImage(SHRUGGIE_IMAGE_SRC);
    state.points = sampleShruggieFromImage(img);
    const pos = randomShruggiePosition(heroW, heroH, state.points);
    state.x = pos.x;
    state.y = pos.y;
    state.initialized = true;
  } catch {
    // Silently ignore — easter egg just won't appear
  }
}

/**
 * Reposition the shruggie after a resize. Resets reveal/flee state.
 */
export function repositionShruggie(
  state: ShruggieState,
  heroW: number,
  heroH: number,
): void {
  if (!state.initialized) return;
  const pos = randomShruggiePosition(heroW, heroH, state.points);
  state.x = pos.x;
  state.y = pos.y;
  state.revealed = false;
  state.revealAmount = 0;
  state.fleeing = false;
}

/* ── Update (State Machine) ────────────────────────────────────────────── */

/**
 * Update the shruggie state machine each frame.
 *
 * Handles: flee animation, reveal detection, wiggle, and flee trigger.
 *
 * @param state    Mutable shruggie state
 * @param now      Current time in seconds (performance.now() / 1000)
 * @param focalX   Focal point X in hero-relative coordinates
 * @param focalY   Focal point Y in hero-relative coordinates
 * @param hasFocus Whether there's an active focal point
 * @param heroW    Hero section width in CSS pixels
 * @param heroH    Hero section height in CSS pixels
 */
export function updateShruggie(
  state: ShruggieState,
  now: number,
  focalX: number,
  focalY: number,
  hasFocus: boolean,
  heroW: number,
  heroH: number,
): void {
  // ── Handle flee animation ─────────────────────────────────────────
  if (state.fleeing) {
    const elapsed = now - state.fleeStartTime;
    const t = Math.min(elapsed / SHRUGGIE_FLEE_DURATION, 1);
    // Ease-in-out cubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    state.x = state.fleeFromX + (state.fleeToX - state.fleeFromX) * ease;
    state.y = state.fleeFromY + (state.fleeToY - state.fleeFromY) * ease;

    // Fade out during flee
    state.revealAmount = Math.max(0, 1 - ease);

    if (t >= 1) {
      state.fleeing = false;
      state.revealed = false;
      state.revealAmount = 0;
    }
  }

  // ── Check if spotlight is over any shruggie dots ───────────────────
  if (state.initialized && hasFocus && !state.fleeing) {
    let illuminatedCount = 0;
    for (const p of state.points) {
      const px = state.x + p.x;
      const py = state.y + p.y;
      const dx = px - focalX;
      const dy = py - focalY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < SHRUGGIE_REVEAL_RADIUS) {
        illuminatedCount++;
      }
    }

    const illuminatedRatio =
      state.points.length > 0 ? illuminatedCount / state.points.length : 0;

    if (illuminatedRatio >= SHRUGGIE_REVEAL_THRESHOLD && !state.revealed) {
      state.revealed = true;
      state.revealedAt = now;
    }

    // Smooth reveal
    if (illuminatedRatio > 0.1 || state.revealed) {
      state.revealAmount = Math.min(1, state.revealAmount + 0.04);
    } else if (!state.revealed) {
      state.revealAmount = Math.max(0, state.revealAmount - 0.02);
    }

    // Wiggle when scared (between WIGGLE_START and HIDE_DELAY)
    const timeSinceReveal = now - state.revealedAt;
    if (
      state.revealed &&
      timeSinceReveal > SHRUGGIE_WIGGLE_START &&
      timeSinceReveal <= SHRUGGIE_HIDE_DELAY
    ) {
      // Intensity ramps up from 0 to 1 as we approach flee time
      const wiggleProgress =
        (timeSinceReveal - SHRUGGIE_WIGGLE_START) /
        (SHRUGGIE_HIDE_DELAY - SHRUGGIE_WIGGLE_START);
      const intensity = wiggleProgress * wiggleProgress; // ease-in quadratic
      const amp = SHRUGGIE_WIGGLE_AMPLITUDE * intensity;
      state.wiggleX =
        Math.sin(now * SHRUGGIE_WIGGLE_FREQ * Math.PI * 2) * amp;
      state.wiggleY =
        Math.cos(now * SHRUGGIE_WIGGLE_FREQ * Math.PI * 2 * 0.7) * amp * 0.5;
    } else {
      state.wiggleX = 0;
      state.wiggleY = 0;
    }

    // After delay, trigger flee
    if (state.revealed && timeSinceReveal > SHRUGGIE_HIDE_DELAY) {
      const newPos = randomShruggiePosition(
        heroW,
        heroH,
        state.points,
        state.x,
        state.y,
      );
      state.fleeing = true;
      state.fleeStartTime = now;
      state.fleeFromX = state.x;
      state.fleeFromY = state.y;
      state.fleeToX = newPos.x;
      state.fleeToY = newPos.y;
    }
  }
}

/* ── Render ─────────────────────────────────────────────────────────────── */

/**
 * Render the shruggie dots onto the canvas.
 *
 * Shruggie positions are in hero-relative coordinates. This function
 * converts them to viewport coordinates using the scroll offset.
 *
 * @param ctx      Canvas 2D context (already scaled for DPR)
 * @param state    Current shruggie state
 * @param focalX   Focal point X in hero-relative coordinates
 * @param focalY   Focal point Y in hero-relative coordinates
 * @param hasFocus Whether there's an active focal point
 * @param scrollY  Current scroll offset (to convert hero → viewport coords)
 * @param isDark   Whether dark mode is active
 */
export function renderShruggie(
  ctx: CanvasRenderingContext2D,
  state: ShruggieState,
  focalX: number,
  focalY: number,
  hasFocus: boolean,
  scrollY: number,
  isDark: boolean,
): void {
  if (!state.initialized || state.revealAmount <= 0) return;

  const sc = isDark ? SHRUGGIE_COLOR_DARK : SHRUGGIE_COLOR_LIGHT;

  for (const p of state.points) {
    // Position in hero-relative / page coordinates
    const px = state.x + p.x + state.wiggleX;
    const py = state.y + p.y + state.wiggleY;

    // Per-dot proximity-based reveal (in hero-relative coords)
    let dotReveal = state.revealAmount;
    if (hasFocus && !state.fleeing) {
      const dx = px - focalX;
      const dy = py - focalY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / SHRUGGIE_REVEAL_RADIUS);
      dotReveal =
        state.revealAmount * Math.max(proximity, state.revealed ? 0.7 : 0);
    }

    if (dotReveal <= 0) continue;

    const alpha = SHRUGGIE_MAX_ALPHA * dotReveal;
    const radius = 0.8 + 0.4 * dotReveal;

    // Convert from hero-relative to viewport coordinates for rendering
    const screenX = px;
    const screenY = py - scrollY;

    // Skip dots that are off-screen
    if (screenY < -10 || screenY > ctx.canvas.height + 10) continue;

    // Crisp dot — no glow, just a clean circle
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${sc.r}, ${sc.g}, ${sc.b}, ${alpha})`;
    ctx.fill();
  }
}
