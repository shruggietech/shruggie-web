"use client";

/**
 * KnoxvilleSkyline — Detailed SVG silhouette of the Knoxville, TN skyline.
 *
 * Two tonal layers create depth: background buildings (#0a0a10) sit behind
 * foreground buildings (#0d0d14). Window grids use a slightly lighter tone
 * (#111118) for subtle detail. Key landmarks: Sunsphere with lattice tower,
 * Henley Street Bridge arches, church steeples, Art Deco tower, varied
 * downtown buildings with window patterns.
 *
 * Anchored to the bottom of its container via preserveAspectRatio="xMidYMax slice".
 * On mobile, shows the right half of the skyline (including Sunsphere) at a larger scale.
 */

import { useIsMobile } from "@/hooks/useIsMobile";

interface KnoxvilleSkylineProps {
  className?: string;
}

/* ── Window grid helper ─────────────────────────────────────────────────── */

function WindowGrid({
  x,
  y,
  cols,
  rows,
  w = 3,
  h = 3,
  gapX = 5,
  gapY = 5,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  w?: number;
  h?: number;
  gapX?: number;
  gapY?: number;
}) {
  const rects: React.ReactElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rects.push(
        <rect
          key={`${x}-${y}-${r}-${c}`}
          x={x + c * gapX}
          y={y + r * gapY}
          width={w}
          height={h}
        />
      );
    }
  }
  return <>{rects}</>;
}

export default function KnoxvilleSkyline({ className }: KnoxvilleSkylineProps) {
  const isMobile = useIsMobile();

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox={isMobile ? "700 0 740 200" : "0 0 1440 200"}
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ================================================================ */}
      {/* BACKGROUND LAYER — farther buildings (#0a0a10)                   */}
      {/* ================================================================ */}
      <g fill="#0a0a10">
        {/* Far-left low institutional / church */}
        <rect x="30" y="148" width="44" height="52" />
        <rect x="45" y="138" width="14" height="10" />
        {/* Steeple */}
        <polygon points="52,118 46,138 58,138" />

        {/* Background tower behind left cluster */}
        <rect x="108" y="72" width="24" height="128" />
        <WindowGrid x={111} y={78} cols={3} rows={18} w={2} h={2.5} gapX={6} gapY={6} />

        {/* Background mid-rise left */}
        <rect x="150" y="108" width="30" height="92" />
        <WindowGrid x={153} y={114} cols={4} rows={12} w={2} h={2} gapX={6} gapY={6} />

        {/* Background buildings behind downtown center */}
        <rect x="370" y="95" width="28" height="105" />
        <WindowGrid x={373} y={100} cols={3} rows={14} w={2.5} h={2} gapX={7} gapY={7} />

        <rect x="410" y="105" width="22" height="95" />
        <WindowGrid x={413} y={110} cols={3} rows={12} w={2} h={2} gapX={5} gapY={6} />

        {/* Background tower center-right area */}
        <rect x="830" y="78" width="26" height="122" />
        <WindowGrid x={833} y={84} cols={3} rows={16} w={2} h={2} gapX={6} gapY={6} />

        <rect x="870" y="98" width="20" height="102" />
        <WindowGrid x={873} y={104} cols={2} rows={13} w={2.5} h={2} gapX={7} gapY={6} />

        {/* Background buildings right side */}
        <rect x="1020" y="108" width="24" height="92" />
        <WindowGrid x={1023} y={114} cols={3} rows={11} w={2} h={2.5} gapX={5} gapY={6} />

        <rect x="1100" y="118" width="32" height="82" />
        <WindowGrid x={1104} y={124} cols={4} rows={10} w={2} h={2} gapX={6} gapY={6} />

        {/* Far right background */}
        <rect x="1260" y="130" width="28" height="70" />
        <rect x="1340" y="138" width="36" height="62" />
      </g>

      {/* ================================================================ */}
      {/* FOREGROUND LAYER — closer buildings (#0d0d14)                    */}
      {/* ================================================================ */}
      <g fill="#0d0d14">
        {/* ── 1. Far left: Church / institutional with steeple ────────── */}
        <rect x="55" y="135" width="50" height="65" />
        <rect x="62" y="128" width="36" height="7" />
        {/* Peaked roof */}
        <polygon points="80,108 62,128 98,128" />
        {/* Cross on steeple */}
        <rect x="78" y="100" width="4" height="10" />
        <rect x="75" y="103" width="10" height="3" />
        {/* Windows */}
        <WindowGrid x={62} y={140} cols={5} rows={7} w={3} h={3} gapX={8} gapY={7} />

        {/* ── 2. Two tall rectangular towers (left cluster) ───────────── */}
        {/* Tower A — tallest left */}
        <rect x="130" y="52" width="28" height="148" />
        {/* Rooftop detail */}
        <rect x="134" y="48" width="20" height="6" />
        <rect x="140" y="42" width="8" height="8" />
        {/* Windows */}
        <WindowGrid x={134} y={58} cols={3} rows={22} w={2.5} h={3} gapX={7} gapY={6} />

        {/* Tower B */}
        <rect x="162" y="62" width="24" height="138" />
        <rect x="165" y="58" width="18" height="6" />
        <WindowGrid x={166} y={68} cols={3} rows={19} w={2} h={2.5} gapX={6} gapY={6} />

        {/* ── 3. Mid-rise buildings with window grids ─────────────────── */}
        <rect x="190" y="100" width="32" height="100" />
        <WindowGrid x={194} y={106} cols={4} rows={13} w={2.5} h={2.5} gapX={6} gapY={6} />

        <rect x="226" y="112" width="26" height="88" />
        <WindowGrid x={229} y={118} cols={3} rows={11} w={2.5} h={2.5} gapX={6} gapY={6} />

        <rect x="256" y="105" width="28" height="95" />
        <WindowGrid x={260} y={110} cols={3} rows={12} w={2.5} h={2.5} gapX={7} gapY={6} />

        {/* ── 4. Ornamental / arched facade (Market Square) ───────────── */}
        <rect x="290" y="118" width="48" height="82" />
        {/* Arched top */}
        <path d="M290,118 Q314,102 338,118 Z" />
        {/* Decorative arched windows row */}
        <path d="M296,128 Q300,123 304,128" fill="#111118" />
        <path d="M310,128 Q314,123 318,128" fill="#111118" />
        <path d="M324,128 Q328,123 332,128" fill="#111118" />
        <WindowGrid x={296} y={136} cols={5} rows={8} w={3} h={3} gapX={8} gapY={7} />

        {/* ── 5. Art Deco tower with setbacks & antenna ───────────────── */}
        {/* Base */}
        <rect x="348" y="100" width="40" height="100" />
        {/* Setback 1 */}
        <rect x="352" y="80" width="32" height="22" />
        {/* Setback 2 */}
        <rect x="356" y="62" width="24" height="20" />
        {/* Setback 3 / crown */}
        <rect x="360" y="48" width="16" height="16" />
        {/* Decorative Art Deco crown details */}
        <polygon points="368,48 362,55 374,55" />
        <rect x="365" y="44" width="6" height="6" />
        {/* Antenna / flagpole */}
        <rect x="367" y="18" width="2" height="28" />
        {/* Flag */}
        <polygon points="369,20 379,24 369,28" />
        {/* Window grids on each setback */}
        <WindowGrid x={352} y={105} cols={5} rows={12} w={3} h={3} gapX={7} gapY={7} />
        <WindowGrid x={356} y={84} cols={4} rows={2} w={2.5} h={2.5} gapX={6} gapY={6} />
        <WindowGrid x={360} y={66} cols={3} rows={2} w={2} h={2.5} gapX={6} gapY={6} />

        {/* ── Transition buildings before bridge ──────────────────────── */}
        <rect x="395" y="120" width="24" height="80" />
        <WindowGrid x={398} y={126} cols={3} rows={10} w={2} h={2.5} gapX={6} gapY={6} />

        <rect x="424" y="130" width="30" height="70" />
        <WindowGrid x={428} y={136} cols={4} rows={8} w={2} h={2.5} gapX={6} gapY={6} />

        {/* ── Low buildings along riverbank ───────────────────────────── */}
        <rect x="460" y="155" width="40" height="45" />
        <rect x="505" y="158" width="30" height="42" />

        {/* ── 6. Henley Street Bridge — arched spans ─────────────────── */}
        {/* Bridge deck */}
        <rect x="540" y="165" width="260" height="6" />
        {/* Arch span 1 */}
        <path d="M545,171 Q590,150 635,171 Z" />
        {/* Arch span 2 */}
        <path d="M640,171 Q685,148 730,171 Z" />
        {/* Arch span 3 */}
        <path d="M735,171 Q778,152 800,171 Z" />
        {/* Bridge piers */}
        <rect x="545" y="165" width="5" height="35" />
        <rect x="633" y="165" width="5" height="35" />
        <rect x="728" y="165" width="5" height="35" />
        <rect x="795" y="165" width="5" height="35" />
        {/* Railing posts */}
        <rect x="560" y="161" width="2" height="6" />
        <rect x="580" y="161" width="2" height="6" />
        <rect x="600" y="161" width="2" height="6" />
        <rect x="620" y="161" width="2" height="6" />
        <rect x="655" y="161" width="2" height="6" />
        <rect x="675" y="161" width="2" height="6" />
        <rect x="695" y="161" width="2" height="6" />
        <rect x="715" y="161" width="2" height="6" />
        <rect x="750" y="161" width="2" height="6" />
        <rect x="770" y="161" width="2" height="6" />
        <rect x="790" y="161" width="2" height="6" />

        {/* ── 7. Dense mid-rise office cluster (right of bridge) ──────── */}
        <rect x="810" y="108" width="30" height="92" />
        <WindowGrid x={814} y={114} cols={4} rows={11} w={2} h={2.5} gapX={5} gapY={6} />

        <rect x="845" y="95" width="26" height="105" />
        <WindowGrid x={848} y={100} cols={3} rows={14} w={2.5} h={2.5} gapX={6} gapY={6} />

        <rect x="876" y="112" width="22" height="88" />
        <WindowGrid x={879} y={118} cols={3} rows={11} w={2} h={2} gapX={5} gapY={6} />

        <rect x="903" y="102" width="28" height="98" />
        <WindowGrid x={907} y={108} cols={3} rows={13} w={2.5} h={2.5} gapX={7} gapY={6} />

        <rect x="936" y="118" width="24" height="82" />
        <WindowGrid x={939} y={124} cols={3} rows={10} w={2} h={2.5} gapX={6} gapY={6} />

        {/* ── 8. Tallest building in skyline (center-right) ──────────── */}
        <rect x="965" y="35" width="34" height="165" />
        {/* Crown setback */}
        <rect x="968" y="30" width="28" height="8" />
        <rect x="972" y="24" width="20" height="8" />
        <rect x="978" y="18" width="8" height="8" />
        {/* Windows — dense grid */}
        <WindowGrid x={969} y={42} cols={4} rows={22} w={2.5} h={3} gapX={7} gapY={6.5} />

        {/* ── Buildings between tallest and Sunsphere ─────────────────── */}
        <rect x="1005" y="92" width="26" height="108" />
        <WindowGrid x={1008} y={98} cols={3} rows={14} w={2.5} h={2.5} gapX={6} gapY={6} />

        <rect x="1036" y="105" width="22" height="95" />
        <WindowGrid x={1039} y={110} cols={3} rows={12} w={2} h={2.5} gapX={5} gapY={6} />

        <rect x="1063" y="115" width="28" height="85" />
        <WindowGrid x={1067} y={120} cols={3} rows={10} w={2.5} h={2.5} gapX={7} gapY={7} />

        {/* ── 9. Sunsphere — sphere atop lattice tower ───────────────── */}
        {/* Observation platform */}
        <rect x="1112" y="72" width="20" height="5" rx="1" />

        {/* Lattice / truss tower */}
        {/* Main verticals */}
        <rect x="1116" y="75" width="3" height="125" />
        <rect x="1125" y="75" width="3" height="125" />
        {/* Cross-bracing (X pattern) */}
        <line x1="1116" y1="80" x2="1128" y2="95" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="80" x2="1116" y2="95" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1116" y1="95" x2="1128" y2="110" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="95" x2="1116" y2="110" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1116" y1="110" x2="1128" y2="125" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="110" x2="1116" y2="125" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1116" y1="125" x2="1128" y2="140" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="125" x2="1116" y2="140" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1116" y1="140" x2="1128" y2="155" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="140" x2="1116" y2="155" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1116" y1="155" x2="1128" y2="170" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="155" x2="1116" y2="170" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1116" y1="170" x2="1128" y2="185" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="170" x2="1116" y2="185" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1116" y1="185" x2="1128" y2="200" stroke="#0d0d14" strokeWidth="1.5" />
        <line x1="1128" y1="185" x2="1116" y2="200" stroke="#0d0d14" strokeWidth="1.5" />
        {/* Horizontal ties */}
        <line x1="1116" y1="95" x2="1128" y2="95" stroke="#0d0d14" strokeWidth="1" />
        <line x1="1116" y1="110" x2="1128" y2="110" stroke="#0d0d14" strokeWidth="1" />
        <line x1="1116" y1="125" x2="1128" y2="125" stroke="#0d0d14" strokeWidth="1" />
        <line x1="1116" y1="140" x2="1128" y2="140" stroke="#0d0d14" strokeWidth="1" />
        <line x1="1116" y1="155" x2="1128" y2="155" stroke="#0d0d14" strokeWidth="1" />
        <line x1="1116" y1="170" x2="1128" y2="170" stroke="#0d0d14" strokeWidth="1" />
        <line x1="1116" y1="185" x2="1128" y2="185" stroke="#0d0d14" strokeWidth="1" />

        {/* Wider base */}
        <polygon points="1110,200 1112,175 1132,175 1134,200" />

        {/* Sphere */}
        <circle cx="1122" cy="56" r="18" />
        {/* Sphere highlight ring (subtle inner detail) */}
        <circle cx="1122" cy="56" r="14" fill="none" stroke="#111118" strokeWidth="0.8" />
        <circle cx="1122" cy="56" r="9" fill="none" stroke="#111118" strokeWidth="0.5" />
        {/* Equatorial band */}
        <line x1="1104" y1="56" x2="1140" y2="56" stroke="#111118" strokeWidth="0.6" />

        {/* ── 10. Right-side buildings & far-right church steeple ─────── */}
        <rect x="1150" y="120" width="28" height="80" />
        <WindowGrid x={1154} y={126} cols={3} rows={10} w={2.5} h={2.5} gapX={7} gapY={6} />

        <rect x="1183" y="110" width="24" height="90" />
        <WindowGrid x={1186} y={116} cols={3} rows={11} w={2} h={2.5} gapX={6} gapY={6} />

        <rect x="1212" y="128" width="30" height="72" />
        <WindowGrid x={1216} y={134} cols={4} rows={8} w={2} h={2.5} gapX={6} gapY={7} />

        {/* Low institutional building */}
        <rect x="1250" y="145" width="42" height="55" />
        <WindowGrid x={1254} y={150} cols={5} rows={6} w={2.5} h={3} gapX={7} gapY={7} />

        {/* Far-right church with steeple */}
        <rect x="1300" y="138" width="40" height="62" />
        <rect x="1310" y="130" width="20" height="10" />
        {/* Peaked roof */}
        <polygon points="1320,112 1310,130 1330,130" />
        {/* Cross */}
        <rect x="1318" y="104" width="4" height="10" />
        <rect x="1315" y="107" width="10" height="3" />
        <WindowGrid x={1306} y={144} cols={4} rows={6} w={3} h={3} gapX={8} gapY={7} />

        {/* Far-right low buildings */}
        <rect x="1350" y="152" width="34" height="48" />
        <rect x="1390" y="158" width="50" height="42" />
      </g>

      {/* ================================================================ */}
      {/* WINDOW GRID OVERLAY — lighter tone for depth (#111118)           */}
      {/* ================================================================ */}
      <g fill="#111118">
        {/* Background layer windows are rendered inline above.             */}
        {/* Foreground layer windows are rendered inline above.             */}
        {/* This group left intentionally for any shared decorative lines. */}

        {/* Subtle ground line to unify the base */}
        <rect x="0" y="198" width="1440" height="2" />
      </g>
    </svg>
  );
}
