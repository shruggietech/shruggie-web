/**
 * dot-grid.ts — Pure rendering functions for the animated dot grid.
 *
 * Extracted from HeroBackground.tsx. Renders a grid of dots in brand green
 * (#2BCC73) at low opacity. Dots near a focal point brighten and connect
 * with thin lines. Glow effects on active dots.
 *
 * The dot grid now spans the full page height (not just the hero section).
 * Only visible dots are rendered each frame based on the scroll offset.
 *
 * Zero external dependencies — pure canvas rendering.
 */

/* ── Configuration ──────────────────────────────────────────────────────── */

/** Spacing between dots in pixels */
export const DOT_SPACING = 38;

/** Base dot radius */
export const DOT_RADIUS = 1.6;

/** Brand green in RGB */
export const DOT_COLOR = { r: 43, g: 204, b: 115 };

/** Resting opacity for dots */
export const DOT_BASE_ALPHA = 0.18;

/** Max opacity when cursor is closest */
export const DOT_HOVER_ALPHA = 0.7;

/** Radius (px) around cursor where dots react */
export const INTERACTION_RADIUS = 240;

/** Max distance for drawing connecting lines between activated dots */
export const LINE_MAX_DISTANCE = 90;

/** Line opacity at closest range */
export const LINE_ALPHA = 0.18;

/** Ambient drift speed (px/frame at 60fps) */
export const DRIFT_SPEED = 0.4;

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface FocalPoint {
  x: number;
  y: number;
  active: boolean;
}

export interface DriftState {
  x: number;
  y: number;
  angle: number;
}

interface DotInfo {
  x: number;
  y: number;
  alpha: number;
}

/* ── Rendering ──────────────────────────────────────────────────────────── */

/**
 * Renders the dot grid for the visible viewport area.
 *
 * Dots are placed on a page-level grid (covering the full page height).
 * Only dots within the current viewport (plus padding for interaction
 * glow) are rendered, using the scroll offset to determine visibility.
 *
 * @param ctx        Canvas 2D context (already scaled for DPR)
 * @param viewportW  Viewport width in CSS pixels
 * @param viewportH  Viewport height in CSS pixels
 * @param scrollY    Current scroll position (px from top of page)
 * @param pageH      Total page height in CSS pixels
 * @param focal      Focal point in **viewport** coordinates
 */
export function renderDotGrid(
  ctx: CanvasRenderingContext2D,
  viewportW: number,
  viewportH: number,
  scrollY: number,
  pageH: number,
  focal: FocalPoint,
): void {
  // Total grid dimensions across the full page
  const totalCols = Math.ceil(viewportW / DOT_SPACING) + 1;
  const totalRows = Math.ceil(pageH / DOT_SPACING) + 1;
  const offsetX = (viewportW - (totalCols - 1) * DOT_SPACING) / 2;

  // Determine which rows are visible (with padding for interaction radius + glow)
  const padding = INTERACTION_RADIUS + 20;
  const visibleTop = scrollY - padding;
  const visibleBottom = scrollY + viewportH + padding;

  const startRow = Math.max(0, Math.floor(visibleTop / DOT_SPACING));
  const endRow = Math.min(totalRows, Math.ceil(visibleBottom / DOT_SPACING));

  const activeDots: DotInfo[] = [];

  for (let row = startRow; row < endRow; row++) {
    for (let col = 0; col < totalCols; col++) {
      // Position in page coordinates
      const pageX = offsetX + col * DOT_SPACING;
      const pageY = row * DOT_SPACING;

      // Convert to viewport (screen) coordinates for rendering
      const screenX = pageX;
      const screenY = pageY - scrollY;

      let alpha = DOT_BASE_ALPHA;
      let radius = DOT_RADIUS;

      if (focal.active) {
        // Compare in viewport coordinates
        const dx = screenX - focal.x;
        const dy = screenY - focal.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INTERACTION_RADIUS) {
          const t = 1 - dist / INTERACTION_RADIUS;
          // Ease-out cubic
          const ease = 1 - (1 - t) * (1 - t) * (1 - t);
          alpha = DOT_BASE_ALPHA + (DOT_HOVER_ALPHA - DOT_BASE_ALPHA) * ease;
          radius = DOT_RADIUS + 1.0 * ease;
          activeDots.push({ x: screenX, y: screenY, alpha });
        }
      }

      // Draw glow for active dots
      if (alpha > DOT_BASE_ALPHA + 0.05) {
        const glowRadius = radius * 4;
        const gradient = ctx.createRadialGradient(
          screenX,
          screenY,
          radius,
          screenX,
          screenY,
          glowRadius,
        );
        gradient.addColorStop(
          0,
          `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, ${alpha * 0.25})`,
        );
        gradient.addColorStop(
          1,
          `rgba(${DOT_COLOR.r}, ${DOT_COLOR.g}, ${DOT_COLOR.b}, 0)`,
        );
        ctx.beginPath();
        ctx.arc(screenX, screenY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
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
}

/**
 * Updates the ambient drift position for touch / no-mouse scenarios.
 *
 * Mutates the drift state in place. The drift follows a smooth
 * figure-eight-ish path centered in the viewport.
 */
export function updateDrift(
  drift: DriftState,
  viewportW: number,
  viewportH: number,
): void {
  drift.angle += DRIFT_SPEED * 0.005;
  drift.x = viewportW * 0.5 + Math.cos(drift.angle) * viewportW * 0.25;
  drift.y = viewportH * 0.5 + Math.sin(drift.angle * 0.7) * viewportH * 0.2;
}
