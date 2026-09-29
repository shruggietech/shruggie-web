type SignalFoundrySceneProps = {
  size: "desktop" | "mobile";
  className: string;
};

/** A fixed vector composition so the first paint is complete without JavaScript. */
export function SignalFoundryScene({ size, className }: SignalFoundrySceneProps) {
  const glow = `hero-signal-glow-${size}`;
  const route = `hero-signal-route-${size}`;

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
          <stop stopColor="currentColor" stopOpacity="0.19" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={route}>
          <stop stopColor="currentColor" stopOpacity="0" />
          <stop offset=".55" stopColor="currentColor" stopOpacity=".63" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".12" />
        </linearGradient>
      </defs>

      <circle cx="927" cy="350" fill={`url(#${glow})`} r="300" />

      <g data-hero-arrival="planes" fill="currentColor" stroke="currentColor">
        <path
          d="M722 143 913 113 1161 225 974 266Z"
          fillOpacity=".018"
          strokeOpacity=".14"
        />
        <path
          d="M716 514 917 445 1178 563 957 609Z"
          fillOpacity=".025"
          strokeOpacity=".2"
        />
        <path d="M913 113v119m248-7v130M716 514v-133m462 182V432" fill="none" strokeOpacity=".11" />
      </g>

      <g data-hero-arrival="routes" fill="none" stroke={`url(#${route})`} strokeWidth="1.5">
        <path d="M655 470 778 313 927 350 1086 216 1240 270" />
        <path d="M716 567 797 448 927 350 1064 473 1238 418" />
        <path d="M739 178 857 252 927 350 1117 341 1239 189" />
        <path d="M828 105 857 252 797 448 944 563 1100 590" opacity=".52" />
        <path d="M1086 216 1117 341 1064 473 1100 590" opacity=".64" />
      </g>

      <g data-hero-arrival="structure" fill="none" stroke="currentColor">
        <circle cx="927" cy="350" opacity=".25" r="137" />
        <circle cx="927" cy="350" opacity=".2" r="204" strokeDasharray="2 15" />
        <path d="M734 350h386M927 158v386" opacity=".16" />
        <path d="M797 448 857 252 1086 216 1064 473Z" opacity=".13" />
      </g>

      <g data-hero-arrival="nodes" fill="currentColor">
        <circle cx="778" cy="313" opacity=".75" r="4" />
        <circle cx="857" cy="252" opacity=".7" r="3" />
        <circle cx="797" cy="448" opacity=".7" r="3" />
        <circle cx="927" cy="350" r="5" />
        <circle cx="1086" cy="216" opacity=".8" r="4" />
        <circle cx="1117" cy="341" opacity=".8" r="3" />
        <circle cx="1064" cy="473" opacity=".8" r="4" />
        <circle cx="944" cy="563" opacity=".6" r="2" />
        <circle cx="1238" cy="418" opacity=".75" r="3" />
      </g>

      <g data-hero-signature="true" fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M835 340 868 296 898 323M956 323 986 296 1019 340" opacity=".82" strokeWidth="3" />
        <path d="M882 390Q927 426 972 390" opacity=".9" strokeWidth="3" />
        <path d="M899 343v5m53-5v5" opacity=".85" strokeWidth="6" />
      </g>

      <g data-hero-responsive="true">
        <circle cx="927" cy="350" fill="none" opacity=".18" r="176" stroke="currentColor" strokeDasharray="1 20" />
        <g fill="currentColor" opacity=".42">
          <circle cx="1225" cy="114" r="2" />
          <circle cx="1130" cy="132" r="2" />
          <circle cx="693" cy="280" r="2" />
          <circle cx="1020" cy="604" r="2" />
          <circle cx="1207" cy="610" r="2" />
        </g>
      </g>
    </svg>
  );
}
