type RadarSweepSceneProps = {
  size: "desktop" | "mobile";
  className: string;
};

/** Complete radar geometry in the server HTML; CSS reveals it on load. */
export function RadarSweepScene({ size, className }: RadarSweepSceneProps) {
  const glow = `hero-radar-glow-${size}`;
  const sweep = `hero-radar-sweep-${size}`;
  const range = `hero-radar-range-${size}`;

  return (
    <svg
      aria-hidden="true"
      className={className}
      data-hero-size={size}
      focusable="false"
      preserveAspectRatio={size === "mobile" ? "xMidYMid meet" : "xMidYMid slice"}
      viewBox={size === "mobile" ? "680 100 550 490" : "0 0 1280 690"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={glow}>
          <stop stopColor="currentColor" stopOpacity=".16" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={sweep} x1="0" x2="1" y1="1" y2="0">
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset=".7" stopColor="currentColor" stopOpacity=".05" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".27" />
        </linearGradient>
        <linearGradient id={range}>
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset=".6" stopColor="currentColor" stopOpacity=".3" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="1000" cy="345" fill={`url(#${glow})`} r="360" />

      <g fill="none" stroke="currentColor">
        <circle cx="1000" cy="345" opacity=".19" r="220" strokeWidth="1.3" />
        <circle cx="1000" cy="345" opacity=".22" r="158" />
        <circle cx="1000" cy="345" opacity=".28" r="94" />
        <circle cx="1000" cy="345" opacity=".28" r="32" />
        <path d="M780 345h440M1000 125v440" opacity=".12" />
        <path d="M844 189l312 312M844 501l312-312" opacity=".08" strokeDasharray="3 11" />
        <path d="M1000 125a220 220 0 0 1 197 122M1197 443a220 220 0 0 1-117 107M860 515a220 220 0 0 1-67-96" opacity=".57" strokeWidth="2" />
        <path d="M1000 187a158 158 0 0 1 153 118M872 437a158 158 0 0 1-18-159" opacity=".36" strokeWidth="2" />
      </g>

      <g data-hero-sweep="true">
        <path d="M1000 345 1000 125A220 220 0 0 1 1183 224Z" fill={`url(#${sweep})`} />
        <path d="M1000 345 1183 224" fill="none" opacity=".55" stroke="currentColor" strokeWidth="1.4" />
      </g>

      <g fill="none" stroke="currentColor">
        <path d="M1084 199h16m-8-8v16M1184 379h16m-8-8v16M860 442h16m-8-8v16" opacity=".75" strokeWidth="1.7" />
        <path d="M1092 199 1124 166h50M1192 379l-20 42h-72M868 442l-34 30h-31" opacity=".32" />
        <path d="M1119 166h7m45 0h7M1095 421h7M795 472h7" opacity=".7" strokeWidth="2" />
        <path d="M1092 199a108 108 0 0 1 100 180M868 442a158 158 0 0 0 224-243" opacity=".15" strokeDasharray="4 13" />
      </g>

      <g fill="currentColor">
        <circle cx="1092" cy="199" opacity=".94" r="3" />
        <circle cx="1192" cy="379" opacity=".88" r="3" />
        <circle cx="868" cy="442" opacity=".7" r="2.5" />
        <circle cx="1000" cy="345" opacity=".8" r="2" />
        <path d="M742 578h240" opacity=".24" stroke={`url(#${range})`} strokeWidth="2" />
      </g>
    </svg>
  );
}
