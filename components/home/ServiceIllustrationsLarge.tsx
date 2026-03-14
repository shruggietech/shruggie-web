/**
 * ServiceIllustrationsLarge — Full-column-height animated SVG illustrations
 * for the pinned ServicesScroll section.
 *
 * Each illustration fills the right 45% column (~600×800 viewport) and uses
 * CSS @keyframes entrance animations controlled by an `.is-active` class on
 * the parent element. Animations are disabled when prefers-reduced-motion
 * is active — elements render in their final state immediately.
 *
 * Color palette:
 *   Primary strokes/fills — brand green #2BCC73
 *   Accent — gradient teal #14B8A6
 *   Structural — white at 10–15% opacity
 *   Emphasis — orange #FF5300
 *
 * Redesign reference: §3.4, §5.2
 */

import styles from "./ServiceIllustrationsLarge.module.css";

interface IllustrationProps {
  className?: string;
}

/* ── A. Strategy & Brand — "Brand System Assembly" ───────────────────── */

export function StrategyBrandIllustrationLarge({
  className,
}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 600 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      {/* Grid guideline — vertical */}
      <line
        x1="200"
        y1="60"
        x2="200"
        y2="740"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
        strokeDasharray="6 8"
        className={styles.guidelineV1}
      />
      <line
        x1="400"
        y1="60"
        x2="400"
        y2="740"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
        strokeDasharray="6 8"
        className={styles.guidelineV2}
      />
      {/* Grid guideline — horizontal */}
      <line
        x1="60"
        y1="260"
        x2="540"
        y2="260"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
        strokeDasharray="6 8"
        className={styles.guidelineH1}
      />
      <line
        x1="60"
        y1="540"
        x2="540"
        y2="540"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
        strokeDasharray="6 8"
        className={styles.guidelineH2}
      />

      {/* Central logo-mark placeholder — rounded square with stroke draw-in */}
      <rect
        x="220"
        y="300"
        width="160"
        height="160"
        rx="28"
        stroke="#2BCC73"
        strokeWidth="2.5"
        opacity="0.9"
        className={styles.logoMark}
      />
      {/* Inner detail — smaller rounded square */}
      <rect
        x="260"
        y="340"
        width="80"
        height="80"
        rx="14"
        stroke="#14B8A6"
        strokeWidth="1.5"
        opacity="0.5"
        className={styles.logoMarkInner}
      />
      {/* Inner accent dot */}
      <circle
        cx="300"
        cy="380"
        r="12"
        fill="#2BCC73"
        opacity="0.2"
        className={styles.logoMarkDot}
      />

      {/* Color swatches — fanning arc from top-left of the mark */}
      {[
        { x: 110, y: 210, color: "#2BCC73", op: 0.8, delay: "swatch1" },
        { x: 138, y: 178, color: "#14B8A6", op: 0.65, delay: "swatch2" },
        { x: 176, y: 156, color: "#00AB21", op: 0.5, delay: "swatch3" },
        { x: 220, y: 146, color: "#FF5300", op: 0.55, delay: "swatch4" },
        { x: 268, y: 148, color: "#2BCC73", op: 0.35, delay: "swatch5" },
      ].map((s) => (
        <rect
          key={s.delay}
          x={s.x}
          y={s.y}
          width="38"
          height="38"
          rx="6"
          fill={s.color}
          opacity={s.op}
          className={styles[s.delay]}
        />
      ))}

      {/* Typography specimens — sliding in from right */}
      {[
        { y: 520, w: 220, h: 12, op: 0.7, cls: "typeLine1" },
        { y: 548, w: 170, h: 8, op: 0.4, cls: "typeLine2" },
        { y: 568, w: 190, h: 8, op: 0.35, cls: "typeLine3" },
        { y: 588, w: 140, h: 8, op: 0.3, cls: "typeLine4" },
        { y: 614, w: 200, h: 6, op: 0.2, cls: "typeLineSmall1" },
        { y: 630, w: 160, h: 6, op: 0.18, cls: "typeLineSmall2" },
        { y: 646, w: 180, h: 6, op: 0.15, cls: "typeLineSmall3" },
      ].map((t) => (
        <rect
          key={t.cls}
          x={200}
          y={t.y}
          width={t.w}
          height={t.h}
          rx={t.h / 2}
          fill="#2BCC73"
          opacity={t.op}
          className={styles[t.cls]}
        />
      ))}

      {/* Accent layout guide — cross-hairs at the logo center */}
      <line
        x1="300"
        y1="280"
        x2="300"
        y2="480"
        stroke="#14B8A6"
        strokeWidth="0.75"
        opacity="0.12"
        className={styles.crosshairV}
      />
      <line
        x1="200"
        y1="380"
        x2="400"
        y2="380"
        stroke="#14B8A6"
        strokeWidth="0.75"
        opacity="0.12"
        className={styles.crosshairH}
      />

      {/* Decorative corner marks */}
      <path
        d="M 100 100 L 100 130"
        stroke="white"
        strokeWidth="0.75"
        opacity="0.12"
        className={styles.cornerMark}
      />
      <path
        d="M 100 100 L 130 100"
        stroke="white"
        strokeWidth="0.75"
        opacity="0.12"
        className={styles.cornerMark}
      />
      <path
        d="M 500 100 L 500 130"
        stroke="white"
        strokeWidth="0.75"
        opacity="0.12"
        className={styles.cornerMark}
      />
      <path
        d="M 500 100 L 470 100"
        stroke="white"
        strokeWidth="0.75"
        opacity="0.12"
        className={styles.cornerMark}
      />
    </svg>
  );
}

/* ── B. Development — "Code Architecture" ────────────────────────────── */

export function DevelopmentIllustrationLarge({
  className,
}: IllustrationProps) {
  const codeLines = [
    { y: 230, w: 160, op: 0.6 },
    { y: 250, w: 120, op: 0.4 },
    { y: 270, w: 180, op: 0.5 },
    { y: 290, w: 100, op: 0.35 },
    { y: 310, w: 140, op: 0.45 },
    { y: 330, w: 90, op: 0.3 },
    { y: 350, w: 170, op: 0.5 },
    { y: 370, w: 110, op: 0.35 },
    { y: 390, w: 150, op: 0.4 },
    { y: 410, w: 130, op: 0.3 },
  ];

  const blocks: { x: number; y: number; w: number; h: number; label: string }[] = [
    { x: 400, y: 200, w: 140, h: 70, label: "API" },
    { x: 400, y: 330, w: 140, h: 70, label: "DB" },
    { x: 400, y: 460, w: 140, h: 70, label: "UI" },
  ];

  return (
    <svg
      viewBox="0 0 600 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      {/* Code editor frame */}
      <rect
        x="60"
        y="170"
        width="280"
        height="290"
        rx="12"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.5"
        className={styles.editorFrame}
      />
      {/* Title bar */}
      <rect
        x="60"
        y="170"
        width="280"
        height="32"
        rx="12"
        fill="#2BCC73"
        opacity="0.08"
        className={styles.editorFrame}
      />
      {/* Title bar dots */}
      <circle cx="82" cy="186" r="4" fill="#FF5300" opacity="0.6" className={styles.editorDot} />
      <circle cx="96" cy="186" r="4" fill="#14B8A6" opacity="0.4" className={styles.editorDot} />
      <circle cx="110" cy="186" r="4" fill="#2BCC73" opacity="0.4" className={styles.editorDot} />
      {/* Line numbers */}
      {codeLines.map((line, i) => (
        <text
          key={`ln-${i}`}
          x="74"
          y={line.y + 5}
          fill="#2BCC73"
          opacity="0.15"
          fontSize="9"
          fontFamily="monospace"
          className={styles[`codeLine${i}`]}
        >
          {i + 1}
        </text>
      ))}
      {/* Code lines — write-in from left */}
      {codeLines.map((line, i) => (
        <rect
          key={`code-${i}`}
          x={95}
          y={line.y}
          width={line.w}
          height={6}
          rx={3}
          fill="#2BCC73"
          opacity={line.op}
          className={styles[`codeLine${i}`]}
        />
      ))}

      {/* System blocks — slide together like puzzle pieces */}
      {blocks.map((block, i) => (
        <g key={block.label} className={styles[`block${i}`]}>
          <rect
            x={block.x}
            y={block.y}
            width={block.w}
            height={block.h}
            rx="10"
            stroke="#14B8A6"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <rect
            x={block.x}
            y={block.y}
            width={block.w}
            height={block.h}
            rx="10"
            fill="#14B8A6"
            opacity="0.04"
          />
          {/* Label inside block */}
          <text
            x={block.x + block.w / 2}
            y={block.y + block.h / 2 + 4}
            textAnchor="middle"
            fill="#14B8A6"
            opacity="0.5"
            fontSize="14"
            fontFamily="monospace"
          >
            {block.label}
          </text>
        </g>
      ))}

      {/* Connection lines between blocks — draw in after blocks settle */}
      <line
        x1="470"
        y1="270"
        x2="470"
        y2="330"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.3"
        className={styles.connLine1}
      />
      <line
        x1="470"
        y1="400"
        x2="470"
        y2="460"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.3"
        className={styles.connLine2}
      />
      {/* Connection dots */}
      <circle
        cx="470"
        cy="270"
        r="3"
        fill="#FF5300"
        opacity="0.6"
        className={styles.connDot1}
      />
      <circle
        cx="470"
        cy="330"
        r="3"
        fill="#FF5300"
        opacity="0.6"
        className={styles.connDot2}
      />
      <circle
        cx="470"
        cy="400"
        r="3"
        fill="#FF5300"
        opacity="0.5"
        className={styles.connDot3}
      />
      <circle
        cx="470"
        cy="460"
        r="3"
        fill="#FF5300"
        opacity="0.5"
        className={styles.connDot4}
      />

      {/* Link from editor to blocks */}
      <path
        d="M 340 350 C 370 350, 380 300, 400 300"
        stroke="#2BCC73"
        strokeWidth="1"
        opacity="0.2"
        strokeDasharray="4 4"
        className={styles.editorLink}
      />

      {/* Bracket decorations */}
      <polyline
        points="40,220 25,350 40,480"
        stroke="#2BCC73"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
        className={styles.bracketLeft}
      />

      {/* Bottom architecture lines */}
      <line
        x1="100"
        y1="580"
        x2="500"
        y2="580"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.08"
        className={styles.archLine}
      />
      <line
        x1="100"
        y1="600"
        x2="400"
        y2="600"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.06"
        className={styles.archLine}
      />
    </svg>
  );
}

/* ── C. Marketing — "Growth Dashboard" ───────────────────────────────── */

export function MarketingIllustrationLarge({ className }: IllustrationProps) {
  const barHeights = [60, 95, 80, 130, 110, 160, 150, 190];

  return (
    <svg
      viewBox="0 0 600 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      {/* Dashboard outer frame */}
      <rect
        x="50"
        y="100"
        width="500"
        height="600"
        rx="16"
        stroke="white"
        strokeWidth="1"
        opacity="0.1"
        className={styles.dashFrame}
      />
      {/* Dashboard title bar */}
      <rect
        x="50"
        y="100"
        width="500"
        height="36"
        rx="16"
        fill="white"
        opacity="0.03"
        className={styles.dashFrame}
      />

      {/* ── Line chart area (top half) ──────────────────────────── */}
      {/* Axes */}
      <line
        x1="90"
        y1="180"
        x2="90"
        y2="390"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
      />
      <line
        x1="90"
        y1="390"
        x2="510"
        y2="390"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
      />
      {/* Grid lines */}
      {[220, 260, 300, 340].map((y) => (
        <line
          key={`lg-${y}`}
          x1="90"
          y1={y}
          x2="510"
          y2={y}
          stroke="white"
          strokeWidth="0.5"
          opacity="0.04"
        />
      ))}

      {/* Line chart — upward trend path */}
      <path
        d="M 110 360 C 140 350, 170 340, 200 320 C 230 300, 260 310, 290 280 C 320 250, 350 260, 380 230 C 410 200, 440 210, 470 190 L 500 180"
        stroke="#2BCC73"
        strokeWidth="2"
        opacity="0.8"
        fill="none"
        strokeLinecap="round"
        className={styles.lineChart}
      />
      {/* Area fill under line chart */}
      <path
        d="M 110 360 C 140 350, 170 340, 200 320 C 230 300, 260 310, 290 280 C 320 250, 350 260, 380 230 C 410 200, 440 210, 470 190 L 500 180 L 500 390 L 110 390 Z"
        fill="url(#lineGrad)"
        opacity="0.15"
        className={styles.lineChartArea}
      />
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2BCC73" />
          <stop offset="100%" stopColor="#2BCC73" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Data points on the line */}
      {[
        [110, 360],
        [200, 320],
        [290, 280],
        [380, 230],
        [500, 180],
      ].map(([cx, cy], i) => (
        <circle
          key={`lp-${i}`}
          cx={cx}
          cy={cy}
          r="4"
          fill="#2BCC73"
          opacity="0.7"
          className={styles[`linePoint${i}`]}
        />
      ))}

      {/* ── Bar chart area (bottom-left) ────────────────────────── */}
      <line
        x1="90"
        y1="440"
        x2="90"
        y2="660"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
      />
      <line
        x1="90"
        y1="660"
        x2="360"
        y2="660"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.1"
      />
      {barHeights.map((h, i) => (
        <rect
          key={`bar-${i}`}
          x={108 + i * 30}
          y={660 - h}
          width="18"
          height={h}
          rx="3"
          fill="#14B8A6"
          opacity={0.3 + i * 0.06}
          className={styles[`bar${i}`]}
        />
      ))}

      {/* ── Funnel (bottom-right) ───────────────────────────────── */}
      <g className={styles.funnel}>
        {/* Funnel shape — trapezoids narrowing downward */}
        <path
          d="M 400 450 L 530 450 L 510 510 L 420 510 Z"
          stroke="#2BCC73"
          strokeWidth="1"
          opacity="0.4"
          fill="#2BCC73"
          fillOpacity="0.04"
        />
        <path
          d="M 420 515 L 510 515 L 500 565 L 430 565 Z"
          stroke="#2BCC73"
          strokeWidth="1"
          opacity="0.3"
          fill="#2BCC73"
          fillOpacity="0.03"
        />
        <path
          d="M 430 570 L 500 570 L 492 610 L 438 610 Z"
          stroke="#14B8A6"
          strokeWidth="1"
          opacity="0.25"
          fill="#14B8A6"
          fillOpacity="0.03"
        />
        <path
          d="M 438 615 L 492 615 L 485 650 L 445 650 Z"
          stroke="#14B8A6"
          strokeWidth="1"
          opacity="0.2"
          fill="#14B8A6"
          fillOpacity="0.02"
        />
      </g>

      {/* Funnel flow dots — small circles moving down through funnel */}
      {[
        { cx: 450, cy: 470, d: "funnelDot0" },
        { cx: 480, cy: 480, d: "funnelDot1" },
        { cx: 460, cy: 530, d: "funnelDot2" },
        { cx: 475, cy: 545, d: "funnelDot3" },
        { cx: 465, cy: 585, d: "funnelDot4" },
        { cx: 460, cy: 635, d: "funnelDot5" },
      ].map((dot) => (
        <circle
          key={dot.d}
          cx={dot.cx}
          cy={dot.cy}
          r="3"
          fill="#FF5300"
          opacity="0.5"
          className={styles[dot.d]}
        />
      ))}

      {/* Notification badges — pop in */}
      <g className={styles.badge0}>
        <rect x="470" y="168" width="50" height="22" rx="11" fill="#FF5300" opacity="0.7" />
        <text x="495" y="183" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" opacity="0.9">
          +24%
        </text>
      </g>
      <g className={styles.badge1}>
        <rect x="330" y="430" width="42" height="20" rx="10" fill="#2BCC73" opacity="0.6" />
        <text x="351" y="444" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" opacity="0.85">
          NEW
        </text>
      </g>
      <g className={styles.badge2}>
        <circle cx="528" cy="445" r="10" fill="#14B8A6" opacity="0.5" />
        <text x="528" y="449" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" opacity="0.8">
          3
        </text>
      </g>
    </svg>
  );
}

/* ── D. AI & Data — "Neural Processing" ──────────────────────────────── */

export function AIDataIllustrationLarge({ className }: IllustrationProps) {
  // Neural network layers — 4 layers, positions defined for each node
  const layers: { x: number; nodes: number[] }[] = [
    { x: 100, nodes: [200, 300, 400, 500, 600] },
    { x: 240, nodes: [220, 340, 460, 580] },
    { x: 400, nodes: [180, 300, 420, 540, 660] },
    { x: 520, nodes: [260, 400, 540] },
  ];

  // Build connection pairs
  const connections: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    layerIdx: number;
  }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    const from = layers[l];
    const to = layers[l + 1];
    for (const fy of from.nodes) {
      for (const ty of to.nodes) {
        connections.push({
          x1: from.x,
          y1: fy,
          x2: to.x,
          y2: ty,
          layerIdx: l,
        });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 600 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for output nodes */}
        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines — draw in sequentially per layer */}
      {connections.map((c, i) => (
        <line
          key={`conn-${i}`}
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke="#2BCC73"
          strokeWidth="0.8"
          opacity="0.12"
          className={styles[`neuralConn${c.layerIdx}`]}
        />
      ))}

      {/* Nodes per layer */}
      {layers.map((layer, li) =>
        layer.nodes.map((ny, ni) => (
          <g
            key={`node-${li}-${ni}`}
            className={styles[`neuralNode${li}`]}
          >
            {/* Outer ring */}
            <circle
              cx={layer.x}
              cy={ny}
              r={li === layers.length - 1 ? 16 : 12}
              stroke={li === layers.length - 1 ? "#14B8A6" : "#2BCC73"}
              strokeWidth={li === layers.length - 1 ? 2 : 1.5}
              opacity={0.5 + li * 0.1}
              filter={li === layers.length - 1 ? "url(#nodeGlow)" : undefined}
            />
            {/* Inner fill */}
            <circle
              cx={layer.x}
              cy={ny}
              r={li === layers.length - 1 ? 7 : 5}
              fill={li === layers.length - 1 ? "#14B8A6" : "#2BCC73"}
              opacity={0.2 + li * 0.05}
            />
          </g>
        )),
      )}

      {/* Data points traveling along connections — small circles */}
      {[
        { cx: 150, cy: 240, cls: "dataFlow0" },
        { cx: 170, cy: 380, cls: "dataFlow1" },
        { cx: 170, cy: 520, cls: "dataFlow2" },
        { cx: 310, cy: 270, cls: "dataFlow3" },
        { cx: 320, cy: 420, cls: "dataFlow4" },
        { cx: 320, cy: 560, cls: "dataFlow5" },
        { cx: 460, cy: 310, cls: "dataFlow6" },
        { cx: 450, cy: 480, cls: "dataFlow7" },
      ].map((dp) => (
        <circle
          key={dp.cls}
          cx={dp.cx}
          cy={dp.cy}
          r="3.5"
          fill="#FF5300"
          opacity="0.6"
          className={styles[dp.cls]}
        />
      ))}

      {/* Output layer pulsing glow rings */}
      {layers[layers.length - 1].nodes.map((ny, ni) => (
        <circle
          key={`pulse-${ni}`}
          cx={layers[layers.length - 1].x}
          cy={ny}
          r="24"
          stroke="#14B8A6"
          strokeWidth="1"
          opacity="0.15"
          className={styles.outputPulse}
        />
      ))}

      {/* Layer labels */}
      {["Input", "Hidden 1", "Hidden 2", "Output"].map((label, i) => (
        <text
          key={label}
          x={layers[i].x}
          y={140}
          textAnchor="middle"
          fill="white"
          fontSize="11"
          opacity="0.12"
          fontFamily="monospace"
          className={styles[`neuralNode${i}`]}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
