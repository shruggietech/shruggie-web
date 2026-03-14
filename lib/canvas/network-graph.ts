/**
 * network-graph.ts — Network graph renderer for the homepage canvas.
 *
 * Renders a set of 20 nodes with connecting edges that can morph between
 * shape definitions. Nodes drift gently with sine/cosine offsets and
 * brighten near the cursor focal point.
 *
 * This module is purely functional — all state lives in NetworkGraphState
 * and is mutated in-place by update/render functions for zero allocations
 * per frame.
 *
 * Zero external dependencies — pure canvas rendering.
 */

import { DOT_COLOR, INTERACTION_RADIUS, LINE_ALPHA } from "./dot-grid";
import { getShape, NODE_COUNT, type ShapeDefinition } from "./shapes";

/* ── Configuration ──────────────────────────────────────────────────────── */

/** Node circle radius in px */
const NODE_RADIUS = 3;

/** Base alpha for nodes */
const NODE_BASE_ALPHA = 0.4;

/** Max alpha when cursor is near */
const NODE_HOVER_ALPHA = 0.85;

/** Edge line width in px */
const EDGE_LINE_WIDTH = 0.6;

/** Base alpha for edges */
const EDGE_BASE_ALPHA = 0.12;

/** Max distance (px) for proximity-based edge fallback */
const PROXIMITY_EDGE_DISTANCE = 90;

/** Drift amplitude in px (sine/cosine offsets) */
const DRIFT_AMPLITUDE = 4;

/** Lerp rate toward target position (per second). 1/0.3 ≈ 3.33 for ~300ms settle. */
const POSITION_LERP_RATE = 3.33;

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface NetworkNode {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  driftPhase: number;
  driftSpeed: number;
}

export interface NetworkGraphState {
  nodes: NetworkNode[];
  activeShapeIndex: number;
  /** Elapsed time accumulator for drift (seconds) */
  time: number;
}

/* ── Initialization ─────────────────────────────────────────────────────── */

/**
 * Create the initial network graph state with 20 nodes.
 * Nodes start at origin and will lerp to their targets on the first update.
 */
export function createNetworkGraphState(): NetworkGraphState {
  const nodes: NetworkNode[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.3 + Math.random() * 0.4, // 0.3–0.7 radians/sec
    });
  }
  return { nodes, activeShapeIndex: 0, time: 0 };
}

/* ── Update ──────────────────────────────────────────────────────────────── */

/**
 * Update node positions toward their morph targets with gentle drift.
 *
 * @param state       Mutable network graph state
 * @param dt          Delta time in seconds
 * @param centerX     Center X of the graph in viewport px
 * @param centerY     Center Y of the graph in viewport px
 * @param spread      Scale factor: normalized coords × spread = viewport px offset
 * @param shapeIndex  Which shape's targets to use. Fractional values interpolate
 *                    between floor(shapeIndex) and ceil(shapeIndex) for smooth morphing.
 */
export function updateNetworkGraph(
  state: NetworkGraphState,
  dt: number,
  centerX: number,
  centerY: number,
  spread: number,
  shapeIndex: number,
): void {
  // Clamp dt to avoid huge jumps on tab-switch
  const clampedDt = Math.min(dt, 0.1);
  state.time += clampedDt;
  state.activeShapeIndex = shapeIndex;

  const shapeFloor = Math.floor(shapeIndex);
  const shapeCeil = Math.ceil(shapeIndex);
  const morphT = shapeIndex - shapeFloor;

  const shapeA = getShape(shapeFloor);
  const shapeB = shapeFloor === shapeCeil ? shapeA : getShape(shapeCeil);

  const t = state.time;
  const lerpFactor = 1 - Math.exp(-POSITION_LERP_RATE * clampedDt);

  for (let i = 0; i < state.nodes.length; i++) {
    const node = state.nodes[i];
    const defA = shapeA.nodes[i];
    const defB = shapeB.nodes[i];

    // Interpolate between the two shape definitions
    const sx = defA.x + (defB.x - defA.x) * morphT;
    const sy = defA.y + (defB.y - defA.y) * morphT;

    // Compute drift offset
    const driftX = Math.sin(t * node.driftSpeed + node.driftPhase) * DRIFT_AMPLITUDE;
    const driftY = Math.cos(t * node.driftSpeed * 0.7 + node.driftPhase + 1.3) * DRIFT_AMPLITUDE;

    // Target = center + shape position × spread + drift
    node.targetX = centerX + sx * spread + driftX;
    node.targetY = centerY + sy * spread + driftY;

    // Lerp toward target
    node.x += (node.targetX - node.x) * lerpFactor;
    node.y += (node.targetY - node.y) * lerpFactor;
  }
}

/* ── Render ──────────────────────────────────────────────────────────────── */

/**
 * Render the network graph onto the canvas.
 *
 * @param ctx         Canvas 2D rendering context
 * @param state       Current network graph state
 * @param focalX      Cursor/focal X in viewport px
 * @param focalY      Cursor/focal Y in viewport px
 * @param globalAlpha Overall opacity multiplier (0–1)
 */
export function renderNetworkGraph(
  ctx: CanvasRenderingContext2D,
  state: NetworkGraphState,
  focalX: number,
  focalY: number,
  globalAlpha: number,
): void {
  if (globalAlpha <= 0) return;

  const shapeFloor = Math.floor(state.activeShapeIndex);
  const shapeCeil = Math.ceil(state.activeShapeIndex);
  const morphT = state.activeShapeIndex - shapeFloor;

  const shapeA = getShape(shapeFloor);
  const shapeB = shapeFloor === shapeCeil ? shapeA : getShape(shapeCeil);
  const { nodes } = state;

  const r = DOT_COLOR.r;
  const g = DOT_COLOR.g;
  const b = DOT_COLOR.b;

  // ── Draw edges first (behind nodes) ────────────────────────────────
  ctx.lineWidth = EDGE_LINE_WIDTH;

  const hasEdgesA = shapeA.edges.length > 0;
  const hasEdgesB = shapeB.edges.length > 0;

  if (hasEdgesA || hasEdgesB) {
    // Draw edges from shape A (fading out during morph)
    if (hasEdgesA) {
      const edgeAlphaA = EDGE_BASE_ALPHA * globalAlpha * (1 - morphT);
      if (edgeAlphaA > 0.001) {
        for (const [ai, bi] of shapeA.edges) {
          if (ai >= nodes.length || bi >= nodes.length) continue;
          const a = nodes[ai];
          const bNode = nodes[bi];
          drawEdge(ctx, a.x, a.y, bNode.x, bNode.y, r, g, b, edgeAlphaA);
        }
      }
    }
    // Draw edges from shape B (fading in during morph)
    if (hasEdgesB && shapeA !== shapeB) {
      const edgeAlphaB = EDGE_BASE_ALPHA * globalAlpha * morphT;
      if (edgeAlphaB > 0.001) {
        for (const [ai, bi] of shapeB.edges) {
          if (ai >= nodes.length || bi >= nodes.length) continue;
          const a = nodes[ai];
          const bNode = nodes[bi];
          drawEdge(ctx, a.x, a.y, bNode.x, bNode.y, r, g, b, edgeAlphaB);
        }
      }
    }
    // If one shape has edges and the other doesn't, also draw proximity for the no-edge shape
    if (!hasEdgesA && hasEdgesB) {
      drawProximityEdges(ctx, nodes, r, g, b, EDGE_BASE_ALPHA * globalAlpha * (1 - morphT));
    } else if (hasEdgesA && !hasEdgesB) {
      drawProximityEdges(ctx, nodes, r, g, b, EDGE_BASE_ALPHA * globalAlpha * morphT);
    }
  } else {
    // Both shapes use proximity fallback
    drawProximityEdges(ctx, nodes, r, g, b, EDGE_BASE_ALPHA * globalAlpha);
  }

  // ── Draw nodes ─────────────────────────────────────────────────────
  const interactionRadiusSq = INTERACTION_RADIUS * INTERACTION_RADIUS;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const dx = node.x - focalX;
    const dy = node.y - focalY;
    const distSq = dx * dx + dy * dy;

    // Compute alpha with cursor proximity brightening
    let alpha = NODE_BASE_ALPHA;
    if (distSq < interactionRadiusSq) {
      const dist = Math.sqrt(distSq);
      const proximity = 1 - dist / INTERACTION_RADIUS;
      // Ease: cubic
      const eased = proximity * proximity * proximity;
      alpha = NODE_BASE_ALPHA + (NODE_HOVER_ALPHA - NODE_BASE_ALPHA) * eased;
    }
    alpha *= globalAlpha;

    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();

    // Subtle glow on bright nodes
    if (alpha > 0.5 * globalAlpha) {
      ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.4})`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
  }
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function drawProximityEdges(
  ctx: CanvasRenderingContext2D,
  nodes: NetworkNode[],
  r: number, g: number, b: number,
  baseAlpha: number,
): void {
  if (baseAlpha <= 0.001) return;
  const distSq = PROXIMITY_EDGE_DISTANCE * PROXIMITY_EDGE_DISTANCE;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (dx * dx + dy * dy < distSq) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        const edgeAlpha = (1 - dist / PROXIMITY_EDGE_DISTANCE) * baseAlpha;
        drawEdge(ctx, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, r, g, b, edgeAlpha);
      }
    }
  }
}

function drawEdge(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  r: number, g: number, b: number,
  alpha: number,
): void {
  if (alpha <= 0.001) return;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
  ctx.stroke();
}
