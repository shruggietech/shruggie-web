<a name="shruggietech-homepage-updates-plan-v2" id="shruggietech-homepage-updates-plan-v2"></a>
# ShruggieTech Homepage Updates Plan (v2)

| Attribute | Value |
|-----------|-------|
| Subject | Homepage UX Polish — Transitions, Sizing, and Research Section |
| Version | 1.0.0 |
| Date | 2026-03-16 |
| Status | PROPOSED |
| Audience | AI-first, Human-second |
| Scope | Hero, What We Do, Our Work, and Research sections of the homepage |
| Depends On | shruggie-web repository (current main), ShruggieTech-Website-Redesign-Plan.md v1.0.0 |

<a name="table-of-contents" id="table-of-contents"></a>
<hr class="print-page-break">

## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Hero Section](#1-hero-section)
  - [1.1. Shruggie Easter Egg — Reduce Size](#11-shruggie-easter-egg-reduce-size)
- [2. What We Do Section](#2-what-we-do-section)
  - [2.1. Smooth Card Transitions — Sequential Fade](#21-smooth-card-transitions-sequential-fade)
  - [2.2. Larger SVG Illustrations on Desktop](#22-larger-svg-illustrations-on-desktop)
  - [2.3. Learn More Hover Color — Orange](#23-learn-more-hover-color-orange)
- [3. Our Work Section](#3-our-work-section)
  - [3.1. Smooth Card Transitions — Sequential Fade](#31-smooth-card-transitions-sequential-fade)
  - [3.2. Larger Device Mockups on Desktop](#32-larger-device-mockups-on-desktop)
  - [3.3. Read Case Study Hover Color — Orange](#33-read-case-study-hover-color-orange)
- [4. Research Section](#4-research-section)
  - [4.1. rustif Declaration — Add Decorative Graphic](#41-rustif-declaration-add-decorative-graphic)
  - [4.2. Full-Card Clickability](#42-full-card-clickability)
- [5. Implementation Sequencing](#5-implementation-sequencing)
  - [5.1. Prompt Sequence Overview](#51-prompt-sequence-overview)
  - [5.2. Prompt 1 — Hero and Transition Overhaul](#52-prompt-1)
  - [5.3. Prompt 2 — Desktop Sizing and Hover Colors](#53-prompt-2)
  - [5.4. Prompt 3 — Research Section Polish](#54-prompt-3)
- [6. Files Affected](#6-files-affected)

<a name="executive-summary" id="executive-summary"></a>
<hr class="print-page-break">

## Executive Summary

<div style="text-align:justify">

This plan addresses 9 discrete feedback items across four homepage sections: Hero, What We Do (Services), Our Work, and Research. The feedback falls into four categories: (1) sizing adjustments (shruggie easter egg too large, SVG illustrations and device mockups underutilizing desktop space), (2) transition quality (card cycling in both Services and Work sections feels jerky and needs smooth sequential fade-out/fade-in with no overlapping text), (3) hover interactivity (link hover states should use ShruggieTech orange), and (4) Research section polish (missing rustif graphic, cards should be fully clickable).

</div>

<div style="text-align:justify">

The work is organized into three sequential prompts, each scoped to be completable in a single Claude Opus 4.6 session in VS Code. The prompts are ordered by dependency: transition mechanics first (since they touch GSAP timeline logic), then sizing and color tweaks (CSS-only, low risk), then Research section changes (isolated component).

</div>

---

<a name="1-hero-section" id="1-hero-section"></a>
<hr class="print-page-break">

## 1. Hero Section

<a name="11-shruggie-easter-egg-reduce-size" id="11-shruggie-easter-egg-reduce-size"></a>
### 1.1. Shruggie Easter Egg — Reduce Size

<div style="text-align:justify">

**Current behavior:** The shruggie easter egg is rendered at `SHRUGGIE_RENDER_SIZE = 110` CSS pixels with a `SHRUGGIE_SAMPLE_STEP = 2`, producing a dot cloud that occupies roughly 110×110px on screen. The dot cloud is composed of sampled pixels from `logo-icon-only-green.png`, drawn at the target render size and then sampled every 2 pixels. The result is recognizable and detailed but feels slightly oversized relative to the dot grid.

</div>

**Target behavior:** Reduce the shruggie to approximately 75-80% of its current size while preserving visual fidelity. The icon should remain clearly recognizable when revealed by the spotlight.

**Implementation approach:**

<div style="text-align:justify">

Reduce `SHRUGGIE_RENDER_SIZE` from `110` to `85` in `components/home/HeroBackground.tsx`. This is the single constant that controls the drawn size of the image on the offscreen sampling canvas. The `SHRUGGIE_SAMPLE_STEP` of `2` should remain unchanged to preserve dot density at the new size. The `SHRUGGIE_CORNER_INSET` of `80` should be reduced proportionally to approximately `65` so the smaller icon does not appear to float too far from the corner. The `SHRUGGIE_REVEAL_RADIUS` of `180` should be reduced to approximately `140` so the reveal zone scales with the smaller footprint, preventing premature reveals from distant cursor proximity.

</div>

**Constants to change:**

| Constant | Current | Proposed | Rationale |
|----------|---------|----------|-----------|
| `SHRUGGIE_RENDER_SIZE` | `110` | `85` | ~77% of original, preserves recognizability |
| `SHRUGGIE_CORNER_INSET` | `80` | `65` | Proportional reduction so icon stays near corners |
| `SHRUGGIE_REVEAL_RADIUS` | `180` | `140` | Tighter reveal zone matches smaller footprint |
| `SHRUGGIE_SAMPLE_STEP` | `2` | `2` | No change; maintains dot density |

**Affected file:** `components/home/HeroBackground.tsx`

---

<a name="2-what-we-do-section" id="2-what-we-do-section"></a>
<hr class="print-page-break">

## 2. What We Do Section

<a name="21-smooth-card-transitions-sequential-fade" id="21-smooth-card-transitions-sequential-fade"></a>
### 2.1. Smooth Card Transitions — Sequential Fade

<div style="text-align:justify">

**Current behavior:** The GSAP timeline in `ServicesScroll.tsx` uses overlapping fade-out/fade-in animations. Card N fades out over `duration: 0.4` starting at timeline position `i`, while Card N+1 fades in over `duration: 0.4` starting at `i + 0.2`. This creates a 0.2-unit overlap window where both cards are partially visible. Even though the overlap is brief, it produces a "jerky" feel because during the crossfade window the user can see fragments of two different text blocks simultaneously, which reads as visual noise rather than a smooth transition.

</div>

**Target behavior:** A strict sequential transition where Card N is fully gone before Card N+1 begins appearing. The transition should feel smooth and deliberate, not abrupt. The recommended approach is a "fade to black" pattern: Card N fades out completely, there is a very brief pause at zero opacity (1-2 frames, just enough to guarantee no overlap), then Card N+1 fades in. The total transition time should remain similar to the current speed so the scrolling cadence is preserved.

**Implementation approach:**

<div style="text-align:justify">

Restructure the GSAP timeline so that each card-to-card segment is divided into two strictly non-overlapping phases within a 1.0 unit segment:

</div>

1. **Phase A (0.0 to 0.35):** Outgoing card fades from opacity 1 to 0, with a slight upward slide of -20px. Easing: `power2.in`.
2. **Dead zone (0.35 to 0.45):** Both cards at opacity 0. No animation plays. This 0.1-unit gap guarantees zero text overlap at any scroll position, including mid-scrub.
3. **Phase B (0.45 to 0.80):** Incoming card fades from opacity 0 to 1, with a slight upward slide from +20px to 0px. Easing: `power2.out`.
4. **Hold (0.80 to 1.0):** Incoming card rests at full opacity. Provides a scroll-distance buffer before the next transition begins.

<div style="text-align:justify">

The key constraint is that at no point during any scroll position should two cards have opacity greater than 0 simultaneously. The dead zone guarantees this. The slide distance is reduced from the current 30/60px to 20px to keep the motion subtle.

</div>

**SVG illustration sync:** The `ServiceIllustrationsLarge` crossfade must follow the same sequential pattern. The outgoing illustration fades out during Phase A, the incoming illustration fades in during Phase B. The `is-animating` class toggle for CSS entrance animations should fire at the start of Phase B (timeline position `i + 0.45`).

**Reduced motion:** When `prefers-reduced-motion` is active, the component already falls back to `ServicesCarousel` (a static mobile-style carousel). No changes needed for that path.

**Affected files:** `components/home/ServicesScroll.tsx`

<a name="22-larger-svg-illustrations-on-desktop" id="22-larger-svg-illustrations-on-desktop"></a>
### 2.2. Larger SVG Illustrations on Desktop

<div style="text-align:justify">

**Current behavior:** The pinned layout in `ServicesScroll` splits the viewport into a left content column (55%) and a right illustration column (45%). The `ServiceIllustrationsLarge` SVGs have `width="100%"` and `height="100%"` within their container, but the container itself is constrained by padding, max-width limits, and the content wrapper. The illustrations visually "float" inside the right column with noticeable whitespace around them.

</div>

**Target behavior:** The SVG illustrations should fill more of the available right-column space on desktop. The left column text layout must not change at all (no size, position, or spacing changes). Only the right-column illustration container should expand.

**Implementation approach:**

<div style="text-align:justify">

The illustration wrapper inside each service frame currently sits within the content container's max-width. To let the illustrations breathe, adjust the illustration container to occupy more of the right half:

</div>

1. Increase the right column's allocated width from `45%` to `50%` (changing the split from 55/45 to 50/50 or even 48/52). The left column text content already has its own max-width constraint, so giving the right column more room does not affect the text layout.
2. Remove or reduce any internal padding on the illustration wrapper. If the current wrapper has `p-4` or `p-8` type padding, strip it so the SVG can expand closer to the container edges.
3. Ensure the SVG container uses `max-h-[85vh]` to prevent the illustrations from exceeding viewport height, while allowing them to fill most of the vertical space.
4. The `viewBox="0 0 600 800"` on each SVG is preserved. The SVGs scale proportionally via `width="100%" height="100%"` with `preserveAspectRatio` defaulting to `xMidYMid meet`, which will naturally fill the larger container.

**Constraint:** Do not modify any text sizing, font sizes, spacing, or positioning in the left column. Do not modify mobile or reduced-motion layouts.

**Affected files:** `components/home/ServicesScroll.tsx` (layout classes on the frame wrapper divs)

<a name="23-learn-more-hover-color-orange" id="23-learn-more-hover-color-orange"></a>
### 2.3. Learn More Hover Color — Orange

<div style="text-align:justify">

**Current behavior:** The "Learn more →" links use `text-accent` (brand green `#2BCC73`) as the resting color and `hover:text-accent-hover` as the hover color. The `accent-hover` token is a lighter green. The hover state blends into the resting state.

</div>

**Target behavior:** On hover, the "Learn more →" links should change to ShruggieTech orange (`#FF5300`).

**Implementation approach:**

<div style="text-align:justify">

Replace `hover:text-accent-hover` with `hover:text-brand-orange` (or the equivalent Tailwind token mapped to `#FF5300`) on the "Learn more →" `<Link>` elements in `ServicesScroll.tsx`. If no Tailwind token for brand orange exists, add `--color-brand-orange: #FF5300` to the CSS custom properties and map it in `tailwind.config.ts`, or use the direct class `hover:text-[#FF5300]` as a quick solution. The resting color (`text-accent`, brand green) remains unchanged.

</div>

**Affected files:** `components/home/ServicesScroll.tsx` (link className), possibly `styles/globals.css` and `tailwind.config.ts` if a new token is needed.

---

<a name="3-our-work-section" id="3-our-work-section"></a>
<hr class="print-page-break">

## 3. Our Work Section

<a name="31-smooth-card-transitions-sequential-fade" id="31-smooth-card-transitions-sequential-fade"></a>
### 3.1. Smooth Card Transitions — Sequential Fade

<div style="text-align:justify">

**Current behavior:** Identical to the Services section. The `WorkScroll.tsx` GSAP timeline uses the same overlapping fade pattern (Card N fades out at position `i`, Card N+1 fades in at `i + 0.2`, producing a 0.2-unit overlap). The same jerky double-text artifact occurs.

</div>

**Target behavior:** Same as §2.1. Strict sequential fade-out/fade-in with a dead zone, zero text overlap at any scroll position.

**Implementation approach:**

<div style="text-align:justify">

Apply the identical GSAP timeline restructuring described in §2.1 to `WorkScroll.tsx`. The timeline structure, phase durations, easing, and dead zone width should all match the Services section for visual consistency across the homepage. The `DeviceMockup` images in the right column follow the same fade pattern as the `ServiceIllustrationsLarge` SVGs.

</div>

**Affected files:** `components/home/WorkScroll.tsx`

<a name="32-larger-device-mockups-on-desktop" id="32-larger-device-mockups-on-desktop"></a>
### 3.2. Larger Device Mockups on Desktop

<div style="text-align:justify">

**Current behavior:** The `WorkScroll` pinned layout uses a 50/50 split with the case study text on the left and a `DeviceMockup` (browser chrome frame with case study screenshot) on the right. The mockup is sized within a container that includes padding and max-width constraints, leaving visible whitespace around the device frame.

</div>

**Target behavior:** The device mockups should fill more of the right column. The left column text layout must not change.

**Implementation approach:**

<div style="text-align:justify">

Mirror the approach from §2.2. Expand the right column's illustration/mockup container by reducing internal padding and allowing the `DeviceMockup` component to use more of the available space. The `DeviceMockup` component itself uses an `aspect-video` or similar aspect ratio constraint that should be preserved, but its max-width should increase. Consider changing from `max-w-lg` or similar to `max-w-xl` or `max-w-2xl`, or removing the max-width entirely and letting the mockup fill the container width (the browser chrome frame provides its own visual boundary).

</div>

**Constraint:** Do not modify text sizing, spacing, or positioning in the left column. Do not modify mobile or carousel layouts.

**Affected files:** `components/home/WorkScroll.tsx` (layout classes on frame wrapper divs and DeviceMockup container)

<a name="33-read-case-study-hover-color-orange" id="33-read-case-study-hover-color-orange"></a>
### 3.3. Read Case Study Hover Color — Orange

<div style="text-align:justify">

**Current behavior:** The "Read case study →" links use the same `text-accent` / `hover:text-accent-hover` pattern as the Services section links.

</div>

**Target behavior:** On hover, the link color changes to ShruggieTech orange (`#FF5300`), matching the Services section change in §2.3.

**Implementation approach:** Replace `hover:text-accent-hover` with `hover:text-brand-orange` (or `hover:text-[#FF5300]`) on the link elements.

**Affected files:** `components/home/WorkScroll.tsx` (link className)

---

<a name="4-research-section" id="4-research-section"></a>
<hr class="print-page-break">

## 4. Research Section

<a name="41-rustif-declaration-add-decorative-graphic" id="41-rustif-declaration-add-decorative-graphic"></a>
### 4.1. rustif Declaration — Add Decorative Graphic

<div style="text-align:justify">

**Current behavior:** The `ResearchSection` component renders three publication cards, each with a decorative abstract visual in the right column (desktop only). The ADF card uses `ADFVisual` (concentric purple circles representing emotional state dimensions). The Multi-Agent Guide uses `MultiAgentVisual` (a 5×5 grid of green squares with varied opacity representing agent coordination patterns). The rustif Declaration uses `RustifVisual`, which renders 10 horizontal bars of varying width in teal at low opacity. This treatment is the weakest of the three: it reads as generic placeholder bars rather than conveying anything specific about rustif's identity as a Rust-native metadata processing engine.

</div>

**Target behavior:** Replace `RustifVisual` with a more distinctive graphic that communicates the concept of metadata parsing, structured data extraction, or systems-level Rust engineering, while maintaining the same abstract, minimal aesthetic as the other two visuals.

**Recommended design — "Crab Claw Parse Tree":**

<div style="text-align:justify">

A stylized tree structure rendered in teal (`#14B8A6`) that evokes both a data parse tree (metadata being broken into structured fields) and a subtle nod to Rust's crab mascot (Ferris). The graphic consists of a central vertical trunk line with branching horizontal segments at staggered heights, each terminating in small squares or dots (representing extracted metadata fields). At the top of the tree, two short curved lines diverge outward like claw pincers, giving the faintest suggestion of a crab silhouette without being literal. The overall shape reads as "structured data hierarchy with Rust flavor."

</div>

**Implementation details:**

<div style="text-align:justify">

Replace the `RustifVisual` function in `components/home/ResearchSection.tsx`. The new component should use inline SVG or a set of absolutely positioned `<div>` elements (consistent with how `ADFVisual` and `MultiAgentVisual` are built). The container size should match the other visuals (roughly `h-48 w-48` centered in the right column). Use `rgba(20, 184, 166, ...)` as the color base with opacity variation between 0.15 and 0.5 for depth. The graphic must be purely decorative (`aria-hidden="true"` is already handled by the parent).

</div>

**Alternative designs (if the crab parse tree is too literal):**

<div style="text-align:justify">

Option B is a "Binary Gear" consisting of two interlocking gear outlines rendered in teal stroke, with binary digits (0/1) scattered at low opacity around the perimeter, representing the engine/processing nature of rustif. Option C is a "Metadata Tag Stack" consisting of a vertical stack of 5-6 rounded rectangles of decreasing width (like a narrowing funnel), each containing a short horizontal bar representing a key-value pair, with connecting lines between them suggesting hierarchical relationships. Either option maintains the abstract, minimal aesthetic.

</div>

**Affected files:** `components/home/ResearchSection.tsx` (replace `RustifVisual` function)

<a name="42-full-card-clickability" id="42-full-card-clickability"></a>
### 4.2. Full-Card Clickability

<div style="text-align:justify">

**Current behavior:** Each research card renders a "Read paper →" link as a separate `<Link>` element within the card body. The card itself has a hover treatment (the `Card` component supports a `hover` prop that adds a border/shadow transition on hover), so the visual feedback suggests the entire card is interactive. But clicking anywhere outside the link text does nothing.

</div>

**Target behavior:** The entire card should be clickable and navigate to `/research`. Clicking anywhere on the card (text, visual, whitespace) should function identically to clicking the "Read paper →" link.

**Implementation approach:**

<div style="text-align:justify">

Wrap each card's content in a Next.js `<Link>` element that covers the full card area. Two patterns work here:

</div>

**Pattern A (preferred) — Link wraps Card:**

<div style="text-align:justify">

Replace the outer `<Card>` element with a `<Link href="/research">` that contains the card styling. The `<Card>` component can be rendered inside the `<Link>`, or the link itself can receive the card classes. Remove the standalone "Read paper →" `<Link>` from inside the card body and replace it with a styled `<span>` that visually matches but is not an interactive element (since the parent link already handles navigation). This avoids nested `<a>` tags, which are invalid HTML.

</div>

**Pattern B — CSS overlay link:**

<div style="text-align:justify">

Keep the card structure as-is. Add a `<Link>` with `className="absolute inset-0 z-10"` inside the card (with `position: relative` on the card wrapper). This creates a transparent overlay that captures all clicks. The "Read paper →" text element becomes a visual-only `<span>`. This pattern is simpler to implement but requires ensuring the overlay does not interfere with text selection.

</div>

**Either pattern must:**

- Produce valid HTML (no nested `<a>` elements).
- Preserve the existing hover visual treatment on the card.
- Maintain keyboard accessibility (the card should be focusable and activatable via Enter).
- Keep the `ScrollReveal` animation wrapper intact.

**Affected files:** `components/home/ResearchSection.tsx`

---

<a name="5-implementation-sequencing" id="5-implementation-sequencing"></a>
<hr class="print-page-break">

## 5. Implementation Sequencing

<a name="51-prompt-sequence-overview" id="51-prompt-sequence-overview"></a>
### 5.1. Prompt Sequence Overview

| Prompt | Scope | Sections Addressed | Primary Files |
|--------|-------|--------------------|---------------|
| 1 | Transition overhaul + shruggie sizing | §1.1, §2.1, §3.1 | `HeroBackground.tsx`, `ServicesScroll.tsx`, `WorkScroll.tsx` |
| 2 | Desktop sizing + hover colors | §2.2, §2.3, §3.2, §3.3 | `ServicesScroll.tsx`, `WorkScroll.tsx`, possibly `globals.css` |
| 3 | Research section polish | §4.1, §4.2 | `ResearchSection.tsx` |

<a name="52-prompt-1" id="52-prompt-1"></a>
### 5.2. Prompt 1 — Hero and Transition Overhaul

**Scope:** Shruggie easter egg size reduction, Services card transition rework, Work card transition rework.

**Key context for the agent:**

<div style="text-align:justify">

The `HeroBackground.tsx` component has all shruggie configuration constants at the top of the file. The three constants to change are `SHRUGGIE_RENDER_SIZE`, `SHRUGGIE_CORNER_INSET`, and `SHRUGGIE_REVEAL_RADIUS`. No logic changes are required, only constant value updates.

</div>

<div style="text-align:justify">

The `ServicesScroll.tsx` component uses GSAP ScrollTrigger with a pinned container. The current timeline loop runs `for (let i = 0; i < totalFrames - 1; i++)` and creates two overlapping tweens per transition (a `tl.to` for fade-out starting at position `i`, and a `tl.fromTo` for fade-in starting at `i + 0.2`). The agent must restructure this loop so that each segment's fade-out completes before the fade-in begins, with a dead zone between them. The SVG illustration crossfade must also follow this sequential pattern. The `is-animating` class toggle must fire at the start of the fade-in phase.

</div>

<div style="text-align:justify">

The `WorkScroll.tsx` component has an identical GSAP structure. The agent should apply the same timeline restructuring. The right-column content is a `DeviceMockup` instead of an SVG illustration, but the fade pattern is the same.

</div>

**Acceptance criteria:**

- Shruggie easter egg is visibly smaller than before without appearing distorted or losing recognizability.
- Scrolling through the "What We Do" section produces clean sequential transitions where Card N is fully invisible before Card N+1 begins appearing.
- At no scroll position are two service cards simultaneously partially visible.
- SVG illustration transitions are synchronized with card text transitions (same sequential pattern).
- The "Our Work" section uses the same transition pattern as "What We Do."
- Scrolling speed/cadence feels consistent with the current site (no slower, no faster).
- No regressions to mobile carousel behavior or reduced-motion fallback.

<a name="53-prompt-2" id="53-prompt-2"></a>
### 5.3. Prompt 2 — Desktop Sizing and Hover Colors

**Scope:** Larger SVG illustrations in Services, larger device mockups in Work, orange hover color on "Learn more" and "Read case study" links.

**Key context for the agent:**

<div style="text-align:justify">

The `ServicesScroll.tsx` frame layout uses Tailwind classes to split the viewport into left (text) and right (illustration) columns. The agent needs to identify the specific flex/grid classes controlling column widths and adjust only the right column. The `ServiceIllustrationsLarge` SVGs already use `width="100%" height="100%"` so they will naturally scale to fill a larger container.

</div>

<div style="text-align:justify">

The `WorkScroll.tsx` frame layout follows the same pattern. The `DeviceMockup` component may have its own max-width constraint that needs to be relaxed.

</div>

<div style="text-align:justify">

For hover colors, the brand orange is `#FF5300`. Check whether a Tailwind token already exists for this color (the brand palette includes orange per KB §10.1). If a token like `brand-orange` or `text-brand-orange` exists, use it. If not, create one or use an arbitrary value class.

</div>

**Acceptance criteria:**

- SVG illustrations in the "What We Do" section are noticeably larger on desktop, filling more of the right column.
- Device mockups in the "Our Work" section are noticeably larger on desktop.
- Left-column text layout is completely unchanged in both sections (font sizes, line heights, spacing, positioning).
- "Learn more →" links turn orange (`#FF5300`) on hover.
- "Read case study →" links turn orange (`#FF5300`) on hover.
- Mobile layouts are not affected by any of these changes.

<a name="54-prompt-3" id="54-prompt-3"></a>
### 5.4. Prompt 3 — Research Section Polish

**Scope:** New rustif Declaration decorative graphic, full-card clickability for all three research cards.

**Key context for the agent:**

<div style="text-align:justify">

The `ResearchSection.tsx` component defines three visual components (`ADFVisual`, `MultiAgentVisual`, `RustifVisual`) and maps them via a `visualComponents` record. The `RustifVisual` function currently renders 10 horizontal bars. The agent should replace this with the parse-tree/crab-claw graphic described in §4.1, or one of the alternative designs if the primary design proves too complex in SVG.

</div>

<div style="text-align:justify">

For full-card clickability, the agent should use Pattern A (Link wraps Card) to avoid nested anchor tags. Each card already has a `<Link href="/research">` inside it for the "Read paper →" text, so this inner link must be converted to a non-interactive `<span>` when the outer link wrapper is added. The `ScrollReveal` wrapper must remain outside the `<Link>` to preserve animation behavior.

</div>

**Acceptance criteria:**

- The rustif Declaration card has a distinctive decorative graphic that matches the abstract, minimal aesthetic of the ADF and Multi-Agent visuals.
- The graphic communicates something about Rust, metadata, or systems engineering (not generic placeholder bars).
- Clicking anywhere on any of the three research cards navigates to `/research`.
- The entire card highlights on hover (existing hover treatment preserved).
- No nested `<a>` elements in the rendered HTML.
- Keyboard navigation works (Tab focuses the card, Enter activates it).
- `ScrollReveal` animations still fire correctly.

---

<a name="6-files-affected" id="6-files-affected"></a>
<hr class="print-page-break">

## 6. Files Affected

| File | Prompts | Changes |
|------|---------|---------|
| `components/home/HeroBackground.tsx` | 1 | Reduce shruggie size constants |
| `components/home/ServicesScroll.tsx` | 1, 2 | Restructure GSAP timeline for sequential fade; expand right column; orange hover |
| `components/home/WorkScroll.tsx` | 1, 2 | Restructure GSAP timeline for sequential fade; expand right column; orange hover |
| `components/home/ResearchSection.tsx` | 3 | Replace `RustifVisual`; wrap cards in `<Link>` |
| `styles/globals.css` | 2 (if needed) | Add brand orange CSS custom property (if not present) |
| `tailwind.config.ts` | 2 (if needed) | Map brand orange token (if not present) |
