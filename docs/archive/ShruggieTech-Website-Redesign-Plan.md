<a name="shruggietech-homepage-updates-plan" id="shruggietech-homepage-updates-plan"></a>
# ShruggieTech Homepage Updates Plan

| Attribute | Value |
|-----------|-------|
| Subject | Homepage UX Feedback Remediation |
| Version | 1.0.0 |
| Date | 2026-03-14 |
| Status | PROPOSED |
| Audience | AI-first, Human-second |
| Scope | Hero, Services, Work, and CTA sections of the homepage |
| Depends On | ShruggieTech-Website-Redesign-Plan.md v1.0.0, shruggie-web repository (current main) |

<a name="table-of-contents" id="table-of-contents"></a>
<hr class="print-page-break">

## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Hero Section Updates](#1-hero-section-updates)
  - [1.1. Shruggie Easter Egg — Corner-Based Hide and Seek](#11-shruggie-easter-egg)
  - [1.2. Shruggie Easter Egg — Green Dot Color](#12-shruggie-green-dots)
  - [1.3. Mobile Responsive Fixes](#13-mobile-responsive-fixes)
- [2. What We Do Section Updates](#2-what-we-do-section-updates)
  - [2.1. Reduce Vertical Gap Between Heading and Content](#21-reduce-vertical-gap)
  - [2.2. SVG Illustration Draw-On Tied to Active Card](#22-svg-draw-on-per-card)
  - [2.3. Fix Broken Learn More Links](#23-fix-learn-more-links)
  - [2.4. Snappier Scroll Transitions](#24-snappier-scroll-transitions)
  - [2.5. Clickable Progress Dots with Tooltips](#25-clickable-progress-dots)
  - [2.6. Mobile — Use Large SVG Illustrations](#26-mobile-large-svgs)
- [3. Our Work Section Updates](#3-our-work-section-updates)
  - [3.1. Reduce Vertical Gap Between Heading and Content](#31-reduce-vertical-gap-work)
  - [3.2. Snappier Scroll Transitions](#32-snappier-scroll-transitions-work)
  - [3.3. Fix Broken Read Case Study Links](#33-fix-case-study-links)
  - [3.4. Clickable Progress Dots with Tooltips](#34-clickable-progress-dots-work)
  - [3.5. Client Logos — Remove Label and Left Align](#35-client-logos-rework)
- [4. CTA Section — Knoxville Skyline Redesign](#4-cta-section-redesign)
  - [4.1. Visual Concept — Assessment and Recommendation](#41-visual-concept)
  - [4.2. Implementation Architecture](#42-implementation-architecture)
- [5. Implementation Sequencing](#5-implementation-sequencing)
  - [5.1. Prompt Sequence Overview](#51-prompt-sequence)
  - [5.2. Prompt 1 — Hero Section Fixes](#52-prompt-1)
  - [5.3. Prompt 2 — Services Section Scroll and Link Fixes](#53-prompt-2)
  - [5.4. Prompt 3 — Services Section SVG and Mobile Rework](#54-prompt-3)
  - [5.5. Prompt 4 — Work Section Fixes](#55-prompt-4)
  - [5.6. Prompt 5 — CTA Section Redesign](#56-prompt-5)
- [6. Files Affected](#6-files-affected)

<a name="executive-summary" id="executive-summary"></a>
<hr class="print-page-break">

## Executive Summary

<div style="text-align:justify">

This plan addresses 18 discrete feedback items across four homepage sections: Hero, What We Do (Services), Our Work, and the bottom CTA. The feedback falls into five categories: (1) broken interactivity (non-clickable links, progress dots with no navigation), (2) animation timing issues (sluggish scroll transitions, SVGs that animate on page load instead of on visibility), (3) spatial layout problems (excessive whitespace between section headings and pinned content), (4) mobile-specific regressions (oversized H1, overwhelming spotlight, missing large SVG illustrations), and (5) a visual redesign of the CTA section background.

</div>

<div style="text-align:justify">

The work is organized into five sequential prompts, each scoped to be completable in a single Claude Opus 4.6 session in VS Code. Each prompt is self-contained with all necessary context, file paths, and acceptance criteria. The prompts are ordered to minimize cross-cutting dependency conflicts: hero first (isolated component), then services scroll/link fixes, then services SVG/mobile, then work section (mirrors services patterns), and finally the CTA redesign (standalone).

</div>

---

<a name="1-hero-section-updates" id="1-hero-section-updates"></a>
<hr class="print-page-break">

## 1. Hero Section Updates

<a name="11-shruggie-easter-egg" id="11-shruggie-easter-egg"></a>
### 1.1. Shruggie Easter Egg — Corner-Based Hide and Seek

**Current behavior:** The shruggie spawns at a random position anywhere within the hero section (excluding a central exclusion zone over the headline and CTAs). When discovered and scared, it flees to another random position, also anywhere within the section. This makes it relatively easy to stumble upon during normal cursor movement.

**Target behavior:** The shruggie spawns in one of the four corners of the hero section and, when scared, flees to one of the other three corners (never the same corner it fled from). This creates a more deliberate hide-and-seek dynamic where casual cursor movement over the main content area will not reveal it.

**Implementation approach:**

<div style="text-align:justify">

Replace the `randomShruggiePosition` function in `components/home/HeroBackground.tsx` with a corner-based positioning system. Define four corner anchor points with padding insets (approximately 60-80px from each edge to keep the shruggie fully visible). Maintain a `currentCorner` index on the shruggie ref state. On initial spawn, pick a random corner (0-3). On flee, pick a random corner from the remaining three. The exclusion zone logic for avoiding hero text can be removed since corners are inherently outside the central content area.

</div>

**Constants to add:**

```
CORNER_INSET = 80          // px from viewport edge
SHRUGGIE_CORNERS = [
  { corner: 'top-left' },
  { corner: 'top-right' },
  { corner: 'bottom-left' },
  { corner: 'bottom-right' },
]
```

**Shruggie ref additions:** Add `currentCorner: number` (0-3) to the shruggie state ref.

**Position calculation:** Given the canvas dimensions `w` and `h`, the shruggie point cloud bounding box, and `CORNER_INSET`, each corner resolves to a concrete `(x, y)` coordinate. The bounding box of the point cloud must be accounted for so the entire shruggie image sits within the visible canvas area.

<a name="12-shruggie-green-dots" id="12-shruggie-green-dots"></a>
### 1.2. Shruggie Easter Egg — Green Dot Color

**Current behavior:** The shruggie dots render in white when the site is in dark mode, and a dark green (`rgb(22, 130, 68)`) in light mode. The color is selected via `isDarkRef.current` in the draw loop.

**Target behavior:** The shruggie dots should always render in the brand green (`#2BCC73`, which is `rgb(43, 204, 115)`), regardless of the current theme. This makes the shruggie feel like a branded element rather than a ghost in the dot grid.

**Implementation:** Replace the conditional color selection in the shruggie dot draw block with a single constant green color. Remove the `isDarkRef`-based conditional for shruggie dot color (the base dot grid should continue to use theme-adaptive colors). The specific line to change is in the draw callback where shruggie dots are rendered, near the comment `// Pick color based on current theme`.

<a name="13-mobile-responsive-fixes" id="13-mobile-responsive-fixes"></a>
### 1.3. Mobile Responsive Fixes

**Issue 1 — H1 text too large on mobile.** The `text-display-xl` class applies a large font size that works on desktop but overwhelms the mobile viewport. The fix is to add a responsive step-down: use a smaller display size on mobile and scale up to `display-xl` at the `md` breakpoint. Recommended: `text-display-md md:text-display-xl` on the `<h1>` element in `HeroSection.tsx`.

**Issue 2 — Spotlight (dot grid) too dominant on mobile.** The interactive dot grid on mobile uses ambient drift (since there is no cursor). The current configuration produces a wide glowing region that reads as a "wall of glowing dots." Fixes:

- Reduce `AMBIENT_DRIFT_RADIUS` by approximately 40% when the viewport width is below 768px. This can be done by reading a `isMobile` flag (already available via the `useIsMobile` hook pattern) and applying a multiplier to the radius constant.
- Alternatively (and more cleanly, since `HeroBackground` is a canvas component without React state hooks for resize), detect viewport width at resize time and store it on a ref. Apply a `0.6` multiplier to `AMBIENT_DRIFT_RADIUS` and a `0.7` multiplier to `DOT_HOVER_ALPHA` when the canvas width is below 768px. This keeps the ambient drift effect but makes it subtler.

**Issue 3 — Remove shruggie easter egg on mobile.** The shruggie relies on cursor proximity to reveal, which does not translate to touch. The ambient drift can accidentally reveal it, which is confusing. Guard the shruggie initialization and rendering with a viewport width check. If the canvas width at resize time is below 768px, skip loading the shruggie image, skip all shruggie update logic in the animation loop, and skip shruggie dot rendering. Reset the shruggie state if the viewport transitions from desktop to mobile during a session.

---

<a name="2-what-we-do-section-updates" id="2-what-we-do-section-updates"></a>
<hr class="print-page-break">

## 2. What We Do Section Updates

<a name="21-reduce-vertical-gap" id="21-reduce-vertical-gap"></a>
### 2.1. Reduce Vertical Gap Between Heading and Content

<div style="text-align:justify">

The `ServicesScroll` component currently renders the section heading (`SectionHeading` with label "WHAT WE DO" and title "Full-stack capability, studio-scale delivery.") above the GSAP-pinned viewport area. The heading sits inside its own `div` with generous vertical padding (`py-[var(--section-gap)]` on the outer section, plus `var(--component-gap)` margin on the heading wrapper). When the user scrolls past the heading and into the pinned zone, the pinned content (cards + illustrations) occupies a full viewport height, but the heading is already scrolled out of view, leaving the impression of excessive blank space between heading and content.

</div>

**Fix approach:** Reduce the top padding on the section container and shrink the gap between the heading block and the pinned area. Specifically:

- Change the section's vertical padding from `py-[var(--section-gap)]` to `pt-[var(--section-gap)] pb-0` (the pinned area handles its own vertical centering).
- Reduce the bottom margin of the heading wrapper. Currently the heading is followed by the pinned `div`; adjust the spacing between them from `var(--component-gap)` (48-64px) down to approximately `32px`.
- Alternatively, incorporate the heading into the pinned area itself as a persistent element that remains visible above the cycling cards. This would eliminate the gap entirely. However, this requires more invasive changes to the GSAP timeline. The simpler padding reduction is recommended first; if it still feels too gappy, the persistent heading approach can be explored as a follow-up.

**Affected file:** `components/home/ServicesScroll.tsx`

<a name="22-svg-draw-on-per-card" id="22-svg-draw-on-per-card"></a>
### 2.2. SVG Illustration Draw-On Tied to Active Card

**Current behavior:** The `ServiceIllustrationsLarge` components use CSS `@keyframes` animations (defined in `ServiceIllustrationsLarge.module.css`) with fixed `animation-delay` values. These animations fire immediately when the component mounts (page load). If the user has not yet scrolled to the services section, the draw-on animations complete invisibly.

**Target behavior:** Each SVG illustration should draw/redraw when its corresponding card becomes the active frame in the scroll sequence. When the user scrolls to card 2, the card 2 illustration should begin its draw-on animation fresh. If the user scrolls back to card 1, card 1's illustration should redraw.

**Implementation approach:**

<div style="text-align:justify">

The CSS animations currently use `animation-fill-mode: forwards` with absolute delays. To make them retriggerable, switch from CSS `@keyframes` with `animation` properties to a class-toggled approach. When a card becomes active (detected via the `currentFrame` state in `ServicesScroll`), add a CSS class (e.g., `is-animating`) to the illustration wrapper. When the card becomes inactive, remove the class. The CSS animations should be gated behind this class.

</div>

**Concrete steps:**

1. In `ServiceIllustrationsLarge.module.css`, wrap all animation declarations inside a parent selector like `.animating .lineSegment0 { ... }`. When the `.animating` class is absent, elements should have their initial state (opacity: 0, transform: scaleY(0), etc.) but no animation.
2. In `ServicesScroll.tsx`, the GSAP timeline's `onUpdate` callback already tracks `currentFrame`. Use this to add/remove an `is-animating` (or `data-animating="true"`) attribute on the corresponding illustration `div[data-illustration]`.
3. To force a re-trigger when revisiting a card, briefly remove and re-add the animating class. A simple pattern: when `currentFrame` changes, set all illustrations to non-animating, then on the next frame (`requestAnimationFrame`), set the new active illustration to animating. This causes the browser to restart the CSS animations.

**Affected files:** `ServiceIllustrationsLarge.module.css`, `ServicesScroll.tsx`

<a name="23-fix-learn-more-links" id="23-fix-learn-more-links"></a>
### 2.3. Fix Broken Learn More Links

**Current behavior:** The "Learn more" links for cards 1-3 (Digital Strategy & Brand, Development & Integration, Revenue Flows & Marketing Ops) are not clickable. Additionally, a stray "AI & Data Analysis" link appears beneath each of those three cards.

**Root cause analysis:**

<div style="text-align:justify">

This is almost certainly a z-index / pointer-events / stacking issue caused by the GSAP-pinned frame layout. The four service frames are absolutely positioned and overlaid within the pinned container. All four frames exist in the DOM simultaneously; GSAP controls their opacity to show/hide them. If the fourth frame (AI & Data Analysis) is rendered on top with `opacity: 0` but still has `pointer-events: auto`, its "Learn more" link captures clicks intended for the visible frame underneath. The stray "AI & Data Analysis" text appearing below other cards confirms this: it is the fourth frame's content bleeding through.

</div>

**Fix:**

1. Add `pointer-events: none` to all frames by default.
2. Add `pointer-events: auto` only to the currently active frame.
3. In the GSAP timeline, when transitioning between frames, ensure the outgoing frame receives `pointer-events: none` at the start of its fade-out, and the incoming frame receives `pointer-events: auto` when it reaches full opacity.
4. Alternatively (simpler), use the `currentFrame` React state to conditionally apply `pointer-events-none` / `pointer-events-auto` classes. Since `currentFrame` is already tracked, add a `className` conditional on each frame's wrapper: `pointer-events-${index === currentFrame ? 'auto' : 'none'}`.
5. Additionally verify that each frame has `position: absolute` and `inset: 0` so they properly overlay rather than stacking in document flow.

**Affected file:** `components/home/ServicesScroll.tsx`

<a name="24-snappier-scroll-transitions" id="24-snappier-scroll-transitions"></a>
### 2.4. Snappier Scroll Transitions

**Current behavior:** Scrolling between service cards produces a slow crossfade where card 1 gradually becomes transparent while card 2 slowly fades in. Multiple scroll inputs are required to complete a transition. The effect feels sluggish and indeterminate.

**Target behavior:** Transitions should feel decisive. A single deliberate scroll gesture should commit to the next card. The crossfade should be tight, not a long dissolve.

**Implementation changes:**

1. **Reduce GSAP scrub value.** The current `scrub: 0.6` means the animation lags 0.6 seconds behind scroll position. Reduce to `scrub: 0.3` or `scrub: true` (instant sync) for more responsive feel.
2. **Tighten snap behavior.** The current snap configuration uses `duration: { min: 0.3, max: 0.8 }`. Tighten to `duration: { min: 0.2, max: 0.5 }` and ensure `ease: "power2.inOut"` for a crisp settle.
3. **Reduce transition overlap in the timeline.** The GSAP timeline allocates scroll distance for each card transition. If the fade-out of card N overlaps significantly with the fade-in of card N+1, the user sees both cards semi-transparent simultaneously. Restructure the timeline so that each card's exit and the next card's entrance happen within a narrower scroll band. Use a 15-20% overlap at most rather than a 40-50% overlap.
4. **Consider instant cut with a subtle slide** as an alternative to crossfade. Instead of opacity crossfade, have the outgoing card slide slightly up (20-30px) while fading out quickly (over 10% of scroll distance), and the incoming card slide up from below while fading in (also 10%). The remaining 80% of the scroll segment shows the settled card at full opacity.

**Affected file:** `components/home/ServicesScroll.tsx`

<a name="25-clickable-progress-dots" id="25-clickable-progress-dots"></a>
### 2.5. Clickable Progress Dots with Tooltips

**Current behavior:** The `SectionProgress` component renders dots as a `progressbar` with visual state but no interactive elements. Dots are not clickable and have no tooltip.

**Target behavior:** Each dot should be a clickable button that scrolls to the corresponding card. Each dot should display a tooltip on hover showing the section name (e.g., "Digital Strategy & Brand").

**Implementation changes to `SectionProgress`:**

1. Change the component's `role` from `progressbar` to `tablist` (matching the mobile carousel's dot pattern).
2. Replace the `<span>` dots with `<button>` elements, each with `role="tab"`, `aria-selected`, and `aria-label`.
3. Accept a new prop: `labels: string[]` containing the display name for each section.
4. Accept a new prop: `onSelect: (index: number) => void` callback for when a dot is clicked.
5. Add a CSS tooltip on hover. Use a `title` attribute for simplicity, or a custom positioned tooltip element for better styling control. A custom tooltip (absolutely positioned `<span>` with `opacity-0 group-hover:opacity-100` transition) is recommended for visual consistency with the site's aesthetic.
6. Tooltip should appear to the right of the dot (since the progress bar is on the left edge of the viewport).

**Wiring in `ServicesScroll`:** Pass the service titles as `labels`, pass a callback that uses `gsap.to(window, { scrollTo: ... })` or Lenis `scrollTo()` to programmatically scroll to the appropriate snap point for the selected card. The snap point for card `i` can be calculated as `(i / (totalFrames - 1)) * scrollTriggerEnd`.

**Affected files:** `components/ui/SectionProgress.tsx`, `components/home/ServicesScroll.tsx`

<a name="26-mobile-large-svgs" id="26-mobile-large-svgs"></a>
### 2.6. Mobile — Use Large SVG Illustrations

**Current behavior:** The mobile `ServicesCarousel` component imports and renders the small `ServiceIllustrations` (original smaller versions) inside each card. The gorgeous `ServiceIllustrationsLarge` animations are desktop-only.

**Target behavior:** Remove the old small illustrations from inside the cards. Place the large SVG illustrations (`ServiceIllustrationsLarge`) above the swipeable card strip. When the user swipes to a new card, the illustration above transitions to match (crossfade or instant swap), and the draw-on animation triggers fresh.

**Implementation approach:**

<div style="text-align:justify">

In `ServicesCarousel.tsx`, add a fixed illustration display area above the scroll strip. This area renders a single `ServiceIllustrationsLarge` component corresponding to `activeIndex`. When `activeIndex` changes (tracked by the existing `IntersectionObserver`), swap the illustration and trigger the draw-on animation. Use the same class-toggle mechanism described in §2.2 for animation retriggering.

</div>

**Layout change:** The carousel becomes two zones stacked vertically:
1. **Top zone (illustration):** Approximately 200-250px tall, centered. Shows the active card's large SVG with draw-on animation.
2. **Bottom zone (cards):** The existing snap-scroll strip, but with the inline small illustrations removed from each card. Cards now contain only the number watermark, icon, title, description, and link.

**Affected files:** `components/home/ServicesCarousel.tsx`

---

<a name="3-our-work-section-updates" id="3-our-work-section-updates"></a>
<hr class="print-page-break">

## 3. Our Work Section Updates

<div style="text-align:justify">

Items 3.1 through 3.4 mirror the corresponding services section fixes (§2.1, §2.4, §2.3, §2.5). The root causes and implementation patterns are identical, applied to `WorkScroll.tsx` and `WorkCarousel.tsx` instead of their services counterparts.

</div>

<a name="31-reduce-vertical-gap-work" id="31-reduce-vertical-gap-work"></a>
### 3.1. Reduce Vertical Gap Between Heading and Content

Same approach as §2.1. Reduce padding between the "OUR WORK" / "Real results for real businesses." heading block and the pinned scroll area in `WorkScroll.tsx`. Change the section's bottom padding to `pb-0` and tighten the margin between heading and pinned container.

**Affected file:** `components/home/WorkScroll.tsx`

<a name="32-snappier-scroll-transitions-work" id="32-snappier-scroll-transitions-work"></a>
### 3.2. Snappier Scroll Transitions

Same approach as §2.4. Reduce `scrub` value, tighten `snap` duration, and reduce crossfade overlap in the GSAP timeline for `WorkScroll.tsx`.

**Affected file:** `components/home/WorkScroll.tsx`

<a name="33-fix-case-study-links" id="33-fix-case-study-links"></a>
### 3.3. Fix Broken Read Case Study Links

Same root cause as §2.3. The "Read case study" links for cards 1-2 (United Way, Scruggs Tire) are not clickable, and a stray "I Heart PR Tours" link appears beneath them. Fix by adding `pointer-events: none` to inactive frames and `pointer-events: auto` to the active frame, keyed off `currentFrame` state.

**Affected file:** `components/home/WorkScroll.tsx`

<a name="34-clickable-progress-dots-work" id="34-clickable-progress-dots-work"></a>
### 3.4. Clickable Progress Dots with Tooltips

Same approach as §2.5. Pass case study client names as `labels` to the `SectionProgress` component and wire up `onSelect` to scroll to the appropriate snap point. The `SectionProgress` component changes from §2.5 are shared (only need to be done once).

**Affected file:** `components/home/WorkScroll.tsx`

<a name="35-client-logos-rework" id="35-client-logos-rework"></a>
### 3.5. Client Logos — Remove Label and Left Align

**Current behavior:** The `ClientLogos` component renders a "TRUSTED BY" label above a centered flex row of client logos.

**Target behavior:** Remove the "TRUSTED BY" text entirely. Make the logos slightly larger (increase from `h-6 md:h-8 lg:h-10` to `h-8 md:h-10 lg:h-12`). Left-align the logos instead of center-aligning (change `justify-center` to `justify-start`).

**Affected file:** `components/home/WorkScroll.tsx` (the `ClientLogos` sub-component)

---

<a name="4-cta-section-redesign" id="4-cta-section-redesign"></a>
<hr class="print-page-break">

## 4. CTA Section — Knoxville Skyline Redesign

<a name="41-visual-concept" id="41-visual-concept"></a>
### 4.1. Visual Concept — Assessment and Recommendation

<div style="text-align:justify">

The current CTA section uses an orange gradient bloom with a giant shruggie emoticon watermark. The shruggie watermark at 3-5% opacity is barely perceptible and does not add meaningful personality, and the section overall feels generic. The founder's instinct toward a Knoxville skyline with a network-node starry sky is a strong direction. It ties ShruggieTech to its physical home (Knoxville, TN), reinforces the "Made in the USA" identity marker, and gives the section a distinctive visual signature that no other tech studio's CTA will have.

</div>

**Recommended approach: Detailed SVG Knoxville skyline silhouette with particle-node sky.**

**Reference image provided:** A high-detail black silhouette of the Knoxville skyline (see `docs/assets/knoxville-skyline-reference.png`). This is the target fidelity level, not a simplified geometric abstraction.

<div style="text-align:justify">

The skyline should be rendered as a detailed SVG silhouette matching the complexity of the reference image. This means individual building shapes with visible window grids, architectural details (cornices, setbacks, rooftop equipment), the Sunsphere with its lattice tower structure, bridge arches (Henley Street Bridge), church steeples, and varied building heights across the full downtown profile. No mountain ridge or background layer behind the buildings; the skyline stands alone against the particle sky. The SVG will consist of multiple `<path>` and `<rect>` elements composited together rather than a single simplified path. The skyline sits at the bottom 20-25% of the section, rendered in a slightly lighter shade than the background (e.g., `#0d0d14` buildings against `#060608` section background) with subtle tonal variation between foreground and background building layers for depth.

</div>

**Landmark inventory from the reference (left to right):**

1. A church or institutional building with a small steeple (far left)
2. Two tall rectangular towers (likely residential/office, tallest structures on the left cluster)
3. Several mid-rise buildings with varied profiles and window grids
4. A distinctive arched/ornamental facade (Market Square area or similar)
5. A tall Art Deco-style tower with setbacks and a flag/antenna
6. The Henley Street Bridge arches (low horizontal, center)
7. A dense cluster of mid-rise office buildings with detailed window patterns
8. The tallest building in the skyline (likely the Plaza Tower or similar, center-right)
9. The Sunsphere with its spherical observation deck on a lattice/truss tower (right of center)
10. Lower institutional buildings and a church steeple (far right)

**The sky above the skyline** uses a particle field of small dots (2-3px, white at 5-15% opacity) scattered randomly, with a subset connected by faint lines (the network-node motif from the hero section, echoed at a smaller scale). This creates visual continuity with the hero's dot grid DNA without duplicating it. A handful of dots can pulse slowly (opacity oscillation over 4-6 seconds, staggered) to simulate twinkling. The particle field renders via CSS (absolutely positioned dots with randomized positions and animation delays) rather than canvas, keeping the implementation lightweight and the CTA text crisply above it all. On mobile, reduce the particle count by 50-60% and disable the connecting lines.

**The orange bloom is retained** but repositioned: instead of centering behind the CTA button, center it at the horizon line (where the skyline meets the sky). This creates a warm glow effect as if the city is lit from within, adding atmosphere without competing with the CTA text.

**Why this over other options:**

- A canvas-based animation was already tried and removed for performance and complexity reasons. CSS/SVG keeps things light.
- The Knoxville identity is a genuine differentiator. The "Made in the USA" marker already signals geographic pride; the skyline makes it tangible.
- The network-node motif in the sky creates a bookend with the hero section, giving the page a sense of visual closure.

<a name="42-implementation-architecture" id="42-implementation-architecture"></a>
### 4.2. Implementation Architecture

**SVG Skyline Component (`components/home/KnoxvilleSkyline.tsx`):**

<div style="text-align:justify">

A self-contained SVG component that renders the detailed Knoxville skyline silhouette. The SVG uses `viewBox` with `preserveAspectRatio="xMidYMax slice"` to anchor the skyline to the bottom of its container and scale horizontally without distortion. Unlike a simplified geometric approach, this component uses multiple layered `<path>`, `<rect>`, and `<circle>` elements to render individual buildings with window grids, the Sunsphere's lattice tower, bridge arches, and church steeples at a fidelity level matching the provided reference image. The component should use two tonal layers for depth: background buildings at `#0a0a10` and foreground buildings at `#0d0d14`, both against the section background of `#060608`. No mountain ridge or background terrain. The reference image should be traced or faithfully recreated as SVG paths. The SVG should be approximately 150-200px tall at its tallest point and span 100% width.

</div>

**Particle Sky Component (`components/home/ParticleSky.tsx`):**

<div style="text-align:justify">

A CSS-only particle field. Pre-generate 40-60 dot positions (percentage-based for responsiveness) and render them as absolutely positioned `<span>` elements with randomized opacity (0.05-0.15), size (1.5-3px), and twinkle animation delays. Connect 8-12 pairs of nearby dots with thin SVG `<line>` elements at 8-10% opacity. Use `prefers-reduced-motion` to disable twinkle animations. On mobile (detected via a media query in CSS), hide the connecting lines and reduce dot count by hiding every other dot with `nth-child`.

</div>

**Section assembly:**

```
<section className="relative overflow-hidden bg-[#060608]">
  <!-- Particle sky: absolutely positioned, full section coverage -->
  <ParticleSky />

  <!-- Orange bloom: repositioned to horizon line -->
  <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
    <div className="cta-bloom ..." />
  </div>

  <!-- CTA content: centered, above everything -->
  <div className="relative z-10 container-narrow text-center py-32">
    <h2>Ready to build something?</h2>
    <p>...</p>
    <ShruggieCTA href="/contact">Let's Talk</ShruggieCTA>
  </div>

  <!-- Skyline: anchored to bottom -->
  <KnoxvilleSkyline className="absolute bottom-0 left-0 w-full" />
</section>
```

---

<a name="5-implementation-sequencing" id="5-implementation-sequencing"></a>
<hr class="print-page-break">

## 5. Implementation Sequencing

<a name="51-prompt-sequence" id="51-prompt-sequence"></a>
### 5.1. Prompt Sequence Overview

| Prompt | Scope | Sections Addressed | Primary Files |
|--------|-------|--------------------|---------------|
| 1 | Hero section fixes | §1.1, §1.2, §1.3 | `HeroBackground.tsx`, `HeroSection.tsx` |
| 2 | Services scroll, link, and spacing fixes | §2.1, §2.3, §2.4, §2.5 | `ServicesScroll.tsx`, `SectionProgress.tsx` |
| 3 | Services SVG retrigger and mobile rework | §2.2, §2.6 | `ServiceIllustrationsLarge.module.css`, `ServicesScroll.tsx`, `ServicesCarousel.tsx` |
| 4 | Work section fixes (mirrors Prompt 2 + 3 patterns) | §3.1 through §3.5 | `WorkScroll.tsx`, `WorkCarousel.tsx` |
| 5 | CTA section redesign | §4.1, §4.2 | `CTASection.tsx`, new `KnoxvilleSkyline.tsx`, new `ParticleSky.tsx` |

<a name="52-prompt-1" id="52-prompt-1"></a>
### 5.2. Prompt 1 — Hero Section Fixes

**Scope:** Shruggie easter egg corner-based positioning, green dot color, mobile H1 sizing, mobile spotlight reduction, and mobile shruggie removal.

**Key context for the agent:**

<div style="text-align:justify">

The `HeroBackground.tsx` component is a single self-contained file (~400 lines) that manages the canvas-based dot grid and the shruggie easter egg entirely within a `useCallback`-based draw loop. The shruggie state lives on a `useRef` object. All configuration constants are at the top of the file. The agent needs to: (1) replace `randomShruggiePosition` with a corner-based system, (2) force green dot color for the shruggie, (3) add responsive text sizing to the `<h1>` in `HeroSection.tsx`, (4) detect mobile viewport in the canvas resize handler and adjust ambient drift radius / dot opacity, and (5) gate shruggie initialization and rendering behind a mobile check.

</div>

**Acceptance criteria:**

- Shruggie always spawns in one of the four hero corners (with ~80px inset).
- On flee, shruggie travels to a different corner (never the same one).
- Shruggie dots are always brand green (`#2BCC73`) regardless of theme.
- H1 text is `display-md` on mobile, `display-xl` on `md`+ breakpoints.
- Dot grid spotlight on mobile is noticeably smaller and dimmer than desktop.
- Shruggie does not appear or load on viewports below 768px.
- No regressions to desktop dot grid behavior.

<a name="53-prompt-2" id="53-prompt-2"></a>
### 5.3. Prompt 2 — Services Section Scroll and Link Fixes

**Scope:** Fix broken Learn More links, snappier scroll transitions, reduced heading-to-content gap, and clickable progress dots with tooltips.

**Key context for the agent:**

<div style="text-align:justify">

The `ServicesScroll.tsx` component uses GSAP ScrollTrigger with a pinned container. Four service frames are rendered as siblings inside the pinned area, with GSAP controlling their opacity. The `SectionProgress` component needs to be upgraded from a passive indicator to an interactive navigation element. The link/pointer-events bug is caused by transparent frames stacking and capturing clicks.

</div>

**Acceptance criteria:**

- All four "Learn more" links are clickable and navigate to the correct `/services#anchor`.
- No stray text from other cards appears beneath any card.
- Scrolling between cards feels immediate (no long dissolve, no need to scroll repeatedly).
- Progress dots are clickable; clicking dot N scrolls to card N.
- Hovering over a progress dot shows a tooltip with the service name.
- The vertical gap between "WHAT WE DO" heading and the first card content is visibly reduced.

<a name="54-prompt-3" id="54-prompt-3"></a>
### 5.4. Prompt 3 — Services Section SVG and Mobile Rework

**Scope:** SVG illustrations draw/redraw per active card, and mobile carousel uses large SVG illustrations.

**Key context for the agent:**

<div style="text-align:justify">

The `ServiceIllustrationsLarge` components are four separate React components, each containing inline SVG with CSS module classes for animation (490+ lines of CSS in `ServiceIllustrationsLarge.module.css`). Animations use `animation-delay` and `animation-fill-mode: forwards`. The mobile carousel (`ServicesCarousel.tsx`) currently imports the small `ServiceIllustrations` and renders them inline within each card. The agent needs to refactor the CSS to be class-toggled, wire the toggle to `currentFrame` in desktop, and restructure the mobile carousel to display illustrations above the card strip.

</div>

**Acceptance criteria:**

- On desktop, each SVG illustration animates (draws on) when its card becomes active.
- Scrolling back to a previous card re-triggers its illustration animation.
- On mobile, the large SVG illustrations appear above the card strip.
- Old small inline illustrations are removed from mobile cards.
- Swiping to a new card in the mobile carousel triggers the corresponding large SVG animation.

<a name="55-prompt-4" id="55-prompt-4"></a>
### 5.5. Prompt 4 — Work Section Fixes

**Scope:** All work section feedback items: gap reduction, snappy transitions, fix broken links, clickable progress dots, and client logo rework.

**Key context for the agent:**

<div style="text-align:justify">

The `WorkScroll.tsx` component follows the same GSAP-pinned pattern as `ServicesScroll.tsx`. The same bugs (pointer-events on overlapping frames, sluggish crossfade, non-interactive progress dots) apply here with identical root causes. The `SectionProgress` component will already have been upgraded in Prompt 2. The `ClientLogos` sub-component is defined within `WorkScroll.tsx`. The case study data comes from `lib/case-studies.ts`.

</div>

**Acceptance criteria:**

- All "Read case study" links are clickable and navigate correctly.
- No stray link text from other case studies appears beneath any card.
- Scroll transitions between case studies are snappy (matching the services section feel).
- Progress dots are clickable with tooltips showing case study client names.
- Vertical gap between "OUR WORK" heading and content is visibly reduced.
- "TRUSTED BY" label is removed.
- Client logos are larger and left-aligned.

<a name="56-prompt-5" id="56-prompt-5"></a>
### 5.6. Prompt 5 — CTA Section Redesign

**Scope:** Replace the shruggie watermark background with a Knoxville skyline silhouette and particle-node sky.

**Key context for the agent:**

<div style="text-align:justify">

The `CTASection.tsx` is a straightforward section component with an orange gradient bloom `div`, a shruggie watermark `span`, and centered CTA content. The agent needs to: remove the shruggie watermark, create a new `KnoxvilleSkyline.tsx` SVG component with a detailed Knoxville skyline matching the reference image at `docs/assets/knoxville-skyline-reference.png`, create a `ParticleSky.tsx` CSS-based particle field, reposition the orange bloom to the horizon line, and assemble everything in the updated `CTASection.tsx`. The skyline must include individual building silhouettes with window grids, the Sunsphere with its lattice tower, bridge arches, church steeples, and varied architectural profiles. No mountain ridge or background terrain. Two tonal layers for depth (foreground and background buildings).

</div>

**Acceptance criteria:**

- A detailed, recognizable Knoxville skyline silhouette spans the bottom of the CTA section.
- Key landmarks are identifiable: Sunsphere (lattice tower + sphere), bridge arches, church steeples, varied downtown buildings with window details.
- No mountain ridge or background terrain behind the buildings.
- Two tonal layers create depth between foreground and background buildings.
- A subtle particle field with occasional connecting lines fills the sky above the skyline.
- The orange bloom glows from the horizon line, creating a "city glow" effect.
- The shruggie watermark is removed.
- CTA text and button remain fully legible and the primary focus.
- Particles respect `prefers-reduced-motion` (static, no twinkle).
- On mobile, particle count is reduced and connecting lines are hidden.
- The skyline scales gracefully across viewport widths without distortion.

---

<a name="6-files-affected" id="6-files-affected"></a>
<hr class="print-page-break">

## 6. Files Affected

| File | Prompt | Nature of Change |
|------|--------|-----------------|
| `components/home/HeroBackground.tsx` | 1 | Shruggie corner positioning, green dots, mobile spotlight reduction, mobile shruggie removal |
| `components/home/HeroSection.tsx` | 1 | Responsive H1 text sizing |
| `components/ui/SectionProgress.tsx` | 2 | Upgrade to interactive dots with tooltips, `labels` and `onSelect` props |
| `components/home/ServicesScroll.tsx` | 2, 3 | Fix pointer-events, tighten GSAP timing, reduce heading gap, wire progress dot callbacks, SVG animation retrigger |
| `components/home/ServiceIllustrationsLarge.module.css` | 3 | Refactor animations to be class-toggled instead of auto-firing |
| `components/home/ServicesCarousel.tsx` | 3 | Replace inline small SVGs with above-strip large SVGs, animation retrigger on swipe |
| `components/home/WorkScroll.tsx` | 4 | Fix pointer-events, tighten GSAP timing, reduce heading gap, wire progress dots, rework ClientLogos |
| `components/home/CTASection.tsx` | 5 | Remove shruggie watermark, integrate skyline and particle sky, reposition bloom |
| `components/home/KnoxvilleSkyline.tsx` | 5 | New file — SVG skyline silhouette component |
| `components/home/ParticleSky.tsx` | 5 | New file — CSS-based particle field with connecting lines |
