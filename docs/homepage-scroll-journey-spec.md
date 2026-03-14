# Homepage Scroll Journey — Full Specification

> **This is the reference specification.** Do not implement this document directly.
> Sequential implementation prompts reference this file for architectural context.
> Place this file in your project at `docs/homepage-scroll-journey-spec.md`.

## Context

This is the ShruggieTech website, a Next.js project deployed on Vercel. The homepage currently has:

- A `HeroBackground.tsx` component rendering an interactive dot grid on HTML5 Canvas (brand green `#2BCC73` dots at low opacity, brightening + connecting near cursor, ambient drift on mobile)
- A hidden shruggie easter egg in the dot grid that reveals when the spotlight passes over it, wiggles when "scared," then flees to a new position (loads from `/images/logo-icon-only-green.png`)
- Section components: `HeroSection`, `ServicesPreview` (4 service cards in a 2×2 grid), `WorkPreview` (3 case study cards in horizontal snap-scroll), `ResearchPreview` (3 publication cards stacked vertically), `CTASection`
- Brand colors: Black `#000000`, Green Bright `#2BCC73`, Green Deep `#00AB21`, Orange `#FF5300`, Light Gray `#D1D3D4`
- Fonts: Space Grotesk (display), Geist (body)
- Dark mode is the default theme

## Objective

Transform the homepage into a continuous scroll-driven animated journey where a unified dot-grid + network-graph visual system flows through every section, morphing to match each section's content. The dots from `HeroBackground.tsx` must persist as the base layer across the entire page, with network graph overlays that transform as the user scrolls.

## Critical Constraint — Preserve the Shruggie Easter Egg

The existing shruggie easter egg behavior in `HeroBackground.tsx` MUST be preserved exactly as it works today:

- Image-sampled dot cloud from `/images/logo-icon-only-green.png`
- Proximity-based reveal when the spotlight (cursor or ambient drift) passes over it
- Wiggle animation when "scared" (ramping intensity)
- Flee animation to a random new position after a delay
- Exclusion zones so it doesn't spawn over hero text
- All existing configuration constants and timing

Do not refactor, simplify, or remove any shruggie logic. If the canvas architecture changes (e.g., moving to a single page-level canvas), port the shruggie system faithfully into the new architecture.

**Optional enhancement (implement only if it doesn't compromise the above):** When the shruggie flees, have it briefly travel along a nearby network graph edge before disappearing — as if it's running along a wire. Fall back to the existing direct-flee animation if no edge is nearby.

## Technology Stack

- **Smooth scrolling:** Lenis (already in the project's tech stack plan)
- **Scroll-driven animation:** GSAP + ScrollTrigger (free tier). Use `pin`, `scrub`, and `snap` features for scroll-locked sections.
- **Rendering:** Keep the HTML5 Canvas approach from the existing `HeroBackground.tsx`. Extend it to a single full-page canvas (or a set of section-level canvases if that's more performant — use your judgment, but the visual must be seamless with no visible seams between sections).
- **Dot grid:** The existing dot grid rendering logic (spacing, radius, color, base alpha, hover alpha, interaction radius, glow, connecting lines) is the foundation. Extend it to cover the full page height.
- **Network graph:** Rendered on the same canvas layer as the dots. Network nodes are larger dots (or clusters) with edges drawn as lines between them. The network graph is a distinct visual element that overlays the base dot grid.

## Section-by-Section Specification

### Section 1: Hero

**Base layer:** Full dot grid as it exists today, covering the entire hero section. All existing interactivity (cursor brightening, connecting lines, ambient drift on mobile, shruggie easter egg) preserved.

**Network graph overlay:** A subtle network graph composed of ~15–25 nodes with connecting edges. The nodes should be slightly larger than the base dots (radius ~3–4px) and brighter (alpha ~0.4–0.5). Edges between connected nodes should be thin lines at ~0.12 alpha in brand green.

**Placement:** The network graph is centered in the hero section. It extends past the text content area in all directions but occupies no more than 50% of the remaining empty space between the text region and the viewport edges. Think of it as a soft halo of connectivity surrounding the hero copy — visible but not competing with the text.

**Behavior:** Nodes drift very slowly (slower than the ambient drift) in gentle sine-wave paths. The network should feel alive but calm. The cursor interaction from the base dot grid should also affect network nodes (brightening nearby ones).

### Scroll Transition: Hero → What We Do

As the user scrolls past the hero section, the network graph:

1. **Condenses** — nodes pull closer together, the graph contracts from its spread-out hero layout into a tighter cluster
2. **Moves diagonally toward the right** — the cluster translates from center-ish to the right side of the viewport
3. **Arrives** at its resting position on the right half of the "What We Do" section, aligned with the first service card ("Digital Strategy & Brand")

This transition should be smooth and scrub-driven (tied to scroll position via GSAP ScrollTrigger `scrub`). Duration: roughly 1 viewport-height of scroll distance.

The base dot grid continues underneath throughout — only the network graph overlay moves.

### Section 2: What We Do (Services Preview)

**Layout change:** Replace the current 2×2 card grid with a scroll-locked single-card presentation. The section is pinned via GSAP ScrollTrigger `pin`.

**Desktop layout:**
- Left half: The service card (one at a time), with the same content as today (icon, title, description) but presented larger — full left-half width, vertically centered.
- Right half: The network graph, which has morphed into an abstract shape representing the current card's theme.

**Card cycling:** As the user scrolls within the pinned section, cards transition one by one (4 cards total). Each card transition:
- Fades/slides the current card out and the next card in (left side)
- Morphs the network graph from the current shape to the next shape (right side)

**Network graph shapes per card:**
1. **Digital Strategy & Brand** — A constellation/star pattern (nodes arranged in a radial burst suggesting creative direction)
2. **Development & Integration** — A circuit-board-like grid pattern (nodes in structured rows/columns with right-angle edges)
3. **Revenue Flows & Marketing Ops** — A funnel shape (wider at top, narrower at bottom, with flowing edge animations suggesting direction)
4. **AI & Data Analysis** — A neural-network pattern (layered nodes with dense cross-connections)

Each shape should be recognizable but abstract — these are dot-and-line compositions, not literal icons. They should feel like they belong to the same visual language as the hero network graph.

**Shape morphing:** Use position interpolation. Each shape is defined as a set of target (x, y) positions for the ~15–25 nodes. Morphing between shapes animates each node from its current position to its target position with eased timing. Edges redraw based on the new node positions. The morph should take about 30–40% of the scroll distance allocated to each card transition, with the remaining scroll showing the settled shape.

**Mobile layout:**
- The network graph shape sits above the card (top ~40% of the pinned viewport).
- The card content sits below (bottom ~60%).
- Same scroll-locked cycling behavior, same shape morphing.

**Scroll budget:** Allocate approximately 4× viewport height of scroll distance for this section (1× per card). Use GSAP ScrollTrigger `snap` to ensure users land cleanly on each card.

### Section 3: Our Work (Work Preview)

**Layout change:** Replace the horizontal snap-scroll strip with a scroll-locked node-graph presentation.

**Transition in:** As the last "What We Do" card finishes, the network graph on the right side expands outward — nodes spread apart and new nodes appear, growing the graph to cover the right 2/3 of the viewport. Some of the larger nodes in this expanded graph should use the company logo icon (`/images/logo-icon-only-green.png`) rendered as a small circular icon (not dot-sampled like the easter egg — just the actual image at ~40–50px diameter, with a subtle green glow ring around it). These logo-icon nodes are the case study anchors.

**Desktop layout:**
- Left 1/3: Case study detail card (client name, industry badge, summary, "Read case study →" link). Same content as the existing `WorkPreview` cards but displayed one at a time, larger.
- Right 2/3: Network graph with logo-icon nodes. The node corresponding to the currently displayed case study should be highlighted (brighter glow, slightly larger, maybe a subtle pulse animation). Other case study nodes are visible but dimmer.

**Node design:** The network graph in this section should have:
- ~30–50 regular nodes (standard dot-grid-sized, brand green, low alpha)
- 3+ logo-icon nodes (one per case study, using the actual logo image)
- Edges connecting nodes organically — the logo-icon nodes should be well-distributed and act as "hubs" with more connections radiating from them

**Scalability:** The node layout must be generated programmatically from the case study data array. Adding a 4th, 5th, or 6th case study should automatically add more logo-icon nodes and redistribute the graph. Do not hardcode positions for exactly 3 case studies.

**Card cycling:** Same scroll-locked behavior as "What We Do." As the user scrolls, the case study card on the left transitions (fade/slide), and the highlight shifts to the corresponding logo-icon node on the right. The highlight transition should include a visible "energy pulse" traveling along graph edges from the previous node to the next node.

**Click interaction:** Logo-icon nodes are click-focusable. Clicking a node immediately switches to that case study's card on the left and highlights that node, regardless of scroll position. After clicking, scrolling resumes from the clicked card's position in the sequence.

**Mobile layout:**
- Network graph sits in the top ~50% of the pinned viewport.
- Case study card sits in the bottom ~50%.
- Logo-icon nodes are tap-focusable.
- Same scroll-locked cycling.

**Scroll budget:** Allocate approximately 3× viewport height of scroll distance (1× per case study, scaling with the array length).

### Scroll Transition: Our Work → Research

As the user scrolls past the last case study, the network graph contracts from its spread-out node layout and begins morphing into the next section's visual.

### Section 4: Research Preview

**Network graph transformation:** The network graph morphs into an abstract architectural city skyline. This is a dot-and-line composition where:
- Vertical clusters of nodes form "buildings" of varying heights
- Horizontal edges at the base connect the buildings into a "ground plane"
- The skyline sits at the bottom of the Research section, with buildings growing upward
- The ground plane aligns with the bottom edge of the section

**Construction animation:** The buildings are "constructed" as the user scrolls — nodes and edges appear progressively from the ground up, as if the city is being built in real time. Start with the ground plane, then shorter buildings on the edges, then taller buildings toward the center. The construction should feel deliberate and satisfying.

**Scroll budget:** Allocate approximately 2–2.5× viewport height of scroll distance for this section. The research publication cards appear in the left portion of the section (similar to today's layout) while the skyline builds on the right. The extended scroll distance means the user experiences a notable "building" phase — the skyline continues constructing even after the text content is fully visible. Don't make it so long it's annoying — aim for a moment of "oh, that's cool" followed by natural scroll-through.

**Research cards:** Keep the existing vertical card layout but position them on the left ~50% of the section. The skyline occupies the right ~50%.

### Scroll Transition: Research → CTA

As the user scrolls past the Research section, the camera "pulls back" — the skyline shrinks as if we're zooming out, the dots around it become smaller and denser, and the visual transitions to a view from space.

### Section 5: CTA (Bottom Call-to-Action)

**Network graph transformation:** The network graph is now a "planet" — a large circular cluster of nodes with dense internal connections and a subtle atmospheric glow at the edges. The planet is centered horizontally in the section, but only the top 2/3 is visible — the bottom 1/3 extends below the viewport, as if the planet is rising from the bottom of the screen.

**Planet design:**
- Circular node distribution with higher density toward the center
- Internal edges creating a mesh pattern (like a wireframe globe)
- A soft radial gradient glow in brand green at the edges, fading outward
- Very subtle rotation animation (nodes shifting positions slowly to simulate planetary rotation)

**Layout:** The CTA text ("Ready to build something?", description, and button) sits centered above the planet, in the visible top portion of the section. The planet is a background element — it should not compete with the CTA text but should feel grand and ambient.

**Zoom-out transition:** The transition from the Research skyline to the CTA planet should feel like a camera pull-back. Achieve this by:
1. Scaling down the skyline composition
2. Simultaneously introducing the planet's circular form, as if the skyline was a detail on the planet's surface
3. The background dot grid becomes denser (dots closer together, smaller) to simulate increased distance

## Performance Requirements

- Target 60fps on modern hardware (2020+ machines). Gracefully degrade on older hardware (skip morph animations, simplify network graph to fewer nodes).
- `prefers-reduced-motion`: Disable all scroll-driven animations. Show the dot grid as a static background. Show all sections in their natural document flow (no pinning, no scroll-locking). Network graph shapes appear in their final morph state without animation.
- Canvas rendering must not block the main thread. If the full-page canvas approach causes jank, consider using `OffscreenCanvas` with a Web Worker for the dot grid rendering.
- Lazy-initialize GSAP ScrollTrigger instances — don't compute layouts for sections that aren't near the viewport.

## Implementation Notes

- The existing `HeroBackground.tsx` should be refactored into a page-level component (e.g., `HomeCanvas.tsx` or `ScrollCanvas.tsx`) that manages the full-page canvas. Extract the shruggie easter egg logic into its own module that gets composed into the canvas renderer.
- Network graph node positions for each section's shape should be defined as configuration objects — arrays of `{ x: number, y: number }` targets (in viewport-relative or section-relative coordinates) that the renderer interpolates between based on scroll progress.
- GSAP ScrollTrigger `scrub` values should be tuned for smoothness. Start with `scrub: 1` (1 second of catch-up) and adjust.
- Lenis and GSAP ScrollTrigger need to be integrated. Lenis provides the smooth scroll, and ScrollTrigger reads the scroll position. Use the standard Lenis + ScrollTrigger integration pattern (Lenis `scroll` event updating ScrollTrigger).
- Keep all animation configuration constants at the top of files, matching the pattern in the existing `HeroBackground.tsx`.
- For the case study logo-icon nodes in the "Our Work" section: render the actual PNG image on the canvas using `drawImage`, not the dot-sampled approach used for the easter egg. Apply a circular clip mask and a green glow ring via `shadowBlur`/`shadowColor`.

## Target File Structure

```
components/
  home/
    HomeCanvas.tsx          — Full-page canvas component (replaces HeroBackground as the primary visual layer)
    HeroSection.tsx         — Updated hero (text + CTAs only, canvas is separate)
    ServicesScroll.tsx       — Replaces ServicesPreview, scroll-locked card cycling
    WorkScroll.tsx           — Replaces WorkPreview, scroll-locked node-graph case studies
    ResearchSection.tsx      — Updated research section with skyline build area
    CTASection.tsx           — Updated CTA with planet viewport
    ScrollOrchestrator.tsx   — Top-level component that initializes Lenis + GSAP ScrollTrigger, manages scroll state, passes progress values to HomeCanvas
lib/
  canvas/
    dot-grid.ts             — Dot grid rendering logic (extracted from HeroBackground)
    network-graph.ts        — Network graph node/edge system, shape definitions, morphing
    shruggie-easter-egg.ts  — Shruggie state machine + rendering (extracted faithfully)
    shapes.ts               — Shape target definitions for each section's network graph morph
    planet.ts               — Planet renderer for CTA section
    skyline.ts              — Skyline construction renderer for Research section
```

This is a suggestion — deviate from it if a better structure emerges during implementation. The key principle is separation of rendering concerns so each visual system is testable and tunable independently.

## Global Constraints

- Do not change the page's text content, headings, descriptions, or CTAs.
- Do not change the brand colors, fonts, or design tokens.
- Do not change the navigation, footer, or any other page-level layout.
- Do not remove or simplify the shruggie easter egg.
- Do not introduce any external dependencies beyond Lenis and GSAP (+ ScrollTrigger plugin). All canvas rendering should remain dependency-free.
- Do not use WebGL/Three.js — stay with 2D Canvas. The dot grid aesthetic is core to the brand and should not become a 3D scene.
