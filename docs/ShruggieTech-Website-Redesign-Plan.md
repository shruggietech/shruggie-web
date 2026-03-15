<a name="shruggietech-website-redesign-plan" id="shruggietech-website-redesign-plan"></a>
# ShruggieTech Website Redesign Plan

| Attribute | Value |
|-----------|-------|
| Subject | Homepage Visual Overhaul and UX Redesign |
| Version | 1.0.0 |
| Date | 2026-03-14 |
| Status | PROPOSED |
| Audience | AI-first, Human-second |
| Scope | Homepage redesign, global design system updates, mobile UX remediation |
| Depends On | ShruggieTech_Website_Specification.md v1.2.0, shruggietech-knowledge-base.md v1.3.0 |

<a name="table-of-contents" id="table-of-contents"></a>
## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Design System Overhaul — Kill the Terminal Look](#1-design-system-overhaul)
  - [1.1. Expanded Color Palette](#11-expanded-color-palette)
  - [1.2. Section Background Treatments](#12-section-background-treatments)
  - [1.3. Card and Surface Redesign](#13-card-and-surface-redesign)
  - [1.4. Typography Color Updates](#14-typography-color-updates)
- [2. Dark Mode Strategy — Homepage Always Dark, Reading Pages Toggle](#2-dark-mode-strategy)
- [3. Network Graph Assessment and Replacement Recommendation](#3-network-graph-assessment)
  - [3.1. What Worked](#31-what-worked)
  - [3.2. What Did Not Work](#32-what-did-not-work)
  - [3.3. Recommendation — Replace with Section-Specific Premium Visuals](#33-recommendation)
  - [3.4. New Visual System — Section by Section](#34-new-visual-system)
- [4. Scroll Experience — Pinned Sections Done Right](#4-scroll-experience)
  - [4.1. The aaru.com Model](#41-the-aaru-model)
  - [4.2. Desktop Scroll Architecture](#42-desktop-scroll-architecture)
  - [4.3. Mobile Scroll Architecture — A Separate Strategy](#43-mobile-scroll-architecture)
- [5. Section Differentiation — More Boldness, More Fun](#5-section-differentiation)
  - [5.1. Hero Section (No Changes)](#51-hero-section)
  - [5.2. Services Section Redesign](#52-services-section-redesign)
  - [5.3. Work Section Redesign](#53-work-section-redesign)
  - [5.4. Research Section Redesign](#54-research-section-redesign)
  - [5.5. CTA Section Redesign](#55-cta-section-redesign)
- [6. Photography and Human Connection](#6-photography-and-human-connection)
  - [6.1. Required Photography](#61-required-photography)
  - [6.2. Photo Treatment Standards](#62-photo-treatment-standards)
  - [6.3. Placement Map](#63-placement-map)
- [7. Mobile UX Remediation](#7-mobile-ux-remediation)
  - [7.1. Core Mobile Principles](#71-core-mobile-principles)
  - [7.2. Section-by-Section Mobile Treatments](#72-section-by-section-mobile-treatments)
- [8. Implementation Phasing](#8-implementation-phasing)
  - [Phase 1 — Design System and Global Infrastructure](#phase-1)
  - [Phase 2 — Homepage Section Rebuilds](#phase-2)
  - [Phase 3 — Photography Integration and Polish](#phase-3)
- [9. Files Affected](#9-files-affected)
- [10. Open Decisions Requiring Founder Input](#10-open-decisions)

---

<a name="executive-summary" id="executive-summary"></a>
<hr class="print-page-break">

## Executive Summary

<div style="text-align:justify">

This plan addresses seven categories of feedback about the current ShruggieTech website. The core problem is that the site reads as a developer portfolio built for developers, when the primary audience (Segments A and B from the knowledge base: local SMBs and mission-driven organizations) needs to feel confidence, warmth, and premium quality. The green-on-black color palette creates a terminal aesthetic that actively works against this. The network graph morphing system, while technically impressive, adds visual complexity without communicating anything meaningful to a non-technical visitor. The scroll-pinned sections break on mobile. The site lacks any human presence.

</div>

<div style="text-align:justify">

The plan proposes a redesign that keeps the hero section untouched (it works), replaces the unified canvas/network-graph system with purpose-built visuals per section, introduces a richer color palette that retains brand green as the primary accent but eliminates the monochrome terminal aesthetic, fixes the mobile experience by treating it as a first-class layout rather than a degraded desktop, and defines the photography needed to add human connection.

</div>

---

<a name="1-design-system-overhaul" id="1-design-system-overhaul"></a>
<hr class="print-page-break">

## 1. Design System Overhaul — Kill the Terminal Look

<div style="text-align:justify">

The current design system has exactly five brand colors and uses green as the sole accent against black backgrounds. This creates a monochrome green-on-black aesthetic across every section of every page. The fix is not to abandon the brand colors but to expand the working palette with derived and complementary tones that give each section its own visual identity while keeping the brand recognizable.

</div>

<a name="11-expanded-color-palette" id="11-expanded-color-palette"></a>
### 1.1. Expanded Color Palette

**Retained brand colors (no changes):**

| Token | Hex | Role |
|-------|-----|------|
| `--brand-green-bright` | `#2BCC73` | Primary accent, interactive elements |
| `--brand-green-deep` | `#00AB21` | Secondary accent, hover states |
| `--brand-orange` | `#FF5300` | CTA buttons, action elements, energy |
| `--brand-black` | `#000000` | Hero section background, deep anchors |
| `--brand-gray-light` | `#D1D3D4` | Borders, secondary text |

**New extended palette (derived tones for section variety):**

| Token | Hex | Derivation | Usage |
|-------|-----|------------|-------|
| `--surface-dark-warm` | `#0D0F12` | Near-black with a blue-cool undertone | Services section background |
| `--surface-dark-rich` | `#0A0E18` | Dark navy | Work section background |
| `--surface-dark-slate` | `#111318` | Charcoal with cool gray | Research section background |
| `--surface-dark-deep` | `#060608` | Near-black with purple cast | CTA section background |
| `--gradient-teal` | `#14B8A6` | Analogous to brand green | Gradient accents, data visualizations |
| `--gradient-blue` | `#3B82F6` | Cool complement | Section divider gradients, secondary glow |
| `--gradient-purple` | `#8B5CF6` | Split-complementary | Research section accents, futuristic feel |
| `--gradient-warm` | `#F59E0B` | Warm amber near orange | Subtle warm gradient tails |
| `--text-hero` | `#F0F0F0` | Slightly warm white | Primary headings on dark backgrounds |
| `--text-body-light` | `#B0B4BC` | Warm gray | Body text on dark backgrounds (higher contrast than current `#D1D3D4`) |

<div style="text-align:justify">

The principle is that no two adjacent sections should share the same background color or the same accent treatment. Brand green remains the interactive color (links, buttons, highlights), and brand orange remains the CTA color. The new tones provide section-level identity through subtle background shifts and gradient accents that read as "premium tech company" rather than "green terminal."

</div>

<a name="12-section-background-treatments" id="12-section-background-treatments"></a>
### 1.2. Section Background Treatments

Each homepage section gets a distinct background recipe. No section is flat black.

| Section | Background | Accent Treatment |
|---------|-----------|-----------------|
| Hero | `#000000` (pure black, unchanged) | Existing dot grid with green glow, gradient mesh |
| Services | `#0D0F12` + subtle radial gradient (teal at 4% opacity, centered top-right) | Cards have thin gradient left-border (green→teal) |
| Work | `#0A0E18` + diagonal gradient sweep (blue at 3% opacity, bottom-left to top-right) | Case study cards lift with subtle blue-green glow on hover |
| Research | `#111318` + fine noise texture overlay (2% opacity) | Publication cards have purple-tinted accent line |
| CTA | `#060608` + radial gradient bloom (orange at 6% opacity from CTA button outward) | Orange glow radiates from the primary CTA |

<a name="13-card-and-surface-redesign" id="13-card-and-surface-redesign"></a>
### 1.3. Card and Surface Redesign

<div style="text-align:justify">

The current `Card` component uses a single border color and uniform `bg-elevated` surface. The redesign introduces glassmorphism-lite: cards get a semi-transparent background with a subtle backdrop blur, creating depth against the varied section backgrounds. This is a controlled use, not a heavy frosted glass effect.

</div>

**New card treatment:**

- Background: `rgba(255, 255, 255, 0.03)` (dark mode), providing barely perceptible lift
- Border: `1px solid rgba(255, 255, 255, 0.06)`, shifting to `rgba(43, 204, 115, 0.2)` on hover
- Backdrop filter: `blur(12px)` (provides subtle depth against gradient backgrounds)
- Hover: Translate Y -2px, border transitions to green, faint box-shadow glow in section accent color

<a name="14-typography-color-updates" id="14-typography-color-updates"></a>
### 1.4. Typography Color Updates

| Element | Current | Proposed | Rationale |
|---------|---------|----------|-----------|
| Section headings (dark bg) | `#FFFFFF` | `#F0F0F0` | Slightly warmer, less harsh |
| Section labels ("WHAT WE DO") | Brand green `#2BCC73` | Keep as-is | Already works as accent text |
| Body text (dark bg) | `#D1D3D4` | `#B0B4BC` | Marginally warmer tone, better readability |
| Muted text | `#6B6B6B` | `#7A7F8A` | Warmer gray with slight blue undertone |

---

<a name="2-dark-mode-strategy" id="2-dark-mode-strategy"></a>
<hr class="print-page-break">

## 2. Dark Mode Strategy — Homepage Always Dark, Reading Pages Toggle

**Homepage:** Dark mode only. Remove the theme toggle from the header when on the homepage route. The homepage is a showpiece, and the visual design depends on dark backgrounds for impact.

**Content-heavy pages (blog, research, case studies):** Retain the theme toggle. These are reading-focused pages where a lighter background improves sustained readability.

**Light mode palette update:** When light mode is active on reading pages, use an off-white base instead of pure white.

| Token | Current Light Mode | Proposed Light Mode |
|-------|-------------------|-------------------|
| `--bg-primary` | `#FFFFFF` | `#F8F8F6` (warm cream) |
| `--bg-secondary` | `#F5F5F5` | `#F0EFED` (warm gray) |
| `--bg-elevated` | `#FFFFFF` | `#FFFFFF` (keep for cards to provide lift) |

**Implementation:** The theme toggle visibility is controlled by a prop or route check in the `Header` component. On `/`, `/services`, `/about`, and `/contact`, the toggle is hidden and the page forces dark class. On `/blog/*`, `/research/*`, and `/work/*`, the toggle appears.

---

<a name="3-network-graph-assessment" id="3-network-graph-assessment"></a>
<hr class="print-page-break">

## 3. Network Graph Assessment and Replacement Recommendation

<a name="31-what-worked" id="31-what-worked"></a>
### 3.1. What Worked

<div style="text-align:justify">

The concept of a living, continuous visual system that evolves as the user scrolls was a strong creative direction. The idea that the page feels alive, that visual elements respond to your journey through the content, is exactly the kind of "fun and futuristic" feel that ShruggieTech's brand calls for. The dot grid in the hero section specifically works well: it is subtle, interactive, and feels techy without being alienating. The shruggie easter egg is a genuine delight. These elements should be preserved.

</div>

<a name="32-what-did-not-work" id="32-what-did-not-work"></a>
### 3.2. What Did Not Work

<div style="text-align:justify">

The network graph morphing system has several structural problems that cannot be fixed with tuning.

</div>

**Problem 1 — Semantic emptiness.** A constellation shape morphing into a circuit-board shape morphing into a funnel shape carries no meaning to the visitor. These shapes are abstract references to service categories that only make sense if you already understand them. A non-technical business owner (Segment A) sees green dots moving around and has no idea why.

**Problem 2 — Performance on mobile.** A full-page HTML5 Canvas running a 60fps animation loop with ~50 nodes, edge calculations, and shape interpolation is expensive. On mid-range phones, this produces jank, battery drain, and heat. The `prefers-reduced-motion` fallback (static grid, no pinning) is a complete visual downgrade rather than a graceful adaptation.

**Problem 3 — Competing with content.** The network graph shares screen space with text content in every section. On the services section, the left half is a card and the right half is dots. On the work section, the left third is a card and the right two-thirds are dots. The dots provide visual texture but they compete with the actual content for the visitor's attention. In an aaru.com-style design, the visual element *is* the content (a video, a product image, a data visualization), not a decorative companion beside the content.

**Problem 4 — Canvas rendering conflicts.** A single fixed-position canvas behind all sections creates z-index and interaction challenges. The canvas must account for scroll position, section dimensions, pinned states, and viewport resizing simultaneously. This architectural complexity is the root cause of most of the mobile bugs.

<a name="33-recommendation" id="33-recommendation"></a>
### 3.3. Recommendation — Replace with Section-Specific Premium Visuals

<div style="text-align:justify">

Retire the `HomeCanvas`, `ScrollOrchestrator`, and the entire `lib/canvas/` module library. Replace the unified canvas system with section-specific visual treatments that each use the best rendering approach for their content. Keep the hero section's `HeroBackground` (dot grid + easter egg) as a standalone component confined to the hero section only, just like it was before the scroll journey refactor.

</div>

The replacement approach:

- **Hero:** Keep `HeroBackground.tsx` as-is. Dot grid with interactive cursor glow, ambient drift, shruggie easter egg. This works and should not change.
- **Services:** CSS/SVG animated illustrations per service card (the `ServiceIllustrations` already exist; promote them to full visual partners, not sidebar decorations).
- **Work:** Real case study screenshots and client imagery. This is where photography becomes essential.
- **Research:** Stylized abstract code/data visualizations using SVG or lightweight CSS animations.
- **CTA:** A bold gradient bloom behind the call-to-action button. No canvas, no planet. The CTA's job is to convert, not to impress.

<a name="34-new-visual-system" id="34-new-visual-system"></a>
### 3.4. New Visual System — Section by Section

**Hero section visual:** No change. The existing dot grid with cursor interaction is the signature. It establishes the techy baseline. The key insight is that this visual is effective *because it is confined to one section*. When it was stretched across the entire page, it diluted its own impact.

**Services section visual:** Each service card gets a full-bleed animated illustration that fills the right side of the viewport during the scroll-pinned presentation. These are not the small sidebar SVGs currently in `ServiceIllustrations.tsx`. They are large, expressive, and animated. Think of how Stripe's homepage presents product features with illustrations that command half the viewport.

- *Digital Strategy & Brand:* Animated brand identity system (logo marks assembling, color palettes expanding, typography cascading)
- *Development & Integration:* Code editor mockup with syntax-highlighted lines writing themselves, interlocking system blocks connecting
- *Revenue Flows & Marketing Ops:* Animated dashboard with rising chart lines, funnel visualization, notification badges pulsing
- *AI & Data Analysis:* Neural pathway visualization, data points flowing through a processing pipeline

These can be implemented as Lottie animations, SVG with CSS keyframe animations, or lightweight Framer Motion compositions. They do not require a canvas rendering pipeline.

**Work section visual:** Real photographs and screenshots. Each case study card includes a hero image (the client's website on a device mockup, a before/after comparison, or a stylized screenshot). The visual weight of real imagery communicates credibility in a way that abstract dots cannot.

**Research section visual:** Stylized code blocks or manuscript excerpts rendered as decorative elements behind the publication cards, using a monospace font at low opacity with a gradient mask. Think of how Vercel's marketing pages use code snippets as visual texture.

**CTA section visual:** A gradient bloom (the orange CTA color radiating outward at low opacity) with a subtle particle field (CSS-only, using small absolutely positioned dots with slow drift animations). This creates atmosphere without requiring a canvas.

---

<a name="4-scroll-experience" id="4-scroll-experience"></a>
<hr class="print-page-break">

## 4. Scroll Experience — Pinned Sections Done Right

<a name="41-the-aaru-model" id="41-the-aaru-model"></a>
### 4.1. The aaru.com Model

<div style="text-align:justify">

The aaru.com homepage uses a pattern where content sections pin to the viewport during scroll, with content elements (text blocks, videos, images) animating in and out as the user scrolls. The key qualities that make it feel premium are: generous whitespace, large typography, video and imagery as primary content (not decoration), smooth transitions between pinned states, and a clear "one idea per screen" information density. The scroll-freeze effect works because each pinned frame presents a single thought with a single visual, not a split-screen of text plus decoration.

</div>

<a name="42-desktop-scroll-architecture" id="42-desktop-scroll-architecture"></a>
### 4.2. Desktop Scroll Architecture

Retain GSAP ScrollTrigger for scroll-pinned sections on desktop. The existing Lenis + ScrollTrigger integration is sound. What changes is the content within the pinned frames.

**Services section (pinned, 4 frames):**

- Full viewport height per frame.
- Each frame: Left 55% is the service content (icon, title, description, "Learn more" link). Right 45% is the animated illustration for that service.
- Transition between frames: Content fades and slides vertically. Illustration crossfades.
- Visual indicator: A vertical progress track on the far left edge with 4 dots showing current position.
- Scroll budget: 4x viewport height (unchanged from current spec).

**Work section (pinned, 3 frames):**

- Full viewport height per frame.
- Each frame: Left 50% is the case study card (client name, badge, summary, link). Right 50% is a large case study hero image (device mockup or screenshot).
- Transition: Card content slides, image crossfades.
- Scroll budget: 3x viewport height.

**Research section (not pinned on desktop):**

- Standard scroll with `ScrollReveal` entrance animations.
- Three publication cards stacked vertically with generous spacing.
- Background code-texture visual is fixed-position within the section (CSS `background-attachment: fixed` or a sticky-positioned pseudo-element), creating a subtle parallax-like depth as the cards scroll over it.

**CTA section (not pinned):**

- Standard scroll reveal.
- Centered headline, subtext, and button.
- Gradient bloom animation triggers on viewport entry.

<a name="43-mobile-scroll-architecture" id="43-mobile-scroll-architecture"></a>
### 4.3. Mobile Scroll Architecture — A Separate Strategy

<div style="text-align:justify">

This is the most critical architectural decision in the plan. The current implementation tries to run the same scroll-pinning behavior on mobile as on desktop, which produces a poor experience. The recommendation is to treat mobile as a completely separate scroll experience, not a degraded version of desktop.

</div>

**Mobile rule: No GSAP ScrollTrigger pinning on viewports below 768px.**

Instead, mobile uses:

- **Standard document flow.** Sections scroll naturally.
- **Framer Motion `whileInView` reveals.** Elements fade/slide in as they enter the viewport.
- **Stacked layouts.** All content is single-column. Illustrations and images appear above or below their text content, never beside it.
- **Swipeable carousels** for the services cards and work cards (CSS `scroll-snap-type: x mandatory` on a horizontal scroll container). This gives mobile users a native-feeling interaction without scroll-jacking.

<div style="text-align:justify">

This means the services section on mobile is a section heading followed by a horizontal swipeable card strip (each card is ~85vw wide, with peek of the next card visible). The work section is the same pattern. This is the exact layout the original `ServicesPreview` and `WorkPreview` components used before the scroll journey refactor, which means the `prefers-reduced-motion` fallback components can be repurposed as the mobile layout with minimal changes.

</div>

---

<a name="5-section-differentiation" id="5-section-differentiation"></a>
<hr class="print-page-break">

## 5. Section Differentiation — More Boldness, More Fun

<a name="51-hero-section" id="51-hero-section"></a>
### 5.1. Hero Section (No Changes)

Zero complaints from the founder. Leave it alone. The only minor addition: ensure the dot grid does not render below the hero section boundary (the current implementation already confines the spotlight, but the base grid still renders into subsequent sections at resting opacity, which contributes to the terminal look in adjacent sections).

**Action:** Clip the `HeroBackground` canvas to the hero section's bounding box. The canvas should not extend into the services section.

<a name="52-services-section-redesign" id="52-services-section-redesign"></a>
### 5.2. Services Section Redesign

**Visual identity:** Dark warm background (`#0D0F12`) with a teal radial gradient accent. This section should feel like "capability" and "confidence."

**Section intro (before pinned frames begin):** A large section heading ("What We Do") with an animated counter or stat line below it. Something like "4 practice areas. 40+ capabilities. One team." This intro scrolls naturally, and the pinned frame sequence begins after it exits.

**Pinned frame layout (desktop):**

- Left column (55%): Service number in large display text (01, 02, 03, 04) with gradient fill (green→teal). Service title in `display-md`. Description in body text. A "Learn more →" link to the services page anchor.
- Right column (45%): Full-height animated illustration with a subtle background glow in the section's accent color.
- Progress indicator: Thin vertical line on the left edge with a filled segment showing current position out of four.

**Transitions:** Cards transition with a vertical slide (outgoing slides up and fades, incoming slides up from below and fades in). Illustrations crossfade with a 300ms overlap.

**Shruggietech spirit element:** The service numbers (01, 02, 03, 04) are rendered in a large, bold, semi-transparent gradient font that sits behind the card content as a watermark. This adds visual weight and personality.

<a name="53-work-section-redesign" id="53-work-section-redesign"></a>
### 5.3. Work Section Redesign

**Visual identity:** Dark rich navy background (`#0A0E18`) with a diagonal blue gradient accent. This section should feel like "proof" and "trust."

**Section intro:** Heading ("Our Work") with a brief tagline. Below the heading, a row of small client logo thumbnails (grayscale, becoming color on hover) provides an immediate signal that real companies trust ShruggieTech. This requires client logos from Natalie.

**Pinned frame layout (desktop):**

- Left column (50%): Case study card with client name, industry badge, summary paragraph, key metric (if available, e.g., "Launched in 6 weeks" or "100% client-owned infrastructure"), and a "Read case study →" link.
- Right column (50%): Large image (device mockup of the client's website, before/after split, or styled screenshot). Images should have a subtle border radius and a drop shadow to create depth against the dark background.

**Transitions:** Content slides vertically, images crossfade.

**Shruggietech spirit element:** Between case study frames, a brief interstitial text appears: a short, punchy statement about the work philosophy (e.g., "Your infrastructure. Your data. Your domain. Always."). These echo the "ownership" thesis.

<a name="54-research-section-redesign" id="54-research-section-redesign"></a>
### 5.4. Research Section Redesign

**Visual identity:** Charcoal slate background (`#111318`) with a fine noise texture and purple accent elements. This section should feel like "depth" and "credibility."

**Layout (not pinned):** Three publication cards in a stacked layout with generous vertical spacing. Each card is wider than the current implementation (full content-width) and taller, with a two-column internal layout: left side has the publication metadata (title, author, date, abstract excerpt), right side has a stylized cover image or abstract visual treatment.

**Background treatment:** A decorative code block rendered at 5% opacity in monospace font, positioned behind the cards with a gradient mask that fades it at the edges. This reads as "we write real code and real research" without being literal or distracting.

**Shruggietech spirit element:** A small "Published by humans. Cited by machines." tagline rendered below the section heading.

<a name="55-cta-section-redesign" id="55-cta-section-redesign"></a>
### 5.5. CTA Section Redesign

**Visual identity:** Near-black background (`#060608`) with an orange radial gradient bloom centered on the CTA button. This section should feel like "invitation" and "warmth."

**Layout:** Centered, generous whitespace above and below. A headline in `display-lg` or `display-xl`. A single sentence of body text. The ShruggieCTA button. Below the button, the shruggie tagline fades in with the characteristic `¯\_(ツ)_/¯` personality.

**The orange bloom:** A soft radial gradient using `--brand-orange` at 8-12% opacity, centered behind the CTA button and extending outward roughly 300-400px in all directions. This creates a warm focal point that draws the eye to the action without being garish. The bloom can pulse very slowly (8-10s cycle) to add subtle life.

**Shruggietech spirit element:** The shruggie emoticon rendered large (perhaps 120px tall) in very low opacity (3-5%) as a watermark behind the CTA content. It should be just barely perceptible and reveal fully on hover as a nod to the easter egg sensibility.

---

<a name="6-photography-and-human-connection" id="6-photography-and-human-connection"></a>
<hr class="print-page-break">

## 6. Photography and Human Connection

<a name="61-required-photography" id="61-required-photography"></a>
### 6.1. Required Photography

**Priority 1 — Team headshots (3 square photos):**

| Person | Usage | File Path | Notes |
|--------|-------|-----------|-------|
| William Thompson | About page team card, potentially footer or sidebar | `public/images/team/william.png` | Professional but approachable. Tech environment preferred (at a desk, in front of monitors). Square format (1:1). |
| Natalie Thompson | About page team card, potentially homepage or services | `public/images/team/natalie.png` | Professional, confident. Could be client-facing context (meeting, whiteboard, laptop). Square format (1:1). |
| Josiah Thompson | About page team card | `public/images/team/josiah.png` | Professional, appropriate framing per the existing description guidelines. Square format (1:1). |

**Priority 2 — Case study hero images (3 screenshots, PROVIDED):**

| Client | File Path | Notes |
|--------|-----------|-------|
| United Way of Anderson County | `public/images/work/united-way.png` | Full-page screenshot. Rendered inside `DeviceMockup` (browser variant). |
| Scruggs Tire & Alignment | `public/images/work/scruggs-tire.png` | Full-page screenshot. Rendered inside `DeviceMockup` (browser variant). |
| I Heart PR Tours | `public/images/work/i-heart-pr-tours.png` | Full-page screenshot. Rendered inside `DeviceMockup` (browser variant). |

Image paths are derived from the case study slug: `/images/work/${slug}.png`. The `caseStudies` data array in the Work section components already uses these slugs.

**Priority 3 — Office/workspace imagery (2-3 photos):**

| Subject | Usage | Notes |
|---------|-------|-------|
| The "Command Center" or a workspace shot | About page, possibly homepage background | Shows the team has serious infrastructure. Conveys legitimacy. |
| Collaborative work moment | Services page or homepage | Two people looking at a screen, whiteboard session, anything that shows teamwork. |
| Knoxville, TN context | Footer area or about page | A tasteful Knoxville skyline or downtown shot for the "Made in the USA / Knoxville, TN" identity. |

**Priority 4 — Client logos (3-4 logos):**

| Client | Format Needed |
|--------|--------------|
| United Way of Anderson County | SVG or high-res PNG with transparent background |
| Scruggs Tire & Alignment | SVG or high-res PNG with transparent background |
| I Heart PR Tours | SVG or high-res PNG with transparent background |

<a name="62-photo-treatment-standards" id="62-photo-treatment-standards"></a>
### 6.2. Photo Treatment Standards

- Team headshots are 1:1 (square) source images. Render them as sharp squares with no border radius. This is an intentional editorial choice, not a placeholder. The `PlaceholderAvatar` circles on the about page will be replaced with square containers (`aspect-square`, approximately `w-48 h-48` on desktop, `w-40 h-40` on mobile). No `rounded-full`, no `rounded-xl`, no border radius of any kind.
- Case study images should be presented in device mockup frames (laptop, phone, or browser window). A reusable `DeviceMockup` component should be created that accepts an image and renders it inside a styled browser chrome or device bezel.
- Photos used on dark backgrounds should have a subtle vignette or gradient overlay at the edges to blend into the section background rather than sitting as harsh rectangles.
- Images served via `next/image` with AVIF/WebP formats, responsive `sizes` attribute, and `priority` on above-the-fold placements.

<a name="63-placement-map" id="63-placement-map"></a>
### 6.3. Placement Map

| Page | Location | Image |
|------|----------|-------|
| Homepage — Work section | Right column of each pinned frame | Case study hero image in device mockup |
| Homepage — Work section intro | Client logo row below heading | Grayscale client logos |
| About — Team section | Team cards | Headshots replacing placeholder circles |
| About — Origin story | Inline or background | Workspace photo |
| Services — Hero or pillar sections | Background or inline | Collaborative work photo |
| Contact — Sidebar or hero | Accent image | Team or office photo |

---

<a name="7-mobile-ux-remediation" id="7-mobile-ux-remediation"></a>
<hr class="print-page-break">

## 7. Mobile UX Remediation

<a name="71-core-mobile-principles" id="71-core-mobile-principles"></a>
### 7.1. Core Mobile Principles

1. **No scroll-jacking.** Scroll-pinned sections (GSAP ScrollTrigger `pin`) are disabled below 768px. The page scrolls naturally.
2. **No full-page canvas.** The `HeroBackground` renders only within the hero section on mobile, at reduced resolution (0.75x DPR instead of full DPR) to save battery.
3. **Touch-native interactions.** Swipeable horizontal carousels for card collections. Tap to expand for interactive elements. No hover-dependent interactions.
4. **Content-first stacking.** Text content always appears before its associated visual in the DOM order on mobile. Images load lazily below the fold.
5. **Reduced animation.** Simpler, shorter entrance animations. No complex crossfade sequences. Framer Motion `whileInView` with conservative thresholds (`amount: 0.3`).

<a name="72-section-by-section-mobile-treatments" id="72-section-by-section-mobile-treatments"></a>
### 7.2. Section-by-Section Mobile Treatments

**Hero (mobile):** Full viewport height. Dot grid renders at reduced resolution. Text content is centered. CTAs stack vertically. Ambient drift focal point provides subtle motion. No changes from current behavior except canvas resolution reduction.

**Services (mobile):** Section heading scrolls normally. Below it, a horizontal swipeable card strip. Each card is ~88vw wide with 16px gap, showing a peek of the next card. Card contains: service number, icon, title, description. The animated illustration is replaced with a static version of the SVG at a smaller size, positioned above the text within the card. A row of 4 small indicator dots below the strip shows the current card.

**Work (mobile):** Section heading scrolls normally. Below it, a horizontal swipeable card strip similar to services. Each card is ~90vw wide. Card contains: case study image (rendered at a fixed 16:9 aspect ratio above the text), client name, badge, summary, link. Indicator dots below.

**Research (mobile):** Standard stacked cards, full width. Each card is a single column with metadata and a "Read paper" link. The decorative code-block background is hidden on mobile to reduce rendering cost.

**CTA (mobile):** Full-width section with generous padding. Headline, body text, and button stacked and centered. The orange gradient bloom is simplified to a CSS radial gradient (no animation) to conserve battery.

---

<a name="8-implementation-phasing" id="8-implementation-phasing"></a>
<hr class="print-page-break">

## 8. Implementation Phasing

<a name="phase-1" id="phase-1"></a>
### Phase 1 — Design System and Global Infrastructure

**Scope:** Update the design system, theme strategy, and card components. Remove the unified canvas system. Restore the hero dot grid as a standalone component.

**Work items:**

1. **Expand `globals.css` color tokens.** Add all new surface colors, gradient colors, and typography color updates. Extend the Tailwind theme with the new tokens.
2. **Update `Card` component.** Implement glassmorphism-lite treatment (semi-transparent background, backdrop blur, gradient border hover).
3. **Update dark/light mode strategy.** Modify `Header` to conditionally hide the theme toggle based on the current route. Force dark mode on homepage, services, about, and contact. Allow toggle on blog, research, and work detail pages. Update light mode `--bg-primary` to off-white.
4. **Remove the unified canvas system.** Delete `HomeCanvas.tsx`, `ScrollOrchestrator.tsx`, and the `lib/canvas/` directory (except preserve `HeroBackground.tsx` and the shruggie easter egg logic). Restore `HeroBackground` as a self-contained component rendered inside `HeroSection` only.
5. **Create mobile detection utility.** A `useIsMobile()` hook (based on viewport width, not user-agent sniffing) that components use to conditionally render desktop or mobile layouts. Use `768px` as the breakpoint, matching the existing Tailwind `md` breakpoint.
6. **Create `DeviceMockup` component.** A reusable component that renders an image inside a browser chrome or device bezel frame. Accepts `src`, `alt`, `variant` (browser/laptop/phone).

<a name="phase-2" id="phase-2"></a>
### Phase 2 — Homepage Section Rebuilds

**Scope:** Rebuild each homepage section with the new visual system. Desktop scroll-pinning on services and work sections. Mobile swipeable carousels.

**Work items:**

7. **Rebuild `ServicesScroll` (desktop) and `ServicesCarousel` (mobile).** Desktop: GSAP-pinned 4-frame presentation with animated illustrations (full right-column size) and progress indicator. Mobile: horizontal snap-scroll strip with static illustration thumbnails and indicator dots. Both share the same data array and card content.
8. **Create large-format service illustrations.** Scale up the existing `ServiceIllustrations` SVGs to full-column-height compositions. Add CSS keyframe or Framer Motion entrance animations (draw-on for line art, fade-in-up for elements). These replace the canvas-rendered network graph shapes.
9. **Rebuild `WorkScroll` (desktop) and `WorkCarousel` (mobile).** Desktop: GSAP-pinned 3-frame presentation with case study images in device mockups. Mobile: horizontal snap-scroll strip. Both share the same case study data. Screenshots are available at `public/images/work/{slug}.png` (united-way.png, scruggs-tire.png, i-heart-pr-tours.png). Render via `next/image` inside `DeviceMockup` (browser variant).
10. **Rebuild `ResearchSection`.** Standard scroll layout (no pinning). Full-width publication cards with two-column internal layout (metadata left, visual right). Add decorative code-block background on desktop, hidden on mobile.
11. **Rebuild `CTASection`.** Centered layout with orange gradient bloom. Add low-opacity shruggie watermark. Pulse animation on the bloom (desktop only, respects reduced motion).
12. **Rebuild `app/page.tsx` homepage assembly.** Remove `ScrollOrchestrator` wrapper. Compose sections directly. Services and Work sections handle their own GSAP initialization internally (no shared orchestrator state). Each section is self-contained.

<a name="phase-3" id="phase-3"></a>
### Phase 3 — Photography Integration and Polish

**Scope:** Once photography is provided, integrate real images. Final polish pass.

**Work items:**

13. **Integrate team headshots.** Replace `PlaceholderAvatar` in `app/about/page.tsx` with real `next/image` components. Ensure consistent crop and treatment.
14. **Integrate case study images.** No longer a separate step. Screenshots are available at `public/images/work/{slug}.png` and are integrated directly during the Work section rebuild (Phase 2, item 9).
15. **Integrate client logos.** Add grayscale logo row to the Work section intro on the homepage.
16. **Integration testing and performance audit.** Lighthouse audit targeting 90+ on all four metrics. Test on real mobile devices (iOS Safari, Android Chrome). Verify all scroll behaviors, animation frame rates, and reduced-motion fallbacks.

---

<a name="9-files-affected" id="9-files-affected"></a>
<hr class="print-page-break">

## 9. Files Affected

**Deleted (or substantially gutted):**

| File | Action |
|------|--------|
| `components/home/HomeCanvas.tsx` | Delete |
| `components/home/ScrollOrchestrator.tsx` | Delete |
| `lib/canvas/dot-grid.ts` | Delete (logic preserved in `HeroBackground.tsx`) |
| `lib/canvas/network-graph.ts` | Delete |
| `lib/canvas/shapes.ts` | Delete |
| `lib/canvas/planet.ts` | Delete |
| `lib/canvas/skyline.ts` | Delete |
| `lib/canvas/work-graph.ts` | Delete |
| `lib/canvas/scroll-state.ts` | Delete |
| `docs/homepage-scroll-journey-spec.md` | Archive (move to `docs/archive/`) |

**Modified:**

| File | Nature of Change |
|------|-----------------|
| `styles/globals.css` | Extended color palette, updated card treatments, removed canvas-related layout utilities, added section background classes |
| `components/ui/Card.tsx` | Glassmorphism-lite treatment |
| `components/shared/Header.tsx` | Conditional theme toggle visibility based on route |
| `lib/theme.ts` | Route-aware dark mode enforcement |
| `components/home/HeroSection.tsx` | Re-embed `HeroBackground` as a child component (revert to pre-scroll-journey architecture) |
| `components/home/HeroBackground.tsx` | Clip canvas to hero section bounds, restore as standalone |
| `components/home/ServicesScroll.tsx` | Full rebuild (new layout, new visuals, self-contained GSAP) |
| `components/home/WorkScroll.tsx` | Full rebuild (new layout, real images, self-contained GSAP) |
| `components/home/CTASection.tsx` | New gradient bloom treatment, shruggie watermark |
| `app/page.tsx` | Remove ScrollOrchestrator, recompose sections |
| `app/about/page.tsx` | Photo integration (Phase 3) |

**Created:**

| File | Purpose |
|------|---------|
| `components/home/ServicesCarousel.tsx` | Mobile swipeable services strip |
| `components/home/WorkCarousel.tsx` | Mobile swipeable work strip |
| `components/home/ResearchSection.tsx` | Rebuilt research section (replaces ResearchPreview) |
| `components/ui/DeviceMockup.tsx` | Reusable device frame for screenshots |
| `components/ui/SectionProgress.tsx` | Vertical progress dots for pinned sections |
| `hooks/useIsMobile.ts` | Viewport-based mobile detection hook |
| `components/home/ServiceIllustrationsLarge.tsx` | Full-column-height animated service illustrations |

---

<a name="10-open-decisions" id="10-open-decisions"></a>
<hr class="print-page-break">

## 10. Open Decisions Requiring Founder Input

1. **Service illustration style.** The current `ServiceIllustrations` use a Stripe/Linear-inspired geometric line art style in brand green. Should the large-format versions continue this style (scaling it up with more detail and animation), or shift to a different style (e.g., isometric, gradient-filled, mixed-media with photographic elements)?

2. **Client logo permissions.** Can client logos (United Way, Scruggs Tire, I Heart PR Tours) be displayed on the homepage? The knowledge base notes that case study permissions were secured via engagement contracts, but logo usage on the main marketing page may require explicit confirmation.

3. **Case study metrics.** The work section redesign includes space for a key metric per case study (e.g., "Launched in 6 weeks," "100% client-owned infrastructure"). Are there specific metrics or outcomes that should be highlighted for each client?

4. **Photography timeline.** When can team headshots and workspace photography be completed? Phase 3 depends on this. The design should work with placeholders until then, but the visual impact is significantly better with real photos.

5. **Additional brand colors.** This plan introduces teal, blue, purple, and amber as gradient and accent tones. These are not additions to the formal brand palette in the knowledge base; they are working design tones for the website only. Is this distinction acceptable, or should any of these be promoted to official brand colors?

6. **Pages forced to dark mode.** This plan forces dark mode on homepage, services, about, and contact. Should any of these pages allow the light mode toggle instead? The services page in particular has substantial reading content in the pillar sections.

---

*End of plan. This document should be uploaded to the project as the "full vision" reference alongside sequential implementation prompts.*
