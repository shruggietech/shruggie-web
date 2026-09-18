# UI contract

- `ScrollReveal` retains `children`, `delay` in seconds, `initialY` in pixels, and `className`. Rendered HTML contains no initial hiding styles. Initially visible/above-viewport content is static; only content initially below the viewport is enhanced.
- Below-viewport reveals keep the existing 600ms opacity/translateY easing. Unsupported APIs, reduced motion, focused descendants, setup errors, animation cancellation, and cleanup restore readable content.
- `PageHero` keeps its current public props and DOM layout but becomes server-rendered without a reveal dependency. Homepage hero copy and CTA destinations are unchanged.
- Services/Work pagination keeps its labels, selected state, click/swipe behavior, and tablist semantics. Button boxes are 44px square with focus rings; dots remain decorative.
- Both homepage service presentations name the specific service destination. Cookie consent links visibly say Privacy policy; cookies and accept/decline behavior are unchanged.
- Compact common Geist/Geist Mono/Space Grotesk faces preserve retained glyph geometry, hinting, advances, and vertical metrics, including the macron in the site's mark. Standard shaping/kerning is retained; unused optional stylistic sets are excluded. Complementary original-file Unicode faces retain all other supported characters before system fallbacks.
- Shared skyline images preserve the exact desktop/mobile artwork and crops, using explicit dimensions and responsive CSS without window-grid hydration. Generated assets must match authoritative artwork.
- Native illustration observation retains one-time triggers, reduced-motion changes, and failure fallbacks. The process accordion preserves one selected phase and matching diagram/ARIA state; inactive panels are inert. CSS transitions respect reduced motion.
- Tailwind scans all runtime templates and content, excluding planning documents. External stylesheets remain cached independently. Initial and navigated routes must preserve appearance and the existing blog theme behavior.
