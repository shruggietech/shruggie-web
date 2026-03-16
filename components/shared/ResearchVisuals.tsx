/**
 * ResearchVisuals — Decorative SVG visuals for research publication cards.
 *
 * Extracted from ResearchSection for reuse on the /research page.
 *
 * Spec reference: ShruggieTech-Site-Design-Consistency-Plan §4.2, §6
 */

export function ADFVisual() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-48 w-48">
        {[120, 90, 60, 30].map((size, i) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 rounded-full border"
            style={{
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
              borderColor: `rgba(139, 92, 246, ${0.12 + i * 0.06})`,
              backgroundColor: `rgba(139, 92, 246, ${0.02 + i * 0.01})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function MultiAgentVisual() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="h-5 w-5 rounded-sm"
            style={{
              backgroundColor: `rgba(43, 204, 115, ${0.08 + (((i * 7 + 3) % 10) / 10) * 0.22})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function RustifVisual() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-48 w-48">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 192 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central trunk */}
          <line
            x1="96" y1="40" x2="96" y2="160"
            stroke="rgba(20, 184, 166, 0.4)"
            strokeWidth="2"
          />

          {/* Top node (head) */}
          <circle cx="96" cy="36" r="4" fill="rgba(20, 184, 166, 0.5)" />

          {/* Crab claw / forked accent at top */}
          <path
            d="M96 40 Q82 28 74 24"
            stroke="rgba(20, 184, 166, 0.4)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M96 40 Q110 28 118 24"
            stroke="rgba(20, 184, 166, 0.4)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Branch 1 — left, y=60 */}
          <line
            x1="96" y1="60" x2="38" y2="60"
            stroke="rgba(20, 184, 166, 0.25)"
            strokeWidth="1.5"
          />
          <rect x="34" y="58" width="4" height="4" fill="rgba(20, 184, 166, 0.45)" />

          {/* Branch 2 — right, y=78 */}
          <line
            x1="96" y1="78" x2="148" y2="78"
            stroke="rgba(20, 184, 166, 0.2)"
            strokeWidth="1.5"
          />
          <rect x="148" y="76" width="4" height="4" fill="rgba(20, 184, 166, 0.4)" />

          {/* Branch 3 — left, y=96 */}
          <line
            x1="96" y1="96" x2="52" y2="96"
            stroke="rgba(20, 184, 166, 0.3)"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="96" r="3" fill="rgba(20, 184, 166, 0.5)" />

          {/* Branch 4 — right, y=110 */}
          <line
            x1="96" y1="110" x2="158" y2="110"
            stroke="rgba(20, 184, 166, 0.15)"
            strokeWidth="1.5"
          />
          <rect x="158" y="108" width="4" height="4" fill="rgba(20, 184, 166, 0.35)" />

          {/* Branch 5 — both directions, y=126 */}
          <line
            x1="60" y1="126" x2="132" y2="126"
            stroke="rgba(20, 184, 166, 0.2)"
            strokeWidth="1.5"
          />
          <rect x="56" y="124" width="4" height="4" fill="rgba(20, 184, 166, 0.4)" />
          <circle cx="134" cy="126" r="3" fill="rgba(20, 184, 166, 0.45)" />

          {/* Branch 6 — left, y=144 */}
          <line
            x1="96" y1="144" x2="44" y2="144"
            stroke="rgba(20, 184, 166, 0.25)"
            strokeWidth="1.5"
          />
          <circle cx="42" cy="144" r="3" fill="rgba(20, 184, 166, 0.4)" />

          {/* Branch 7 — right, y=156 */}
          <line
            x1="96" y1="156" x2="140" y2="156"
            stroke="rgba(20, 184, 166, 0.18)"
            strokeWidth="1.5"
          />
          <rect x="140" y="154" width="4" height="4" fill="rgba(20, 184, 166, 0.38)" />
        </svg>
      </div>
    </div>
  );
}
