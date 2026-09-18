# UI contract

- `ScrollReveal` retains `children`, `delay` in seconds, `initialY` in pixels, and `className`. Rendered HTML contains no initial hiding styles. Initially visible/above-viewport content is static; only content initially below the viewport is enhanced.
- Below-viewport reveals keep the existing 600ms opacity/translateY easing. Unsupported APIs, reduced motion, focused descendants, setup errors, animation cancellation, and cleanup restore readable content.
- `PageHero` keeps its current public props and DOM layout but becomes server-rendered without a reveal dependency. Homepage hero copy and CTA destinations are unchanged.
- Services/Work pagination keeps its labels, selected state, click/swipe behavior, and tablist semantics. Button boxes are 44px square with focus rings; dots remain decorative.
- Both homepage service presentations name the specific service destination. Cookie consent links visibly say Privacy policy; cookies and accept/decline behavior are unchanged.
- Compact Latin Geist faces preserve original glyph geometry, hinting, advances, and vertical metrics. Complementary original-file Unicode faces retain all other supported characters before system fallbacks.
- Production initial HTML includes inline styles; client navigation may use external stylesheets. Initial and navigated routes must preserve appearance and the existing blog theme behavior.
