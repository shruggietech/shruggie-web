<a name="shruggietech-site-design-consistency-plan" id="shruggietech-site-design-consistency-plan"></a>
# ShruggieTech Site-Wide Design Consistency Plan

| Attribute | Value |
|-----------|-------|
| Subject | Inner Page Design Consistency with Homepage Visual System |
| Version | 1.0.0 |
| Date | 2026-03-16 |
| Status | PROPOSED |
| Audience | AI-first, Human-second |
| Scope | All pages and subpages outside the homepage |
| Depends On | shruggie-web repository (current main), ShruggieTech Website Specification v1.2.0 |

<a name="table-of-contents" id="table-of-contents"></a>
<hr class="print-page-break">

## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Design Gap Analysis](#1-design-gap-analysis)
  - [1.1. Homepage Design Language — What Exists](#11-homepage-design-language)
  - [1.2. Inner Page Baseline — What Is Missing](#12-inner-page-baseline)
  - [1.3. Shared Component Inventory](#13-shared-component-inventory)
- [2. Services Page Redesign](#2-services-page-redesign)
  - [2.1. Page Hero Enhancement](#21-services-page-hero)
  - [2.2. Service Pillar Cards — Glassmorphism Treatment](#22-service-pillar-cards)
  - [2.3. Animated SVG Pillar Illustrations](#23-animated-svg-pillar-illustrations)
  - [2.4. Section Backgrounds and Surface Colors](#24-services-section-backgrounds)
  - [2.5. Engagement Model Visual Polish](#25-engagement-model-polish)
  - [2.6. Ownership Thesis and CTA](#26-ownership-thesis-cta)
- [3. Work Page Redesign](#3-work-page-redesign)
  - [3.1. Page Hero Enhancement](#31-work-page-hero)
  - [3.2. Case Study Grid — DeviceMockup Integration](#32-case-study-grid-device-mockups)
  - [3.3. Section Background and Surface Colors](#33-work-section-backgrounds)
  - [3.4. Individual Case Study Pages](#34-individual-case-study-pages)
- [4. Research Page Redesign](#4-research-page-redesign)
  - [4.1. Page Hero Enhancement](#41-research-page-hero)
  - [4.2. Publication Cards — Decorative Visuals](#42-publication-card-visuals)
  - [4.3. Section Background and Surface Colors](#43-research-section-backgrounds)
  - [4.4. Full-Card Clickability](#44-full-card-clickability)
- [5. Remaining Pages — Consistency Pass](#5-remaining-pages-consistency-pass)
  - [5.1. Products Page](#51-products-page)
  - [5.2. About Page](#52-about-page)
  - [5.3. Blog Index and Post Pages](#53-blog-pages)
  - [5.4. Contact Page](#54-contact-page)
  - [5.5. Audience Landing Pages](#55-audience-landing-pages)
  - [5.6. Utility Pages (Privacy, 404, Error)](#56-utility-pages)
- [6. Cross-Cutting Infrastructure](#6-cross-cutting-infrastructure)
  - [6.1. ThemeEnforcer Route Expansion](#61-theme-enforcer-routes)
  - [6.2. New CSS Utilities and Tokens](#62-new-css-utilities)
  - [6.3. Shared Page Hero Component](#63-shared-page-hero)
- [7. Implementation Sequencing](#7-implementation-sequencing)
- [8. Files Affected](#8-files-affected)

<a name="executive-summary" id="executive-summary"></a>
<hr class="print-page-break">

## Executive Summary

<div style="text-align:justify">

The ShruggieTech homepage has undergone a significant visual overhaul introducing a premium dark design language: section-specific background surfaces (`section-bg-services`, `section-bg-work`, `section-bg-research`, `section-bg-cta`), glassmorphism card treatments, animated SVG illustrations, scroll-driven pinned layouts, `DeviceMockup` browser frames, decorative background patterns, an extended dark-mode typography palette (`text-hero`, `text-body-light`, `text-muted-warm`), orange hover accents on interactive links, and `SectionProgress` navigation. The homepage now feels like a premium, polished product.

</div>

<div style="text-align:justify">

The inner pages (Services, Work, Research, Products, About, Blog, Contact, audience landing pages, and utility pages) were built against the original website specification before the homepage redesign occurred. They use basic `ScrollReveal` animations, standard `Card` components, and vanilla light/dark semantic tokens. The result is a jarring visual drop-off when a visitor navigates from the homepage to any inner page. The homepage says "premium studio"; the inner pages say "template site."

</div>

<div style="text-align:justify">

This plan systematically upgrades every inner page to carry through the homepage design language. The three primary targets (Services, Work, Research) receive the deepest treatment because they are the direct continuations of homepage preview sections and visitors will arrive with visual expectations set by those previews. The remaining pages (Products, About, Blog, Contact, landing pages, utility pages) receive a lighter but consistent pass that applies the same surface colors, typography tokens, card treatments, and interaction patterns.

</div>

<div style="text-align:justify">

The work is organized into six sequential prompts, each scoped for a single Claude Opus 4.6 session in VS Code. The prompts are provided in the companion document `ShruggieTech-Site-Design-Consistency-Prompts.md`.

</div>

---

<a name="1-design-gap-analysis" id="1-design-gap-analysis"></a>
<hr class="print-page-break">

## 1. Design Gap Analysis

<a name="11-homepage-design-language" id="11-homepage-design-language"></a>
### 1.1. Homepage Design Language — What Exists

<div style="text-align:justify">

The homepage redesign established the following visual vocabulary. Every element listed below must carry through to inner pages where contextually appropriate.

</div>

**Surface colors (dark mode):** Four distinct section backgrounds that create visual rhythm and depth as the user scrolls. These are defined in `styles/globals.css` and applied via Tailwind utilities.

| Utility | CSS Variable | Hex | Used On |
|---------|-------------|-----|---------|
| `section-bg-services` | `--surface-dark-warm` | `#0D0F12` | "What We Do" section |
| `section-bg-work` | `--surface-dark-rich` | `#0A0E18` | "Our Work" section |
| `section-bg-research` | `--surface-dark-slate` | `#111318` | Research section |
| `section-bg-cta` | `--surface-dark-deep` | `#060608` | Bottom CTA section |

**Glassmorphism cards:** The `Card` component has a `glass` variant that applies a translucent backdrop-blur treatment with a subtle border glow. Used for service cards and work cards on the homepage.

**Animated SVG illustrations:** The `ServiceIllustrationsLarge` component provides four full-viewport animated SVG illustrations (one per service pillar) with CSS keyframe entrance animations (draw-on, fade-in, pulse). These are triggered by the active card in the scroll-driven layout.

**DeviceMockup frames:** Browser chrome and mobile frame wrappers that present case study screenshots in realistic device contexts. Used in the "Our Work" homepage section.

**Extended typography tokens (dark mode only):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-hero` | `#F0F0F0` | Hero headlines on dark surfaces |
| `--text-body-light` | `#B0B4BC` | Body text on dark surfaces (lighter than `--text-secondary`) |
| `--text-muted-warm` | `#7A7F8A` | Muted labels and captions on dark surfaces |

**Interaction patterns:**

| Pattern | Implementation |
|---------|---------------|
| Link hover color | Orange (`#FF5300`) on "Learn more →" and "Read case study →" links |
| Card hover | Border transitions to `accent/40`, subtle green box-shadow glow |
| `ScrollReveal` | Framer Motion scroll-triggered entrance with staggered delays |
| `SectionHeading` | Consistent label/title/description pattern across all sections |

**CTA treatment:** `ShruggieCTA` component with shruggie hover/scroll tagline reveal. Used at the bottom of every major page.

<a name="12-inner-page-baseline" id="12-inner-page-baseline"></a>
### 1.2. Inner Page Baseline — What Is Missing

<div style="text-align:justify">

The following gaps exist across inner pages. Each gap represents a place where the homepage sets an expectation that the inner page does not meet.

</div>

| Gap | Homepage | Inner Pages |
|-----|----------|-------------|
| Section backgrounds | Distinct surface colors per section | Flat `bg-bg-primary` everywhere |
| Card treatment | Glassmorphism (`card-glass`) with glow | Standard `Card` with basic border |
| Hero treatment | Rich gradient mesh, canvas, `display-xl` | Plain `SectionHeading` with basic padding |
| Visual illustrations | Animated SVGs, decorative patterns | No illustrations or decorative elements |
| Work presentation | `DeviceMockup` browser frames | Basic hero image or placeholder |
| Research visuals | Decorative graphics (ADF, Multi-Agent, Rustif) | Plain text cards |
| Typography depth | Extended tokens (`text-hero`, `text-body-light`) | Standard `text-primary`/`text-secondary` only |
| Link hover | Orange (`#FF5300`) | Default accent green |
| Dark mode enforcement | `ThemeEnforcer` forces dark on homepage and `/services` | Most pages allow light mode (visual mismatch) |
| Page hero impact | Full-viewport hero with background treatment | Small heading + subheadline with minimal spacing |

<a name="13-shared-component-inventory" id="13-shared-component-inventory"></a>
### 1.3. Shared Component Inventory

<div style="text-align:justify">

These components already exist and can be reused directly on inner pages. No modifications needed.

</div>

| Component | Location | Reuse Opportunity |
|-----------|----------|-------------------|
| `ScrollReveal` | `components/shared/ScrollReveal.tsx` | Already used on most pages; ensure stagger delays are consistent |
| `SectionHeading` | `components/ui/SectionHeading.tsx` | Already used; no changes needed |
| `ShruggieCTA` | `components/ui/ShruggieCTA.tsx` | Used on Services and Contact; add to Work, Research, Products |
| `Card` (with `glass` variant) | `components/ui/Card.tsx` | Extend usage to inner page cards |
| `Badge` | `components/ui/Badge.tsx` | Already used on Products and Work |
| `DeviceMockup` | `components/shared/DeviceMockup.tsx` | Reuse on Work index page |
| `JsonLd` | `components/shared/JsonLd.tsx` | Already in place |

---

<a name="2-services-page-redesign" id="2-services-page-redesign"></a>
<hr class="print-page-break">

## 2. Services Page Redesign

<div style="text-align:justify">

The Services page is the direct continuation of the homepage "What We Do" section. A visitor who clicks "Learn more →" on a homepage service card lands on `/services` and should feel continuity in color, card treatment, illustration style, and overall density. The current Services page is text-heavy with minimal visual interest.

</div>

<a name="21-services-page-hero" id="21-services-page-hero"></a>
### 2.1. Page Hero Enhancement

**Current behavior:** Standard `SectionHeading` with headline "Services" and a subheadline paragraph. No background treatment, no visual impact.

**Target behavior:** A hero section that echoes the homepage hero's density without duplicating it. Full-width dark section with the `section-bg-services` background. Headline in `display-lg` (one step below the homepage `display-xl` to signal subpage hierarchy). Subheadline in `text-body-light`. Generous vertical padding (`pt-32 pb-20 md:pt-40 md:pb-28`).

**Implementation approach:**

<div style="text-align:justify">

Use the shared `PageHero` component (see §6.3) with `section-bg-services` as the background. Use the extended typography tokens for text colors.

</div>

**Affected files:** `app/services/page.tsx`

<a name="22-service-pillar-cards" id="22-service-pillar-cards"></a>
### 2.2. Service Pillar Cards — Glassmorphism Treatment

**Current behavior:** Each service pillar is a full-width text section with a title, lead paragraph, body text, and a capabilities list. No card wrapper, no visual boundary, no background differentiation. The four pillars are visually indistinguishable from each other.

**Target behavior:** Each pillar is wrapped in a glassmorphism `Card` (the `glass` variant) with a Lucide icon matching the homepage cards (`Palette`, `Code2`, `TrendingUp`, `Brain`). The card has a left-aligned accent stripe in brand green at 20% opacity. Capabilities lists use the existing green dot markers but are rendered within the card boundary.

**Implementation approach:**

<div style="text-align:justify">

Wrap each pillar section's content in a `Card glass` container. Add the matching Lucide icon above the title, sized at 32px with `text-accent` color. Add a `border-l-2 border-accent/20` left accent stripe to the card. Keep the existing anchor IDs (`#strategy-brand`, `#development`, etc.) on the wrapping `<section>` element so deep links from the homepage still work.

</div>

**Affected files:** `app/services/page.tsx`

<a name="23-animated-svg-pillar-illustrations" id="23-animated-svg-pillar-illustrations"></a>
### 2.3. Animated SVG Pillar Illustrations

**Current behavior:** No illustrations on the Services page.

**Target behavior:** Each pillar card is accompanied by a smaller version of the corresponding animated SVG illustration from the homepage. On desktop, use a two-column layout (text left, illustration right) for each pillar. On mobile, the illustration appears above the card content at reduced height.

**Implementation approach:**

<div style="text-align:justify">

Import the `ServiceIllustrationsLarge` component set and render the corresponding illustration alongside each pillar card. Use `ScrollReveal` to trigger the SVG entrance animation when the pillar scrolls into view. The illustration container should be sized to approximately 40% of the content width on desktop, with `max-h-[400px]` to prevent oversizing. Apply `is-animating` class on intersection.

</div>

**Affected files:** `app/services/page.tsx`

<a name="24-services-section-backgrounds" id="24-services-section-backgrounds"></a>
### 2.4. Section Backgrounds and Surface Colors

**Current behavior:** The entire Services page uses `bg-bg-primary` (flat black in dark mode). No visual rhythm between sections.

**Target behavior:** Alternate section backgrounds to create visual rhythm:

| Section | Background |
|---------|-----------|
| Hero | `section-bg-services` (`#0D0F12`) |
| Pillars A and C | `bg-bg-primary` (`#000000`) |
| Pillars B and D | `section-bg-services` (`#0D0F12`) |
| Engagement Model | `section-bg-work` (`#0A0E18`) |
| Ownership Thesis | `bg-bg-primary` |
| CTA | `section-bg-cta` (`#060608`) |

**Affected files:** `app/services/page.tsx`

<a name="25-engagement-model-polish" id="25-engagement-model-polish"></a>
### 2.5. Engagement Model Visual Polish

**Current behavior:** The `EngagementModel` component uses standard `bg-bg-elevated` cards on a flat background.

**Target behavior:** Apply `section-bg-work` background to the Engagement Model section wrapper. Upgrade phase cards to the `glass` variant. Add a subtle gradient border glow on the active (expanded) card matching the homepage's green glow pattern.

**Affected files:** `app/services/page.tsx`, `app/services/EngagementModel.tsx`

<a name="26-ownership-thesis-cta" id="26-ownership-thesis-cta"></a>
### 2.6. Ownership Thesis and CTA

**Current behavior:** Plain text section with no visual differentiation.

**Target behavior:** The Ownership Thesis section gets a thin `border-t border-accent/10` top separator. The CTA section uses `section-bg-cta` background with `ShruggieCTA` centered.

**Affected files:** `app/services/page.tsx`

---

<a name="3-work-page-redesign" id="3-work-page-redesign"></a>
<hr class="print-page-break">

## 3. Work Page Redesign

<div style="text-align:justify">

The Work page is the direct continuation of the homepage "Our Work" section. Visitors who click "Read case study →" from the homepage arrive here expecting the same `DeviceMockup` frames, dark surface backgrounds, and visual polish.

</div>

<a name="31-work-page-hero" id="31-work-page-hero"></a>
### 3.1. Page Hero Enhancement

**Target behavior:** Full-width hero with `section-bg-work` background. Headline in `display-lg`, subheadline in `text-body-light`.

**Affected files:** `app/work/page.tsx`

<a name="32-case-study-grid-device-mockups" id="32-case-study-grid-device-mockups"></a>
### 3.2. Case Study Grid — DeviceMockup Integration

**Current behavior:** Basic card grid with hero images or placeholders. Standard `Card` component.

**Target behavior:** Each case study card features a `DeviceMockup` (browser chrome frame) presenting the case study screenshot. Cards use the `glass` variant. "Read case study →" links use orange hover color. The entire card is clickable (Link wraps Card).

**Affected files:** `app/work/page.tsx`

<a name="33-work-section-backgrounds" id="33-work-section-backgrounds"></a>
### 3.3. Section Background and Surface Colors

| Section | Background |
|---------|-----------|
| Hero | `section-bg-work` |
| Case Study Grid | `bg-bg-primary` |
| CTA (add if missing) | `section-bg-cta` |

**Affected files:** `app/work/page.tsx`, `lib/route-theme.ts`

<a name="34-individual-case-study-pages" id="34-individual-case-study-pages"></a>
### 3.4. Individual Case Study Pages

**Current behavior:** MDX-rendered content with standard prose styling. No hero treatment.

**Target behavior:** `PageHero` with client name as headline and `section-bg-work` background. Full-width `DeviceMockup` below the hero. "Services Used" section renders as `Badge` components in a `Card glass` wrapper. Bottom CTA via `ShruggieCTA`.

**Affected files:** `app/work/[slug]/page.tsx`

---

<a name="4-research-page-redesign" id="4-research-page-redesign"></a>
<hr class="print-page-break">

## 4. Research Page Redesign

<a name="41-research-page-hero" id="41-research-page-hero"></a>
### 4.1. Page Hero Enhancement

**Target behavior:** `PageHero` with `section-bg-research` background.

**Affected files:** `app/research/page.tsx`

<a name="42-publication-card-visuals" id="42-publication-card-visuals"></a>
### 4.2. Publication Cards — Decorative Visuals

**Current behavior:** Three vertically stacked text-only cards.

**Target behavior:** Two-column layout per card (text left, decorative SVG visual right). Cards use `glass` variant. Visuals are the same `ADFVisual`, `MultiAgentVisual`, `RustifVisual` components from the homepage, extracted into a shared module. "Read paper →" links use orange hover color.

**Affected files:** `app/research/page.tsx`, new `components/shared/ResearchVisuals.tsx`, `components/home/ResearchSection.tsx`

<a name="43-research-section-backgrounds" id="43-research-section-backgrounds"></a>
### 4.3. Section Background and Surface Colors

| Section | Background |
|---------|-----------|
| Hero | `section-bg-research` |
| Publication Cards | `section-bg-research` (Card glass provides contrast) |
| CTA | `section-bg-cta` |

**Affected files:** `app/research/page.tsx`, `lib/route-theme.ts`

<a name="44-full-card-clickability" id="44-full-card-clickability"></a>
### 4.4. Full-Card Clickability

**Target behavior:** The entire card is clickable. Link-wraps-Card pattern (no nested `<a>` tags). Inner "Read paper →" becomes a styled `<span>`. Keyboard-navigable.

**Affected files:** `app/research/page.tsx`

---

<a name="5-remaining-pages-consistency-pass" id="5-remaining-pages-consistency-pass"></a>
<hr class="print-page-break">

## 5. Remaining Pages — Consistency Pass

<a name="51-products-page" id="51-products-page"></a>
### 5.1. Products Page

<div style="text-align:justify">

`PageHero` with new `section-bg-products` surface (`#0E1014`). Product cards upgrade to `Card glass` with Lucide icons (`Package`, `Database`, `FileText`, `Cpu`). "How We Build Software" section gets `section-bg-cta` background. `ShruggieCTA` at bottom. Orange hover on GitHub/Docs links. Dark mode enforcement.

</div>

**Affected files:** `app/products/page.tsx`, `lib/route-theme.ts`, `styles/globals.css`

<a name="52-about-page" id="52-about-page"></a>
### 5.2. About Page

<div style="text-align:justify">

`PageHero` with `section-bg-services` background. Team cards and values cards upgrade to `Card glass`. Origin story gets `text-body-lg` and `text-body-light` tokens. Alternating section backgrounds. `ShruggieCTA` at bottom. Dark mode enforcement.

</div>

**Affected files:** `app/about/page.tsx`, `lib/route-theme.ts`

<a name="53-blog-pages" id="53-blog-pages"></a>
### 5.3. Blog Index and Post Pages

<div style="text-align:justify">

NO dark mode enforcement (reading comfort). Blog index hero uses `PageHero` with `bg-bg-secondary`. `PostCard` title gets orange hover. Post pages get `border-t border-accent/10` separator. `TableOfContents` gets `text-muted-warm` dark mode token. `ShruggieCTA` at bottom of index.

</div>

**Affected files:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `components/blog/PostCard.tsx`

<a name="54-contact-page" id="54-contact-page"></a>
### 5.4. Contact Page

<div style="text-align:justify">

`PageHero` with `section-bg-cta` background. Form wrapped in `Card glass`. Input fields get glassmorphic treatment. "Direct Contact" section gets `section-bg-services` background. Dark mode enforcement.

</div>

**Affected files:** `app/contact/page.tsx`, `lib/route-theme.ts`

<a name="55-audience-landing-pages" id="55-audience-landing-pages"></a>
### 5.5. Audience Landing Pages (`/for/*`)

<div style="text-align:justify">

`LandingPageTemplate` updated to use `PageHero` with `section-bg-services`. Pain point cards upgrade to `Card glass`. Social proof section gets `section-bg-work` background. Dark mode enforcement for all `/for/` routes.

</div>

**Affected files:** `components/shared/LandingPageTemplate.tsx`, `lib/route-theme.ts`

<a name="56-utility-pages" id="56-utility-pages"></a>
### 5.6. Utility Pages (Privacy, 404, Error)

<div style="text-align:justify">

**Privacy:** `PageHero` with `bg-bg-secondary`. No dark mode enforcement. **404:** `section-bg-cta` background, orange hover on nav links. **Error:** `section-bg-cta` background.

</div>

**Affected files:** `app/privacy/page.tsx`, `app/not-found.tsx`, `app/error.tsx`

---

<a name="6-cross-cutting-infrastructure" id="6-cross-cutting-infrastructure"></a>
<hr class="print-page-break">

## 6. Cross-Cutting Infrastructure

<a name="61-theme-enforcer-routes" id="61-theme-enforcer-routes"></a>
### 6.1. ThemeEnforcer Route Expansion

**Current state:** Forces dark mode on `/` and `/services`.

**Target state:**

| Route | Enforced | Reason |
|-------|----------|--------|
| `/` | Yes | Already enforced |
| `/services` | Yes | Already enforced |
| `/work` (prefix) | Yes | Continues "Our Work" homepage section |
| `/research` | Yes | Continues Research homepage section |
| `/products` | Yes | Technical product showcase |
| `/about` | Yes | Team/company showcase |
| `/contact` | Yes | Conversion page |
| `/for/` (prefix) | Yes | Audience landing pages |
| `/blog` | **No** | Reading comfort |
| `/privacy` | **No** | Reading comfort |

**Affected files:** `lib/route-theme.ts`

<a name="62-new-css-utilities" id="62-new-css-utilities"></a>
### 6.2. New CSS Utilities and Tokens

Add to `styles/globals.css`:

```css
.dark {
  --surface-dark-products: #0E1014;
}

@utility section-bg-products {
  background-color: var(--surface-dark-products);
}
```

**Affected files:** `styles/globals.css`

<a name="63-shared-page-hero" id="63-shared-page-hero"></a>
### 6.3. Shared Page Hero Component

Create `components/shared/PageHero.tsx`:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `headline` | `string` | Yes | Page title in `display-lg` |
| `subheadline` | `string` | No | Supporting paragraph in `text-body-light` |
| `bgClass` | `string` | No | Background utility class. Defaults to empty string. |
| `children` | `ReactNode` | No | Optional additional content below the subheadline |

<div style="text-align:justify">

Renders a full-width `<section>` with the specified background class, vertical padding `pt-32 pb-16 md:pt-40 md:pb-24`, `container-content` inner wrapper, `<h1>` in `font-display text-display-lg font-bold` with `dark:text-[var(--text-hero)] text-text-primary`, `<p>` in `mt-6 text-body-lg max-w-3xl` with `dark:text-[var(--text-body-light)] text-text-secondary`, and children. Wrapped in `ScrollReveal`.

</div>

**Affected files:** New `components/shared/PageHero.tsx`

---

<a name="7-implementation-sequencing" id="7-implementation-sequencing"></a>
<hr class="print-page-break">

## 7. Implementation Sequencing

| Prompt | Scope | Estimated Complexity |
|--------|-------|---------------------|
| 1 | Infrastructure: `PageHero`, `ThemeEnforcer` routes, CSS tokens, `ResearchVisuals` extraction | Light |
| 2 | Services page full redesign | Heavy |
| 3 | Work page full redesign (index + case study detail pages) | Heavy |
| 4 | Research page full redesign | Medium |
| 5 | Products page + About page consistency pass | Medium |
| 6 | Blog, Contact, Landing pages, Utility pages consistency pass | Medium |

<div style="text-align:justify">

The prompts are ordered to minimize cross-cutting dependency conflicts: infrastructure first (Prompt 1), then the three primary pages that mirror homepage sections (Prompts 2-4), then the secondary pages (Prompts 5-6). Each prompt is self-contained. The complete prompt text is provided in the companion document `ShruggieTech-Site-Design-Consistency-Prompts.md`.

</div>

---

<a name="8-files-affected" id="8-files-affected"></a>
<hr class="print-page-break">

## 8. Files Affected

| File | Prompt | Nature of Change |
|------|--------|-----------------|
| `components/shared/PageHero.tsx` | 1 | New file |
| `components/shared/ResearchVisuals.tsx` | 1 | New file (extracted from ResearchSection) |
| `lib/route-theme.ts` | 1 | Modified (expanded route list) |
| `styles/globals.css` | 1 | Modified (new `section-bg-products` utility) |
| `components/home/ResearchSection.tsx` | 1 | Modified (import from shared module) |
| `app/services/page.tsx` | 2 | Modified (major redesign) |
| `app/services/EngagementModel.tsx` | 2 | Modified (glassmorphism upgrade) |
| `app/work/page.tsx` | 3 | Modified (major redesign) |
| `app/work/[slug]/page.tsx` | 3 | Modified (hero, mockup, CTA additions) |
| `app/research/page.tsx` | 4 | Modified (major redesign) |
| `app/products/page.tsx` | 5 | Modified (hero, cards, CTA) |
| `app/about/page.tsx` | 5 | Modified (hero, cards, backgrounds) |
| `app/blog/page.tsx` | 6 | Modified (hero, CTA) |
| `app/blog/[slug]/page.tsx` | 6 | Modified (separator) |
| `components/blog/PostCard.tsx` | 6 | Modified (hover color) |
| `components/blog/TableOfContents.tsx` | 6 | Modified (dark mode token) |
| `app/contact/page.tsx` | 6 | Modified (hero, form card, section bg) |
| `components/shared/LandingPageTemplate.tsx` | 6 | Modified (hero, cards, backgrounds) |
| `app/privacy/page.tsx` | 6 | Modified (hero) |
| `app/not-found.tsx` | 6 | Modified (background, hover) |
| `app/error.tsx` | 6 | Modified (background) |

---

*This plan is the authoritative reference for the ShruggieTech site-wide design consistency work. Implementation prompts are provided in the companion document `ShruggieTech-Site-Design-Consistency-Prompts.md`.*
