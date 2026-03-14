/**
 * planet.ts — Wireframe planet renderer for the CTA section.
 *
 * Renders a circular cluster of nodes with dense internal mesh connections
 * and a subtle atmospheric glow, positioned so the top 2/3 is visible and
 * the bottom 1/3 extends below the viewport.
 *
 * Nodes shift laterally with a slow sine wave to simulate rotation.
 * Concentric rings with randomized offsets give an organic wireframe
 * globe appearance.
 */

import { DOT_COLOR } from "./dot-grid";

/* ── Configuration ──────────────────────────────────────────────────────── */

/** Number of concentric rings */
const RING_COUNT = 7;

/** Nodes per ring (inner → outer, increasing count) */
const RING_NODE_COUNTS = [6, 10, 14, 18, 22, 26, 30];

/** Node alpha */
const PLANET_NODE_ALPHA = 0.25;

/** Node radius */
const PLANET_NODE_RADIUS = 1.8;

/** Edge alpha */
const PLANET_EDGE_ALPHA = 0.10;

/** Edge line width */
const PLANET_EDGE_LINE_WIDTH = 0.5;

/** Glow alpha at planet edge */
const GLOW_ALPHA = 0.08;

/** Glow extends to this fraction beyond planet radius */
const GLOW_EXTENT = 1.2;

/** Rotation cycle period in seconds */
const ROTATION_PERIOD = 60;

/** Max lateral shift in fraction of radius (at equator) */
const ROTATION_AMPLITUDE = 0.06;

/** Maximum neighbors to connect per node */
const MAX_NEIGHBORS = 4;

/* ── Types ──────────────────────────────────────────────────────────────── */

interface PlanetNode {
  /** Normalized position within the circle (-1 to 1 range) */
  nx: number;
  ny: number;
  /** Ring index (0 = center) */
  ring: number;
  /** Angle on ring */
  angle: number;
  /** Distance from center as fraction of radius (0–1) */
  distFrac: number;
}

interface PlanetEdge {
  a: number;
  b: number;
}

export interface PlanetState {
  nodes: PlanetNode[];
  edges: PlanetEdge[];
  generated: boolean;
}

/* ── Seeded random ──────────────────────────────────────────────────────── */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Generation ─────────────────────────────────────────────────────────── */

export function createPlanetState(): PlanetState {
  return { nodes: [], edges: [], generated: false };
}

/**
 * Generate planet node positions and edges. Call once; subsequent calls
 * are no-ops.
 */
export function generatePlanet(state: PlanetState): void {
  if (state.generated) return;
  state.generated = true;

  const rand = seededRandom(27182);
  const nodes: PlanetNode[] = [];

  // Center node
  nodes.push({ nx: 0, ny: 0, ring: 0, angle: 0, distFrac: 0 });

  // Concentric rings
  for (let r = 0; r < RING_COUNT; r++) {
    const ringFrac = (r + 1) / RING_COUNT; // 0.14 … 1.0
    const count = RING_NODE_COUNTS[r];
    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2;
      // Add slight randomness to angle and distance
      const angle = baseAngle + (rand() - 0.5) * (Math.PI * 2 / count) * 0.4;
      const dist = ringFrac + (rand() - 0.5) * 0.05;
      nodes.push({
        nx: Math.cos(angle) * dist,
        ny: Math.sin(angle) * dist,
        ring: r + 1,
        angle,
        distFrac: dist,
      });
    }
  }

  // Generate edges: connect each node to its nearest neighbors
  const edges: PlanetEdge[] = [];
  const seen = new Set<string>();

  const addEdge = (a: number, b: number) => {
    if (a === b) return;
    const key = Math.min(a, b) + "-" + Math.max(a, b);
    if (!seen.has(key)) {
      seen.add(key);
      edges.push({ a, b });
    }
  };

  for (let i = 0; i < nodes.length; i++) {
    const ni = nodes[i];
    // Find nearest neighbors
    const dists: { idx: number; dist: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = nodes[j].nx - ni.nx;
      const dy = nodes[j].ny - ni.ny;
      dists.push({ idx: j, dist: dx * dx + dy * dy });
    }
    dists.sort((a, b) => a.dist - b.dist);
    const connectCount = Math.min(MAX_NEIGHBORS, dists.length);
    for (let k = 0; k < connectCount; k++) {
      addEdge(i, dists[k].idx);
    }
  }

  state.nodes = nodes;
  state.edges = edges;
}

/* ── Render ──────────────────────────────────────────────────────────────── */

/**
 * Render the planet using pre-generated state.
 *
 * @param ctx      Canvas 2D context
 * @param state    Generated planet state
 * @param centerX  Center X of the planet in canvas px
 * @param centerY  Center Y of the planet in canvas px
 * @param radius   Planet radius in canvas px
 * @param time     Elapsed time in seconds (for rotation)
 * @param alpha    Global alpha multiplier (0–1, for fade-in)
 */
export function renderPlanet(
  ctx: CanvasRenderingContext2D,
  state: PlanetState,
  centerX: number,
  centerY: number,
  radius: number,
  time: number,
  alpha: number = 1,
): void {
  if (alpha <= 0 || !state.generated) return;

  const { nodes, edges } = state;
  const cr = DOT_COLOR.r;
  const cg = DOT_COLOR.g;
  const cb = DOT_COLOR.b;

  // ── Atmospheric glow ───────────────────────────────────────────────
  const glowOuter = radius * GLOW_EXTENT;
  const grad = ctx.createRadialGradient(
    centerX, centerY, radius * 0.8,
    centerX, centerY, glowOuter,
  );
  grad.addColorStop(0, `rgba(${cr},${cg},${cb},${GLOW_ALPHA * alpha})`);
  grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
  ctx.beginPath();
  ctx.arc(centerX, centerY, glowOuter, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // ── Compute rotation offset per node ───────────────────────────────
  const rotPhase = (time / ROTATION_PERIOD) * Math.PI * 2;

  // Precompute screen positions
  const sx: number[] = new Array(nodes.length);
  const sy: number[] = new Array(nodes.length);

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    // Lateral shift: equator nodes (ny ≈ 0) shift most, poles (|ny| ≈ 1) shift least
    const equatorFactor = 1 - Math.abs(n.ny);
    const lateralShift = Math.sin(rotPhase + n.angle) * ROTATION_AMPLITUDE * equatorFactor * radius;

    sx[i] = centerX + n.nx * radius + lateralShift;
    sy[i] = centerY + n.ny * radius;
  }

  // ── Edges ──────────────────────────────────────────────────────────
  ctx.lineWidth = PLANET_EDGE_LINE_WIDTH;
  const edgeAlpha = PLANET_EDGE_ALPHA * alpha;
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},${edgeAlpha})`;

  for (const edge of edges) {
    const ax = sx[edge.a];
    const ay = sy[edge.a];
    const bx = sx[edge.b];
    const by = sy[edge.b];

    // Skip edges whose both endpoints are outside the circle (minor cull)
    const aDist = (ax - centerX) ** 2 + (ay - centerY) ** 2;
    const bDist = (bx - centerX) ** 2 + (by - centerY) ** 2;
    const r2 = (radius * 1.05) ** 2;
    if (aDist > r2 && bDist > r2) continue;

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  // ── Nodes ──────────────────────────────────────────────────────────
  const nodeAlpha = PLANET_NODE_ALPHA * alpha;
  ctx.fillStyle = `rgba(${cr},${cg},${cb},${nodeAlpha})`;

  for (let i = 0; i < nodes.length; i++) {
    ctx.beginPath();
    ctx.arc(sx[i], sy[i], PLANET_NODE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}
