/**
 * skyline.ts — City skyline construction renderer for the Research section.
 *
 * Generates a wireframe city skyline made of dot-and-line compositions.
 * Buildings are vertical stacks of nodes connected by horizontal and
 * vertical edges, progressively constructed as the user scrolls.
 *
 * The skyline is a separate visual from the 20-node network graph —
 * it has its own ~80–120 nodes rendered on the same canvas.
 */

import { DOT_COLOR } from "./dot-grid";

/* ── Configuration ──────────────────────────────────────────────────────── */

/** Node rendering */
const SKYLINE_NODE_RADIUS = 2;
const SKYLINE_NODE_ALPHA = 0.3;
const SKYLINE_EDGE_ALPHA = 0.15;
const SKYLINE_EDGE_LINE_WIDTH = 0.6;

/** Building generation */
const BUILDING_COUNT_MIN = 10;
const BUILDING_COUNT_MAX = 14;

/** Column width in normalized coords */
const COLUMN_WIDTH = 0.025;

/** Floor height in normalized coords */
const FLOOR_HEIGHT = 0.04;

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface Building {
  x: number;          // horizontal center position (normalized 0–1)
  width: number;      // in node columns (2–4)
  floors: number;     // height in node rows (3–12)
  buildOrder: number; // 0 = builds first, higher = builds later
}

interface SkylineNode {
  /** Position in normalized coords (0–1) */
  nx: number;
  ny: number;
  /** Build progress threshold: node appears when progress >= this value */
  buildAt: number;
}

interface SkylineEdge {
  a: number;
  b: number;
  /** Build progress threshold: edge appears when progress >= this AND both nodes visible */
  buildAt: number;
}

export interface SkylineState {
  buildings: Building[];
  nodes: SkylineNode[];
  edges: SkylineEdge[];
  groundNodes: number[]; // indices of ground-plane nodes
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

/* ── Skyline Generation ─────────────────────────────────────────────────── */

export function createSkylineState(): SkylineState {
  return {
    buildings: [],
    nodes: [],
    edges: [],
    groundNodes: [],
    generated: false,
  };
}

/**
 * Generate the skyline layout. Call once; subsequent calls are no-ops.
 */
export function generateSkyline(state: SkylineState): void {
  if (state.generated) return;
  state.generated = true;

  const rand = seededRandom(31415);
  const buildingCount = BUILDING_COUNT_MIN +
    Math.floor(rand() * (BUILDING_COUNT_MAX - BUILDING_COUNT_MIN + 1));

  const buildings: Building[] = [];

  // Distribute buildings across x: 0.05 to 0.95
  const xStart = 0.05;
  const xEnd = 0.95;
  const gap = (xEnd - xStart) / buildingCount;

  for (let i = 0; i < buildingCount; i++) {
    const t = (i + 0.5) / buildingCount; // 0–1 position
    const x = xStart + i * gap + gap * 0.3 + rand() * gap * 0.4;

    // Taller buildings toward center (t ≈ 0.5)
    const centerProximity = 1 - Math.abs(t - 0.5) * 2; // 0 at edges, 1 at center
    const minFloors = 3;
    const maxFloors = 4 + Math.floor(centerProximity * 8); // 4–12 range
    const floors = minFloors + Math.floor(rand() * (maxFloors - minFloors + 1));

    const width = 2 + Math.floor(rand() * 3); // 2–4 columns

    buildings.push({ x, width, floors, buildOrder: 0 });
  }

  // Assign build order: shorter buildings first, ties broken by edge-to-center
  const sortedByHeight = [...buildings].sort((a, b) => {
    if (a.floors !== b.floors) return a.floors - b.floors;
    const aCenterDist = Math.abs(a.x - 0.5);
    const bCenterDist = Math.abs(b.x - 0.5);
    return bCenterDist - aCenterDist; // edges first for ties
  });
  for (let i = 0; i < sortedByHeight.length; i++) {
    sortedByHeight[i].buildOrder = i;
  }

  state.buildings = buildings;

  // Generate nodes and edges for each building
  const nodes: SkylineNode[] = [];
  const edges: SkylineEdge[] = [];
  const groundY = 1.0; // bottom of normalized space
  const groundNodeIndices: number[] = [];

  // Track all ground-level x positions for the ground plane
  const groundXPositions: { x: number; nodeIdx: number }[] = [];

  for (const bldg of buildings) {
    const buildProgress = 0.1 + (bldg.buildOrder / buildings.length) * 0.8;
    // Each floor builds sequentially within the building's allocation
    const buildDuration = 0.8 / buildings.length;

    const cols = bldg.width;
    const halfWidth = (cols - 1) * COLUMN_WIDTH / 2;

    // Create nodes floor-by-floor, bottom-up
    const buildingNodeStart = nodes.length;
    for (let floor = 0; floor <= bldg.floors; floor++) {
      const floorBuildAt = buildProgress +
        (floor / bldg.floors) * buildDuration;
      const y = groundY - floor * FLOOR_HEIGHT;

      for (let col = 0; col < cols; col++) {
        const x = bldg.x - halfWidth + col * COLUMN_WIDTH;
        const nodeIdx = nodes.length;
        nodes.push({ nx: x, ny: y, buildAt: Math.min(floorBuildAt, 0.9) });

        if (floor === 0) {
          groundNodeIndices.push(nodeIdx);
          groundXPositions.push({ x, nodeIdx });
        }
      }
    }

    // Create edges: vertical columns and horizontal floors
    for (let floor = 0; floor <= bldg.floors; floor++) {
      for (let col = 0; col < cols; col++) {
        const nodeIdx = buildingNodeStart + floor * cols + col;

        // Horizontal edge to the right neighbor on the same floor
        if (col < cols - 1) {
          const rightIdx = nodeIdx + 1;
          const edgeBuildAt = Math.max(nodes[nodeIdx].buildAt, nodes[rightIdx].buildAt);
          edges.push({ a: nodeIdx, b: rightIdx, buildAt: edgeBuildAt });
        }

        // Vertical edge to the node above (next floor)
        if (floor < bldg.floors) {
          const aboveIdx = buildingNodeStart + (floor + 1) * cols + col;
          const edgeBuildAt = Math.max(nodes[nodeIdx].buildAt, nodes[aboveIdx].buildAt);
          edges.push({ a: nodeIdx, b: aboveIdx, buildAt: edgeBuildAt });
        }
      }
    }
  }

  // Ground plane: connect ground nodes left-to-right
  groundXPositions.sort((a, b) => a.x - b.x);
  for (let i = 0; i < groundXPositions.length - 1; i++) {
    const a = groundXPositions[i].nodeIdx;
    const b = groundXPositions[i + 1].nodeIdx;
    edges.push({ a, b, buildAt: 0.05 }); // Ground builds early
  }

  // Ground-plane nodes get early buildAt
  for (const idx of groundNodeIndices) {
    nodes[idx].buildAt = Math.min(nodes[idx].buildAt, 0.08);
  }

  state.nodes = nodes;
  state.edges = edges;
  state.groundNodes = groundNodeIndices;
}

/* ── Render ──────────────────────────────────────────────────────────────── */

/**
 * Render the skyline construction.
 *
 * @param ctx        Canvas 2D context
 * @param state      Skyline state (must be generated)
 * @param progress   Construction progress 0–1 (from researchProgress)
 * @param areaX      Left edge of the skyline area in canvas px
 * @param areaY      Top edge of the skyline area in canvas px
 * @param areaWidth  Width of the skyline area in canvas px
 * @param areaHeight Height of the skyline area in canvas px
 */
export function renderSkyline(
  ctx: CanvasRenderingContext2D,
  state: SkylineState,
  progress: number,
  areaX: number,
  areaY: number,
  areaWidth: number,
  areaHeight: number,
): void {
  if (!state.generated || progress <= 0) return;

  const { nodes, edges } = state;
  const r = DOT_COLOR.r;
  const g = DOT_COLOR.g;
  const b = DOT_COLOR.b;

  // Map normalized coords to canvas area.
  // nx 0–1 maps to areaX..areaX+areaWidth
  // ny 0–1 maps vertically; groundY=1.0 is at bottom of area
  const toX = (nx: number) => areaX + nx * areaWidth;
  const toY = (ny: number) => areaY + ny * areaHeight;

  // ── Edges ──────────────────────────────────────────────────────────
  ctx.lineWidth = SKYLINE_EDGE_LINE_WIDTH;
  for (const edge of edges) {
    if (progress < edge.buildAt) continue;
    const na = nodes[edge.a];
    const nb = nodes[edge.b];
    // Both endpoint nodes must also be built
    if (progress < na.buildAt || progress < nb.buildAt) continue;

    // Fade in: alpha ramps from 0 to full over a small progress window
    const edgeFadeWindow = 0.05;
    const edgeAge = Math.min((progress - edge.buildAt) / edgeFadeWindow, 1);
    const alpha = SKYLINE_EDGE_ALPHA * edgeAge;
    if (alpha <= 0.001) continue;

    ctx.beginPath();
    ctx.moveTo(toX(na.nx), toY(na.ny));
    ctx.lineTo(toX(nb.nx), toY(nb.ny));
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.stroke();
  }

  // ── Nodes ──────────────────────────────────────────────────────────
  for (const node of nodes) {
    if (progress < node.buildAt) continue;

    const nodeFadeWindow = 0.04;
    const nodeAge = Math.min((progress - node.buildAt) / nodeFadeWindow, 1);
    const alpha = SKYLINE_NODE_ALPHA * nodeAge;
    if (alpha <= 0.001) continue;

    ctx.beginPath();
    ctx.arc(toX(node.nx), toY(node.ny), SKYLINE_NODE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }
}
