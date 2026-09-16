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
            className="absolute top-1/2 left-1/2 rounded-full border"
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

/**
 * Wide Affective Dynamics treatment for 16:9 proof cards. The diagram turns
 * the framework's valence/arousal/dominance state model into a compact visual
 * instead of falling back to a generic category label.
 */
export function AffectiveDynamicsProofVisual() {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#0d0f13]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_48%,rgba(139,92,246,0.18),transparent_38%),radial-gradient(circle_at_18%_82%,rgba(43,204,115,0.1),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.055)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <svg
        className="relative h-full w-full"
        viewBox="0 0 520 292"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="affect-orbit" x1="102" y1="46" x2="420" y2="246">
            <stop stopColor="#8B5CF6" stopOpacity="0.72" />
            <stop offset="1" stopColor="#2BCC73" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="affect-core">
            <stop stopColor="#A78BFA" stopOpacity="0.55" />
            <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g opacity="0.42" stroke="#A78BFA" strokeWidth="1">
          <path d="M70 146H454" />
          <path d="M260 42V250" />
          <path d="M128 224L394 68" />
        </g>

        <g stroke="url(#affect-orbit)">
          <ellipse cx="260" cy="146" rx="148" ry="78" opacity="0.36" />
          <ellipse
            cx="260"
            cy="146"
            rx="104"
            ry="104"
            opacity="0.28"
            transform="rotate(28 260 146)"
          />
          <ellipse
            cx="260"
            cy="146"
            rx="76"
            ry="132"
            opacity="0.2"
            transform="rotate(-58 260 146)"
          />
        </g>

        <circle cx="260" cy="146" r="44" fill="url(#affect-core)" />
        <circle cx="260" cy="146" r="10" fill="#A78BFA" fillOpacity="0.9" />
        <circle cx="260" cy="146" r="3" fill="#F2F5FA" />

        <g stroke="#A78BFA" strokeOpacity="0.48">
          <path d="M260 146L178 96L128 154" />
          <path d="M260 146L348 102L404 142" />
          <path d="M260 146L334 214L218 232L128 154" />
        </g>

        <g>
          <circle cx="178" cy="96" r="6" fill="#8B5CF6" />
          <circle cx="128" cy="154" r="5" fill="#2BCC73" />
          <circle cx="348" cy="102" r="7" fill="#A78BFA" />
          <circle cx="404" cy="142" r="4" fill="#2BCC73" />
          <circle cx="334" cy="214" r="6" fill="#8B5CF6" />
          <circle cx="218" cy="232" r="4" fill="#2BCC73" />
        </g>

        <g
          fill="#B7BBC6"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="10"
          letterSpacing="1.4"
        >
          <text x="28" y="30" fill="#2BCC73">
            AFFECT STATE
          </text>
          <text x="28" y="48" opacity="0.65">
            RELATIONAL DYNAMICS
          </text>
          <text x="28" y="266" opacity="0.72">
            VALENCE
          </text>
          <text x="445" y="139" opacity="0.72">
            AROUSAL
          </text>
          <text x="362" y="62" opacity="0.72">
            DOMINANCE
          </text>
          <text x="428" y="238" fill="#A78BFA">
            V +0.62
          </text>
          <text x="428" y="254" fill="#A78BFA">
            A +0.48
          </text>
          <text x="428" y="270" fill="#A78BFA">
            D +0.71
          </text>
        </g>
      </svg>
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
            x1="96"
            y1="40"
            x2="96"
            y2="160"
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
            x1="96"
            y1="60"
            x2="38"
            y2="60"
            stroke="rgba(20, 184, 166, 0.25)"
            strokeWidth="1.5"
          />
          <rect
            x="34"
            y="58"
            width="4"
            height="4"
            fill="rgba(20, 184, 166, 0.45)"
          />

          {/* Branch 2 — right, y=78 */}
          <line
            x1="96"
            y1="78"
            x2="148"
            y2="78"
            stroke="rgba(20, 184, 166, 0.2)"
            strokeWidth="1.5"
          />
          <rect
            x="148"
            y="76"
            width="4"
            height="4"
            fill="rgba(20, 184, 166, 0.4)"
          />

          {/* Branch 3 — left, y=96 */}
          <line
            x1="96"
            y1="96"
            x2="52"
            y2="96"
            stroke="rgba(20, 184, 166, 0.3)"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="96" r="3" fill="rgba(20, 184, 166, 0.5)" />

          {/* Branch 4 — right, y=110 */}
          <line
            x1="96"
            y1="110"
            x2="158"
            y2="110"
            stroke="rgba(20, 184, 166, 0.15)"
            strokeWidth="1.5"
          />
          <rect
            x="158"
            y="108"
            width="4"
            height="4"
            fill="rgba(20, 184, 166, 0.35)"
          />

          {/* Branch 5 — both directions, y=126 */}
          <line
            x1="60"
            y1="126"
            x2="132"
            y2="126"
            stroke="rgba(20, 184, 166, 0.2)"
            strokeWidth="1.5"
          />
          <rect
            x="56"
            y="124"
            width="4"
            height="4"
            fill="rgba(20, 184, 166, 0.4)"
          />
          <circle cx="134" cy="126" r="3" fill="rgba(20, 184, 166, 0.45)" />

          {/* Branch 6 — left, y=144 */}
          <line
            x1="96"
            y1="144"
            x2="44"
            y2="144"
            stroke="rgba(20, 184, 166, 0.25)"
            strokeWidth="1.5"
          />
          <circle cx="42" cy="144" r="3" fill="rgba(20, 184, 166, 0.4)" />

          {/* Branch 7 — right, y=156 */}
          <line
            x1="96"
            y1="156"
            x2="140"
            y2="156"
            stroke="rgba(20, 184, 166, 0.18)"
            strokeWidth="1.5"
          />
          <rect
            x="140"
            y="154"
            width="4"
            height="4"
            fill="rgba(20, 184, 166, 0.38)"
          />
        </svg>
      </div>
    </div>
  );
}
