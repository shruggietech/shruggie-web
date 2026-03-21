# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Dynamic OG images**: `getOgImageUrl()` helper in `lib/constants.ts` generates dynamic `/api/og` URLs with title and optional author params
- **Per-page OpenGraph & Twitter metadata**: every page (`about`, `blog`, `blog/[slug]`, `contact`, `products`, `services`, `work`, `work/[slug]`, `research`, `privacy`, `for/*`, homepage) now exports explicit `openGraph` and `twitter` metadata with dynamic OG images, dimensions, and alt text
- **Root layout OG defaults**: added fallback `openGraph` and `twitter` fields to the root `metadata` export so every page inherits social card settings

### Changed

- **OG image route**: replaced text-based "SHRUGGIETECH" label with the actual logo (`logo-darkbg.png` fetched and base64-encoded at render time); added `shruggie.tech` domain footer
- **About page**: renamed team section heading from "The People Behind the Work" to "Who We Are"; removed `text-justify` from the origin story paragraph
- **TeamCard**: added hover border accent (`border-accent/40` / `brand-green-bright/20`); made back face clickable/tappable to flip the card back (with keyboard and ARIA support)
- **Blog post featured image**: widened featured image to full container width (1400px) instead of being constrained to the 900px article column
- **Blog post OG images**: blog posts now generate dynamic OG images with title and author; falls back to `getOgImageUrl()` when no custom `ogImage` is set
- **Contact page**: reordered layout so social media links appear above the contact form
- **Blog**: added featured image to "Multi-Agent Coding Workflows" post

## [0.5.0] — 2026-03-20

### Fixed

- **Blog code blocks**: removed `prose-pre:p-0` override from blog post content wrapper so code block padding renders correctly
- `CopyCodeBlock`: added `min-h-[3.5rem]` to prevent short code blocks from collapsing, added `pr-12` right padding so code text doesn't overlap the copy button

### Added

- **Contact page social links**: GitHub, Facebook, Instagram, and X (Twitter) icon buttons below the contact form with responsive labels (icons-only on mobile, icon + label on sm+), styled with border/hover transitions and `ScrollReveal` entrance animation
- **Blog Table of Contents**: sticky desktop sidebar (xl+ breakpoints) and collapsible sticky mobile disclosure with IntersectionObserver-based active heading highlighting; `TableOfContents` rewritten as a client component with active-state border/color styling
- `CopyCodeBlock` component: copy-to-clipboard button overlay on code blocks — appears on hover with `Copy`/`Check` icon feedback, replaces plain `<pre>` in MDX rendering
- **MDX heading IDs**: `h2` and `h3` components now auto-generate slugified `id` attributes with `scroll-mt-24` for smooth anchor offset
- `slugify()` and `extractHeadings()` utilities plus `TocItem` interface exported from `lib/utils.ts`
- `BackToTop` component: floating scroll-to-top button that appears after 500px of scroll — fixed bottom-right, CTA-colored with chevron icon, smooth fade/slide entrance animation, keyboard-accessible with `focus-visible` outline
- **Blog**: expanded "Multi-Agent Coding Workflows" post with new sections — What to Expect Going Wrong (merge conflicts, context drift, runaway agents, token costs), Conclusion, and additional Getting Started recommendations (bridging artifacts, multi-agent experimentation)

### Changed

- **Contact form confirmation**: shortened follow-up copy from "We will get back to you within one business day." to "We will get back to you soon!"
- **Blog post layout**: restructured article to a two-column layout on xl screens (1400px max-width) with 260px sidebar for ToC; content area resets shiki code block prose styles (`prose-pre:bg-transparent`, etc.)
- **Homepage metadata**: changed em dash (—) to hyphen (-) in page title and OpenGraph title
- **Global CSS**: changed `overflow-x: hidden` to `overflow-x: clip` on `html, body` to prevent scroll anchoring issues while still clipping overflow
- **About page**: tightened "Where We Come From" origin copy (removed "ShruggieTech was" opener); redesigned CTA section from `text-body-lg` paragraph to `text-display-md` heading with `mt-8` button wrapper, removed `flex-col items-center`
- **Products page**: shortened metadata/hero description (removed "Open-source tools and software products built by ShruggieTech." prefix); tightened "How We Build Software" paragraph (removed "ShruggieTech" self-reference, shortened prose); changed CTA heading to "The code is open. Jump in." with GitHub link instead of contact link
- **Research page**: updated metadata/hero description to "Technical writing and original research from real project work. We publish what we learn."; changed publication dates from 2025 to 2026 for ADF and RUSTif
- **Services page**: rewrote metadata/hero description to "Strategy, design, development, and marketing, shaped around how your business actually operates."; rewrote all four service pillar body descriptions and trimmed capability list labels to be more concise; tightened OwnershipSection paragraph; refined ProcessAccordion phase descriptions for all three phases (Discuss, Create, Deliver)
- **Work page**: updated metadata description to "No mock-ups. No hypotheticals. Every project on this page shipped."; changed hero subheadline to "Real results for real businesses. See for yourself."; updated homepage work section heading to "Real results for real businesses" across `WorkPreview` and `WorkScroll`; removed date display from case study cards and individual case study hero; made case study cards equal-height with `h-full flex flex-col` and `mt-auto` on CTA link
- **Case studies**: rewrote United Way title ("A Complete Website Rebuild for a Community Nonprofit"), summary, challenge, approach, and outcomes; rewrote I Heart PR Tours title ("A Ground-Up Digital Partnership in Puerto Rico Tourism"), summary, challenge, approach, and outcomes; trimmed Scruggs Tire challenge and approach paragraphs; removed "Ongoing" sections from all three case studies; changed case study dates to year-only format
- **CTA color**: darkened `--cta-color` from `#FF5300` to `#C24000` for WCAG AA compliance (4.6:1 contrast ratio vs white) in both light and dark themes

### Removed

- `EngagementModel` component: deleted legacy three-phase engagement model section (replaced previously by `ProcessAccordion`)

## [Previous — Copy, Content & Interaction Refinements]

### Added

- **Blog**: new post "Multi-Agent Coding Workflows for Solo Developers and Small Teams" — practical field manual covering sequential sessions, parallel independent agents, coordinated teams, VS Code agent types, Superset orchestration, and the admin-coding divide

### Changed

- **Homepage hero**: rewrote headline ("We advance your vision.") and subheading copy; tightened CTA section subtitle; added `border-white` to "See Our Work" button
- **Homepage services section**: updated heading from "Full-stack capability, studio-scale delivery." to "Full-stack capability, boutique delivery."; changed subtitle from "4 practice areas. 40+ capabilities. One team." to "One point of contact. Every layer."; rewrote Digital Strategy & Brand, Revenue Flows & Marketing Ops, and AI & Data Analysis card descriptions across `ServicesCarousel`, `ServicesPreview`, and `ServicesScroll`
- **Homepage work section**: changed heading from "Real results for real businesses." to "We don't do mock-ups. These shipped." across `WorkCarousel`, `WorkPreview`, and `WorkScroll`; removed description from `WorkPreview`
- **Homepage research section**: removed Multi-Agent Development Guide publication card; reduced from three publications to two (ADF + rustif); added direct external links (`href`, `target="_blank"`) to publication titles and "Read paper" links instead of routing to `/research`; removed unused `Link` import; cleaned up code snippet block
- **Research page**: removed Multi-Agent Coding Workflows publication card; removed `MultiAgentVisual` import
- **Landing pages**: removed Multi-Agent Coding Workflows research card from Developers and Technical Teams landing pages
- **Case study summaries**: rewrote United Way summary and metric ("Minimal revision cycles"); updated Scruggs Tire metric ("Full ownership restored"); rewrote I Heart PR Tours summary and metric ("Flexible engagement model")

### Removed

- `content/blog/example-post.mdx`: deleted placeholder blog post
- `MultiAgentVisual` usage from `ResearchSection` and `ResearchPreview` visual maps

## [Previous — Copy & Content Refinements]

### Changed

- **Services page**: generalized service pillar descriptions to be technology-agnostic — removed specific vendor/platform references (WordPress, Bokun, GetYourGuide, Azure AI Search, TripAdvisor, Viator, Expedia) in favor of broader capability language; updated Development, Marketing, and AI pillar body text and capability lists
- **Scruggs Tire case study**: changed summary wording from "Knoxville auto shop" to "local auto shop" across site spec, MDX frontmatter, and case-studies data
- **Logo assets**: updated `logo-darkbg.png` and `logo-lightbg.png`

## [Previous — Illustrations & UI Refinements]

### Added

- `OriginIllustration` component: animated "Origin Journey Blueprint" SVG for the About page "Where We Come From" section — three-chapter timeline (ResoNova era → transition → ShruggieTech/Knoxville) with IntersectionObserver-triggered CSS entrance animations, matching the blueprint line-art style of `ServiceIllustrationsLarge`

### Changed

- **Privacy page**: widened content container from `container-narrow` to `container-content` to match navigation/header width
- **Contact page**: removed `max-w-2xl` constraint from the contact form Card so the form spans the full container width; wrapped contact form section with `CTABackground` (ParticleSky + KnoxvilleSkyline)
- **About page**: replaced inline decorative SVG with new `OriginIllustration` component; redesigned "Where We Come From" section with separate mobile (stacked, centered) and desktop (full-bleed side-by-side) layouts; body text set to `text-justify`
- **Products page**: updated RUSTif "Read Declaration" and code repository links to point to the actual GitHub Gist
- **Research page**: updated publication links (ADF, Multi-Agent Coding, RUSTif) to actual GitHub Gist URLs; changed publication cards from Next.js `Link` to native `<a>` with `target="_blank"` / `rel="noopener noreferrer"` for external navigation; removed unused `Link` import
- **ContactForm**: added custom chevron SVG dropdown indicator to the referral `<select>` field; wrapped select in a relative container
- `TeamCard`: reduced mobile card height from 480px to 400px; added hover tilt/scale effect (`rotateY(-5deg) scale(1.02)`); expanded "About Me" click target to full lower area of the card front; left-aligned back-face bio text
- `Pagination`: added bottom margin (`mb-16`) to single-page pagination indicator
- **Typography**: reduced `--text-body-lg` from `1.25rem` to `1.15rem`

## [Previous — Custom Illustrations]

### Added

- `OwnershipSection` component: extracted "You Own Everything We Build" section from the Services page into a dedicated client component with an animated SVG shield/key illustration triggered by IntersectionObserver
- `SpecToShipIllustration` component: new animated SVG illustration for the Products page "How We Build Software" section depicting a spec-to-ship pipeline, replacing the inline icon grid
- `ServiceIllustrationsLarge`: added large-format SVG illustrations for service pillar sections on the homepage

### Changed

- **ProcessAccordion**: redesigned cycle diagram from circle-based icons to a blueprint-style arrow cycle with numbered nodes, cubic-bézier arrow paths, and arrowhead tips; replaced individual icon components (DiscussIcon, CreateIcon, RocketIcon) with a cleaner geometric design
- **Products page**: replaced inline decorative SVG grid (Terminal, GitBranch, Layers, Cpu icons) with the new `SpecToShipIllustration` component; removed unused Lucide icon imports; removed `border-t` from the "How We Build Software" section
- **Services page**: replaced inline "You Own Everything We Build" markup and decorative Lucide icon cluster (Shield, Key, FileCheck, Lock) with `OwnershipSection` component; removed unused icon imports
- **Research page**: refactored publication card layout from `grid` to `flex` with explicit width columns; removed mobile-only visual duplication above text content
- **Work page**: replaced static `section-bg-cta` CTA section with `CTABackground` component; updated heading from `text-display-sm` to `text-display-md`; improved CTA button spacing
- `ServicePillarSection`: added constrained sizing for illustration containers (`h-[280px] max-w-[360px]` on mobile, unconstrained on desktop); illustrations now receive `className="h-full w-full"` for proper fill
- `ServiceIllustrationsLarge.module.css`: added animation keyframes and styling for large service illustrations

### Previous

- **ProcessAccordion**: redesigned from three sequential phases (Foundation & Setup → Optimization & Growth → Ongoing Partnership) to an iterative Agile cycle (Discuss → Create → Deliver) with updated descriptions and deliverables; replaced curved-arrow cycle diagram with circle-based icons (speech bubble, lightbulb, rocket) using orange accent borders
- Services page "How We Work" description updated from "three-phase methodology" to "iterative Discuss, Create, Deliver cycle"
- `ServicePillarSection`: scoped `is-animating` class and `useInView` detection to the illustration wrapper instead of the entire section for more precise animation triggering
- `ServicesCarousel`: replaced React synthetic touch handlers with non-passive native `touchmove` listeners via `useEffect` so `preventDefault()` correctly blocks page scroll during horizontal swipes; fixed stale-closure issue by tracking `activeIndex` in a ref
- `WorkCarousel`: added controlled programmatic scroll-to-card touch handling (matching `ServicesCarousel` pattern); removed CSS `snap-x snap-mandatory scroll-smooth` and `WebkitOverflowScrolling` in favor of explicit `scrollToCard` logic; updated dot indicator click handlers to use `scrollToCard`

## [Previous — Site-Wide v2 Updates]

### Added

- `CTABackground` shared component: reusable CTA section wrapper with `ParticleSky` background and `KnoxvilleSkyline` anchored to the bottom — extracted from homepage `CTASection` so every page-level CTA can share the same interactive visual treatment
- `ProcessAccordion` component: accordion + cycle diagram for the "How We Work" section on the Services page — left-side accordion panels with phase details (one open at a time, fixed min-height to eliminate page jumps) and right-side SVG cycle diagram with curved arrow segments that highlight the active phase in brand green
- `TeamCard` component: flip-card for team member display with CSS 3D transforms — front shows photo, name, title, social icons, and "About Me" button; back shows full bio text and "Back" button
- `lib/service-links.ts`: maps service name strings (from case study MDX frontmatter) to their corresponding anchor URLs on the Services page, enabling linked service badges
- `featuredImage` field in blog `PostMeta` interface and MDX frontmatter parsing — optional hero/feature image displayed at the top of blog post pages
- Social links on team member cards (LinkedIn, GitHub, Facebook, Instagram, Twitch, YouTube) — each team member now displays their relevant social media profiles
- Shiki code block CSS overrides in `globals.css` — prevents Tailwind prose from overriding Shiki's inline token colors in blog post code blocks
- `shruggie-feedtools` added to the Products list in the Footer
- `docs/ShruggieTech-Site-Updates-Plan-v2.md`: v2 feedback-driven updates specification covering 30 items across all pages

### Changed

- **Interactive CTA backgrounds site-wide**: replaced static `section-bg-cta` CTA sections with `CTABackground` (ParticleSky + KnoxvilleSkyline) on Research, Work case study detail, Blog, Products, and About pages — matching the homepage's premium CTA treatment
- Homepage `CTASection`: refactored to use shared `CTABackground` component instead of inlining `ParticleSky` and `KnoxvilleSkyline` directly
- Services page: replaced `EngagementModel` with `ProcessAccordion` for the "How We Work" section; added decorative Lucide icon cluster (Shield, Key, FileCheck, Lock) to the "You Own Everything We Build" section with responsive desktop/mobile layouts
- `ServicePillarSection`: removed glassmorphism Card wrappers from service pillars — now renders content and SVG illustrations in a side-by-side layout with alternating illustration position per index (even = illustration left, odd = illustration right)
- About page: replaced inline team member rendering with `TeamCard` flip-card component; added decorative Knoxville skyline SVG illustration to the "Where We Come From" section; added `CTABackground` CTA section
- About page "What We Believe" cards: added default accent glow (`shadow-[0_0_20px_rgba(var(--brand-green-rgb),0.15)]`) so cards glow without requiring hover
- Blog index page: expanded from `container-narrow` to `container-content` with a two-column grid layout for post cards; added CTA one-liner ("Want to talk tech or explore a project idea?") with `CTABackground`; added top spacing to post grid
- Blog post pages: expanded content width from `container-narrow` to `max-w-[900px]`; added optional featured image display below `PostHeader`
- Work case study detail pages: expanded MDX body and services-used sections from `container-narrow` to `max-w-[900px]`; service badges now link to corresponding service pillar anchors via `SERVICE_ANCHOR_MAP`; CTA section replaced with `CTABackground`
- Research page: expanded publication cards from `container-narrow` to `container-content`; CTA section replaced with `CTABackground`
- Products page: added `id` attributes to product cards for direct anchor linking; added decorative icon cluster (Terminal, GitBranch, Layers) to "How We Build Software" section; added CTA one-liner and `CTABackground`; expanded from `container-narrow` to `container-content`
- Contact page: expanded from `container-narrow` to `container-content`; disabled hover glow on contact form Card; removed "Direct Contact" section
- Footer: expanded social links from GitHub-only to GitHub, Facebook, Instagram, and X (Twitter) with icon-only layout
- Mobile navigation: added "Home" link to the top of the nav link list
- Header logo: switched from React state-driven `src` swap to CSS `dark:block`/`dark:hidden` dual-`<Image>` approach with `MutationObserver` to keep `isDark` state in sync when `ThemeEnforcer` modifies the class list externally — eliminates flash-of-wrong-logo on forced-dark routes
- `ServicesCarousel`: replaced CSS `snap-x snap-mandatory scroll-smooth` with controlled touch handlers (touchstart/touchmove/touchend) ensuring one swipe = one card advance — fixes over-sensitive swipe behavior on mobile where momentum scrolling would skip multiple cards
- `MDXComponents` `<pre>`: added `[&>code]:bg-transparent [&>code]:p-0` to prevent code block background/padding from doubling up with Shiki output
- Case study hero images: renamed `heroImage` paths in `i-heart-pr-tours.mdx`, `scruggs-tire.mdx`, and `united-way.mdx` to match updated filenames

### Removed

- `EngagementModel` component: replaced by `ProcessAccordion`
- Contact page "Direct Contact" section: removed address and placeholder email info
- `docs/ShruggieTech-Site-Design-Consistency-Plan.md`: moved to `docs/archive/` (superseded by v2 updates plan)

## [Previous — Site-Wide Design Consistency Pass]

### Added

- `PageHero` shared component: reusable page hero section with dark surface backgrounds, gradient overlay, subtle dot-grid pattern, and `ScrollReveal` entrance animation — used across Services, Work, Research, Products, About, Blog, Contact, and utility pages for consistent hero presentation
- `ServicePillarSection` component: extracted service pillar rendering into a dedicated component with glassmorphism card treatment, animated SVG pillar illustrations (reusing `ServiceIllustrationsLarge`), and alternating left/right layouts
- `ResearchVisuals` shared component: decorative SVG graphics for research publication cards, providing unique visuals per publication (parse tree, neural network, waveform, circuit board patterns)
- `--surface-dark-products` CSS token and `section-bg-products` utility for the Products page dark surface
- `docs/ShruggieTech-Site-Design-Consistency-Plan.md`: comprehensive specification for extending the homepage design language to all inner pages

### Changed

- **Site-wide design consistency pass**: upgraded all inner pages to carry through the homepage's premium dark design language — glassmorphism cards, section surface colors, extended typography tokens, and orange hover accents
- Services page: replaced plain text hero and pillar sections with `PageHero` and `ServicePillarSection` components featuring glassmorphism cards and animated SVG illustrations
- Work page: adopted `PageHero`, glassmorphism card treatments on case study grid, `DeviceMockup` browser frames, and `section-bg-work` surface color
- Work case study detail pages: upgraded with dark surface backgrounds, glassmorphism metric cards, improved image presentation, and consistent typography tokens
- Research page: adopted `PageHero`, integrated `ResearchVisuals` decorative SVGs into publication cards, applied `section-bg-research` surface color
- Products page: adopted `PageHero`, applied `section-bg-products` surface, glassmorphism card styling for product offerings
- About page: adopted `PageHero` with dark surface, updated team card styling for consistency
- Blog index and post pages: adopted `PageHero`, consistent card treatments
- Contact page: adopted `PageHero`, updated form and contact info styling for dark theme consistency
- Privacy, 404, and error pages: adopted dark surface backgrounds and consistent typography
- `ThemeEnforcer` / `route-theme.ts`: expanded forced-dark routes to include `/research`, `/products`, `/work` (prefix), and `/for/` (prefix); refactored from exact-match array to support both exact and prefix matching
- `lib/theme.ts`: updated inline FOUC-prevention script to support prefix-based route matching for dark mode enforcement
- `ResearchSection` (homepage): simplified by extracting research visuals into shared `ResearchVisuals` component
- `ContactForm`: updated label and input styling for dark theme consistency
- `PostCard`: updated hover accent to brand orange
- `TableOfContents`: updated active link accent to brand orange
- `LandingPageTemplate`: adopted `PageHero` and consistent dark surface styling for audience landing pages
- `EngagementModel`: minor styling adjustments for dark theme consistency

### Removed

- `docs/ShruggieTech-Homepage-Updates-Plan-v2.md`: moved to `docs/archive/` (superseded by site-wide consistency plan)

## [Previous — Homepage UX Polish & Animations]

### Added

- `ParticleSky` component: canvas-based interactive particle field (particles.js style) with drifting nodes, proximity-based connecting lines, and mouse/touch cursor interaction for the CTA section background
- `KnoxvilleSkyline` component: detailed two-layer SVG silhouette of the Knoxville, TN skyline with window grids, Sunsphere, Henley Street Bridge arches, and church steeples — anchored to the bottom of the CTA section
- Custom `nav` breakpoint (1081px) in `globals.css` for navigation responsive switching
- `docs/ShruggieTech-Homepage-Updates-Plan-v2.md`: v2 UX polish specification covering transition quality, sizing adjustments, hover colors, and Research section improvements

### Changed

- `HeroBackground`: reduced shruggie easter egg size — render size 110→85px, reveal radius 180→140px, corner inset 80→65px for better proportions against the dot grid
- `ServicesScroll`: restructured GSAP timeline to sequential fade with dead zone (Phase A fade-out 0–0.35, dead zone 0.35–0.45, Phase B fade-in 0.45–0.80, hold 0.80–1.0) eliminating overlapping text during transitions; expanded right-column illustrations to edge-to-edge layout breaking out of content container; "Learn more" link hover color changed to brand orange
- `WorkScroll`: same sequential fade transition pattern as ServicesScroll; expanded right-column device mockups to edge-to-edge layout; "Read case study" link hover color changed to brand orange
- `ResearchSection`: replaced `RustifVisual` placeholder bars with "Crab Claw Parse Tree" SVG graphic evoking Rust/metadata parsing themes; wrapped all research publication cards in `<Link>` for full-card clickability with accessible focus ring
- `DeviceMockup`: changed screenshot image fit from `object-contain` to `object-cover` for better visual fill in browser frames
- `KnoxvilleSkyline`: brightened SVG fill colors for better visibility against dark backgrounds, especially on mobile — background layer `#0a0a10` → `#18182a`, foreground layer `#0d0d14` → `#1e1e34`, window/detail accents `#111118` → `#2a2a40`
- `Header`: navigation breakpoint changed from `md` (768px) to custom `nav` (1081px) so the mobile hamburger menu is used on tablets and narrower desktops where nav links were overflowing
- `HeroBackground`: mobile ambient drift repositioned to top-right area with horizontal-only movement; mobile interaction radius reduced to 55% of desktop size for tighter dot-highlight focus
- `HeroSection`: increased mobile top padding (`pt-44`) to push hero content below the header and avoid overlap
- `KnoxvilleSkyline`: converted to client component with `useIsMobile`; mobile viewBox crops to the right half of the skyline (showing Sunsphere) at a larger scale
- `ParticleSky`: reduced particle count on mobile from 80 to 30 for better performance on lower-powered devices
- `ServicesCarousel`: SVG draw-on animations now deferred via `IntersectionObserver` until the illustration area scrolls into view, preventing animations from firing off-screen; increased illustration container size (220→280px height, 300→360px max-width)
- `ServicesScroll`: SVG draw-on animations deferred via `IntersectionObserver` until the pinned area enters the viewport, matching `ServicesCarousel` behavior
- `CTASection`: replaced orange gradient bloom and shruggie watermark background with interactive `ParticleSky` canvas and `KnoxvilleSkyline` SVG silhouette anchored at bottom
- `HeroBackground`: refactored shruggie easter egg to use deterministic corner positions (cycling through 4 corners) instead of random placement with exclusion zones; added mobile-specific adjustments (reduced spotlight radius, disabled shruggie interactions below 768px); unified shruggie dot color to brand green regardless of theme; extracted ambient drift radius into configurable constants
- `HeroSection`: responsive hero heading text — `text-display-md` on mobile scaling up to `text-display-xl` on desktop
- `ServicesScroll`: tightened scroll-driven transitions — reduced scrub to 0.3, faster snap duration (0.15–0.4s), sharper `power2.inOut` easing, reduced frame travel distance (30px); SVG illustration draw-on animations now retrigger on frame change via `is-animating` class toggle with `requestAnimationFrame` restart
- `ServicesCarousel`: upgraded from small `ServiceIllustrations` to large-format `ServiceIllustrationsLarge` with a dedicated illustration display area above the carousel; SVG draw-on animations retrigger on active card change
- `WorkScroll`: same scroll snapping improvements as `ServicesScroll` (scrub 0.3, faster snap, reduced travel); client logo row changed to left-aligned layout with larger logos, removed "Trusted by" label; reduced spacing between section intro and pinned area
- `SectionProgress`: upgraded from passive progressbar to interactive tab-based navigation with clickable dots, label tooltips on hover, keyboard-accessible focus states (`role="tablist"`, `aria-selected`, focus-visible ring)
- `ServiceIllustrationsLarge.module.css`: refactored animation lifecycle from pause/play (`.is-active`) to class-toggle restart (`.is-animating`), enabling proper animation restart when revisiting frames via scroll or carousel navigation
- `docs/ShruggieTech-Website-Redesign-Plan.md`: moved to `docs/archive/`; replaced by v2 plan

## [Previous — Case Study Screenshots & Data Centralization]

### Added

- `lib/case-studies.ts`: shared case study data module — single source of truth for slug, client name, industry, summary, image path, and metric, imported by `WorkScroll`, `WorkCarousel`, and `WorkPreview`
- Case study screenshots: real website screenshots for all three case studies (`public/images/work/united-way.png`, `scruggs-tire.png`, `i-heart-pr-tours.png`) replacing placeholder "Screenshot coming soon" labels

### Changed

- `WorkScroll`, `WorkCarousel`, `WorkPreview`: replaced inline case study data arrays with shared import from `lib/case-studies.ts`, eliminating triplicated data definitions
- `WorkPreview`: replaced placeholder gray rectangles with `DeviceMockup` browser frames rendering actual case study screenshots
- `DeviceMockup`: changed image fit from `object-cover` to `object-contain object-top` for better full-page screenshot rendering, darkened viewport background from `gray-900` to `gray-950`, added responsive `sizes` attribute for image optimization
- `docs/ShruggieTech-Website-Redesign-Plan.md`: updated to reflect that case study screenshots are now provided and integrated (no longer a pending Phase 3 item)

## [Previous — Homepage Redesign]

### Added

- Design system: section-level surface color tokens (`--color-section-*`) and glassmorphism card treatment (`card-glass` variant) for layered section backgrounds
- `ThemeEnforcer` component: route-aware dark mode enforcement that forces dark theme on specific routes (homepage, services) and conditionally hides the theme toggle in the Header
- `lib/route-theme.ts`: route-to-theme mapping configuration for per-page theme enforcement
- `useIsMobile` hook: responsive breakpoint detection hook using `matchMedia` for mobile/desktop layout switching
- `DeviceMockup` component: browser-chrome and mobile-frame device mockup wrappers for presenting case study screenshots in realistic device frames
- `SectionProgress` component: scroll-progress indicator showing current section position within pinned scroll sequences
- `ServicesSection` wrapper component: responsive switcher that renders `ServicesScroll` (pinned desktop layout) or `ServicesCarousel` (swipeable mobile carousel) based on viewport
- `ServicesCarousel` component: mobile-optimized horizontal carousel for service cards with snap scrolling and progress indicators
- `ServiceIllustrationsLarge` component: full-viewport animated SVG illustrations for each service pillar with CSS keyframe entrance animations (draw-on, fade-in, pulse effects) triggered on active card transitions
- `ServiceIllustrationsLarge.module.css`: 490+ lines of CSS animations for service illustration entrance sequences
- `WorkSection` wrapper component: responsive switcher rendering `WorkScroll` (pinned desktop) or `WorkCarousel` (swipeable mobile) based on viewport
- `WorkCarousel` component: mobile-optimized horizontal carousel for case study cards with device mockups and snap scrolling
- Team photos: real headshot images for William, Natalie, and Josiah Thompson replacing placeholder avatar silhouettes on the About page
- `docs/ShruggieTech-Website-Redesign-Plan.md`: comprehensive redesign specification documenting the phased homepage rebuild strategy
- `docs/archive/`: archived original homepage scroll journey spec (superseded by redesign plan)

### Changed

- **Homepage redesign**: complete visual overhaul of all homepage sections below the hero, replacing GSAP ScrollTrigger-pinned canvas animations with a cleaner, more performant CSS/Framer Motion approach
- `ServicesScroll`: rebuilt as a pinned desktop layout with scroll-driven card cycling, large-format animated SVG illustrations crossfading in sync with active card, and glassmorphism card styling
- `WorkScroll`: rebuilt with pinned desktop layout, device mockup frames (browser chrome) for case study screenshots, scroll-driven card transitions, and "View Case Study" CTAs
- `ResearchSection`: redesigned with full-width publication cards, decorative code/syntax background pattern, and improved layout hierarchy
- `CTASection`: redesigned with orange gradient bloom background effect, large shruggie watermark, and updated visual treatment replacing the previous gray-900→black gradient
- `Card` component: added `glass` variant prop for glassmorphism surface treatment
- `Header`: theme toggle visibility now controlled by route-aware theme enforcement (hidden on dark-enforced routes)
- `lib/theme.ts`: expanded to support route-aware theme initialization alongside cookie-based persistence
- `app/page.tsx`: refactored to use `ServicesSection` and `WorkSection` wrapper components for responsive layout switching
- `HeroSection`: restored embedded `HeroBackground` canvas (reverted from page-level `HomeCanvas` approach back to self-contained hero background)
- About page: replaced placeholder avatar silhouettes (initials in gray circles) with real team member headshot photos using `next/image` optimization
- `styles/globals.css`: consolidated section surface color variables, removed unused CTA gradient classes, added glassmorphism utilities

### Removed

- `HomeCanvas` component and `ScrollOrchestrator`: removed page-level canvas rendering in favor of section-contained approaches
- `lib/canvas/` module library: removed all 8 canvas rendering utilities (`dot-grid.ts`, `network-graph.ts`, `planet.ts`, `scroll-state.ts`, `shapes.ts`, `shruggie-easter-egg.ts`, `skyline.ts`, `work-graph.ts`) — superseded by CSS/SVG-based section designs
- `ServiceIllustrations` component: replaced by `ServiceIllustrationsLarge` with full-viewport animated SVG illustrations and CSS entrance animations
- `ServicesPreview` static fallback and `WorkPreview` GSAP-based scroll layouts (superseded by responsive Section wrapper components)
- Production dependency: `gsap` (GSAP ScrollTrigger no longer used for homepage sections)

## [Previous — SVG Illustrations & Canvas Refinements]

### Changed

- `ServicesScroll`: replace empty canvas-rendered dot graphics in the right half with meaningful SVG service illustrations that crossfade in lockstep with card transitions
- `ServicesScroll`: wrap GSAP ScrollTrigger in `gsap.context()` with `useLayoutEffect` to prevent `removeChild` errors during React strict mode remount cycles
- `ServicesPreview` static fallback: add side-by-side card layout with SVG illustrations visible on md+ breakpoints
- `WorkScroll`: refactor card transition logic to use centered crossfade midpoints with `TRANSITION_HALF_WIDTH` for smoother snap-to-card transitions
- `network-graph.ts`: increase node and edge visibility (higher base alpha, hover alpha, and edge line width) for better contrast
- `HomeCanvas`: fix services shape morphing to use 3 transitions across 4 shapes instead of incorrectly mapping to 4 segments

## [Previous — Scroll-Driven Homepage Journey]

### Added
  - `planet.ts` — wireframe planet with concentric node rings and lateral rotation simulation
  - `scroll-state.ts` — shared mutable scroll state avoiding React re-renders
  - `shapes.ts` — 5 morphable shape definitions (halo, constellation, circuit, funnel, neural net)
  - `shruggie-easter-egg.ts` — relocated easter egg state machine (image-sampled dot cloud, wiggle, flee)
  - `skyline.ts` — progressive wireframe city skyline synced to research section scroll
  - `work-graph.ts` — arc-layout hub-and-spoke graph for work section case studies
- `docs/homepage-scroll-journey-spec.md`: full reference specification for the scroll-driven homepage architecture and phased implementation strategy
- Production dependency: `gsap` ^3.14.2 (GSAP ScrollTrigger for scroll-locked pinned sections)
- CSS `prefers-reduced-motion` toggle classes for `ServicesScroll` and `WorkScroll` animated/static layout switching

### Changed

- Confine dot grid spotlight effect to the hero section only; the focal point is deactivated when the cursor is below the hero boundary, so dots in subsequent sections render at resting opacity without the distracting cursor-follow glow
- Refactor homepage (`app/page.tsx`) to wrap all sections in `ScrollOrchestrator` and replace standalone section components with scroll-driven equivalents (`ServicesScroll`, `WorkScroll`, `ResearchSection`)
- `HeroSection`: remove embedded `HeroBackground` canvas (now rendered by page-level `HomeCanvas`); add section `id` for scroll targeting
- `ServicesBackground`: rewrite from fading dot grid to dot grid → morphing lava blob cross-fade with animated radial-gradient orbs for a premium organic feel
- `ServicesPreview`, `WorkPreview`, `ResearchPreview`: add section `id` attributes and `relative z-[2]` stacking for proper layering over the full-page canvas
- `CTASection`: add section `id`, increased bottom padding (`pb-[40vh]`), and `relative z-[2]` stacking context
- `ServicesBackground` component: fading dot grid canvas that extends below the hero section, bridging the two sections with a smooth visual taper (same spacing, colour, and radius as `HeroBackground`, quadratic vertical fade across 85% of section height)
- `AnimatedIcon` component: SVG stroke-draw animation wrapper that uses `strokeDasharray`/`strokeDashoffset` to progressively "draw" Lucide icons with staggered per-path delays and an expanding brand-green glow ring; controlled via a `draw` prop; respects `prefers-reduced-motion`
- `ServiceCard` component: self-contained scroll-driven service card that individually tracks its own scroll position via Framer Motion `useScroll`/`useTransform`; 80px float-up with subtle 0.97→1 scale; right-column cards stagger 15% later than left-column to prevent same-row cards from appearing simultaneously; triggers icon stroke-draw at ~60% reveal progress; fully reversible on scroll direction change; works with Lenis smooth scrolling
- `ScrollDrivenReveal` shared component: reusable scroll-position-driven fade-up wrapper using Framer Motion `useScroll` + `useTransform` for continuous, reversible opacity and translateY tied to scroll progress
- `ScrollReveal` now accepts an optional `initialY` prop to control float-up distance (defaults to 24px, preserving existing behavior)
- Add `logo-icon-only-green.png` brand icon to `public/images/` for use in hero easter egg and other brand contexts
- Hidden shruggie easter egg in hero dot grid: logo icon (`logo-icon-only-green.png`) sampled into a dense white dot-cloud (110px, 2px step) that lurks invisibly on the canvas; spotlight proximity reveals it with per-dot fade-in; after 1.5s the shruggie starts a scared wiggle (ramping amplitude, 18Hz) before fleeing at 2.5s to a new random position with an ease-in-out cubic animation; exclusion zone prevents spawning over hero text and CTA buttons; repositions on window resize; respects prefers-reduced-motion
- Refactor `ServicesPreview` to use per-card scroll-driven reveals (`ServiceCard`) with trailing dot grid background (`ServicesBackground`) and stroke-draw icon animations (`AnimatedIcon`), replacing the previous fire-once `ScrollReveal` stagger approach
- Change "What We Do" services preview grid from `auto-fit` 3+1 layout to a fixed `md:grid-cols-2` (2×2) grid for balanced card distribution
- Fix `ShruggieCTA` tagline ("¯\_(ツ)\_/¯ We'll figure it out.") starting in visible/hover state; tagline now hidden by default and fades down below the button on hover via CSS `group-hover`; absolutely positioned so it does not affect sibling button alignment in the hero section; replaced Framer Motion `whileInView` with pure CSS transitions; respects `prefers-reduced-motion` via `motion-reduce:transition-none`
- Update tagline and hero paragraph text colors: `#595959` in light mode, `#ffffff` in dark mode
- Shruggie easter egg dot color now adapts to current theme: dark ShruggieTech green (`rgb(22, 130, 68)`) in light mode, white in dark mode; uses `MutationObserver` on `<html>` class for real-time theme switching
- Enhance hero dot grid visibility: increase base dot opacity (0.07→0.18), hover opacity (0.45→0.7), dot radius (1.2→1.6), interaction radius (180→240px), hover growth (+0.6→+1.0), and add radial-gradient glow/bloom on active dots; soften connecting lines (distance 100→90, opacity 0.15→0.18, width 0.5→0.6) to reduce the visible X pattern
- Replace static CSS gradient mesh hero background with interactive canvas-based dot grid (`HeroBackground` component); brand-green dots brighten and form connecting mesh lines near cursor, ambient drift animation on mobile/touch, static grid fallback for `prefers-reduced-motion`, zero new dependencies
- Replace placeholder shruggie emoticon logos in `Header` and `Footer` with actual ShruggieTech logo images (`logo-darkbg.png` / `logo-lightbg.png`); Header switches source via `isDark` state, Footer uses CSS `dark:` class toggling; logos sized with auto width to preserve aspect ratio (`h-12` in both Header and Footer)
- Mouse tracking for hero dot grid uses `window`-level events so interaction continues seamlessly over hero text and CTA buttons
- Replace default Next.js favicon with ShruggieTech branded favicon

### Fixed

- Fix hero "See Our Work" button having transparent background causing text to be unreadable over dot grid; add solid `bg-white` / `dark:bg-black` background that adapts to current theme
- Fix US flag not rendering in Footer on Windows; replace `🇺🇸` emoji (displays as "US" letter indicators on Windows) with an inline SVG flag for consistent cross-platform rendering
- Fix missing pointer cursor on buttons, links, and other interactive elements; Tailwind CSS 4 removed the automatic `cursor: pointer` default, so a global base-layer rule now restores it for `a`, `button`, `[role="button"]`, submit/reset/button inputs, `select`, and `summary`
- Fix React hydration mismatch in `HeroSection` caused by `<style jsx>` generating different class name hashes on server vs client; moved gradient mesh CSS to `styles/globals.css` and converted `HeroSection` to a server component

- Project initialization with Next.js 15 (App Router), TypeScript, and Tailwind CSS 4.x
- Production dependencies: lenis, framer-motion, next-mdx-remote, shiki, gray-matter, lucide-react, react-hook-form, @hookform/resolvers, @formspree/react, zod, clsx, tailwind-merge, reading-time, critters
- Development dependencies: @tailwindcss/typography, prettier, prettier-plugin-tailwindcss
- Complete directory structure per specification §1.2
- Design system foundation (§2.1–§2.6): CSS custom properties for full color palette (dark and light modes), Tailwind CSS 4 theme tokens, type scale (display-xl through body-xs), layout constants with responsive breakpoints, and container utilities
- Self-hosted WOFF2 font files: Space Grotesk (Medium 500, Bold 700), Geist (Regular 400, Medium 500), Geist Mono (Regular 400)
- `lib/constants.ts`: site-wide constants (SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE)
- `lib/utils.ts`: `cn()` utility combining clsx and tailwind-merge
- `lib/theme.ts`: `getThemeScript()` IIFE for FOUC-free dark/light mode initialization from cookie state
- `public/site.webmanifest`: web app manifest with icon sizes 192x192 and 512x512
- Placeholder favicon assets at all required sizes (16x16, 32x32, 180x180, 192x192, 512x512, .ico) using brand green (#2BCC73) fill
- VS Code CSS custom data for Tailwind CSS 4 at-rules (`@plugin`, `@theme`, `@custom-variant`, `@utility`)
- Prettier configuration with Tailwind CSS plugin
- `.handoff/` directory structure for sprint coordination
- Component library (§2.4, §3.2, §8.2): 10 reusable UI primitives and shared components
  - `Button` — two variants (primary/secondary), two sizes (default/sm), forwardRef, focus rings
  - `Card` — surface container with border, shadow, optional hover treatment, forwardRef
  - `SectionHeading` — label/title/description with left or center alignment
  - `Badge` — inline tag label with translucent green background
  - `Divider` — horizontal rule with design system border color
  - `SkipLink` — accessible "Skip to main content" link (§3.2)
  - `ShruggieCTA` — CTA button with shruggie tagline flourish, aria-hidden, reduced-motion support
  - `ScrollReveal` — Framer Motion whileInView fade-up wrapper, reduced-motion fallback
  - `JsonLd` — JSON-LD structured data injection via script tag (§8.2)
  - `SEOHead` — convenience wrapper for page-level Open Graph and meta tags (§8.1)
- Global layout and navigation (§4, §5):
  - `LenisProvider` — Lenis smooth scrolling with prefers-reduced-motion bailout and mid-session detection (§4.1–§4.3)
  - `Header` — fixed header with progressive backdrop-blur opacity on scroll, logo/wordmark, 6 nav links with animated underline, theme toggle (Sun/Moon), "Get in Touch" CTA, mobile hamburger (§5.1)
  - `Footer` — four-column layout (brand, pages, products, GitHub) with dynamic copyright year, "Made in the USA" tagline, privacy policy link (§5.2)
  - `MobileNav` — full-screen overlay with slide-in transition, focus trap, Escape close, scroll lock (§5.3)
  - Root layout (`app/layout.tsx`) — self-hosted font loading via next/font/local, FOUC-free theme script injection, SkipLink + Header + main + Footer shell, favicon/manifest metadata, title template (§2.2, §2.6, §1.5, §8.1)
  - Dark/light mode toggle with 1-year cookie persistence (SameSite=Lax), class-based Tailwind strategy (§2.6)
- Homepage (§6.1): five-section landing page with page-level metadata and JSON-LD
  - `HeroSection` — full-width dark hero with CSS animated gradient mesh (30s cycle, prefers-reduced-motion disabled), display-xl headline, dual CTAs (ShruggieCTA + secondary Button)
  - `ServicesPreview` — 2×2 responsive card grid with Lucide icons (Palette, Code2, TrendingUp, Brain), deep links to /services#anchors, staggered ScrollReveal
  - `WorkPreview` — horizontal snap-scroll strip of 3 case study cards (United Way, Scruggs Tire, I Heart PR Tours) with industry badges and placeholder images
  - `ResearchPreview` — vertical publication cards (ADF, Multi-Agent Guide, rustif Declaration) with author and "Read paper" links
  - `CTASection` — gradient background (gray-900→black) with green-20% top border, ShruggieCTA to /contact
  - `app/page.tsx` — homepage assembly with WebSite JSON-LD schema, Open Graph metadata, canonical URL
  - `lib/schema.ts` — JSON-LD schema generators (Organization, WebSite, BlogPosting, Service, TechArticle, SoftwareSourceCode) per §8.2- Services page (§6.2): full services page at `/services` with page-level metadata and JSON-LD
  - Page hero with headline and subheadline
  - Four service pillar sections with anchor IDs (`#strategy-brand`, `#development`, `#marketing`, `#ai-data`) — each with title, lead paragraph, body text, and styled capabilities list using semantic `<ul>` with custom green dot markers
  - `EngagementModel` — interactive three-phase engagement model ("How We Work") with animated SVG connecting lines (Framer Motion pathLength), expandable phase cards with CSS grid-template-rows transition, hover/tap interactions, per-segment glow effects, and full prefers-reduced-motion fallback (pre-expanded cards, static lines, no animations)
  - Ownership thesis section ("You Own Everything We Build")
  - Bottom CTA using ShruggieCTA linking to `/contact`
  - Service JSON-LD schemas for all four pillars via `generateServiceSchema`
- About page (§6.6): four-section page at `/about` with page-level metadata
  - Hero with headline and subheadline from spec
  - Origin story ("Where We Come From") with full body text
  - Team section: three cards (William Thompson, Natalie Thompson, Josiah Thompson) with placeholder avatar silhouettes (initials in gray circles), name, title, and description matching spec exactly
  - Values section: three value blocks ("Ownership, not rentership.", "Specification-driven.", "Ship and iterate.") in responsive horizontal/stacked grid
  - All sections wrapped in ScrollReveal with staggered delays for team and values cards
- Contact page (§6.8): conversion page at `/contact` with page-level metadata
  - Hero with headline "Get in Touch" and subheadline from spec
  - `ContactForm` client component integrating @formspree/react `useForm` hook with React Hook Form + Zod validation
  - Five form fields: Name (min 2, required), Email (valid email, required), Company (optional), Message textarea (min 10, required), "How did you hear about us?" select (enum: Search engine, Referral, Social media, Other; optional)
  - Full form accessibility: visible `<label>` elements with `htmlFor`, `aria-invalid` on invalid fields, `aria-describedby` linking error messages, `aria-live="polite"` error summary, submit button disabled during submission
  - Success state: confirmation message "Thanks for reaching out. We will get back to you within one business day."
  - Direct contact section with address (116 Agnes Rd, Ste 200, Knoxville, TN 37919) and email placeholder per §1.4 item 7
- Blog architecture (§7.1–§7.4, §6.7, §8.2): complete MDX-based blog content pipeline
  - `lib/blog.ts` — content loading library with `getAllPostsMeta()`, `getPostBySlug()`, and `getPaginatedPosts()` functions; reads `.mdx` from `content/blog/`, parses frontmatter with gray-matter, computes reading time, filters drafts in production, sorts by date descending
  - `components/blog/MDXComponents.tsx` — custom MDX renderers for h2, h3, p, a, code (inline vs block detection for Shiki compatibility), blockquote, pre, and custom `Callout` component (info/warning variants with colored borders)
  - `components/blog/PostCard.tsx` — blog index card with title, date, reading time, author, category badge, and 2-line excerpt; full card is a clickable link
  - `components/blog/PostHeader.tsx` — individual post header with category badge, display-md title, author, date, and reading time in centered layout
  - `components/blog/TableOfContents.tsx` — sidebar navigation extracting h2/h3 headings from raw MDX with sticky positioning and anchor links
  - `components/blog/Pagination.tsx` — previous/next navigation with page numbers, disabled states, and aria-current/aria-label attributes
  - `app/blog/page.tsx` — blog index page with hero section, paginated post cards in single-column 720px layout, and page-level metadata
  - `app/blog/[slug]/page.tsx` — individual blog post page with `generateStaticParams` for SSG, `generateMetadata` for dynamic SEO, MDXRemote rendering with Shiki `github-dark` syntax highlighting, and BlogPosting JSON-LD schema
  - `content/blog/example-post.mdx` — sample blog post exercising h2, h3, code block, Callout (info + warning), and blockquote
  - `@shikijs/rehype` — installed as production dependency for Shiki rehype integration
- Case studies — Work section (§6.3): content pipeline, index page, and individual case study pages
  - `lib/work.ts` — content loading library with `getAllCaseStudiesMeta()` and `getCaseStudyBySlug()` functions; reads `.mdx` from `content/work/`, parses frontmatter with gray-matter, filters drafts in production, sorts by date descending
  - `app/work/page.tsx` — work index page with hero section, responsive 2-column (desktop) / 1-column (mobile) case study card grid, industry badges, "Coming Soon" badge overlay for cards without hero images, and page-level metadata
  - `app/work/[slug]/page.tsx` — individual case study page with `generateStaticParams` for SSG, `generateMetadata` for dynamic SEO, MDXRemote rendering with Shiki syntax highlighting (reuses blog MDXComponents), services used badges section, hero image support with existence check
  - `content/work/united-way.mdx` — United Way of Anderson County case study (Nonprofit, web development, accessibility compliance)
  - `content/work/scruggs-tire.mdx` — Scruggs Tire & Alignment case study (Automotive Services, vendor displacement, replatforming)
  - `content/work/i-heart-pr-tours.mdx` — I Heart PR Tours case study (Tourism & Hospitality, OTA optimization, revenue share model)
- Research, Products, and Error pages (§6.4, §6.5, §6.10, §8.2):
  - `app/research/page.tsx` — Research page with three publication cards (ADF, Multi-Agent Guide, rustif Declaration), TechArticle JSON-LD for each publication, page-level metadata, ScrollReveal animations
  - `app/products/page.tsx` — Products page with four product cards (shruggie-indexer, metadexer, shruggie-feedtools, rustif), status badges, SoftwareSourceCode JSON-LD for each product, "How We Build Software" engineering philosophy section, page-level metadata
  - `app/not-found.tsx` — Custom 404 page with display-xl "404" headline in accent color, navigation links (Homepage, Services, Contact), decorative shruggie emoticon (aria-hidden), uses global layout
  - `app/error.tsx` — Global error boundary client component with "Try Again" (reset) and "Go Home" actions, console.error diagnostics
- Audience landing pages, privacy policy, and cookie consent (§6.9, §6.11):
  - `components/shared/LandingPageTemplate.tsx` — shared template for audience-specific landing pages with hero, pain point cards (3-card responsive grid), relevant services (badge list), social proof section (case study/research/product cards), and ShruggieCTA, reused by all four `/for/` pages
  - `app/for/small-business/page.tsx` — Small Business Owners landing page (Segment A) referencing Scruggs Tire case study
  - `app/for/nonprofits/page.tsx` — Nonprofits & Mission-Driven Organizations landing page (Segment B) referencing United Way case study
  - `app/for/technical-teams/page.tsx` — Technical Founders & Product Teams landing page (Segment C) referencing ADF and Multi-Agent guide research
  - `app/for/developers/page.tsx` — Developers & Open Source Community landing page (Segment D) referencing products (shruggie-indexer, metadexer, rustif) and research publications
  - `app/privacy/page.tsx` — Privacy Policy page with hardcoded policy text (not MDX), narrow container with prose styling, sections: Information We Collect, How We Use Your Information, Third-Party Services, Cookies, Data Retention, Your Rights, Changes to This Policy, Contact
  - `components/shared/CookieConsent.tsx` — cookie consent banner client component, fixed bottom bar with translucent background/backdrop-blur, Accept/Decline buttons setting 1-year `consent` cookie, "Learn more" link to `/privacy`, `role="dialog"` and `aria-label="Cookie consent"`, auto-hides if consent cookie already exists
  - `app/layout.tsx` — modified to include CookieConsent component after Footer
- SEO infrastructure, analytics, and deployment configuration (§8.1–§8.4, §9, §10, §6.11):
  - `lib/schema.ts` — six JSON-LD generator functions (Organization, WebSite, BlogPosting, Service, TechArticle, SoftwareSourceCode) per §8.2, all returning valid `@context: https://schema.org` objects
  - Organization JSON-LD injected into root layout (`app/layout.tsx`) via `JsonLd` component, rendering on every page
  - Verified page-level JSON-LD injections: Homepage (WebSite), Services (Service ×4), Blog posts (BlogPosting), Research (TechArticle ×3), Products (SoftwareSourceCode ×4)
  - `app/sitemap.ts` — dynamic sitemap generation via Next.js `MetadataRoute.Sitemap` including all static pages, `/privacy`, all four `/for/` landing pages, all blog post slugs, and all case study slugs with priority tiers (1.0/0.8/0.6) per §8.3
  - `app/robots.ts` — robots.txt generation via Next.js `MetadataRoute.Robots` allowing all user agents, referencing sitemap URL per §8.3
  - `app/api/og/route.tsx` — dynamic OG image generation (1200×630) using `next/og` `ImageResponse` on edge runtime with branded dark card, green "SHRUGGIETECH" label, title and author params per §8.4
  - Consent-gated GA4/GTM analytics loading in root layout via inline IIFE script that reads `consent` cookie before first paint; scripts only injected when `consent=granted` and env vars are configured per §6.11
  - `next.config.ts` — production configuration with `images.formats` (AVIF/WebP), `experimental.optimizeCss`, and font cache-control headers (`max-age=31536000, immutable`) per §10.1
  - `.env.example` — documentation of all four required environment variables (`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FORMSPREE_ID`) per §10.2
