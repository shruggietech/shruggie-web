/**
 * shapes.ts — Shape target definitions for the network graph.
 *
 * Each shape is an array of 20 { x, y } positions in normalized coordinates
 * (roughly -1 to 1 range, centered at origin) plus an edges array of
 * [nodeIndex, nodeIndex] pairs defining which nodes to connect.
 *
 * Shapes:
 *   0 — Hero (spread halo): organic scatter, proximity-based edges
 *   1 — Constellation (Digital Strategy & Brand): radial burst
 *   2 — Circuit Board (Development & Integration): 5×4 grid
 *   3 — Funnel (Revenue Flows & Marketing Ops): tapering rows
 *   4 — Neural Network (AI & Data Analysis): layered columns
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface ShapeDefinition {
  nodes: { x: number; y: number }[];
  edges: [number, number][];
}

/* ── Shape 0 — Hero (spread halo) ───────────────────────────────────────
 * Organic, loose distribution. No explicit edges — the renderer falls
 * back to proximity-based connections.
 */
const heroHalo: ShapeDefinition = {
  nodes: [
    { x: -0.62, y: -0.38 },
    { x: 0.55, y: -0.52 },
    { x: -0.28, y: 0.65 },
    { x: 0.71, y: 0.31 },
    { x: -0.85, y: 0.12 },
    { x: 0.18, y: -0.78 },
    { x: -0.44, y: -0.71 },
    { x: 0.39, y: 0.58 },
    { x: -0.73, y: 0.55 },
    { x: 0.82, y: -0.18 },
    { x: -0.15, y: 0.22 },
    { x: 0.05, y: -0.35 },
    { x: -0.51, y: 0.08 },
    { x: 0.62, y: -0.72 },
    { x: -0.2, y: -0.15 },
    { x: 0.28, y: 0.12 },
    { x: -0.38, y: 0.42 },
    { x: 0.48, y: -0.22 },
    { x: -0.08, y: 0.82 },
    { x: 0.72, y: 0.72 },
  ],
  edges: [], // proximity fallback
};

/* ── Shape 1 — Constellation (Digital Strategy & Brand) ─────────────────
 * Center node + inner hexagonal ring (6) + outer offset ring (7) +
 * 6 spike tips extending outward.
 *
 * Layout:
 *   [0]        center
 *   [1–6]      inner hexagon (radius ~0.35)
 *   [7–13]     outer ring (radius ~0.65, offset angles)
 *   [14–19]    spike tips (radius ~0.95, aligned with inner ring)
 */
const constellation: ShapeDefinition = (() => {
  const nodes: { x: number; y: number }[] = [];

  // 0: center
  nodes.push({ x: 0, y: 0 });

  // 1–6: inner hexagon
  const innerR = 0.35;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    nodes.push({ x: innerR * Math.cos(a), y: innerR * Math.sin(a) });
  }

  // 7–13: outer ring (7 nodes, offset by half-step)
  const outerR = 0.65;
  for (let i = 0; i < 7; i++) {
    const a = (Math.PI * 2 * i) / 7 - Math.PI / 2 + Math.PI / 7;
    nodes.push({ x: outerR * Math.cos(a), y: outerR * Math.sin(a) });
  }

  // 14–19: spike tips (6, aligned with inner hex angles)
  const spikeR = 0.95;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    nodes.push({ x: spikeR * Math.cos(a), y: spikeR * Math.sin(a) });
  }

  const edges: [number, number][] = [
    // center → inner hex
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    // inner hex loop
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
    // inner hex → spike tips
    [1, 14], [2, 15], [3, 16], [4, 17], [5, 18], [6, 19],
    // outer ring loop
    [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 7],
  ];

  return { nodes, edges };
})();

/* ── Shape 2 — Circuit Board (Development & Integration) ────────────────
 * 5 columns × 4 rows = 20 nodes at regular intervals.
 * Horizontal + vertical edges only (no diagonals).
 */
const circuitBoard: ShapeDefinition = (() => {
  const cols = 5;
  const rows = 4;
  const nodes: { x: number; y: number }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({
        x: -0.8 + (1.6 * c) / (cols - 1),
        y: -0.6 + (1.2 * r) / (rows - 1),
      });
    }
  }

  const edges: [number, number][] = [];

  // horizontal within rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      edges.push([r * cols + c, r * cols + c + 1]);
    }
  }

  // vertical within columns
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 1; r++) {
      edges.push([r * cols + c, (r + 1) * cols + c]);
    }
  }

  return { nodes, edges };
})();

/* ── Shape 3 — Funnel (Revenue Flows & Marketing Ops) ───────────────────
 * 5 rows with decreasing width: 5, 5, 4, 3, 3 = 20 nodes.
 * Within-row horizontal edges + cross-row edges to nearest neighbors.
 */
const funnel: ShapeDefinition = (() => {
  const rowCounts = [5, 5, 4, 3, 3];
  const nodes: { x: number; y: number }[] = [];
  const rowStartIndex: number[] = [];

  const totalRows = rowCounts.length;
  for (let r = 0; r < totalRows; r++) {
    rowStartIndex.push(nodes.length);
    const count = rowCounts[r];
    const halfWidth = 0.8 * (count / 5); // narrower rows have less spread
    for (let c = 0; c < count; c++) {
      const x = count === 1 ? 0 : -halfWidth + (2 * halfWidth * c) / (count - 1);
      const y = -0.8 + (1.6 * r) / (totalRows - 1);
      nodes.push({ x, y });
    }
  }

  const edges: [number, number][] = [];

  // horizontal within each row
  for (let r = 0; r < totalRows; r++) {
    const start = rowStartIndex[r];
    const count = rowCounts[r];
    for (let c = 0; c < count - 1; c++) {
      edges.push([start + c, start + c + 1]);
    }
  }

  // cross-row: connect each node to its nearest 1–2 neighbors in the next row
  for (let r = 0; r < totalRows - 1; r++) {
    const startA = rowStartIndex[r];
    const countA = rowCounts[r];
    const startB = rowStartIndex[r + 1];
    const countB = rowCounts[r + 1];

    for (let a = 0; a < countA; a++) {
      const nodeA = nodes[startA + a];
      // Find nearest node(s) in next row
      let bestDist = Infinity;
      let bestIdx = 0;
      for (let b = 0; b < countB; b++) {
        const dx = nodes[startB + b].x - nodeA.x;
        const dy = nodes[startB + b].y - nodeA.y;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = b;
        }
      }
      edges.push([startA + a, startB + bestIdx]);

      // Also connect to second-nearest if close enough
      let secondDist = Infinity;
      let secondIdx = -1;
      for (let b = 0; b < countB; b++) {
        if (b === bestIdx) continue;
        const dx = nodes[startB + b].x - nodeA.x;
        const dy = nodes[startB + b].y - nodeA.y;
        const dist = dx * dx + dy * dy;
        if (dist < secondDist) {
          secondDist = dist;
          secondIdx = b;
        }
      }
      if (secondIdx >= 0 && secondDist < bestDist * 3) {
        edges.push([startA + a, startB + secondIdx]);
      }
    }
  }

  // Deduplicate edges
  const seen = new Set<string>();
  const uniqueEdges: [number, number][] = [];
  for (const [a, b] of edges) {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEdges.push([a, b]);
    }
  }

  return { nodes, edges: uniqueEdges };
})();

/* ── Shape 4 — Neural Network (AI & Data Analysis) ─────────────────────
 * 4 layers left-to-right: 3, 6, 6, 5 = 20 nodes.
 * Each node connects to 2–3 nearest neighbors in the adjacent layer.
 * Total edges capped around 40–50.
 */
const neuralNetwork: ShapeDefinition = (() => {
  const layerCounts = [3, 6, 6, 5];
  const nodes: { x: number; y: number }[] = [];
  const layerStartIndex: number[] = [];

  const totalLayers = layerCounts.length;
  for (let l = 0; l < totalLayers; l++) {
    layerStartIndex.push(nodes.length);
    const count = layerCounts[l];
    const x = -0.9 + (1.8 * l) / (totalLayers - 1);
    for (let n = 0; n < count; n++) {
      const y = count === 1 ? 0 : -0.7 + (1.4 * n) / (count - 1);
      nodes.push({ x, y });
    }
  }

  const edges: [number, number][] = [];

  // Connect adjacent layers
  for (let l = 0; l < totalLayers - 1; l++) {
    const startA = layerStartIndex[l];
    const countA = layerCounts[l];
    const startB = layerStartIndex[l + 1];
    const countB = layerCounts[l + 1];

    for (let a = 0; a < countA; a++) {
      const nodeA = nodes[startA + a];

      // Find distances to all nodes in next layer
      const dists: { idx: number; dist: number }[] = [];
      for (let b = 0; b < countB; b++) {
        const dx = nodes[startB + b].x - nodeA.x;
        const dy = nodes[startB + b].y - nodeA.y;
        dists.push({ idx: startB + b, dist: dx * dx + dy * dy });
      }
      dists.sort((a, b) => a.dist - b.dist);

      // Connect to 2–3 nearest (3 for small source layers, 2 for large)
      const connectCount = countA <= 3 ? 3 : 2;
      for (let k = 0; k < Math.min(connectCount, dists.length); k++) {
        edges.push([startA + a, dists[k].idx]);
      }
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const uniqueEdges: [number, number][] = [];
  for (const [a, b] of edges) {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEdges.push([a, b]);
    }
  }

  return { nodes, edges: uniqueEdges };
})();

/* ── Registry ──────────────────────────────────────────────────────────── */

const shapes: ShapeDefinition[] = [
  heroHalo,
  constellation,
  circuitBoard,
  funnel,
  neuralNetwork,
];

/**
 * Returns the shape definition for the given index.
 * Clamps to valid range.
 */
export function getShape(index: number): ShapeDefinition {
  const i = Math.max(0, Math.min(index, shapes.length - 1));
  return shapes[i];
}

/** Total number of defined shapes */
export const SHAPE_COUNT = shapes.length;

/** Number of nodes each shape defines (all shapes use 20) */
export const NODE_COUNT = 20;
