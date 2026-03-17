<a name="shruggietech-site-updates-plan-v2" id="shruggietech-site-updates-plan-v2"></a>
# ShruggieTech Site Updates Plan v2

| Attribute | Value |
|-----------|-------|
| Subject | ShruggieTech Website Feedback-Driven Updates |
| Version | 2.0.0 |
| Date | 2026-03-16 |
| Status | PROPOSED |
| Audience | AI-first, Human-second |
| Scope | All pages, global components, and one bug fix |
| Depends On | shruggie-web repository (current main), ShruggieTech Website Specification v1.2.0, ShruggieTech-Site-Design-Consistency-Plan v1.0.0 |

<a name="table-of-contents" id="table-of-contents"></a>
<hr class="print-page-break">

## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Global Components](#1-global-components)
  - [1.1. Home Page — Mobile Carousel Swipe Sensitivity](#11-home-page-mobile-carousel-swipe-sensitivity)
  - [1.2. Mobile Navigation — Add Home Link](#12-mobile-navigation-add-home-link)
  - [1.3. Footer — Products List Update](#13-footer-products-list-update)
  - [1.4. Footer — Social Media Links](#14-footer-social-media-links)
  - [1.5. Bug Fix — Logo Theme Toggle on Blog Page](#15-bug-fix-logo-theme-toggle-on-blog-page)
- [2. Services Page](#2-services-page)
  - [2.1. Remove Card Wrappers from Service Pillars](#21-remove-card-wrappers-from-service-pillars)
  - [2.2. Side-by-Side SVG Layout with Alternating Sides](#22-side-by-side-svg-layout-with-alternating-sides)
  - [2.3. Reimagine How We Work Section](#23-reimagine-how-we-work-section)
  - [2.4. Add Visual Interest to Ownership Thesis Section](#24-add-visual-interest-to-ownership-thesis-section)
  - [2.5. Interactive CTA Background](#25-interactive-cta-background)
- [3. Work Pages](#3-work-pages)
  - [3.1. Add Screenshots to Work Index Cards](#31-add-screenshots-to-work-index-cards)
  - [3.2. Add Screenshots to Work Subpages](#32-add-screenshots-to-work-subpages)
  - [3.3. Expand Content Width on Work Subpages](#33-expand-content-width-on-work-subpages)
  - [3.4. Link Services Used to Service Anchors](#34-link-services-used-to-service-anchors)
  - [3.5. Interactive CTA Background on Work Subpages](#35-interactive-cta-background-on-work-subpages)
- [4. Research Page](#4-research-page)
  - [4.1. Expand Content Width](#41-expand-content-width)
  - [4.2. Interactive CTA Background](#42-interactive-cta-background)
- [5. Products Page](#5-products-page)
  - [5.1. Add Visual Interest to How We Build Software](#51-add-visual-interest-to-how-we-build-software)
  - [5.2. Add CTA One-Liner and Interactive Background](#52-add-cta-one-liner-and-interactive-background)
- [6. About Page](#6-about-page)
  - [6.1. Add Visual Interest to Where We Come From](#61-add-visual-interest-to-where-we-come-from)
  - [6.2. Add Social Links to Team Members](#62-add-social-links-to-team-members)
  - [6.3. Redesign Team Cards with Flip Interaction](#63-redesign-team-cards-with-flip-interaction)
  - [6.4. Default Glow on What We Believe Cards](#64-default-glow-on-what-we-believe-cards)
  - [6.5. Add CTA One-Liner and Interactive Background](#65-add-cta-one-liner-and-interactive-background)
- [7. Blog Pages](#7-blog-pages)
  - [7.1. Add Top Spacing to First Post](#71-add-top-spacing-to-first-post)
  - [7.2. Expand Content Width and Card Layout](#72-expand-content-width-and-card-layout)
  - [7.3. Add CTA One-Liner and Interactive Background](#73-add-cta-one-liner-and-interactive-background)
  - [7.4. Add Feature Image to Blog Posts](#74-add-feature-image-to-blog-posts)
  - [7.5. Expand Blog Post Content Width](#75-expand-blog-post-content-width)
  - [7.6. Fix Code Block Text Highlighting](#76-fix-code-block-text-highlighting)
- [8. Get in Touch Page](#8-get-in-touch-page)
  - [8.1. Expand Content Width](#81-expand-content-width)
  - [8.2. Remove Hover Glow from Contact Card](#82-remove-hover-glow-from-contact-card)
  - [8.3. Remove Direct Contact Section](#83-remove-direct-contact-section)
- [9. Implementation Sequencing](#9-implementation-sequencing)
- [10. Prompt Sequence](#10-prompt-sequence)

<a name="executive-summary" id="executive-summary"></a>
<hr class="print-page-break">

## Executive Summary

<div style="text-align:justify">

This plan addresses 30 discrete feedback items spanning the entire ShruggieTech website. The items range from quick cosmetic fixes (adding top spacing to a blog list, removing a hover glow) to substantial UX redesigns (reimagining the How We Work accordion/cycle interaction on the Services page, redesigning the About page team cards with a flip interaction and social links). A recurring theme is the introduction of an interactive CTA background (matching the homepage's `ParticleSky` + `KnoxvilleSkyline` treatment) across all page-level CTA sections that currently lack visual interest. Another recurring theme is expanding content width on several pages that currently use `container-narrow` (720px) where `container-content` (1200px) would be more appropriate.

</div>

<div style="text-align:justify">

The plan is organized into 8 prompts for sequential execution in Claude Opus 4.6 via VS Code. Each prompt is self-contained and produces a buildable, testable state. Dependencies flow forward (Prompt 1 establishes shared components reused in later prompts).

</div>

<a name="1-global-components" id="1-global-components"></a>
<hr class="print-page-break">

## 1. Global Components

<a name="11-home-page-mobile-carousel-swipe-sensitivity" id="11-home-page-mobile-carousel-swipe-sensitivity"></a>
### 1.1. Home Page — Mobile Carousel Swipe Sensitivity

**Current behavior:** The "What We Do" mobile carousel in `ServicesCarousel.tsx` uses native CSS `snap-x snap-mandatory` with `scroll-smooth` and `WebkitOverflowScrolling: "touch"`. A normal swipe gesture overshoots, jumping from card 1 to card 3 or 4 instead of advancing one card at a time.

**Root cause:** The native scroll-snap behavior combined with `scroll-smooth` and Lenis's `touchMultiplier: 1.5` amplifies swipe velocity. The browser's momentum scrolling carries the container past multiple snap points before settling.

**Target behavior:** One swipe advances exactly one card, regardless of swipe velocity.

**Implementation approach:**

<div style="text-align:justify">

Replace the native scroll-snap behavior with a controlled touch handler. Intercept `touchstart`/`touchmove`/`touchend` events on the scroll container. On `touchend`, calculate the swipe direction from the horizontal delta. If the delta exceeds a minimum threshold (e.g., 30px), programmatically scroll to the next or previous card using `scrollTo` with `behavior: "smooth"`. Clamp the target index so it can only advance or retreat by one card per swipe. Set `overflow-x: hidden` during the programmatic scroll to prevent momentum from carrying past the target, then restore it. Remove `scroll-smooth` from the container's CSS since scrolling is now controlled programmatically. Keep the `snap-x snap-mandatory` classes as a fallback for non-touch interactions (e.g., trackpad horizontal scroll on desktop, though the carousel is mobile-only). Alternatively, remove snap classes entirely and rely solely on the touch handler plus the indicator dot click handler for navigation.

</div>

**Affected files:** `components/home/ServicesCarousel.tsx`

<a name="12-mobile-navigation-add-home-link" id="12-mobile-navigation-add-home-link"></a>
### 1.2. Mobile Navigation — Add Home Link

**Current behavior:** `MobileNav.tsx` lists seven links: Services, Work, Research, Products, About, Blog, and Get in Touch. There is no "Home" link.

**Target behavior:** Add "Home" as the first item in the navigation list, linking to `/`.

**Implementation approach:** Prepend `{ href: "/", label: "Home" }` to the `NAV_LINKS` array in `MobileNav.tsx`.

**Affected files:** `components/layout/MobileNav.tsx`

<a name="13-footer-products-list-update" id="13-footer-products-list-update"></a>
### 1.3. Footer — Products List Update

**Current behavior:** The Products column in `Footer.tsx` lists three products: shruggie-indexer, metadexer, and rustif.

**Target behavior:** Add shruggie-feedtools to the product list.

**Implementation approach:** Append `{ href: "/products#shruggie-feedtools", label: "shruggie-feedtools" }` to the `PRODUCT_LINKS` array in `Footer.tsx`. Verify that the `#shruggie-feedtools` anchor ID exists on the Products page; if not, add it.

**Affected files:** `components/layout/Footer.tsx`, potentially `app/products/page.tsx`

<a name="14-footer-social-media-links" id="14-footer-social-media-links"></a>
### 1.4. Footer — Social Media Links

**Current behavior:** The Connect column in the footer contains only a single GitHub link with an icon.

**Target behavior:** Replace the single GitHub link with a row of social media icons linking to all company accounts:

| Platform | URL | Icon |
|----------|-----|------|
| GitHub | https://github.com/shruggietech | `Github` (Lucide) |
| Facebook | https://www.facebook.com/shruggietech | `Facebook` (Lucide) |
| Instagram | https://www.instagram.com/shruggietech | `Instagram` (Lucide) |
| Twitter/X | https://x.com/shruggietech | `Twitter` (Lucide) |

**Implementation approach:**

<div style="text-align:justify">

Replace the single `<a>` element in Column 4 with a `SOCIAL_LINKS` array of objects (`{ href, label, Icon }`). Render them as a flex row of icon links with consistent sizing (20px icons), appropriate `aria-label` attributes for accessibility, and the same hover/focus styling as the current GitHub link. All links open in new tabs with `target="_blank" rel="noopener noreferrer"`.

</div>

**Affected files:** `components/layout/Footer.tsx`

<a name="15-bug-fix-logo-theme-toggle-on-blog-page" id="15-bug-fix-logo-theme-toggle-on-blog-page"></a>
### 1.5. Bug Fix — Logo Theme Toggle on Blog Page

**Current behavior:** On the blog page (which does not enforce dark mode), switching to light mode works correctly. However, switching back to dark mode does not update the ShruggieTech logo in the navigation header back to the dark-background variant. The logo remains stuck on the light-background variant.

**Root cause analysis:**

<div style="text-align:justify">

The `Header.tsx` component tracks theme state via a local `isDark` React state variable, initialized by reading `document.documentElement.classList.contains("dark")` in a `useEffect`. The `toggleTheme` callback updates this state and toggles the class. However, on routes where `ThemeEnforcer` is not active (like `/blog`), the header's `isDark` state can fall out of sync with the actual DOM class if another mechanism (e.g., the Lenis provider, a race condition with hydration, or the theme initialization script) modifies the `dark` class without going through the Header's `toggleTheme` function. Specifically, the Header's logo rendering uses `isDark` state to conditionally show/hide images via `hidden dark:block` and `block dark:hidden` CSS classes. If the React state `isDark` is correct but the CSS `dark:` variant is not being applied (or vice versa), the wrong logo displays.

</div>

<div style="text-align:justify">

The most robust fix is to remove the `isDark`-based conditional rendering for the logo entirely and rely purely on CSS `dark:` variant classes, which is what the Footer already does successfully. The Footer uses `hidden dark:block` and `block dark:hidden` without any React state, and it works correctly across all pages. The Header should adopt the same pattern for its logo rendering. The `isDark` state should only be used for the Sun/Moon icon toggle, not for logo source selection.

</div>

**Implementation approach:** In `Header.tsx`, change the logo `<Image>` elements to use the same CSS-only dark-mode switching pattern as the Footer: one image with `className="hidden dark:block"` and the other with `className="block dark:hidden"`. Remove any `isDark`-conditional rendering for the logo. Add a `MutationObserver` on `document.documentElement` to watch for class changes and keep the `isDark` state in sync for the Sun/Moon icon, or simply derive the icon from CSS as well.

**Affected files:** `components/layout/Header.tsx`

<a name="2-services-page" id="2-services-page"></a>
<hr class="print-page-break">

## 2. Services Page

<a name="21-remove-card-wrappers-from-service-pillars" id="21-remove-card-wrappers-from-service-pillars"></a>
### 2.1. Remove Card Wrappers from Service Pillars

**Current behavior:** Each service pillar is wrapped in a glassmorphism `Card` component (`ServicePillarSection`) with a left-accent stripe.

**Target behavior:** Remove the card wrapper entirely. Service pillars render as open sections with text and SVG illustration side by side (desktop/tablet) or stacked (mobile).

**Implementation approach:**

<div style="text-align:justify">

Modify `ServicePillarSection` (or inline the rendering in `app/services/page.tsx`) to remove the `Card` wrapper. Each pillar becomes a full-width `<section>` with an `id` for anchor linking. Content renders directly inside `container-content` without a card boundary. Retain the alternating background classes (`bg-bg-primary` / `section-bg-services`) on the section element itself for visual separation.

</div>

**Affected files:** `app/services/page.tsx`, `components/services/ServicePillarSection.tsx` (or equivalent)

<a name="22-side-by-side-svg-layout-with-alternating-sides" id="22-side-by-side-svg-layout-with-alternating-sides"></a>
### 2.2. Side-by-Side SVG Layout with Alternating Sides

**Current behavior:** SVG illustrations are positioned in a fixed layout relative to the text content.

**Target behavior:**

| Viewport | Layout |
|----------|--------|
| Desktop/Tablet | Two-column row: text on one side, SVG on the other. The SVG alternates sides (Pillar A: text left / SVG right; Pillar B: SVG left / text right; etc.). |
| Mobile | Single column: SVG stacked above text. The full SVG is visible without cropping. |

**Implementation approach:**

<div style="text-align:justify">

Use a CSS Grid or Flexbox two-column layout with `md:flex-row` for desktop and `flex-col` for mobile. Pass the pillar `index` to the component and use `index % 2 === 0` to determine the order: even pillars get `md:flex-row` (text left, SVG right), odd pillars get `md:flex-row-reverse` (SVG left, text right). On mobile, always render the SVG first (above text) using source order `flex-col` with the SVG element appearing before the text element in the DOM. Ensure the SVG container has no `overflow: hidden`, no fixed height that would crop, and uses `w-full` with `aspect-ratio` or `max-height` to display the full illustration. The SVGs should use `object-contain` or direct `viewBox` scaling to prevent cropping.

</div>

**Affected files:** `app/services/page.tsx`, `components/services/ServicePillarSection.tsx`

<a name="23-reimagine-how-we-work-section" id="23-reimagine-how-we-work-section"></a>
### 2.3. Reimagine How We Work Section

**Current behavior:** Three expandable phase cards (01, 02, 03) connected by an animated SVG dashed line. Expanding a card causes the section to resize, making the page jump as content shifts.

**Target behavior:** A split layout with an accordion on one side and a cycle diagram SVG on the other:

| Component | Description |
|-----------|-------------|
| Left side (desktop) / Top (mobile) | Three accordion panels (Steps 1, 2, 3). Clicking a panel expands it to show the phase details and deliverables. Only one panel is open at a time. The section height remains stable because the accordion container has a fixed minimum height based on the tallest expanded state. |
| Right side (desktop) / Bottom (mobile) | An SVG cycle diagram with three curved arrows forming a circular flow. Each arrow segment corresponds to a phase. When a phase's accordion panel is active, its corresponding arrow segment fills with brand green (the inactive segments remain muted/gray). The phase number or title appears at each node of the cycle. |

**Content mapping (from existing data):**

| Phase | Title | Description | Deliverables |
|-------|-------|-------------|--------------|
| 01 | Foundation & Setup | "We establish your brand assets, deploy modern web infrastructure, and integrate the systems your business needs to operate independently. The goal is a functional, consistently branded digital presence." | Brand identity system, website build and deployment, DNS and hosting on infrastructure you own, booking/payment integrations |
| 02 | Optimization & Growth | "Once systems are in place, we make them perform. Algorithm analysis, content freshness, A/B testing, and conversion optimization across every relevant platform." | SEO and AEO implementation, analytics architecture (GA4, GTM), ad campaign setup and tuning, review generation workflows |
| 03 | Ongoing Partnership | "Continuous storytelling, community engagement, channel expansion, and reputation management. We grow with you." | Social media content calendar, monthly performance reporting, content refresh cycles, channel expansion strategy |

**Implementation approach:**

<div style="text-align:justify">

Replace the `EngagementModel` component. Create a new client component (e.g., `ProcessAccordion.tsx`) that maintains `activePhase` state (default: 0, the first phase). The accordion panels use `Framer Motion` `AnimatePresence` and `motion.div` with `layout` for smooth height transitions. The container uses `min-h-[400px]` (or calculated from content) to prevent page jumping. The cycle SVG is a separate inline SVG with three arrow path segments. Each segment has a `stroke` that transitions between `var(--color-gray-600)` (inactive) and `var(--color-green-bright)` (active) using CSS transitions keyed off a data attribute or class controlled by `activePhase`. On mobile, stack the accordion above the SVG. On desktop, use a two-column grid (`md:grid-cols-2`) with the accordion on the left and the SVG on the right.

</div>

**Affected files:** `app/services/page.tsx`, new `components/services/ProcessAccordion.tsx` (replaces `EngagementModel`)

<a name="24-add-visual-interest-to-ownership-thesis-section" id="24-add-visual-interest-to-ownership-thesis-section"></a>
### 2.4. Add Visual Interest to Ownership Thesis Section

**Current behavior:** Plain text section with a top border separator. No visual elements.

**Target behavior:** Add a decorative SVG graphic, abstract shapes, or an icon composition that visually reinforces the "ownership" theme (e.g., a key icon, a shield, a document with a checkmark, or abstract geometric shapes suggesting security/ownership).

**Implementation approach:**

<div style="text-align:justify">

Add an inline SVG or a composition of Lucide icons (`Shield`, `Key`, `FileCheck`, `Lock`) arranged in a decorative cluster to the right of the text on desktop, or above the text on mobile. The graphic should be semi-transparent (20-30% opacity) or use the brand green at low opacity to avoid competing with the text content. Use the same alternating side-by-side pattern as the service pillars (text left, graphic right) for consistency.

</div>

**Affected files:** `app/services/page.tsx`

<a name="25-interactive-cta-background" id="25-interactive-cta-background"></a>
### 2.5. Interactive CTA Background

**Current behavior:** The "Let's scope your project." CTA section uses `section-bg-cta` with no interactive visual treatment.

**Target behavior:** Add an interactive background that matches or visually nods to the homepage CTA section (which uses `ParticleSky` + `KnoxvilleSkyline`).

**Implementation approach:**

<div style="text-align:justify">

Create a reusable `CTABackground` wrapper component that renders `ParticleSky` and optionally `KnoxvilleSkyline` behind CTA content. This component will be reused across all page-level CTA sections (Services, Work subpages, Research, Products, About, Blog). The wrapper accepts children (the CTA text and button) and applies the same `relative overflow-hidden` + `z-10` content layering pattern used in `CTASection.tsx` on the homepage. Extract the background treatment from the homepage `CTASection` into this shared component.

</div>

**Affected files:** `app/services/page.tsx`, new `components/shared/CTABackground.tsx`

<a name="3-work-pages" id="3-work-pages"></a>
<hr class="print-page-break">

## 3. Work Pages

<a name="31-add-screenshots-to-work-index-cards" id="31-add-screenshots-to-work-index-cards"></a>
### 3.1. Add Screenshots to Work Index Cards

**Current behavior:** The Work index page (`app/work/page.tsx`) uses `heroImageExists()` to check if screenshot files exist at the paths defined in the case study MDX frontmatter (`heroImage` field). If the file does not exist, `DeviceMockup` renders with a placeholder label.

**Current state of assets:** Per the CHANGELOG, case study screenshots were previously added to `public/images/work/united-way.png`, `scruggs-tire.png`, and `i-heart-pr-tours.png`. The `lib/case-studies.ts` file references these paths. However, the Work index page reads from the MDX frontmatter `heroImage` field via `lib/work.ts`, not from `lib/case-studies.ts`.

**Target behavior:** All three case study cards display actual screenshots in `DeviceMockup` frames. No "Screenshot coming soon" placeholders.

**Implementation approach:**

<div style="text-align:justify">

Verify that the `heroImage` frontmatter field in each MDX file (`content/work/united-way.mdx`, `content/work/scruggs-tire.mdx`, `content/work/i-heart-pr-tours.mdx`) points to the correct file path (e.g., `/images/work/united-way.png`). Verify that the PNG files exist in `public/images/work/`. If the MDX frontmatter is missing or incorrect, update it. If image files are missing, flag this as a blocker requiring the assets to be provided.

</div>

**Affected files:** `content/work/united-way.mdx`, `content/work/scruggs-tire.mdx`, `content/work/i-heart-pr-tours.mdx`

<a name="32-add-screenshots-to-work-subpages" id="32-add-screenshots-to-work-subpages"></a>
### 3.2. Add Screenshots to Work Subpages

**Current behavior:** Same issue as 3.1, but on the individual case study pages (`app/work/[slug]/page.tsx`). The full-width `DeviceMockup` below the hero checks `heroImageExists()`.

**Target behavior:** All three case study detail pages display the actual screenshot in the full-width `DeviceMockup`.

**Implementation approach:** Same as 3.1. Ensure frontmatter `heroImage` paths are correct and assets exist.

**Affected files:** Same as 3.1.

<a name="33-expand-content-width-on-work-subpages" id="33-expand-content-width-on-work-subpages"></a>
### 3.3. Expand Content Width on Work Subpages

**Current behavior:** The prose content on case study detail pages uses a narrow container, making text feel squished relative to the navigation width.

**Target behavior:** The content area should match the navigation content width (1200px / `container-content`), or use a wider intermediate width (e.g., 900px) that provides comfortable reading without feeling cramped.

**Implementation approach:**

<div style="text-align:justify">

In `app/work/[slug]/page.tsx`, replace `container-narrow` (720px) with either `container-content` (1200px) or a new `container-reading` utility (e.g., `max-w-[900px] mx-auto px-[var(--padding-x)]`). The prose `max-w-prose` on the MDX content may also need to be widened or removed. Test that line lengths remain comfortable for reading (65-85 characters per line is the typographic ideal for body text).

</div>

**Affected files:** `app/work/[slug]/page.tsx`, potentially `styles/globals.css` (if adding a new container utility)

<a name="34-link-services-used-to-service-anchors" id="34-link-services-used-to-service-anchors"></a>
### 3.4. Link Services Used to Service Anchors

**Current behavior:** The "Services Used" section on case study detail pages renders service names as `Badge` components with no links.

**Target behavior:** Each service badge links to the corresponding anchor on the Services page.

**Service-to-anchor mapping:**

| Service (from MDX frontmatter) | Target Anchor |
|-------------------------------|---------------|
| Web Development | `/services#development` |
| WordPress | `/services#development` |
| CMS Migration | `/services#development` |
| DNS Management | `/services#development` |
| SSL/TLS | `/services#development` |
| Hosting Setup | `/services#development` |
| Booking Integration | `/services#development` |
| Payment Processing | `/services#development` |
| Platform Replatforming | `/services#development` |
| Brand Identity | `/services#strategy-brand` |
| Content Architecture | `/services#strategy-brand` |
| Brand Standards | `/services#strategy-brand` |
| SEO | `/services#marketing` |
| AEO | `/services#marketing` |
| Analytics | `/services#marketing` |
| Social Media | `/services#marketing` |
| Review Generation | `/services#marketing` |
| OTA Optimization | `/services#marketing` |
| AI Consulting | `/services#ai-data` |
| Accessibility Compliance | `/services#development` |
| Vendor Audit | `/services#strategy-brand` |
| Contract Disentanglement | `/services#strategy-brand` |

**Implementation approach:**

<div style="text-align:justify">

Create a mapping object (`SERVICE_ANCHOR_MAP`) in `lib/work.ts` or a new `lib/service-links.ts` that maps service name strings to their corresponding `/services#anchor` URLs. In `app/work/[slug]/page.tsx`, wrap each `Badge` in a `<Link>` component using the mapped URL. If a service name does not have a mapping, render the badge without a link. Style linked badges with a subtle hover indicator (e.g., underline or color shift to brand green).

</div>

**Affected files:** `app/work/[slug]/page.tsx`, new or modified `lib/service-links.ts`

<a name="35-interactive-cta-background-on-work-subpages" id="35-interactive-cta-background-on-work-subpages"></a>
### 3.5. Interactive CTA Background on Work Subpages

**Current behavior:** The "Ready to see results like these?" CTA section on work subpages uses `section-bg-cta` with no interactive visual.

**Target behavior:** Add the shared `CTABackground` treatment (from §2.5).

**Affected files:** `app/work/[slug]/page.tsx`

<a name="4-research-page" id="4-research-page"></a>
<hr class="print-page-break">

## 4. Research Page

<a name="41-expand-content-width" id="41-expand-content-width"></a>
### 4.1. Expand Content Width

**Current behavior:** Research publication cards are rendered in a narrow container, making them feel squished relative to the navigation width.

**Target behavior:** Content width should match the navigation content width (`container-content`, 1200px). Cards can be displayed two to a row on desktop, or full-width with the decorative SVG image on the right side of the text.

**Implementation approach:**

<div style="text-align:justify">

In `app/research/page.tsx`, replace any `container-narrow` usage with `container-content`. For the card layout, use a two-column grid (`grid-cols-1 md:grid-cols-2`) if keeping cards compact, or use single-column full-width cards with a two-column internal layout (text left, decorative SVG right) similar to the service pillars.

</div>

**Affected files:** `app/research/page.tsx`

<a name="42-interactive-cta-background" id="42-interactive-cta-background"></a>
### 4.2. Interactive CTA Background

**Current behavior:** The "Interested in our research?" CTA section uses basic styling with no interactive visual.

**Target behavior:** Add the shared `CTABackground` treatment (from §2.5).

**Affected files:** `app/research/page.tsx`

<a name="5-products-page" id="5-products-page"></a>
<hr class="print-page-break">

## 5. Products Page

<a name="51-add-visual-interest-to-how-we-build-software" id="51-add-visual-interest-to-how-we-build-software"></a>
### 5.1. Add Visual Interest to How We Build Software

**Current behavior:** The "How We Build Software" section is text-heavy with no visual elements.

**Target behavior:** Add decorative SVG graphics or abstract shapes that reinforce the engineering/open-source theme (e.g., circuit patterns, code brackets, gear icons, or a stylized terminal window).

**Implementation approach:**

<div style="text-align:justify">

Add an inline SVG composition (or Lucide icon arrangement: `Terminal`, `GitBranch`, `Cpu`, `Layers`) as a decorative element beside the text. Use the same side-by-side pattern (text left, graphic right on desktop; graphic above text on mobile). Keep graphics at 20-30% opacity or use brand green accents to avoid overwhelming the text.

</div>

**Affected files:** `app/products/page.tsx`

<a name="52-add-cta-one-liner-and-interactive-background" id="52-add-cta-one-liner-and-interactive-background"></a>
### 5.2. Add CTA One-Liner and Interactive Background

**Current behavior:** The Products page bottom CTA section lacks the one-liner text pattern present on other pages and has no interactive background.

**Target behavior:** Add a short introductory line above the CTA button (e.g., "Want to explore our tools or contribute to the codebase?") and the shared `CTABackground` treatment (from §2.5).

**Affected files:** `app/products/page.tsx`

<a name="6-about-page" id="6-about-page"></a>
<hr class="print-page-break">

## 6. About Page

<a name="61-add-visual-interest-to-where-we-come-from" id="61-add-visual-interest-to-where-we-come-from"></a>
### 6.1. Add Visual Interest to Where We Come From

**Current behavior:** The "Where We Come From" origin story section is a large text block with no visual elements.

**Target behavior:** Add decorative SVG graphics, abstract shapes, or a subtle illustration that provides visual relief (e.g., a timeline graphic, a map pin on Knoxville, or abstract shapes suggesting growth/journey).

**Implementation approach:**

<div style="text-align:justify">

Add an inline SVG or icon composition as a decorative sidebar or accent element. On desktop, render it to the right of the text. On mobile, render it above the text or as a subtle background element. Use brand green accents at low opacity. Consider a simplified timeline or path graphic that visually represents the journey from ResoNova to ShruggieTech.

</div>

**Affected files:** `app/about/page.tsx`

<a name="62-add-social-links-to-team-members" id="62-add-social-links-to-team-members"></a>
### 6.2. Add Social Links to Team Members

**Target behavior:** Each team member displays social media icon links.

**Social link data:**

| Person | Platform | URL | Icon |
|--------|----------|-----|------|
| William | LinkedIn | https://www.linkedin.com/in/willthompsonpro/ | `Linkedin` (Lucide) |
| William | GitHub | https://github.com/h8rt3rmin8r | `Github` (Lucide) |
| Natalie | LinkedIn | https://www.linkedin.com/in/cryptasian/ | `Linkedin` (Lucide) |
| Natalie | Facebook | https://www.facebook.com/cryptasian | `Facebook` (Lucide) |
| Natalie | Instagram | https://www.instagram.com/cryptasian/ | `Instagram` (Lucide) |
| Natalie | GitHub | https://github.com/cryptasian | `Github` (Lucide) |
| Josiah | Twitch | https://twitch.tv/notratmaster | `Twitch` (Lucide) |
| Josiah | YouTube | https://www.youtube.com/@notratmaster | `Youtube` (Lucide) |

**Implementation approach:**

<div style="text-align:justify">

Add a `socials` array to each team member data object in `app/about/page.tsx`. Each entry has `{ href, label, Icon }`. Render the icons as a horizontal row within the team card (or on the card front in the flip-card redesign described in §6.3).

</div>

**Affected files:** `app/about/page.tsx`

<a name="63-redesign-team-cards-with-flip-interaction" id="63-redesign-team-cards-with-flip-interaction"></a>
### 6.3. Redesign Team Cards with Flip Interaction

**Current behavior:** Team member cards have inconsistent heights because the bio descriptions vary in length. All content (photo, name, title, bio) is visible on the card face simultaneously.

**Target behavior:** Equal-height cards with a front/back flip interaction:

| Side | Content |
|------|---------|
| Front | Team member photo, name, title, row of social media icons, and an "About Me" button that triggers the flip. |
| Back | Full bio/description text, with a "Back" or close button to flip back. |

**Implementation approach:**

<div style="text-align:justify">

Create a `TeamCard` client component with CSS 3D transform flip animation. The card container uses `perspective` on the parent and `transform-style: preserve-3d` on the inner wrapper. Front and back faces use `backface-visibility: hidden`. A `rotateY(180deg)` transform toggles on click. The card height is fixed across all cards (determined by the tallest front face, e.g., `h-[420px]` or similar). The "About Me" button on the front triggers the flip. The back face has a close/return button. Social icons render on the front face in a horizontal row below the title.

</div>

<div style="text-align:justify">

Alternatively, if a card-free layout proves cleaner, consider a horizontal layout per team member (photo left, name/title/socials center, expandable bio on click) similar to a team roster. The card approach is preferred per the feedback.

</div>

**Affected files:** `app/about/page.tsx`, new `components/about/TeamCard.tsx`

<a name="64-default-glow-on-what-we-believe-cards" id="64-default-glow-on-what-we-believe-cards"></a>
### 6.4. Default Glow on What We Believe Cards

**Current behavior:** The three "What We Believe" value cards have a glowing border effect on hover, which makes them appear interactive/clickable even though they are not.

**Target behavior:** The glow border is visible by default (always on), not just on hover. This removes the false affordance of clickability.

**Implementation approach:**

<div style="text-align:justify">

In the values section of `app/about/page.tsx`, change the card border styling from `hover:border-accent/40` (or whatever the current hover-triggered glow class is) to a static `border-accent/20` or `shadow-[0_0_15px_rgba(43,204,115,0.15)]` that is always applied. Remove any `hover:` prefixed glow classes. If the glow is implemented via a `Card` component prop or `glass` variant, modify the specific instance.

</div>

**Affected files:** `app/about/page.tsx`

<a name="65-add-cta-one-liner-and-interactive-background" id="65-add-cta-one-liner-and-interactive-background"></a>
### 6.5. Add CTA One-Liner and Interactive Background

**Current behavior:** The About page bottom CTA lacks the one-liner text pattern and has no interactive background.

**Target behavior:** Add a short introductory line (e.g., "Ready to work with a team that actually cares?") and the shared `CTABackground` treatment (from §2.5).

**Affected files:** `app/about/page.tsx`

<a name="7-blog-pages" id="7-blog-pages"></a>
<hr class="print-page-break">

## 7. Blog Pages

<a name="71-add-top-spacing-to-first-post" id="71-add-top-spacing-to-first-post"></a>
### 7.1. Add Top Spacing to First Post

**Current behavior:** The first blog post card is flush against the top of its containing section, with no breathing room between the hero and the post list.

**Target behavior:** Add vertical padding or margin at the top of the post grid section.

**Implementation approach:** In `app/blog/page.tsx`, add `pt-12 md:pt-16` (or similar) to the `<section>` or the post list container to create visual breathing room between the hero and the first post card.

**Affected files:** `app/blog/page.tsx`

<a name="72-expand-content-width-and-card-layout" id="72-expand-content-width-and-card-layout"></a>
### 7.2. Expand Content Width and Card Layout

**Current behavior:** The blog index uses `container-narrow` (720px) for a single-column post list.

**Target behavior:** Expand to `container-content` (1200px) or an intermediate width. Post cards can be displayed two to a row on desktop, or extend full-width.

**Implementation approach:**

<div style="text-align:justify">

In `app/blog/page.tsx`, replace `container-narrow` with `container-content`. Change the post list layout from single-column (`flex flex-col gap-6`) to a two-column grid on desktop (`grid grid-cols-1 md:grid-cols-2 gap-6`). Ensure `PostCard` renders well at both widths. The card content (title, excerpt, metadata) should fill the available width naturally.

</div>

**Affected files:** `app/blog/page.tsx`

<a name="73-add-cta-one-liner-and-interactive-background" id="73-add-cta-one-liner-and-interactive-background"></a>
### 7.3. Add CTA One-Liner and Interactive Background

**Current behavior:** The blog index bottom CTA is a bare `ShruggieCTA` with no introductory text and no interactive background.

**Target behavior:** Add a short introductory line (e.g., "Want to talk tech or explore a project idea?") and the shared `CTABackground` treatment (from §2.5).

**Affected files:** `app/blog/page.tsx`

<a name="74-add-feature-image-to-blog-posts" id="74-add-feature-image-to-blog-posts"></a>
### 7.4. Add Feature Image to Blog Posts

**Current behavior:** Blog post pages (`app/blog/[slug]/page.tsx`) have no feature/hero image area.

**Target behavior:** Add a feature image area similar to the Work subpages' hero image section. The feature image renders below the post header and above the prose content, inside a `DeviceMockup` or a simple full-width image container.

**Implementation approach:**

<div style="text-align:justify">

Add an optional `featuredImage` field to the blog post MDX frontmatter schema. In `app/blog/[slug]/page.tsx`, check if the field is populated and the file exists. If so, render a full-width image (using `next/image`) in a styled container below the `PostHeader` and above the MDX content. The container can use the same dark background treatment as the Work subpage hero image section, or a simpler approach with rounded corners and a subtle border. If no featured image is present, the section is omitted (graceful degradation). Update `lib/blog.ts` to parse and expose the new frontmatter field.

</div>

**Affected files:** `app/blog/[slug]/page.tsx`, `lib/blog.ts`

<a name="75-expand-blog-post-content-width" id="75-expand-blog-post-content-width"></a>
### 7.5. Expand Blog Post Content Width

**Current behavior:** Blog post content uses `container-narrow` (720px).

**Target behavior:** Expand to match the navigation content width. An intermediate width (e.g., 900px) may be ideal for readability while feeling less cramped.

**Implementation approach:** Same approach as §3.3. Replace `container-narrow` with a wider container. Ensure `max-w-prose` on the MDX content wrapper is adjusted or removed.

**Affected files:** `app/blog/[slug]/page.tsx`

<a name="76-fix-code-block-text-highlighting" id="76-fix-code-block-text-highlighting"></a>
### 7.6. Fix Code Block Text Highlighting

**Current behavior:** Code blocks in the example blog post have unusual text highlighting/selection behavior.

**Target behavior:** Code blocks render with clean, standard syntax highlighting without visual artifacts.

**Implementation approach:**

<div style="text-align:justify">

Inspect the Shiki-rendered code blocks in `app/blog/[slug]/page.tsx` and the `MDXComponents.tsx` `pre`/`code` overrides. The issue likely stems from conflicting CSS styles between the Shiki theme (`github-dark`), Tailwind's prose typography plugin, and any custom `code`/`pre` styles in `globals.css`. Check for: (1) overlapping `background-color` or `color` declarations between Shiki inline styles and Tailwind prose, (2) `::selection` styles that conflict with Shiki's token colors, (3) `white-space` or `overflow` issues causing text to wrap incorrectly. Fix by scoping Shiki-generated code blocks with a class (e.g., `[data-rehype-pretty-code-figure]`) and ensuring Tailwind prose does not override Shiki's inline token colors.

</div>

**Affected files:** `components/blog/MDXComponents.tsx`, potentially `styles/globals.css`

<a name="8-get-in-touch-page" id="8-get-in-touch-page"></a>
<hr class="print-page-break">

## 8. Get in Touch Page

<a name="81-expand-content-width" id="81-expand-content-width"></a>
### 8.1. Expand Content Width

**Current behavior:** The contact form card uses a narrow container, making it feel squished.

**Target behavior:** Expand to match the navigation content width (`container-content`, 1200px), or use a comfortable intermediate (e.g., 800-900px). The form itself does not need to be 1200px wide, but the section container should provide adequate horizontal space.

**Implementation approach:** In `app/contact/page.tsx`, replace `container-narrow` with `container-content` on the section wrapper. The form card can have its own `max-w-2xl mx-auto` to center it within the wider container without stretching the form to an uncomfortable width.

**Affected files:** `app/contact/page.tsx`

<a name="82-remove-hover-glow-from-contact-card" id="82-remove-hover-glow-from-contact-card"></a>
### 8.2. Remove Hover Glow from Contact Card

**Current behavior:** The contact card has a glowing border on hover, suggesting it is clickable when it is not.

**Target behavior:** Remove the hover glow effect. The card should have a static border (or no border change on hover).

**Implementation approach:** Remove `hover:border-accent/40` or any hover-triggered glow/shadow classes from the contact form card wrapper.

**Affected files:** `app/contact/page.tsx`

<a name="83-remove-direct-contact-section" id="83-remove-direct-contact-section"></a>
### 8.3. Remove Direct Contact Section

**Current behavior:** Below the contact form, there is a "Direct Contact" section showing the physical address and email placeholder.

**Target behavior:** Remove the entire direct contact section.

**Implementation approach:** Delete the direct contact section JSX from `app/contact/page.tsx`.

**Affected files:** `app/contact/page.tsx`

<a name="9-implementation-sequencing" id="9-implementation-sequencing"></a>
<hr class="print-page-break">

## 9. Implementation Sequencing

| Prompt | Scope | Items Addressed | Estimated Complexity |
|--------|-------|-----------------|---------------------|
| 1 | Global: carousel fix, mobile nav, footer, logo bug, shared CTABackground | §1.1, §1.2, §1.3, §1.4, §1.5, §2.5 (shared component only) | Medium |
| 2 | Services page full rework | §2.1, §2.2, §2.3, §2.4, §2.5 (page integration) | Heavy |
| 3 | Work pages (index + subpages) | §3.1, §3.2, §3.3, §3.4, §3.5 | Medium |
| 4 | Research + Products pages | §4.1, §4.2, §5.1, §5.2 | Medium |
| 5 | About page full rework | §6.1, §6.2, §6.3, §6.4, §6.5 | Heavy |
| 6 | Blog index + post pages | §7.1, §7.2, §7.3, §7.4, §7.5, §7.6 | Medium |
| 7 | Contact page | §8.1, §8.2, §8.3 | Light |
| 8 | QA pass and regression check | All items | Light |

<div style="text-align:justify">

Prompt 1 establishes the shared `CTABackground` component and fixes all global-scope items. Prompts 2-7 address individual pages in order of complexity and dependency. Prompt 8 is a final QA sweep to verify no regressions across the site. Each prompt is self-contained and produces a buildable state.

</div>

<a name="10-prompt-sequence" id="10-prompt-sequence"></a>
<hr class="print-page-break">

## 10. Prompt Sequence

<div style="text-align:justify">

The following section provides the exact prompts to be copy/pasted into Claude Opus 4.6 in VS Code. Each prompt is preceded by an explanation of what it covers and what the expected outcome is. The prompts reference this plan document by section number for detailed context.

</div>

<a name="101-prompt-1" id="101-prompt-1"></a>
### 10.1. Prompt 1 — Global Components and Shared Infrastructure

**Covers:** §1.1, §1.2, §1.3, §1.4, §1.5, and the creation of the shared `CTABackground` component (§2.5, component only).

**Expected outcome:** Mobile carousel swipes one card at a time, mobile nav includes Home, footer has shruggie-feedtools and all social links, logo theme toggle works correctly on blog page, and `CTABackground` component exists for use in subsequent prompts.

---

<a name="102-prompt-2" id="102-prompt-2"></a>
### 10.2. Prompt 2 — Services Page Rework

**Covers:** §2.1, §2.2, §2.3, §2.4, §2.5 (page integration).

**Expected outcome:** Service pillars are unwrapped from cards, SVGs alternate sides with text, How We Work section is an accordion + cycle diagram, Ownership Thesis has visual interest, CTA has interactive background.

---

<a name="103-prompt-3" id="103-prompt-3"></a>
### 10.3. Prompt 3 — Work Pages

**Covers:** §3.1, §3.2, §3.3, §3.4, §3.5.

**Expected outcome:** Screenshots display on index and subpages, subpage content is wider, Services Used badges link to service anchors, CTA has interactive background.

---

<a name="104-prompt-4" id="104-prompt-4"></a>
### 10.4. Prompt 4 — Research and Products Pages

**Covers:** §4.1, §4.2, §5.1, §5.2.

**Expected outcome:** Research content is wider with better card layout, Products "How We Build Software" has visual interest, both pages have CTA one-liners and interactive backgrounds.

---

<a name="105-prompt-5" id="105-prompt-5"></a>
### 10.5. Prompt 5 — About Page Rework

**Covers:** §6.1, §6.2, §6.3, §6.4, §6.5.

**Expected outcome:** Origin story has visual accent, team cards are equal-height with flip interaction and social icons, value cards glow by default, CTA has one-liner and interactive background.

---

<a name="106-prompt-6" id="106-prompt-6"></a>
### 10.6. Prompt 6 — Blog Pages

**Covers:** §7.1, §7.2, §7.3, §7.4, §7.5, §7.6.

**Expected outcome:** Blog index has top spacing, wider layout with two-column cards, CTA one-liner with interactive background. Blog posts have feature image support, wider content, and fixed code block highlighting.

---

<a name="107-prompt-7" id="107-prompt-7"></a>
### 10.7. Prompt 7 — Contact Page

**Covers:** §8.1, §8.2, §8.3.

**Expected outcome:** Contact form is wider, hover glow removed, direct contact section deleted.

---

<a name="108-prompt-8" id="108-prompt-8"></a>
### 10.8. Prompt 8 — QA Pass

**Covers:** Full regression check.

**Expected outcome:** All pages build without errors, no visual regressions, all interactive elements work correctly, dark/light mode toggle works on all pages, mobile responsiveness verified.

---

*This plan is the authoritative reference for the ShruggieTech website feedback-driven update cycle. All 30 items from the original feedback are addressed and mapped to specific implementation prompts. The plan should be uploaded to the project as the "full vision" document and referenced by each sequential prompt.*
