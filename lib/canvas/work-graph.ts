/**
 * work-graph.ts — Layout generator and state for the Work section node graph.
 *
 * Generates a deterministic layout of regular nodes + hub (logo-icon) nodes
 * based on the number of case studies. Hub nodes are placed along a gentle
 * arc in the right 2/3 of the viewport, with regular nodes clustered
 * around them. Edges radiate from hubs (high connectivity) with organic
 * connections between regular nodes.
 *
 * The layout is defined in normalized coordinates (-1 to 1 range) so it
 * can be scaled to any viewport size.
 */

import { DOT_COLOR, INTERACTION_RADIUS } from "./dot-grid";

/* ── Configuration ──────────────────────────────────────────────────────── */

/** Total regular (non-hub) nodes in the work graph */
const REGULAR_NODE_COUNT = 40;

/** Hub node rendered size (px) */
export const HUB_SIZE_BASE = 44;
export const HUB_SIZE_ACTIVE = 55;

/** Hub glow settings */
export const HUB_GLOW_INACTIVE = 15;
export const HUB_GLOW_ACTIVE = 25;

/** Hub pulse: ±3% scale oscillation period (seconds) */
const HUB_PULSE_PERIOD = 2.5;
const HUB_PULSE_AMPLITUDE = 0.03;

/** Regular node radius */
const WORK_NODE_RADIUS = 3;

/** Edge settings */
const WORK_EDGE_LINE_WIDTH = 0.6;
const WORK_EDGE_BASE_ALPHA = 0.12;

/** Node base/hover alpha */
const WORK_NODE_BASE_ALPHA = 0.35;
const WORK_NODE_HOVER_ALPHA = 0.8;

/** Drift amplitude */
const WORK_DRIFT_AMPLITUDE = 3;

/** Lerp rate for work node positions */
const WORK_LERP_RATE = 3.33;

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface WorkNodeDef {
  x: number;
  y: number;
}

export interface WorkGraphLayout {
  regularNodes: WorkNodeDef[];
  hubNodes: WorkNodeDef[];
  edges: [number, number][];
  /** Number of regular nodes that are "initial" (correspond to services graph nodes) */
  initialNodeCount: number;
}

export interface WorkNode {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  alpha: number;
  targetAlpha: number;
  driftPhase: number;
  driftSpeed: number;
  isHub: boolean;
  hubIndex: number; // -1 for regular nodes
}

export interface EnergyPulse {
  active: boolean;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number; // 0–1
  duration: number;  // seconds
}

export interface WorkGraphState {
  nodes: WorkNode[];
  layout: WorkGraphLayout | null;
  activeHub: number;
  previousHub: number;
  time: number;
  logoImage: HTMLImageElement | null;
  logoLoaded: boolean;
  pulse: EnergyPulse;
  caseStudyCount: number;
}

/* ── Seeded random for deterministic layouts ────────────────────────────── */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Layout Generation ──────────────────────────────────────────────────── */

/**
 * Generate a work graph layout with hub and regular nodes.
 * Uses normalized coordinates roughly in -1 to 1 range.
 * The graph occupies the right 2/3 of the normalized space.
 */
export function generateWorkGraphLayout(
  caseStudyCount: number,
): WorkGraphLayout {
  const rand = seededRandom(caseStudyCount * 7919 + 42);

  const hubNodes: WorkNodeDef[] = [];
  const regularNodes: WorkNodeDef[] = [];

  // Place hubs along a gentle vertical arc in the center-right area
  for (let i = 0; i < caseStudyCount; i++) {
    const t = caseStudyCount === 1 ? 0.5 : i / (caseStudyCount - 1);
    // Vertical spread: from -0.6 to 0.6
    const y = -0.6 + t * 1.2;
    // Gentle horizontal arc: center at ~0.1, bulges to 0.3
    const x = 0.1 + 0.2 * Math.sin(t * Math.PI);
    hubNodes.push({ x, y });
  }

  // Place first 20 regular nodes ("initial" nodes that correspond to services graph)
  // These start in the right-half cluster and spread out
  const initialCount = 20;
  for (let i = 0; i < initialCount; i++) {
    const angle = (i / initialCount) * Math.PI * 2 + rand() * 0.5;
    const dist = 0.3 + rand() * 0.55;
    regularNodes.push({
      x: -0.15 + dist * Math.cos(angle),
      y: dist * Math.sin(angle) * 0.9,
    });
  }

  // Place remaining regular nodes in clusters around hubs
  const remaining = REGULAR_NODE_COUNT - initialCount;
  for (let i = 0; i < remaining; i++) {
    // Assign to a hub cluster
    const hubIdx = i % caseStudyCount;
    const hub = hubNodes[hubIdx];
    const angle = rand() * Math.PI * 2;
    const dist = 0.15 + rand() * 0.35;
    regularNodes.push({
      x: hub.x + dist * Math.cos(angle),
      y: hub.y + dist * Math.sin(angle) * 0.85,
    });
  }

  // Generate edges
  const totalNodes = regularNodes.length + caseStudyCount;
  const edges: [number, number][] = [];
  const seen = new Set<string>();

  const addEdge = (a: number, b: number) => {
    if (a === b) return;
    const key = Math.min(a, b) + "-" + Math.max(a, b);
    if (!seen.has(key)) {
      seen.add(key);
      edges.push([a, b]);
    }
  };

  // Hub indices start after regular nodes
  const hubStartIdx = regularNodes.length;

  // Connect each hub to its 5–7 nearest regular nodes
  for (let h = 0; h < caseStudyCount; h++) {
    const hub = hubNodes[h];
    const hubIdx = hubStartIdx + h;

    const dists: { idx: number; dist: number }[] = [];
    for (let r = 0; r < regularNodes.length; r++) {
      const dx = regularNodes[r].x - hub.x;
      const dy = regularNodes[r].y - hub.y;
      dists.push({ idx: r, dist: dx * dx + dy * dy });
    }
    dists.sort((a, b) => a.dist - b.dist);

    const connectCount = 5 + Math.floor(rand() * 3); // 5–7
    for (let k = 0; k < Math.min(connectCount, dists.length); k++) {
      addEdge(hubIdx, dists[k].idx);
    }

    // Connect adjacent hubs
    if (h < caseStudyCount - 1) {
      addEdge(hubIdx, hubIdx + 1);
    }
  }

  // Connect regular nodes to 2–3 nearest neighbors
  for (let i = 0; i < regularNodes.length; i++) {
    const dists: { idx: number; dist: number }[] = [];
    for (let j = 0; j < regularNodes.length; j++) {
      if (i === j) continue;
      const dx = regularNodes[j].x - regularNodes[i].x;
      const dy = regularNodes[j].y - regularNodes[i].y;
      const dist = dx * dx + dy * dy;
      if (dist < 0.25) { // Only consider nearby nodes
        dists.push({ idx: j, dist });
      }
    }
    dists.sort((a, b) => a.dist - b.dist);
    const connectCount = 2 + (rand() > 0.5 ? 1 : 0);
    for (let k = 0; k < Math.min(connectCount, dists.length); k++) {
      addEdge(i, dists[k].idx);
    }
  }

  return {
    regularNodes,
    hubNodes,
    edges,
    initialNodeCount: initialCount,
  };
}

/* ── State Management ───────────────────────────────────────────────────── */

export function createWorkGraphState(): WorkGraphState {
  return {
    nodes: [],
    layout: null,
    activeHub: 0,
    previousHub: -1,
    time: 0,
    logoImage: null,
    logoLoaded: false,
    pulse: {
      active: false,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0,
      progress: 0,
      duration: 0.4,
    },
    caseStudyCount: 0,
  };
}

/**
 * Initialize the work graph with layout for a given case study count.
 * Call once (or when case study count changes).
 */
export function initWorkGraph(state: WorkGraphState, caseStudyCount: number): void {
  if (state.caseStudyCount === caseStudyCount && state.layout) return;

  state.caseStudyCount = caseStudyCount;
  state.layout = generateWorkGraphLayout(caseStudyCount);

  const { regularNodes, hubNodes } = state.layout;
  state.nodes = [];

  // Regular nodes
  for (let i = 0; i < regularNodes.length; i++) {
    state.nodes.push({
      x: 0, y: 0,
      targetX: 0, targetY: 0,
      alpha: 0, targetAlpha: 0,
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.3 + Math.random() * 0.4,
      isHub: false,
      hubIndex: -1,
    });
  }

  // Hub nodes
  for (let h = 0; h < hubNodes.length; h++) {
    state.nodes.push({
      x: 0, y: 0,
      targetX: 0, targetY: 0,
      alpha: 0, targetAlpha: 0,
      driftPhase: Math.random() * Math.PI * 2,
      driftSpeed: 0.2 + Math.random() * 0.2,
      isHub: true,
      hubIndex: h,
    });
  }
}

/**
 * Load the logo image for hub nodes.
 */
export function loadWorkGraphLogo(state: WorkGraphState): void {
  if (state.logoImage) return;
  const img = new Image();
  img.src = "/images/logo-icon-only-green.png";
  img.onload = () => {
    state.logoLoaded = true;
  };
  state.logoImage = img;
}

/* ── Update ──────────────────────────────────────────────────────────────── */

/**
 * Update the work graph state.
 *
 * @param state            Mutable state
 * @param dt               Delta time in seconds
 * @param centerX          Center X of graph area in viewport px
 * @param centerY          Center Y of graph area in viewport px
 * @param spread           Scale factor for normalized coords → px
 * @param transitionProgress  0 = services config, 1 = full work graph
 * @param workProgress     0–1 within the pinned work section
 * @param workActive       Whether work section is pinned
 * @param serviceNodes     Current positions of the 20 services network nodes (for seamless transition)
 */
export function updateWorkGraph(
  state: WorkGraphState,
  dt: number,
  centerX: number,
  centerY: number,
  spread: number,
  transitionProgress: number,
  workProgress: number,
  workActive: boolean,
  serviceNodes: { x: number; y: number }[] | null,
): void {
  if (!state.layout) return;
  const clampedDt = Math.min(dt, 0.1);
  state.time += clampedDt;

  const { regularNodes, hubNodes, initialNodeCount } = state.layout;
  const t = state.time;
  const lerpFactor = 1 - Math.exp(-WORK_LERP_RATE * clampedDt);
  const alphaLerp = 1 - Math.exp(-5 * clampedDt);

  // Determine active hub from work progress
  const csc = state.caseStudyCount;
  const newActiveHub = workActive
    ? Math.min(Math.floor(workProgress * csc), csc - 1)
    : state.activeHub;

  if (newActiveHub !== state.activeHub && state.activeHub >= 0) {
    // Hub changed — trigger energy pulse
    state.previousHub = state.activeHub;
    const prevHubNode = state.nodes[regularNodes.length + state.previousHub];
    const nextHubNode = state.nodes[regularNodes.length + newActiveHub];
    state.pulse.active = true;
    state.pulse.fromX = prevHubNode.x;
    state.pulse.fromY = prevHubNode.y;
    state.pulse.toX = nextHubNode.x;
    state.pulse.toY = nextHubNode.y;
    state.pulse.progress = 0;
  }
  state.activeHub = newActiveHub;

  // Update energy pulse
  if (state.pulse.active) {
    state.pulse.progress += clampedDt / state.pulse.duration;
    if (state.pulse.progress >= 1) {
      state.pulse.active = false;
      state.pulse.progress = 1;
    }
    // Update destination in case hub moved
    const destHub = state.nodes[regularNodes.length + state.activeHub];
    if (destHub) {
      state.pulse.toX = destHub.x;
      state.pulse.toY = destHub.y;
    }
  }

  // Update regular nodes
  for (let i = 0; i < regularNodes.length; i++) {
    const node = state.nodes[i];
    const def = regularNodes[i];

    // During transition, initial nodes interpolate from service positions to work positions
    let finalX: number;
    let finalY: number;

    if (i < initialNodeCount && serviceNodes && transitionProgress < 1) {
      // Blend from service node's position to work target
      const sn = serviceNodes[i];
      const workX = centerX + def.x * spread;
      const workY = centerY + def.y * spread;
      finalX = sn.x + (workX - sn.x) * transitionProgress;
      finalY = sn.y + (workY - sn.y) * transitionProgress;
    } else {
      finalX = centerX + def.x * spread;
      finalY = centerY + def.y * spread;
    }

    // Drift
    const driftX = Math.sin(t * node.driftSpeed + node.driftPhase) * WORK_DRIFT_AMPLITUDE;
    const driftY = Math.cos(t * node.driftSpeed * 0.7 + node.driftPhase + 1.3) * WORK_DRIFT_AMPLITUDE;

    node.targetX = finalX + driftX;
    node.targetY = finalY + driftY;

    // Alpha: initial nodes start visible, new nodes fade in during transition
    if (i < initialNodeCount) {
      node.targetAlpha = WORK_NODE_BASE_ALPHA;
    } else {
      node.targetAlpha = transitionProgress > 0.3
        ? WORK_NODE_BASE_ALPHA * Math.min((transitionProgress - 0.3) / 0.5, 1)
        : 0;
    }

    node.x += (node.targetX - node.x) * lerpFactor;
    node.y += (node.targetY - node.y) * lerpFactor;
    node.alpha += (node.targetAlpha - node.alpha) * alphaLerp;
  }

  // Update hub nodes
  for (let h = 0; h < hubNodes.length; h++) {
    const nodeIdx = regularNodes.length + h;
    const node = state.nodes[nodeIdx];
    const def = hubNodes[h];

    const driftX = Math.sin(t * node.driftSpeed + node.driftPhase) * WORK_DRIFT_AMPLITUDE * 0.5;
    const driftY = Math.cos(t * node.driftSpeed * 0.7 + node.driftPhase + 1.3) * WORK_DRIFT_AMPLITUDE * 0.5;

    node.targetX = centerX + def.x * spread + driftX;
    node.targetY = centerY + def.y * spread + driftY;

    // Hub nodes fade in during the latter part of the transition
    node.targetAlpha = transitionProgress > 0.4
      ? Math.min((transitionProgress - 0.4) / 0.4, 1)
      : 0;

    node.x += (node.targetX - node.x) * lerpFactor;
    node.y += (node.targetY - node.y) * lerpFactor;
    node.alpha += (node.targetAlpha - node.alpha) * alphaLerp;
  }
}

/* ── Render ──────────────────────────────────────────────────────────────── */

/**
 * Render the work graph onto the canvas.
 */
export function renderWorkGraph(
  ctx: CanvasRenderingContext2D,
  state: WorkGraphState,
  focalX: number,
  focalY: number,
  globalAlpha: number,
): void {
  if (globalAlpha <= 0.001 || !state.layout) return;

  const { nodes } = state;
  const { edges } = state.layout;
  const { regularNodes } = state.layout;
  const r = DOT_COLOR.r;
  const g = DOT_COLOR.g;
  const b = DOT_COLOR.b;

  // ── Edges ──────────────────────────────────────────────────────────
  ctx.lineWidth = WORK_EDGE_LINE_WIDTH;
  for (const [ai, bi] of edges) {
    if (ai >= nodes.length || bi >= nodes.length) continue;
    const a = nodes[ai];
    const bNode = nodes[bi];
    const edgeAlpha = WORK_EDGE_BASE_ALPHA * globalAlpha *
      Math.min(a.alpha, bNode.alpha) / WORK_NODE_BASE_ALPHA;
    if (edgeAlpha <= 0.001) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(bNode.x, bNode.y);
    ctx.strokeStyle = `rgba(${r},${g},${b},${edgeAlpha})`;
    ctx.stroke();
  }

  // ── Regular nodes ──────────────────────────────────────────────────
  const interactionRadiusSq = INTERACTION_RADIUS * INTERACTION_RADIUS;

  for (let i = 0; i < regularNodes.length; i++) {
    const node = nodes[i];
    if (node.alpha <= 0.001) continue;

    const dx = node.x - focalX;
    const dy = node.y - focalY;
    const distSq = dx * dx + dy * dy;

    let alpha = node.alpha;
    if (distSq < interactionRadiusSq) {
      const dist = Math.sqrt(distSq);
      const proximity = 1 - dist / INTERACTION_RADIUS;
      const eased = proximity * proximity * proximity;
      alpha = node.alpha + (WORK_NODE_HOVER_ALPHA - node.alpha) * eased;
    }
    alpha *= globalAlpha;

    ctx.beginPath();
    ctx.arc(node.x, node.y, WORK_NODE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
  }

  // ── Hub (logo-icon) nodes ──────────────────────────────────────────
  for (let h = 0; h < state.caseStudyCount; h++) {
    const nodeIdx = regularNodes.length + h;
    const node = nodes[nodeIdx];
    if (node.alpha <= 0.001) continue;

    const isActive = h === state.activeHub;

    // Pulse scale for active hub
    let scale = 1;
    if (isActive) {
      scale = 1 + HUB_PULSE_AMPLITUDE * Math.sin(state.time * Math.PI * 2 / HUB_PULSE_PERIOD);
    }

    const size = isActive ? HUB_SIZE_ACTIVE : HUB_SIZE_BASE;
    const scaledSize = size * scale;
    const glowBlur = isActive ? HUB_GLOW_ACTIVE : HUB_GLOW_INACTIVE;
    const hubAlpha = node.alpha * globalAlpha;

    ctx.save();

    // Glow ring
    ctx.shadowColor = `rgba(${r},${g},${b},${hubAlpha * 0.7})`;
    ctx.shadowBlur = glowBlur;

    // Circular clip path
    ctx.beginPath();
    ctx.arc(node.x, node.y, scaledSize / 2, 0, Math.PI * 2);
    ctx.closePath();

    if (state.logoLoaded && state.logoImage) {
      ctx.save();
      ctx.clip();

      ctx.globalAlpha = hubAlpha;
      ctx.drawImage(
        state.logoImage,
        node.x - scaledSize / 2,
        node.y - scaledSize / 2,
        scaledSize,
        scaledSize,
      );
      ctx.restore();

      // Draw glow ring border
      ctx.beginPath();
      ctx.arc(node.x, node.y, scaledSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},${hubAlpha * 0.5})`;
      ctx.lineWidth = isActive ? 2 : 1.5;
      ctx.stroke();
    } else {
      // Fallback: filled circle
      ctx.fillStyle = `rgba(${r},${g},${b},${hubAlpha * 0.6})`;
      ctx.fill();
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // ── Energy pulse ───────────────────────────────────────────────────
  if (state.pulse.active) {
    const p = state.pulse;
    // Ease-in-out
    const eased = p.progress < 0.5
      ? 2 * p.progress * p.progress
      : 1 - Math.pow(-2 * p.progress + 2, 2) / 2;

    const px = p.fromX + (p.toX - p.fromX) * eased;
    const py = p.fromY + (p.toY - p.fromY) * eased;
    const pulseAlpha = globalAlpha * 0.8 * (1 - Math.abs(eased - 0.5) * 0.4);

    // Bright pulse dot
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${pulseAlpha})`;
    ctx.shadowColor = `rgba(${r},${g},${b},${pulseAlpha})`;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Brighten edges near the pulse point
    ctx.lineWidth = 1.2;
    const pulseRadiusSq = 60 * 60;
    for (const [ai, bi] of edges) {
      if (ai >= nodes.length || bi >= nodes.length) continue;
      const a = nodes[ai];
      const bNode = nodes[bi];
      // Check if pulse point is near the edge midpoint
      const mx = (a.x + bNode.x) / 2;
      const my = (a.y + bNode.y) / 2;
      const dx = px - mx;
      const dy = py - my;
      if (dx * dx + dy * dy < pulseRadiusSq) {
        const edgeBright = pulseAlpha * 0.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(bNode.x, bNode.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${edgeBright})`;
        ctx.stroke();
      }
    }
    ctx.lineWidth = WORK_EDGE_LINE_WIDTH;
  }
}
