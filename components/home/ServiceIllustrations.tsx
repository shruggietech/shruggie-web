/**
 * ServiceIllustrations — Clean geometric SVG illustrations for each
 * service pillar in the ServicesPreview section.
 *
 * Each illustration communicates the service concept through simple,
 * recognizable line art using brand green (#2BCC73) as the primary
 * stroke color with depth from opacity and the deeper green (#00AB21).
 *
 * Style: geometric, minimal, Stripe/Linear-inspired technical line art.
 * No fills — strokes only (with a few accent exceptions).
 */

interface IllustrationProps {
  className?: string;
}

/* ── Digital Strategy & Brand ────────────────────────────────────────────
 * Brand system composition: color swatches, typography specimen lines,
 * and a circular logo placeholder — a visual brief for identity work.
 * ─────────────────────────────────────────────────────────────────────── */

export function StrategyBrandIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Color swatches — three stacked rounded squares */}
      <rect
        x="20"
        y="30"
        width="36"
        height="36"
        rx="6"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <rect
        x="20"
        y="74"
        width="36"
        height="36"
        rx="6"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <rect
        x="20"
        y="118"
        width="36"
        height="36"
        rx="6"
        stroke="#00AB21"
        strokeWidth="1.5"
        opacity="0.35"
      />

      {/* Small filled accent in first swatch */}
      <rect
        x="28"
        y="38"
        width="20"
        height="20"
        rx="3"
        fill="#2BCC73"
        opacity="0.15"
      />

      {/* Typography specimen — horizontal bars representing text lines */}
      <rect
        x="76"
        y="34"
        width="100"
        height="6"
        rx="3"
        fill="#2BCC73"
        opacity="0.7"
      />
      <rect
        x="76"
        y="50"
        width="72"
        height="4"
        rx="2"
        fill="#2BCC73"
        opacity="0.35"
      />
      <rect
        x="76"
        y="62"
        width="84"
        height="4"
        rx="2"
        fill="#2BCC73"
        opacity="0.35"
      />
      <rect
        x="76"
        y="74"
        width="60"
        height="4"
        rx="2"
        fill="#2BCC73"
        opacity="0.25"
      />

      {/* Circular logo placeholder */}
      <circle
        cx="108"
        cy="124"
        r="26"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle
        cx="108"
        cy="124"
        r="14"
        stroke="#00AB21"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Cross-hairs inside logo circle */}
      <line
        x1="108"
        y1="106"
        x2="108"
        y2="142"
        stroke="#2BCC73"
        strokeWidth="0.75"
        opacity="0.2"
      />
      <line
        x1="90"
        y1="124"
        x2="126"
        y2="124"
        stroke="#2BCC73"
        strokeWidth="0.75"
        opacity="0.2"
      />

      {/* Alignment guide lines — subtle structure */}
      <line
        x1="68"
        y1="24"
        x2="68"
        y2="160"
        stroke="#2BCC73"
        strokeWidth="0.5"
        opacity="0.12"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

/* ── Development & Integration ───────────────────────────────────────────
 * Connected module blocks with code bracket accents — small rounded
 * rectangles linked by lines, suggesting system architecture and code.
 * ─────────────────────────────────────────────────────────────────────── */

export function DevelopmentIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Code brackets — angled strokes on the left */}
      <polyline
        points="24,60 12,90 24,120"
        stroke="#2BCC73"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <polyline
        points="176,60 188,90 176,120"
        stroke="#2BCC73"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* Module block: top-center */}
      <rect
        x="72"
        y="22"
        width="56"
        height="32"
        rx="6"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Inner detail — small bars suggesting code lines */}
      <rect x="80" y="32" width="24" height="3" rx="1.5" fill="#2BCC73" opacity="0.3" />
      <rect x="80" y="39" width="16" height="3" rx="1.5" fill="#2BCC73" opacity="0.2" />

      {/* Module block: left */}
      <rect
        x="32"
        y="82"
        width="48"
        height="32"
        rx="6"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <rect x="40" y="92" width="20" height="3" rx="1.5" fill="#2BCC73" opacity="0.25" />
      <rect x="40" y="99" width="14" height="3" rx="1.5" fill="#2BCC73" opacity="0.15" />

      {/* Module block: right */}
      <rect
        x="120"
        y="82"
        width="48"
        height="32"
        rx="6"
        stroke="#2BCC73"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <rect x="128" y="92" width="20" height="3" rx="1.5" fill="#2BCC73" opacity="0.25" />
      <rect x="128" y="99" width="14" height="3" rx="1.5" fill="#2BCC73" opacity="0.15" />

      {/* Module block: bottom-center */}
      <rect
        x="72"
        y="130"
        width="56"
        height="32"
        rx="6"
        stroke="#00AB21"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <rect x="80" y="140" width="24" height="3" rx="1.5" fill="#00AB21" opacity="0.2" />
      <rect x="80" y="147" width="16" height="3" rx="1.5" fill="#00AB21" opacity="0.15" />

      {/* Connection lines — top to left */}
      <line
        x1="82"
        y1="54"
        x2="68"
        y2="82"
        stroke="#2BCC73"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Connection lines — top to right */}
      <line
        x1="118"
        y1="54"
        x2="132"
        y2="82"
        stroke="#2BCC73"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Connection lines — left to bottom */}
      <line
        x1="68"
        y1="114"
        x2="84"
        y2="130"
        stroke="#2BCC73"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Connection lines — right to bottom */}
      <line
        x1="132"
        y1="114"
        x2="116"
        y2="130"
        stroke="#2BCC73"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Small connection dots at line intersections */}
      <circle cx="82" cy="54" r="2" fill="#2BCC73" opacity="0.5" />
      <circle cx="118" cy="54" r="2" fill="#2BCC73" opacity="0.5" />
      <circle cx="68" cy="114" r="2" fill="#2BCC73" opacity="0.4" />
      <circle cx="132" cy="114" r="2" fill="#2BCC73" opacity="0.4" />
    </svg>
  );
}

/* ── Revenue Flows & Marketing Ops ───────────────────────────────────────
 * Ascending bar chart with a smooth trend line and data point dots —
 * the universal visual for "growth" and "analytics."
 * ─────────────────────────────────────────────────────────────────────── */

export function MarketingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Axis lines */}
      <line
        x1="30"
        y1="150"
        x2="180"
        y2="150"
        stroke="#2BCC73"
        strokeWidth="0.75"
        opacity="0.2"
      />
      <line
        x1="30"
        y1="30"
        x2="30"
        y2="150"
        stroke="#2BCC73"
        strokeWidth="0.75"
        opacity="0.2"
      />

      {/* Horizontal grid lines */}
      {[60, 90, 120].map((y) => (
        <line
          key={y}
          x1="30"
          y1={y}
          x2="180"
          y2={y}
          stroke="#2BCC73"
          strokeWidth="0.5"
          opacity="0.08"
        />
      ))}

      {/* Bar chart — ascending bars */}
      <rect x="42" y="130" width="16" height="20" rx="2" fill="#2BCC73" opacity="0.15" />
      <rect x="42" y="130" width="16" height="20" rx="2" stroke="#2BCC73" strokeWidth="1" opacity="0.35" />

      <rect x="68" y="112" width="16" height="38" rx="2" fill="#2BCC73" opacity="0.15" />
      <rect x="68" y="112" width="16" height="38" rx="2" stroke="#2BCC73" strokeWidth="1" opacity="0.45" />

      <rect x="94" y="100" width="16" height="50" rx="2" fill="#2BCC73" opacity="0.15" />
      <rect x="94" y="100" width="16" height="50" rx="2" stroke="#2BCC73" strokeWidth="1" opacity="0.55" />

      <rect x="120" y="78" width="16" height="72" rx="2" fill="#2BCC73" opacity="0.2" />
      <rect x="120" y="78" width="16" height="72" rx="2" stroke="#2BCC73" strokeWidth="1" opacity="0.65" />

      <rect x="146" y="52" width="16" height="98" rx="2" fill="#2BCC73" opacity="0.25" />
      <rect x="146" y="52" width="16" height="98" rx="2" stroke="#2BCC73" strokeWidth="1" opacity="0.8" />

      {/* Smooth trend line overlaying bars */}
      <path
        d="M 50 126 C 65 118, 72 108, 76 106 C 84 100, 96 92, 102 90 C 112 85, 122 72, 128 68 C 138 60, 148 46, 154 42"
        stroke="#2BCC73"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
        fill="none"
      />

      {/* Data point dots on trend line */}
      <circle cx="50" cy="126" r="2.5" fill="#2BCC73" opacity="0.6" />
      <circle cx="76" cy="106" r="2.5" fill="#2BCC73" opacity="0.6" />
      <circle cx="102" cy="90" r="2.5" fill="#2BCC73" opacity="0.7" />
      <circle cx="128" cy="68" r="2.5" fill="#2BCC73" opacity="0.8" />
      <circle cx="154" cy="42" r="3" fill="#2BCC73" opacity="0.9" />

      {/* Small upward arrow at the end of the trend */}
      <polyline
        points="148,38 154,30 160,38"
        stroke="#2BCC73"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

/* ── AI & Data Analysis ──────────────────────────────────────────────────
 * Connected node graph — circles of varying sizes linked by lines,
 * suggesting a neural network or knowledge graph topology.
 * ─────────────────────────────────────────────────────────────────────── */

export function AIDataIllustration({ className }: IllustrationProps) {
  // Node definitions: [x, y, radius, opacity]
  const nodes: [number, number, number, number][] = [
    [100, 90, 14, 0.8],   // Central hub
    [48, 44, 8, 0.5],     // Top-left
    [152, 44, 8, 0.5],    // Top-right
    [36, 108, 8, 0.45],   // Mid-left
    [164, 108, 8, 0.45],  // Mid-right
    [60, 152, 8, 0.4],    // Bottom-left
    [140, 152, 8, 0.4],   // Bottom-right
    [100, 36, 6, 0.35],   // Top-center (small)
    [100, 148, 6, 0.35],  // Bottom-center (small)
    [28, 74, 5, 0.25],    // Far-left (tiny)
    [172, 74, 5, 0.25],   // Far-right (tiny)
  ];

  // Edge definitions: [fromIndex, toIndex, opacity]
  const edges: [number, number, number][] = [
    [0, 1, 0.3],
    [0, 2, 0.3],
    [0, 3, 0.25],
    [0, 4, 0.25],
    [0, 5, 0.2],
    [0, 6, 0.2],
    [0, 7, 0.25],
    [0, 8, 0.2],
    [1, 7, 0.15],
    [2, 7, 0.15],
    [1, 3, 0.12],
    [2, 4, 0.12],
    [3, 5, 0.12],
    [4, 6, 0.12],
    [5, 8, 0.1],
    [6, 8, 0.1],
    [1, 9, 0.1],
    [2, 10, 0.1],
  ];

  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Connection edges */}
      {edges.map(([from, to, opacity], i) => (
        <line
          key={`edge-${i}`}
          x1={nodes[from][0]}
          y1={nodes[from][1]}
          x2={nodes[to][0]}
          y2={nodes[to][1]}
          stroke="#2BCC73"
          strokeWidth="1"
          opacity={opacity}
        />
      ))}

      {/* Nodes */}
      {nodes.map(([x, y, r, opacity], i) => (
        <g key={`node-${i}`}>
          {/* Outer ring */}
          <circle
            cx={x}
            cy={y}
            r={r}
            stroke="#2BCC73"
            strokeWidth={i === 0 ? 1.5 : 1}
            opacity={opacity}
          />
          {/* Inner fill — very subtle */}
          <circle
            cx={x}
            cy={y}
            r={r * 0.5}
            fill="#2BCC73"
            opacity={opacity * 0.3}
          />
        </g>
      ))}

      {/* Pulse ring on central node — suggests activity */}
      <circle
        cx={100}
        cy={90}
        r={22}
        stroke="#00AB21"
        strokeWidth="0.75"
        opacity="0.15"
      />
    </svg>
  );
}