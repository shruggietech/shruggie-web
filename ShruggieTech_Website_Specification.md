<a name="shruggietech-website-specification" id="shruggietech-website-specification"></a>
# ShruggieTech Website Specification

| Attribute | Value |
|-----------|-------|
| Subject | ShruggieTech Website Rebuild |
| Version | 1.2.0 |
| Date | 2026-03-10 |
| Status | APPROVED |
| Audience | AI-first, Human-second |
| Framework | Next.js (App Router) |
| Deployment | Vercel (existing account) |

<a name="table-of-contents" id="table-of-contents"></a>
## Table of Contents

- [Document Information](#document-information)
  - [Purpose and Audience](#purpose-and-audience)
  - [Scope](#scope)
  - [Terminology](#terminology)
  - [Reference Documents](#reference-documents)
- [1. Architectural Overview](#1-architectural-overview)
  - [1.1. Technology Stack](#11-technology-stack)
  - [1.2. Project Structure](#12-project-structure)
  - [1.3. Dependency Manifest](#13-dependency-manifest)
  - [1.4. Human-in-the-Loop Requirements](#14-human-in-the-loop-requirements)
  - [1.5. Favicon and Web App Manifest](#15-favicon-and-web-app-manifest)
- [2. Design System](#2-design-system)
  - [2.1. Color Palette](#21-color-palette)
  - [2.2. Typography](#22-typography)
  - [2.3. Spacing and Grid](#23-spacing-and-grid)
  - [2.4. Component Primitives](#24-component-primitives)
  - [2.5. Motion and Scroll Behavior](#25-motion-and-scroll-behavior)
  - [2.6. Dark and Light Mode](#26-dark-and-light-mode)
- [3. Accessibility Compliance](#3-accessibility-compliance)
  - [3.1. Section 508 and WCAG 2.2 AA Requirements](#31-section-508-and-wcag-22-aa-requirements)
  - [3.2. Implementation Patterns](#32-implementation-patterns)
  - [3.3. Testing Protocol](#33-testing-protocol)
- [4. Lenis Smooth Scrolling Integration](#4-lenis-smooth-scrolling-integration)
  - [4.1. Configuration](#41-configuration)
  - [4.2. Accessibility Safeguards](#42-accessibility-safeguards)
  - [4.3. Provider Implementation](#43-provider-implementation)
- [5. Global Layout and Navigation](#5-global-layout-and-navigation)
  - [5.1. Header](#51-header)
  - [5.2. Footer](#52-footer)
  - [5.3. Mobile Navigation](#53-mobile-navigation)
- [6. Page Specifications](#6-page-specifications)
  - [6.1. Homepage](#61-homepage)
  - [6.2. Services](#62-services)
  - [6.3. Work (Case Studies)](#63-work)
  - [6.4. Research and Publications](#64-research-and-publications)
  - [6.5. Products (Open Source)](#65-products)
  - [6.6. About](#66-about)
  - [6.7. Blog](#67-blog)
  - [6.8. Contact](#68-contact)
  - [6.9. Audience Landing Pages](#69-audience-landing-pages)
  - [6.10. Error Pages](#610-error-pages)
  - [6.11. Privacy Policy](#611-privacy-policy)
- [7. Blog Architecture](#7-blog-architecture)
  - [7.1. Content Strategy](#71-content-strategy)
  - [7.2. MDX Pipeline](#72-mdx-pipeline)
  - [7.3. Blog Post Template](#73-blog-post-template)
  - [7.4. Authoring Workflow](#74-authoring-workflow)
- [8. SEO and AEO Infrastructure](#8-seo-and-aeo-infrastructure)
  - [8.1. Metadata Strategy](#81-metadata-strategy)
  - [8.2. JSON-LD Schema Markup](#82-json-ld-schema-markup)
  - [8.3. Sitemap and Robots](#83-sitemap-and-robots)
  - [8.4. Open Graph and Social Cards](#84-open-graph-and-social-cards)
- [9. Performance Budget](#9-performance-budget)
  - [9.1. Core Web Vitals Targets](#91-core-web-vitals-targets)
  - [9.2. Asset Optimization](#92-asset-optimization)
- [10. Deployment and CI/CD](#10-deployment-and-cicd)
  - [10.1. Vercel Configuration](#101-vercel-configuration)
  - [10.2. Environment Variables](#102-environment-variables)

<a name="document-information" id="document-information"></a>
<hr class="print-page-break">

## Document Information

<a name="purpose-and-audience" id="purpose-and-audience"></a>
### Purpose and Audience

<div style="text-align:justify">

This document is the authoritative specification for the ShruggieTech public website. It defines the architectural decisions, design system, page content, component behavior, accessibility requirements, content pipeline, SEO/AEO infrastructure, and deployment configuration that govern all implementation work on the `shruggie-web` repository.

</div>

<div style="text-align:justify">

The specification is written for an **AI-first, Human-second** audience. Its primary consumers are AI implementation agents operating within isolated context windows during sprint-based development. Every section provides sufficient detail for an agent to produce correct design decisions and working code without requiring interactive clarification. Human developers and maintainers are the secondary audience.

</div>

<div style="text-align:justify">

This specification does NOT serve as a content management guide, user manual, or marketing strategy document. Those concerns are addressed in the ShruggieTech Consolidated Knowledge Base where applicable, and in the operational procedures established during delivery.

</div>

<a name="scope" id="scope"></a>
### Scope

<div style="text-align:justify">

This specification covers the complete public-facing website for ShruggieTech at `https://shruggie.tech`. The scope includes all pages listed in the navigation (Homepage, Services, Work, Research, Products, About, Blog, Contact), four audience-specific landing pages under `/for/`, error and legal pages, the MDX-based blog content pipeline, the design system and component library, the SEO/AEO infrastructure, and the Vercel deployment configuration. The specification does not cover product-specific documentation sites (e.g., the metadexer documentation site defined in the metadexer specification §11), client project websites, or ShruggieTech's internal tooling.

</div>

<a name="terminology" id="terminology"></a>
### Terminology

| Term | Definition |
|------|-----------|
| AEO | Answer Engine Optimization. Structured data and content strategy designed to make web content citable by AI-powered answer engines (ChatGPT, Perplexity, Google AI Overviews). |
| CLS | Cumulative Layout Shift. A Core Web Vital measuring visual stability during page load. |
| FCP | First Contentful Paint. Time to first rendered DOM content. |
| FOUC | Flash of Unstyled Content. A visual flicker caused by styles loading after initial render. |
| INP | Interaction to Next Paint. A Core Web Vital measuring responsiveness to user input. |
| ISR | Incremental Static Regeneration. A Next.js feature that allows static pages to be regenerated on demand after deployment. |
| JSON-LD | JavaScript Object Notation for Linked Data. A structured data format used for schema markup in HTML documents. |
| LCP | Largest Contentful Paint. A Core Web Vital measuring perceived load speed. |
| MDX | Markdown with JSX. An authoring format that combines Markdown syntax with embedded React components. |
| OG | Open Graph. A metadata protocol for controlling how URLs are displayed when shared on social platforms. |
| OTA | Online Travel Agency. Third-party booking platforms (TripAdvisor, Viator, Expedia, etc.) referenced in the I Heart PR Tours case study. |
| RSC | React Server Components. A React architecture where components render on the server and send only HTML to the client. |
| WCAG | Web Content Accessibility Guidelines. The international standard for web accessibility, published by the W3C. |

<a name="reference-documents" id="reference-documents"></a>
### Reference Documents

| Document | Relevance |
|----------|-----------|
| ShruggieTech Consolidated Knowledge Base (v1.4.0) | Authoritative source for company identity, brand standards, team descriptions, service definitions, audience segmentation, product portfolio, and strategic roadmap. This specification cross-references the KB using the notation "KB §X.Y". |
| metadexer Technical Specification (DRAFT, 2026-03-09) | Reference for ShruggieTech's specification authoring standards, document structure conventions, and development workflow (§23). The website project follows the same sprint planning methodology. |
| ShruggieTech Formal Business Plan (v1.1.0) | Source for mission/vision statements, market positioning, financial projections, and phased roadmap. Decisions codified in the business plan are treated as ratified unless explicitly superseded. |

<a name="1-architectural-overview" id="1-architectural-overview"></a>
<hr class="print-page-break">

## 1. Architectural Overview

<a name="11-technology-stack" id="11-technology-stack"></a>
### 1.1. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | Server components, file-based routing, ISR for blog content |
| Language | TypeScript 5.x | Type safety across codebase |
| Styling | Tailwind CSS 4.x | Utility-first CSS with design token integration |
| Smooth Scroll | Lenis (by darkroom.engineering) | Tasteful, performant smooth scrolling with reduced-motion respect |
| Animation | Framer Motion 12.x | Declarative animation with scroll-triggered reveals and layout transitions |
| Blog Content | MDX (via `next-mdx-remote`) | Markdown with embedded React components; low-friction authoring |
| Syntax Highlighting | Shiki | Blog code blocks with accurate token highlighting |
| Icons | Lucide React | Consistent, lightweight SVG icon library |
| Schema Markup | Custom JSON-LD generators | AEO-optimized structured data for every page type |
| Forms | Formspree + React Hook Form + Zod | No backend required; Formspree handles submission and email delivery. Client-side validation via Zod. |
| Analytics | Google Analytics 4 + Google Tag Manager | Existing ShruggieTech tooling (see KB §9.5) |
| Deployment | Vercel | Existing account; zero additional setup |

<a name="12-project-structure" id="12-project-structure"></a>
### 1.2. Project Structure

```
shruggie-web/
├── app/
│   ├── layout.tsx                 # Root layout: fonts, metadata, Lenis provider, header/footer
│   ├── page.tsx                   # Homepage
│   ├── services/
│   │   └── page.tsx
│   ├── work/
│   │   ├── page.tsx               # Case studies index
│   │   └── [slug]/
│   │       └── page.tsx           # Individual case study
│   ├── research/
│   │   └── page.tsx               # Publications listing
│   ├── products/
│   │   └── page.tsx               # Open source portfolio
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx               # Blog index with pagination
│   │   └── [slug]/
│   │       └── page.tsx           # Individual blog post
│   ├── contact/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx               # Privacy policy
│   ├── not-found.tsx               # Custom 404 page
│   ├── error.tsx                   # Global error boundary
│   ├── for/
│   │   ├── small-business/
│   │   │   └── page.tsx           # Segment A landing page
│   │   ├── nonprofits/
│   │   │   └── page.tsx           # Segment B landing page
│   │   ├── technical-teams/
│   │   │   └── page.tsx           # Segment C landing page
│   │   └── developers/
│   │       └── page.tsx           # Segment D landing page
│   └── api/
│       └── og/
│           └── route.tsx          # Dynamic OG image generation
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── LenisProvider.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── Badge.tsx
│   │   ├── Divider.tsx
│   │   ├── SkipLink.tsx
│   │   └── ShruggieCTA.tsx        # CTA button with shruggie hover/scroll interaction
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesPreview.tsx
│   │   ├── WorkPreview.tsx
│   │   ├── ResearchPreview.tsx
│   │   └── CTASection.tsx
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostHeader.tsx
│   │   ├── MDXComponents.tsx      # Custom renderers for MDX elements
│   │   ├── TableOfContents.tsx
│   │   └── Pagination.tsx
│   └── shared/
│       ├── ScrollReveal.tsx        # Framer Motion scroll-triggered reveal wrapper
│       ├── JsonLd.tsx              # Schema markup injection component
│       └── SEOHead.tsx
├── content/
│   └── blog/                       # MDX blog posts live here
│       ├── example-post.mdx
│       └── ...
├── lib/
│   ├── blog.ts                     # Blog content loading, sorting, pagination
│   ├── schema.ts                   # JSON-LD generators for each page type
│   ├── constants.ts                # Site-wide constants (URLs, metadata defaults)
│   └── utils.ts                    # Shared utility functions
├── public/
│   ├── fonts/                      # Self-hosted font files (WOFF2)
│   ├── images/
│   │   ├── team/
│   │   ├── work/
│   │   └── og/                     # Open Graph images
│   ├── favicon.ico                 # Classic favicon (32x32)
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png        # 180x180 for iOS
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   └── site.webmanifest            # Web app manifest
├── styles/
│   └── globals.css                 # Tailwind directives, CSS custom properties, base resets
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

<a name="13-dependency-manifest" id="13-dependency-manifest"></a>
### 1.3. Dependency Manifest

**Production dependencies:**

| Package | Purpose |
|---------|---------|
| `next` | Framework |
| `react`, `react-dom` | UI runtime |
| `lenis` | Smooth scrolling engine |
| `framer-motion` | Animation library |
| `next-mdx-remote` | MDX rendering for blog posts |
| `shiki` | Code syntax highlighting in blog posts |
| `gray-matter` | YAML frontmatter parsing for MDX files |
| `lucide-react` | Icon library |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod integration for react-hook-form |
| `@formspree/react` | Formspree client for contact form submission (no backend required) |
| `zod` | Schema validation for forms and content |
| `clsx` | Conditional class name utility |
| `tailwind-merge` | Tailwind class deduplication |
| `reading-time` | Estimated read time for blog posts |

**Development dependencies:**

| Package | Purpose |
|---------|---------|
| `typescript` | Type system |
| `tailwindcss`, `@tailwindcss/typography` | Styling and prose formatting |
| `eslint`, `eslint-config-next` | Linting |
| `@types/react`, `@types/node` | Type definitions |
| `prettier`, `prettier-plugin-tailwindcss` | Code formatting with Tailwind class sorting |

<a name="14-human-in-the-loop-requirements" id="14-human-in-the-loop-requirements"></a>
### 1.4. Human-in-the-Loop Requirements

<div style="text-align:justify">

The following items require manual action by a ShruggieTech team member and cannot be automated within the build pipeline. Each is annotated with the phase in which it blocks progress.

</div>

| # | Action | Phase | Notes |
|---|--------|-------|-------|
| 1 | **ShruggieTech logo (PNG)** | Pre-development | The kawaii shruggie logo must be provided as a high-resolution PNG file (minimum 512x512px, transparent background). Place in `public/images/logo.png`. An SVG version is also recommended for the header wordmark if available. |
| 2 | **Google Analytics 4 Measurement ID** | Pre-launch | Existing GA4 property; retrieve the `G-XXXXXXXXXX` ID from the GA4 admin panel and add it to Vercel environment variables as `NEXT_PUBLIC_GA_MEASUREMENT_ID`. See also [§10.2](#102-environment-variables). |
| 3 | **Google Tag Manager Container ID** | Pre-launch | Existing GTM container; retrieve the `GTM-XXXXXXX` ID and add to environment variables as `NEXT_PUBLIC_GTM_ID`. See also [§10.2](#102-environment-variables). |
| 4 | **Formspree Form ID** | Pre-launch | Create a new form at [formspree.io](https://formspree.io). Retrieve the form ID (e.g., `xpznqkdl`) and add to Vercel environment variables as `NEXT_PUBLIC_FORMSPREE_ID`. Configure the Formspree dashboard to forward submissions to the desired team email address. No backend API route is required. |
| 5 | **Team photographs** | Content | Professional headshots for William, Natalie, and Josiah. Minimum resolution: 800x800px, square crop. Place in `public/images/team/`. Placeholder silhouettes will render in the interim. |
| 6 | **Case study assets** | Content | Before/after screenshots and quantified outcome metrics for each case study. Client permission is already secured via original engagement contracts. The case study page template is built and ready to populate; see [§6.3](#63-work) for the example structure that demonstrates exactly what content is needed per study. Placeholder cards with "Coming Soon" badges will render until assets are provided. |
| 7 | **Contact email address** | Pre-launch | Confirm the public-facing contact email address for the Contact page ([§6.8](#68-contact)). This address will appear on the website and receive direct inquiries. Add to the Contact page and footer once confirmed. |
| 8 | **Favicon source artwork** | Pre-development | Generate favicon assets from the kawaii shruggie logo at the following sizes: `favicon.ico` (32x32), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180x180), `android-chrome-192x192.png`, `android-chrome-512x512.png`. All PNG variants use a transparent background. Place in `public/`. See [§1.5](#15-favicon-and-web-app-manifest) for the manifest configuration. |

<div style="text-align:justify">

**Regarding fonts:** All fonts specified in this document (Space Grotesk, Geist, Geist Mono) are released under the SIL Open Font License (OFL). This license permits free use, redistribution, and self-hosting with no purchase or registration required. No licensing action is needed.

</div>

<a name="15-favicon-and-web-app-manifest" id="15-favicon-and-web-app-manifest"></a>
### 1.5. Favicon and Web App Manifest

<div style="text-align:justify">

Modern browsers and operating systems expect multiple favicon sizes and a web app manifest for proper tab branding, home screen icons, and PWA metadata. The favicon source artwork is derived from the kawaii shruggie logo ([§1.4](#14-human-in-the-loop-requirements), item 8). All favicon files are placed in the `public/` root for automatic serving by Next.js.

</div>

**Required favicon assets:**

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 32x32 | Classic favicon for legacy browser support |
| `favicon-16x16.png` | 16x16 | Small favicon (browser tabs on low-DPI displays) |
| `favicon-32x32.png` | 32x32 | Standard favicon (browser tabs on high-DPI displays) |
| `apple-touch-icon.png` | 180x180 | iOS home screen icon |
| `android-chrome-192x192.png` | 192x192 | Android home screen icon (standard) |
| `android-chrome-512x512.png` | 512x512 | Android home screen icon (high resolution), splash screen |

**Web app manifest (`public/site.webmanifest`):**

```json
{
  "name": "ShruggieTech",
  "short_name": "ShruggieTech",
  "description": "Modern digital systems, software, and AI-driven experiences.",
  "start_url": "/",
  "display": "browser",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Head metadata (injected via root layout `app/layout.tsx`):**

```tsx
export const metadata: Metadata = {
  // ... other metadata
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
};
```

<a name="2-design-system" id="2-design-system"></a>
<hr class="print-page-break">

## 2. Design System

<a name="21-color-palette" id="21-color-palette"></a>
### 2.1. Color Palette

<div style="text-align:justify">

The palette is drawn directly from the brand identity established in KB §10.1. CSS custom properties are defined in `styles/globals.css` and mapped to Tailwind tokens in `tailwind.config.ts`. The system uses semantic naming to support both dark (default) and light modes.

</div>

**Brand colors (immutable):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-black` | `#000000` | Primary background (dark mode), text (light mode) |
| `--color-green-bright` | `#2BCC73` | Primary accent, interactive elements, links, highlights |
| `--color-green-deep` | `#00AB21` | Logo mark, secondary accent, hover states |
| `--color-orange` | `#FF5300` | CTA emphasis, alerts, energy accents |
| `--color-gray-light` | `#D1D3D4` | Borders, secondary text, dividers |

**Extended palette (derived):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-white` | `#FFFFFF` | Primary background (light mode), text on dark |
| `--color-gray-950` | `#0A0A0A` | Elevated surface (dark mode cards) |
| `--color-gray-900` | `#111111` | Secondary surface (dark mode) |
| `--color-gray-800` | `#1A1A1A` | Tertiary surface, code blocks |
| `--color-gray-600` | `#6B6B6B` | Muted text (dark mode) |
| `--color-gray-400` | `#9A9A9A` | Muted text (light mode) |
| `--color-gray-200` | `#E5E5E5` | Borders (light mode) |
| `--color-gray-100` | `#F5F5F5` | Surface (light mode cards) |
| `--color-green-bright-10` | `rgba(43, 204, 115, 0.10)` | Subtle accent backgrounds |
| `--color-green-bright-20` | `rgba(43, 204, 115, 0.20)` | Badge backgrounds, active states |
| `--color-orange-10` | `rgba(255, 83, 0, 0.10)` | Subtle CTA highlight backgrounds |

**CSS custom properties definition (`styles/globals.css`):**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Brand immutables */
    --color-black: 0 0 0;
    --color-white: 255 255 255;
    --color-green-bright: 43 204 115;
    --color-green-deep: 0 171 33;
    --color-orange: 255 83 0;
    --color-gray-light: 209 211 212;

    /* Semantic tokens — light mode */
    --color-bg-primary: var(--color-white);
    --color-bg-secondary: 245 245 245;
    --color-bg-elevated: 255 255 255;
    --color-text-primary: 10 10 10;
    --color-text-secondary: 107 107 107;
    --color-text-muted: 154 154 154;
    --color-border: 229 229 229;
    --color-accent: var(--color-green-bright);
    --color-accent-hover: var(--color-green-deep);
    --color-cta: var(--color-orange);
  }

  .dark {
    --color-bg-primary: 0 0 0;
    --color-bg-secondary: 17 17 17;
    --color-bg-elevated: 10 10 10;
    --color-text-primary: 255 255 255;
    --color-text-secondary: 209 211 212;
    --color-text-muted: 107 107 107;
    --color-border: 38 38 38;
    --color-accent: var(--color-green-bright);
    --color-accent-hover: var(--color-green-deep);
    --color-cta: var(--color-orange);
  }
}
```

**Tailwind configuration mapping (`tailwind.config.ts`):**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",
          elevated: "rgb(var(--color-bg-elevated) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
        },
        cta: "rgb(var(--color-cta) / <alpha-value>)",
        brand: {
          green: {
            bright: "#2BCC73",
            deep: "#00AB21",
          },
          orange: "#FF5300",
          gray: "#D1D3D4",
        },
      },
      // ... (typography, spacing extensions defined below)
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

<a name="22-typography" id="22-typography"></a>
### 2.2. Typography

<div style="text-align:justify">

The knowledge base specifies Space Grotesk as the logotype font (KB §10.1). Space Grotesk is a geometric sans-serif with a technical personality that aligns with the premium tech aesthetic. It will serve as the display and heading font. For body text, a complementary geometric sans with superior legibility at small sizes is required. The specification selects **Geist** (by Vercel, OFL-licensed) as the body font. Geist is designed specifically for digital interfaces, optimized for screen readability, and pairs naturally with Space Grotesk's geometric character without competing with it. As a backup alternative, **DM Sans** (Google Fonts, OFL-licensed) can be substituted.

</div>

**Font stack:**

| Role | Font | Weight Range | Fallback |
|------|------|-------------|----------|
| Display / Headings | Space Grotesk | 500 (Medium), 700 (Bold) | `system-ui, sans-serif` |
| Body / UI | Geist | 400 (Regular), 500 (Medium) | `system-ui, sans-serif` |
| Monospace (code) | Geist Mono | 400 (Regular) | `ui-monospace, monospace` |

**Self-hosting strategy:** All fonts are self-hosted as WOFF2 files in `public/fonts/` for performance and privacy (no external Google Fonts requests). Next.js `next/font/local` handles preloading and font-display optimization.

**Font loading implementation (`app/layout.tsx`):**

```tsx
import localFont from "next/font/local";

const spaceGrotesk = localFont({
  src: [
    { path: "../public/fonts/SpaceGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/SpaceGrotesk-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const geist = localFont({
  src: [
    { path: "../public/fonts/Geist-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Geist-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: [
    { path: "../public/fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
```

**Type scale (Tailwind extension):**

```typescript
// Inside tailwind.config.ts theme.extend
fontFamily: {
  display: ["var(--font-display)", "system-ui", "sans-serif"],
  body: ["var(--font-body)", "system-ui", "sans-serif"],
  mono: ["var(--font-mono)", "ui-monospace", "monospace"],
},
fontSize: {
  // Display scale (Space Grotesk)
  "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],   // 72px — Hero
  "display-lg": ["3.5rem", { lineHeight: "1.1",  letterSpacing: "-0.025em" }],  // 56px — Page title
  "display-md": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],   // 40px — Section heading
  "display-sm": ["1.75rem", { lineHeight: "1.2",  letterSpacing: "-0.015em" }], // 28px — Subsection

  // Body scale (Geist)
  "body-lg":    ["1.25rem", { lineHeight: "1.6" }],   // 20px — Lead paragraphs
  "body-md":    ["1rem",    { lineHeight: "1.7" }],    // 16px — Default body
  "body-sm":    ["0.875rem",{ lineHeight: "1.6" }],    // 14px — Captions, metadata
  "body-xs":    ["0.75rem", { lineHeight: "1.5" }],    // 12px — Labels, legal
},
```

<a name="23-spacing-and-grid" id="23-spacing-and-grid"></a>
### 2.3. Spacing and Grid

<div style="text-align:justify">

The layout uses generous whitespace consistent with the Anthropic/Linear/Vercel aesthetic. Content is constrained to a maximum width with consistent horizontal padding. Vertical rhythm between sections is large enough to give each section room to breathe.

</div>

**Layout constants:**

| Token | Value | Usage |
|-------|-------|-------|
| `--max-width-content` | `1200px` | Maximum content width |
| `--max-width-narrow` | `720px` | Blog post body, focused reading |
| `--padding-x` | `24px` (mobile), `48px` (tablet), `80px` (desktop) | Horizontal page padding |
| `--section-gap` | `120px` (mobile), `160px` (tablet), `200px` (desktop) | Vertical space between major sections |
| `--component-gap` | `48px` (mobile), `64px` (desktop) | Space between components within a section |

**Grid system:**

```css
/* Container utility */
.container-content {
  max-width: var(--max-width-content);
  margin-inline: auto;
  padding-inline: var(--padding-x);
}

.container-narrow {
  max-width: var(--max-width-narrow);
  margin-inline: auto;
  padding-inline: var(--padding-x);
}
```

<div style="text-align:justify">

For multi-column layouts (services grid, team cards, product cards), use CSS Grid with `auto-fit` and `minmax()` for responsive behavior without breakpoint-specific column counts. Example: `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`.

</div>

<a name="24-component-primitives" id="24-component-primitives"></a>
### 2.4. Component Primitives

**Button (`components/ui/Button.tsx`):**

<div style="text-align:justify">

Two visual variants (primary and secondary) and two sizes (default and small). Primary uses the brand orange for maximum CTA energy. Secondary uses a bordered, transparent treatment. Both have subtle hover transitions. All buttons must be keyboard-focusable with a visible focus ring that uses the bright green accent.

</div>

```tsx
import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "sm";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "default", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          // Base
          "inline-flex items-center justify-center font-display font-medium",
          "rounded-lg transition-all duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
          // Size
          size === "default" && "px-6 py-3 text-body-md",
          size === "sm" && "px-4 py-2 text-body-sm",
          // Variant
          variant === "primary" && [
            "bg-cta text-white",
            "hover:brightness-110 active:brightness-95",
            "shadow-sm hover:shadow-md",
          ],
          variant === "secondary" && [
            "border border-border text-text-primary",
            "hover:border-accent hover:text-accent",
            "bg-transparent",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
```

**Card (`components/ui/Card.tsx`):**

<div style="text-align:justify">

A surface container with subtle depth. Uses a thin border and soft shadow rather than heavy elevation. On hover, the border transitions to the accent color.

</div>

```tsx
import { clsx } from "clsx";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-xl border border-border bg-bg-elevated",
          "p-6 md:p-8",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
          hover && [
            "transition-all duration-300 ease-out",
            "hover:border-accent/40 hover:shadow-[0_4px_12px_rgba(43,204,115,0.06)]",
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
```

**SectionHeading (`components/ui/SectionHeading.tsx`):**

```tsx
interface SectionHeadingProps {
  label?: string;      // Small all-caps label above heading (e.g., "SERVICES")
  title: string;       // Main heading text
  description?: string; // Optional supporting paragraph
  align?: "left" | "center";
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {label && (
        <span className="mb-3 block font-display text-body-sm font-medium uppercase tracking-widest text-accent">
          {label}
        </span>
      )}
      <h2 className="font-display text-display-md font-bold text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-body-lg text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}
```

**ScrollReveal (`components/shared/ScrollReveal.tsx`):**

<div style="text-align:justify">

A reusable wrapper that animates children into view as they enter the viewport. Uses Framer Motion's `whileInView` to trigger once. The animation is a gentle fade-up (opacity 0 to 1, translateY 24px to 0) over 600ms with an easing curve. This component respects `prefers-reduced-motion` by disabling animation entirely.

</div>

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**ShruggieCTA (`components/ui/ShruggieCTA.tsx`):**

<div style="text-align:justify">

A specialized CTA button wrapper that reveals the shruggie tagline "¯\\\_(ツ)\_/¯ We'll figure it out." as a personality flourish. On desktop, the tagline fades in below the button on hover. On mobile, the tagline reveals via a brief fade-in animation when the component scrolls into the viewport (using `whileInView`), appearing once and remaining visible. The tagline is rendered in `body-xs` muted text with the shruggie emoticon in the brand green. The interaction is purely decorative and does not affect the button's click target or accessibility semantics. The tagline element uses `aria-hidden="true"` to keep screen reader output clean.

</div>

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Button from "./Button";

interface ShruggieCTAProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function ShruggieCTA({ href, children, variant = "primary" }: ShruggieCTAProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="group inline-flex flex-col items-center gap-2">
      <a href={href}>
        <Button variant={variant}>{children}</Button>
      </a>
      <motion.span
        aria-hidden="true"
        className="text-body-xs text-text-muted"
        // Desktop: revealed by group-hover via Tailwind opacity classes
        // Mobile: revealed by scroll via whileInView
        initial={{ opacity: 0 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.2 }}
        // On desktop, Tailwind group-hover overrides:
        // "opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
        // On mobile (<md), whileInView handles the reveal.
      >
        <span className="text-accent">¯\_(ツ)_/¯</span>{" "}
        We&apos;ll figure it out.
      </motion.span>
    </div>
  );
}
```

<div style="text-align:justify">

This component should be used for the primary CTA on the homepage hero, the bottom CTA sections on the homepage and services pages, and the contact page CTA. Secondary CTAs (e.g., "See Our Work") use the standard `Button` component without the shruggie flourish, to keep the effect special rather than ubiquitous.

</div>

<a name="25-motion-and-scroll-behavior" id="25-motion-and-scroll-behavior"></a>
### 2.5. Motion and Scroll Behavior

<div style="text-align:justify">

The motion philosophy is "tasteful restraint." Animation is used to guide the eye, reinforce spatial relationships, and add polish. It is never used for spectacle. Every animation must pass two tests: (1) does it serve a communication purpose (e.g., drawing attention to a CTA, signaling a state change, easing a page transition), and (2) does the page still make complete sense with animations disabled?

</div>

**Permitted animation types:**

| Type | Trigger | Properties | Duration |
|------|---------|-----------|----------|
| Scroll reveal | Element enters viewport | `opacity`, `translateY` | 500-700ms |
| Staggered reveal | Group of elements enter viewport | `opacity`, `translateY` with sequential delay | 500ms per item, 80ms stagger |
| Hover feedback | Cursor enters interactive element | `border-color`, `shadow`, `scale` (max 1.02) | 200-300ms |
| Page transition | Route change | `opacity` cross-fade | 300ms |
| Navigation toggle | Mobile menu open/close | `translateX`, `opacity` | 250ms |
| Link underline | Cursor enters text link | `scaleX` of pseudo-element underline | 200ms |

**Prohibited animation types:**

- Parallax scrolling on content elements (accessibility concern; Lenis handles scroll feel at the container level only)
- Auto-playing video backgrounds
- Infinite looping animations (except a single subtle pulse on the hero CTA, which must respect `prefers-reduced-motion`)
- Scroll-jacking (Lenis smooths native scroll; it does not override scroll distance or direction)
- Animation durations exceeding 800ms for any single element

<a name="26-dark-and-light-mode" id="26-dark-and-light-mode"></a>
### 2.6. Dark and Light Mode

<div style="text-align:justify">

The site defaults to dark mode, consistent with the black-primary brand identity (KB §10.1). A theme toggle in the header allows users to switch to light mode. The toggle persists the user's preference via a cookie (not `localStorage`, which would flash on reload). The implementation uses the `class` strategy in Tailwind (`darkMode: "class"`) with a `<script>` in `<head>` that reads the cookie before first paint to prevent FOUC (flash of unstyled content).

</div>

**Theme toggle logic (`lib/theme.ts`):**

```typescript
export function getThemeScript(): string {
  // Inline script injected into <head> to prevent FOUC.
  // Reads cookie first, falls back to system preference, defaults to dark.
  return `
    (function() {
      var cookie = document.cookie.match(/theme=(light|dark)/);
      var theme = cookie ? cookie[1] : null;
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })();
  `;
}
```

---

<a name="3-accessibility-compliance" id="3-accessibility-compliance"></a>
<hr class="print-page-break">

## 3. Accessibility Compliance

<a name="31-section-508-and-wcag-22-aa-requirements" id="31-section-508-and-wcag-22-aa-requirements"></a>
### 3.1. Section 508 and WCAG 2.2 AA Requirements

<div style="text-align:justify">

Section 508 of the Rehabilitation Act requires that electronic and information technology developed, procured, maintained, or used by federal agencies is accessible to people with disabilities. While ShruggieTech is not a federal entity, the knowledge base explicitly identifies WCAG alignment as a standard delivery practice (KB §14.1) and a differentiator for nonprofit and government-adjacent clients (KB §11.2). The ShruggieTech website itself must demonstrate the accessibility competence that the company sells to clients. WCAG 2.2 Level AA is the compliance target.

</div>

<a name="32-implementation-patterns" id="32-implementation-patterns"></a>
### 3.2. Implementation Patterns

**Color contrast:** All text-on-background combinations must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text). The brand green `#2BCC73` on black `#000000` achieves a contrast ratio of approximately 8.9:1 (passes). The brand green on white `#FFFFFF` achieves approximately 2.4:1 (fails for body text). Therefore, in light mode, green accent text must be darkened to `#00AB21` (deep green, approximately 3.6:1) or used only for large text, icons, and decorative elements. Body text in light mode uses `#0A0A0A` on `#FFFFFF` (passes at approximately 19.5:1).

**Keyboard navigation:** Every interactive element must be reachable via Tab key. Focus order must follow visual reading order. Focus indicators use a 2px solid outline in `#2BCC73` with a 2px offset, providing clear visibility on both dark and light backgrounds. The site must include a "Skip to main content" link as the first focusable element on every page.

**Skip link implementation (`components/ui/SkipLink.tsx`):**

```tsx
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className={clsx(
        "fixed left-4 top-4 z-[9999]",
        "rounded-lg bg-accent px-4 py-2 font-display text-body-sm font-medium text-black",
        "opacity-0 -translate-y-full transition-all duration-200",
        "focus-visible:opacity-100 focus-visible:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      )}
    >
      Skip to main content
    </a>
  );
}
```

**Semantic HTML requirements:**

| Element | Usage |
|---------|-------|
| `<header>` | Site header with `role="banner"` |
| `<nav>` | Primary and mobile navigation with `aria-label` |
| `<main id="main-content">` | Page content, target of skip link |
| `<footer>` | Site footer with `role="contentinfo"` |
| `<section>` | Major content sections with `aria-labelledby` referencing section heading |
| `<article>` | Blog posts and case studies |
| `<h1>` through `<h6>` | Strictly hierarchical; exactly one `<h1>` per page |

**Image accessibility:** All content images require descriptive `alt` text. Decorative images use `alt=""` and `aria-hidden="true"`. The kawaii shruggie logo uses `alt="ShruggieTech logo"`.

**Form accessibility:** The contact form must include visible `<label>` elements associated via `htmlFor`, descriptive `aria-describedby` for validation errors, `aria-invalid` on fields with errors, and `aria-live="polite"` on the error summary region.

**Reduced motion:** All animations are wrapped in `prefers-reduced-motion` checks. The Lenis provider disables smooth scrolling when reduced motion is preferred (see §4.2). Framer Motion's `useReducedMotion` hook gates every animated component.

<a name="33-testing-protocol" id="33-testing-protocol"></a>
### 3.3. Testing Protocol

| Tool | Purpose | Phase |
|------|---------|-------|
| axe-core (browser extension) | Automated WCAG violation scanning | During development |
| Lighthouse Accessibility audit | Automated scoring (target: 100) | Pre-launch |
| Manual keyboard navigation | Tab order, focus visibility, skip link | Pre-launch |
| Screen reader testing (NVDA or VoiceOver) | Content reading order, ARIA labels, form interaction | Pre-launch |
| Color contrast checker (WebAIM) | Validate all color pairs | Design phase |

<a name="4-lenis-smooth-scrolling-integration" id="4-lenis-smooth-scrolling-integration"></a>
<hr class="print-page-break">

## 4. Lenis Smooth Scrolling Integration

<a name="41-configuration" id="41-configuration"></a>
### 4.1. Configuration

<div style="text-align:justify">

Lenis provides a smooth, inertial scroll feel without hijacking scroll behavior. The goal is subtle enhancement: the page should feel slightly more refined than native browser scrolling without the user consciously noticing the effect. Lenis modifies the easing and interpolation of scroll position updates; it does not change scroll distance, direction, or the ability to scroll normally. This is the critical distinction between tasteful smooth scrolling and scroll-jacking.

</div>

**Configuration values:**

```typescript
const lenisConfig = {
  duration: 1.0,          // Scroll interpolation duration in seconds.
                           // 1.0 is subtle; higher values feel "floatier."
                           // Do not exceed 1.4 for a professional site.
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                           // Exponential decay easing. Feels natural.
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,       // Smooth mouse wheel scrolling.
  touchMultiplier: 1.5,    // Slightly amplified touch inertia for mobile feel.
  infinite: false,         // No infinite scroll behavior.
  autoResize: true,        // Recalculate on window resize.
};
```

<a name="42-accessibility-safeguards" id="42-accessibility-safeguards"></a>
### 4.2. Accessibility Safeguards

<div style="text-align:justify">

Lenis must be disabled entirely when the user has indicated a preference for reduced motion. This is not optional. Smooth scrolling manipulates scroll position interpolation, which can cause nausea or disorientation for users with vestibular disorders. The implementation checks `prefers-reduced-motion: reduce` at initialization and bypasses Lenis entirely when the preference is active.

</div>

Additionally, Lenis must not interfere with:

- Anchor link navigation (`#section-id` links must jump immediately, not smooth-scroll, when reduced motion is preferred)
- Browser find-in-page (Ctrl+F/Cmd+F)
- Keyboard-driven scroll (Page Up/Down, Space, Home/End)
- Screen reader virtual cursor navigation

<a name="43-provider-implementation" id="43-provider-implementation"></a>
### 4.3. Provider Implementation

```tsx
// components/layout/LenisProvider.tsx
"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Bail out entirely if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Listen for reduced motion changes during session
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

<a name="5-global-layout-and-navigation" id="5-global-layout-and-navigation"></a>
<hr class="print-page-break">

## 5. Global Layout and Navigation

<a name="51-header" id="51-header"></a>
### 5.1. Header

<div style="text-align:justify">

The header is a fixed-position bar at the top of every page. It uses a translucent background with a backdrop-blur effect, creating depth without full opacity. The header progressively gains opacity as the user scrolls down (0% background at scroll position 0, transitioning to 80% background with blur by 100px of scroll). This effect is disabled when reduced motion is preferred.

</div>

**Header layout (desktop):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo + Wordmark]     Services  Work  Research  Products  About  Blog  │
│                                                          [Theme] [CTA]  │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | Specification |
|---------|--------------|
| Logo | Kawaii shruggie PNG image (see [§1.4](#14-human-in-the-loop-requirements), item 1), 32px height, links to `/` |
| Wordmark | "ShruggieTech" in Space Grotesk Medium, 18px, adjacent to logo |
| Nav links | Geist Medium, 14px, uppercase tracking-wide. Hover: underline slides in from left via `scaleX` transition on `::after` pseudo-element |
| Theme toggle | Sun/Moon icon (Lucide), 20px, `aria-label="Toggle color theme"` |
| CTA button | "Get in Touch" — small primary button linking to `/contact` |

**Header layout (mobile, < 768px):**

```
┌─────────────────────────────────────────────────────────┐
│  [Logo + Wordmark]                   [Theme] [Hamburger]│
└─────────────────────────────────────────────────────────┘
```

<a name="52-footer" id="52-footer"></a>
### 5.2. Footer

<div style="text-align:justify">

The footer is divided into four columns on desktop, collapsing to a stacked layout on mobile. It provides secondary navigation, legal information, and social/GitHub links. The footer background is `--color-gray-900` in dark mode and `--color-gray-100` in light mode, creating a subtle visual separation from page content.

</div>

**Footer structure:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Column 1: Brand       Column 2: Pages     Column 3: Products           │
│  ─────────────────     ──────────────────  ────────────────────         │
│  [Logo]                Services            shruggie-indexer             │
│  Tagline (small)       Work                metadexer                    │
│                        Research            rustif                       │
│                        Blog                                             │
│                        About                                            │
│                        Contact                                          │
│                                                                         │
│  Column 4: Connect                                                      │
│  ─────────────────                                                      │
│  GitHub: github.com/shruggietech                                        │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  © Copyright Shruggie, LLC {new Date().getFullYear()} Made in the USA 🇺🇸|
│  Privacy Policy                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

<div style="text-align:justify">

**Copyright year implementation:** The footer copyright year is rendered dynamically using `{new Date().getFullYear()}` in the React component. This ensures the year is always current and never requires manual updates. The location text "Made in the USA" replaces a static city/state reference to keep the footer clean while anchoring the brand's American identity. The flag emoji is rendered as a unicode character and does not require an image asset. The "Privacy Policy" link below the copyright line links to `/privacy` (see [§6.11](#611-privacy-policy)).

</div>

<a name="53-mobile-navigation" id="53-mobile-navigation"></a>
### 5.3. Mobile Navigation

<div style="text-align:justify">

Mobile navigation opens as a full-screen overlay sliding in from the right. The overlay uses the primary background color at full opacity. Navigation links are displayed vertically in Space Grotesk Medium at 28px, with 24px vertical spacing. The overlay is triggered by a hamburger icon button and closed by an X icon button, both with `aria-expanded` attributes and `aria-controls` referencing the nav panel ID. When the overlay is open, focus is trapped within it (Tab does not escape to the underlying page), and pressing Escape closes it. The underlying page scroll is locked via Lenis `stop()`/`start()` methods (or `overflow: hidden` on `<body>` as a fallback).

</div>

<a name="6-page-specifications" id="6-page-specifications"></a>
<hr class="print-page-break">

## 6. Page Specifications

<a name="61-homepage" id="61-homepage"></a>
### 6.1. Homepage (`/`)

**Purpose:** First impression. Establish what ShruggieTech is, what it does, and why it matters in under 5 seconds of visual scanning.

**Section 1: Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Your vision deserves better than a template." |
| Subheadline | "You have a business to run. We handle the technology that makes it grow. Modern websites, marketing engines, AI integrations, and custom software, built for you without the enterprise price tag or the vendor lock-in." |
| Primary CTA | "Start a Conversation" → `/contact` (rendered using `ShruggieCTA` component; see §2.4) |
| Secondary CTA | "See Our Work" → `/work` (standard `Button` component, secondary variant) |
| Visual treatment | Full-width dark section. Headline in Space Grotesk Bold at `display-xl`. A subtle animated gradient mesh in the background using the brand green at very low opacity (5-8%), creating depth without distraction. The gradient animates slowly (30s cycle) and is disabled for `prefers-reduced-motion`. |
| Tagline | The shruggie tagline is delivered via the `ShruggieCTA` component beneath the primary CTA button (reveals on hover/scroll; see §2.4 for behavior). |

**Section 2: Services Preview**

| Element | Content |
|---------|---------|
| Section label | "WHAT WE DO" |
| Section title | "Full-stack capability, studio-scale delivery." |
| Layout | 2x2 card grid on desktop, single column on mobile |
| Cards | Four cards corresponding to the public service pillars (KB §1.3): |

Card content:

| Card Title | Description | Icon |
|------------|-------------|------|
| Digital Strategy & Brand | "From brand identity to content architecture, we build the visual and strategic foundation your business stands on." | `Palette` (Lucide) |
| Development & Integration | "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform." | `Code2` (Lucide) |
| Revenue Flows & Marketing Ops | "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Everything that turns visibility into revenue." | `TrendingUp` (Lucide) |
| AI & Data Analysis | "Chatbots, RAG systems, workflow automation, and AI consulting. We help you adopt AI that actually works for your business." | `Brain` (Lucide) |

Each card links to the corresponding section on the `/services` page via an anchor.

**Section 3: Work Preview**

| Element | Content |
|---------|---------|
| Section label | "OUR WORK" |
| Section title | "Real results for real businesses." |
| Description | "We solve messy problems for businesses that need more than a template." |
| Layout | Horizontal scroll strip of 3 featured case study cards (United Way, Scruggs Tire, I Heart PR Tours). Each card shows: client name, industry tag, one-line summary, a hero image (or placeholder), and a "Read case study →" link. |

**Section 4: Research Preview**

| Element | Content |
|---------|---------|
| Section label | "RESEARCH" |
| Section title | "We write about what we build." |
| Description | "Original research in AI agent architecture, multi-agent development workflows, and metadata systems engineering." |
| Layout | Three cards, one per publication (ADF, Multi-Agent Guide, rustif Declaration). Each shows title, one-line description, author, and a "Read paper →" link. |

**Section 5: Bottom CTA**

| Element | Content |
|---------|---------|
| Headline | "Ready to build something?" |
| Body | "Whether you need a website, a marketing engine, an AI integration, or all of the above, the first step is the same: a conversation about what you need." |
| CTA | "Let's Talk" → `/contact` (rendered using `ShruggieCTA` component; see §2.4) |
| Visual | Full-width section with a background gradient transitioning from `--color-gray-900` to `--color-black`. A thin 1px top border in `--color-green-bright` at 20% opacity creates a subtle horizontal accent. |

<a name="62-services" id="62-services"></a>
### 6.2. Services (`/services`)

**Purpose:** Detailed explanation of what ShruggieTech offers, organized by the four public pillars and expanded with specifics drawn from KB §5.

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Services" |
| Subheadline | "We combine deep technical execution with design instinct and business judgment to deliver work that exceeds expectations." (Adapted from mission statement, KB §3.1) |

**Section 2: Service Pillars (4 sections, one per pillar)**

Each pillar is a full-width section with an anchor ID for deep linking from the homepage cards.

**Pillar A: Digital Strategy & Brand** (`#strategy-brand`)

| Element | Content |
|---------|---------|
| Title | "Digital Strategy & Brand" |
| Lead | "Your brand is the first thing people see and the last thing they remember. We make both count." |
| Body | "We build visual identity systems, brand standards kits, and content architecture from scratch or refresh what already exists. Every logo, color choice, and typographic decision is made with purpose. We plan sitemaps, define content hierarchy, and ensure your brand translates consistently across every platform and touchpoint." |
| Capabilities list | Logo design and visual identity systems, color palette and typography systems, brand standards kits for cross-platform consistency, website strategy and content architecture, marketing collateral (business cards, print materials) |

**Pillar B: Development & Integration** (`#development`)

| Element | Content |
|---------|---------|
| Title | "Development & Integration" |
| Lead | "We build, migrate, and integrate. From marketing sites to custom applications, we handle the full technical stack." |
| Body | "Our development work spans custom website builds, WordPress deployments, Next.js applications, CMS evaluation and migration, DNS management, SSL/TLS configuration, booking system integrations, payment processing setup, and platform replatforming. We are particularly experienced at rescuing businesses from legacy vendor lock-in: extracting domains, migrating data, and rebuilding onto infrastructure the client actually owns." |
| Capabilities list | Custom website design and development, WordPress deployment (Business/Premium plans, staging environments), Next.js and modern React applications, CMS evaluation and migration, Booking system integration (Bokun, GetYourGuide, Stripe Connect), DNS management and Cloudflare configuration, Vendor displacement and replatforming (Rescue & Replatform) |

**Pillar C: Revenue Flows & Marketing Operations** (`#marketing`)

| Element | Content |
|---------|---------|
| Title | "Revenue Flows & Marketing Operations" |
| Lead | "Visibility means nothing without conversion. We build the systems that turn attention into revenue." |
| Body | "We implement SEO strategy, Answer Engine Optimization (AEO) for AI-mediated search, Google and Meta ad campaigns, social media content calendars, review generation workflows, analytics architecture (GA4, GTM, Search Console), and multi-platform content planning. For tourism and activity businesses, we optimize OTA listings across TripAdvisor, Viator, Expedia, and other major platforms." |
| Capabilities list | SEO strategy and execution, Answer Engine Optimization (AEO) with advanced schema markup, Google Ads and Meta/Facebook advertising, Social media strategy and content planning, Analytics implementation (GA4, GTM, Search Console), Review generation and reputation management, OTA listing optimization (TripAdvisor, Viator, Expedia) |

**Pillar D: AI & Data Analysis** (`#ai-data`)

| Element | Content |
|---------|---------|
| Title | "AI & Data Analysis" |
| Lead | "AI is not magic. It is infrastructure. We help you build AI systems that solve real problems." |
| Body | "We design and deploy conversational AI assistants, retrieval-augmented generation (RAG) systems, semantic search implementations, and workflow automation pipelines. Our AI work is grounded in published research (including the Affective Dynamics Framework for emotional state simulation in AI agents) and production experience across the Azure AI ecosystem. We also provide strategic consulting on AI adoption for businesses exploring how to integrate AI into existing operations." |
| Capabilities list | Conversational AI and chatbot development, RAG system design and implementation, Semantic search (Azure AI Search), Workflow automation (email/SMS pipelines, process optimization), AI adoption consulting, Multi-agent coding workflow design |

**Section 3: Engagement Model**

| Element | Content |
|---------|---------|
| Title | "How We Work" |
| Body | "Every engagement follows a three-phase methodology." |

<div style="text-align:justify">

**Interactive treatment:** The three phases are displayed as a horizontal step-flow on desktop (vertical on mobile). Each phase is a card connected by an animated dashed line that "draws" itself as the section scrolls into view using Framer Motion's `pathLength` animation on an SVG `<path>` element. Each phase card has a large phase number (01, 02, 03) rendered in the brand green at `display-lg` size, with the title and description below. On hover (desktop) or tap (mobile), the card expands vertically with a smooth `layout` animation (Framer Motion `layoutId`) to reveal a secondary detail panel listing 3-4 concrete deliverables for that phase. The active/hovered card's border transitions to the brand green, and the connecting line segment leading into that card pulses once with a brief glow effect. This creates a sense of progression and rewards exploration without gating any critical information behind the interaction.

</div>

| Phase | Title | Description | Expanded Deliverables |
|-------|-------|-------------|----------------------|
| 01 | Foundation & Setup | "We establish your brand assets, deploy modern web infrastructure, and integrate the systems your business needs to operate independently. The goal is a functional, consistently branded digital presence." | Brand identity system, website build and deployment, DNS and hosting on infrastructure you own, booking/payment integrations |
| 02 | Optimization & Growth | "Once systems are in place, we make them perform. Algorithm analysis, content freshness, A/B testing, and conversion optimization across every relevant platform." | SEO and AEO implementation, analytics architecture (GA4, GTM), ad campaign setup and tuning, review generation workflows |
| 03 | Ongoing Partnership | "Continuous storytelling, community engagement, channel expansion, and reputation management. We grow with you." | Social media content calendar, monthly performance reporting, content refresh cycles, channel expansion strategy |

<div style="text-align:justify">

**Fallback (reduced motion):** When `prefers-reduced-motion` is active, the dashed lines render statically, cards are fully expanded by default (no hover/tap interaction required), and no animations fire. All content remains accessible.

</div>

**Section 4: Ownership Thesis**

| Element | Content |
|---------|---------|
| Title | "You Own Everything We Build" |
| Body | "Your domain, your hosting credentials, your content, your data. We earn revenue by building things that work, not by controlling assets that should be yours. Every engagement operates under a formal Master Services Agreement and Scope of Work. No handshakes. No ambiguity." |

**Section 5: CTA**

| Element | Content |
|---------|---------|
| Headline | "Let's scope your project." |
| CTA | "Get in Touch" → `/contact` (rendered using `ShruggieCTA` component; see §2.4) |

<a name="63-work" id="63-work"></a>
### 6.3. Work (Case Studies) (`/work`)

**Purpose:** Demonstrate capability through documented client outcomes.

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Work" |
| Subheadline | "Real problems, real solutions, real results. Here is what we have built for our clients." |

**Section 2: Case Study Grid**

<div style="text-align:justify">

Case studies are rendered as cards in a responsive grid (2 columns desktop, 1 column mobile). Each card displays a hero image (or placeholder until screenshots are provided, see §1.4 item 6), client name, industry tag, one-line summary, and a "Read case study →" link. Case studies are stored as MDX files in `content/work/` and follow the same frontmatter pattern as blog posts (see §7.3). The grid is populated dynamically from the filesystem.

</div>

**Case studies (client permission secured via original engagement contracts):**

**Case Study A: United Way of Anderson County**

| Field | Content |
|-------|---------|
| Title | "Modernizing a Nonprofit's Digital Presence" |
| Industry tag | Nonprofit |
| Summary card text | "Accessibility-compliant website redesign aligned with global United Way brand guidelines, built on infrastructure the client owns." |
| Hero image | Before/after browser screenshot (pending asset from §1.4 item 6) |

Case study body content:

| Section | Content |
|---------|---------|
| The Challenge | "United Way of Anderson County needed a modern, accessible website that aligned with global United Way branding guidelines. Their existing site was outdated, difficult to maintain, and did not meet accessibility standards expected of a community-facing nonprofit." |
| What We Did | "We executed a page-by-page redesign using an agile methodology with iterative feedback cycles. The new site was built on WordPress.com Business Plan with a staging environment for testing before each go-live. Every design decision was evaluated against global United Way brand guidelines and WCAG accessibility standards. We established a formal content architecture, integrated SSL/TLS, and configured mobile-responsive themes." |
| Key Outcomes | "Fully redesigned, accessibility-aligned website. Staging-to-production workflow for safe, testable updates. Monthly maintenance arrangement covering core, plugin, and theme updates. Client owns all hosting credentials and content." |
| Ongoing | "ShruggieTech provides monthly maintenance including core and plugin updates, content changes, and technical support under a recurring retainer." |
| Services Used | Web development, accessibility compliance, brand guideline alignment, WordPress deployment, ongoing maintenance |

**Case Study B: Scruggs Tire & Alignment**

| Field | Content |
|-------|---------|
| Title | "Rescuing a Local Business from Vendor Lock-In" |
| Industry tag | Automotive Services |
| Summary card text | "Forensic vendor audit, contract disentanglement, and full replatform onto client-owned infrastructure for a local auto shop." |
| Hero image | Before/after browser screenshot (pending asset from §1.4 item 6) |

Case study body content:

| Section | Content |
|---------|---------|
| The Challenge | "Scruggs Tire & Alignment was paying a significant monthly retainer to a legacy vendor (a Hearst Media Group subsidiary) for a substandard website hosted on a domain with restrictive transfer terms. The existing vendor arrangement included unclear ROI, limited client access to their own assets, and contract terms that made exit difficult." |
| What We Did | "We began with a forensic audit of the existing vendor contract, identifying domain ownership gaps, low-ROI marketing spend, and restrictive terms that kept the client tethered to underperforming service. We walked the client through exactly what they were paying for versus what they were receiving. From there, we developed a replatform proposal: a new website built on infrastructure the client owns, with transparent pricing, Stripe subscription billing for recurring payments, and a Google Ads strategy with properly configured admin access. The engagement also served as a training ground for our subcontractor pipeline." |
| Key Outcomes | "Complete vendor disentanglement with domain ownership transferred to client. New website on client-controlled hosting. Stripe-integrated subscription billing. Google Ads with direct client admin access. SEO blog content strategy for local search visibility." |
| Ongoing | "Monthly retainer covering website maintenance, local SEO content, and marketing operations support." |
| Services Used | Vendor displacement advisory, forensic contract audit, web development, Stripe integration, Google Ads, local SEO, blog content strategy |

**Case Study C: I Heart PR Tours**

| Field | Content |
|-------|---------|
| Title | "Building a Revenue Engine for Puerto Rico Tourism" |
| Industry tag | Tourism & Hospitality |
| Summary card text | "End-to-end digital marketing, OTA optimization, and booking integration for a Puerto Rico tour operator, structured as a performance-based revenue share." |
| Hero image | Before/after browser screenshot (pending asset from §1.4 item 6) |

Case study body content:

| Section | Content |
|---------|---------|
| The Challenge | "I Heart PR Tours needed a comprehensive digital presence that could compete for visibility across multiple Online Travel Agency platforms (TripAdvisor, Viator, Expedia, Civitatis, Klook) while driving direct bookings through their own website. The business operates in a seasonal market with variable demand, making a fixed retainer model economically risky." |
| What We Did | "We manage the entire digital lifecycle for this client. Brand asset standardization, website content and blog writing, SEO and AEO strategy, Bokun and GetYourGuide booking integration, OTA listing optimization across five major platforms, social media content planning, and ad campaign support. We prioritize click-through and conversion rate optimization by refreshing listing photography and introductions on a 4-6 week cycle to signal content freshness to platform algorithms. The commercial structure is a revenue share (10-30% of generated bookings) with seasonal flexibility, including temporary fee suspension during low-demand periods." |
| Key Outcomes | "Multi-platform OTA presence across TripAdvisor, Viator, Expedia, Civitatis, and Klook. Integrated Bokun booking system connected to website and OTA channels. Recurring content refresh cycles optimized for platform algorithm visibility. Revenue-share commercial model aligned with client economics." |
| Ongoing | "Continuous marketing operations including content production, OTA listing management, social media, and seasonal campaign adjustments under a phased revenue share arrangement." |
| Services Used | Website content, SEO/AEO, OTA optimization, booking integration (Bokun, GetYourGuide), social media, ad campaigns, branding, revenue-share commercial model |

**Example case study MDX frontmatter (template for `content/work/united-way.mdx`):**

```yaml
---
title: "Modernizing a Nonprofit's Digital Presence"
client: "United Way of Anderson County"
industry: "Nonprofit"
date: "2025-10-01"
summary: "Accessibility-compliant website redesign aligned with global United Way brand guidelines, built on infrastructure the client owns."
services:
  - "Web Development"
  - "Accessibility Compliance"
  - "Brand Guideline Alignment"
  - "WordPress Deployment"
  - "Ongoing Maintenance"
heroImage: "/images/work/united-way-hero.png"
published: true
---
```

**Example case study MDX frontmatter (template for `content/work/scruggs-tire.mdx`):**

```yaml
---
title: "Rescuing a Local Business from Vendor Lock-In"
client: "Scruggs Tire & Alignment"
industry: "Automotive Services"
date: "2025-11-15"
summary: "Forensic vendor audit, contract disentanglement, and full replatform onto client-owned infrastructure for a local auto shop."
services:
  - "Vendor Displacement Advisory"
  - "Forensic Contract Audit"
  - "Web Development"
  - "Stripe Integration"
  - "Google Ads"
  - "Local SEO"
  - "Blog Content Strategy"
heroImage: "/images/work/scruggs-tire-hero.png"
published: true
---
```

**Example case study MDX frontmatter (template for `content/work/i-heart-pr-tours.mdx`):**

```yaml
---
title: "Building a Revenue Engine for Puerto Rico Tourism"
client: "I Heart PR Tours"
industry: "Tourism & Hospitality"
date: "2025-08-01"
summary: "End-to-end digital marketing, OTA optimization, and booking integration for a Puerto Rico tour operator, structured as a performance-based revenue share."
services:
  - "Website Content"
  - "SEO/AEO"
  - "OTA Optimization"
  - "Booking Integration"
  - "Social Media"
  - "Ad Campaigns"
  - "Branding"
heroImage: "/images/work/ihprt-hero.png"
published: true
---
```

<div style="text-align:justify">

**Note on Belle Toh Piano Studio:** The KB (§6.4) identifies Belle Toh Piano Studio as a client where engagement was explored and a contract model was developed, but the relationship did not progress to a full delivery engagement with documentable outcomes. It is excluded from the case study portfolio because the Work page requires concrete before/after evidence and quantified results. If the engagement matures into a delivered project in the future, a case study can be added by creating a new MDX file in `content/work/` with no code changes required.

</div>

<a name="64-research-and-publications" id="64-research-and-publications"></a>
### 6.4. Research and Publications (`/research`)

**Purpose:** Establish intellectual credibility. Showcase ShruggieTech's original research output per KB §8.4 publication strategy.

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Research" |
| Subheadline | "Original research and technical writing from the ShruggieTech team. We publish what we learn." |

**Section 2: Publication Cards**

Three cards, one per publication, displayed vertically with generous spacing.

| Publication | Title | Author | Description |
|-------------|-------|--------|-------------|
| ADF | "Affective Dynamics Framework: A Systematic Approach to Simulating Human-Like Emotional States and Relational Bonding in AI Agents" | William Thompson | "A mathematically grounded specification for producing emergent, non-linear emotional behavior and relational bonding in AI agents. Extends Brian Roemmele's Love Equation into a real-time personality engine for agentic architectures." |
| Multi-Agent Guide | "Multi-Agent Coding Workflows for Solo Developers and Small Teams" | William Thompson | "A practical field manual for multi-agent coding workflows: sequential sessions, parallel independent agents, coordinated teams, and the admin-coding divide that makes it all work." |
| rustif Declaration | "rustif: A Next-Generation Metadata Processing Engine" | William Thompson | "The case for building a Rust-native metadata processing engine to succeed ExifTool. Ecosystem analysis, architectural specification, security threat model, and a call for contributors." |

<div style="text-align:justify">

Each card includes a "Read paper →" link. Initially, these link to hosted PDF or Markdown versions of the papers on the ShruggieTech site. The publications section should be implemented so that adding a new paper requires only adding a new entry to a data file or content directory, with no code changes.

</div>

<a name="65-products" id="65-products"></a>
### 6.5. Products (Open Source) (`/products`)

**Purpose:** Showcase ShruggieTech's internal product portfolio and open-source contributions. Serves Segment D (developer community, KB §11.4).

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Products" |
| Subheadline | "Open-source tools and software products built by ShruggieTech. We build things we need, then share them with the community." |

**Section 2: Product Cards**

| Product | Description | Status Badge | Links |
|---------|-------------|-------------|-------|
| shruggie-indexer | "Cross-platform file and directory indexing tool. Produces structured JSON output with hash-based content identities, filesystem metadata, and EXIF extraction." | `v0.1.2 — Active` | GitHub, Docs |
| metadexer | "Content-addressed asset management system. Storage, cataloging, deduplication, and search across large, heterogeneous digital collections." | `Pre-release — In Development` | GitHub |
| shruggie-feedtools | "ShruggieTech's reference project for Python tool conventions, packaging patterns, and GUI design language." | `Active` | GitHub |
| rustif | "A proposed Rust-native metadata processing engine. The next-generation successor to thirty years of metadata infrastructure." | `Declaration Phase` | Read Declaration |

**Section 3: Engineering Philosophy**

| Element | Content |
|---------|---------|
| Title | "How We Build Software" |
| Body | "Every ShruggieTech product begins with a specification written for AI-first consumption. Our specifications are structured so that AI coding agents can produce correct implementations within single context windows without interactive clarification. This methodology multiplies engineering throughput without proportional headcount. It is how a two-person studio builds production-grade software tools." |

<a name="66-about" id="66-about"></a>
### 6.6. About (`/about`)

**Purpose:** Introduce the team and establish the company's story, values, and operational identity.

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "About ShruggieTech" |
| Subheadline | "A modern technical studio in Knoxville, Tennessee. We build digital systems, software, and AI-driven experiences that help businesses present sharper, operate smarter, and scale further." |

**Section 2: Origin Story**

| Element | Content |
|---------|---------|
| Title | "Where We Come From" |
| Body | "ShruggieTech was founded by William and Natalie Thompson, a husband-and-wife team who have been building technology together for nearly a decade. Before ShruggieTech, they ran an international consulting firm that delivered research to national governments and launch support for technology projects across multiple continents. That venture taught them how to deliver structured, high-stakes work under pressure. ShruggieTech carries that same operational discipline into a broader mission: solving whatever technology problem stands between a business owner and their vision." |

**Section 3: Team**

<div style="text-align:justify">

Each team member is displayed in a card with a photograph (or placeholder silhouette until photos are available), name, title, and a brief description. Cards are arranged in a responsive row (3 columns desktop, 1 column mobile).

</div>

| Name | Title | Description |
|------|-------|-------------|
| William Thompson | Co-Founder & Chief Architect | "Software architect, systems designer, and the author of ShruggieTech's internal products and published research. Background in cryptography, electronic warfare, and high-performance computing. Writes specifications that AI agents can execute without asking questions." |
| Natalie Thompson | Co-Founder & COO | "Self-taught full-stack developer, client relationship lead, and the person who makes everything actually happen. Pairs deep technical ability with the soft skills that keep complex projects moving forward. From branding to business development, she runs point on it all." |
| Josiah Thompson | Founders Assistant | "Josiah contributes to ShruggieTech's production work, assisting with social media content creation, blog article drafting, and website maintenance. His role is designed to build real professional skills early, equipping him with the technical fluency and operational discipline for a career in technology." |

**Section 4: Values / How We Operate**

Three value blocks displayed horizontally (desktop) or stacked (mobile):

| Value | Description |
|-------|-------------|
| "Ownership, not rentership." | "We believe clients should own their digital assets. Every domain, every credential, every line of content. We earn revenue by building things that work, not by holding things hostage." |
| "Specification-driven." | "We write thorough specifications before we write code. This discipline produces better software, clearer communication, and the ability to scale through AI-augmented workflows." |
| "Ship and iterate." | "We do not hide behind process. We deliver working systems, measure their performance, and improve them continuously." |

<a name="67-blog" id="67-blog"></a>
### 6.7. Blog (`/blog`)

**Purpose:** Content marketing, SEO/AEO presence, thought leadership, and a demonstration of technical depth for all audience segments.

<div style="text-align:justify">

See §7 for the complete blog architecture specification. The blog index page displays posts in reverse chronological order with pagination (10 posts per page). Each post card shows: title, publication date, estimated reading time, author name, category tag, and a 2-line excerpt.

</div>

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Blog" |
| Subheadline | "We write about what we know and show you how to do it yourself. Tutorials, deep-dives, and honest takes on technology, AI, and business. If you would rather have us handle it, that works too." |

**Section 2: Post Grid**

<div style="text-align:justify">

Posts are displayed as cards in a single-column layout with a maximum width of 720px (the narrow container). This keeps the reading-focused aesthetic consistent with the individual post pages. Each card is a clickable link to the full post.

</div>

**Section 3: Pagination**

Standard previous/next pagination with page numbers. Implemented as static pages generated at build time via `generateStaticParams`.

<a name="68-contact" id="68-contact"></a>
### 6.8. Contact (`/contact`)

**Purpose:** Primary conversion point. Route prospects into conversation.

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Get in Touch" |
| Subheadline | "Whether you have a project in mind or just want to explore what is possible, the first step is a conversation." |

**Section 2: Contact Form**

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Name | Text input | Min 2 characters | Yes |
| Email | Email input | Valid email format (Zod `.email()`) | Yes |
| Company / Organization | Text input | None | No |
| How can we help? | Textarea | Min 10 characters | Yes |
| How did you hear about us? | Select (dropdown) | Enum: "Search engine", "Referral", "Social media", "Other" | No |

**Form submission:** The form submits directly to Formspree using the `@formspree/react` client library. No backend API route is required. The Formspree form ID is read from the `NEXT_PUBLIC_FORMSPREE_ID` environment variable (see [§1.4](#14-human-in-the-loop-requirements), item 4). Client-side validation is handled by React Hook Form with Zod before submission. On success, the form is replaced with a confirmation message: "Thanks for reaching out. We will get back to you within one business day."

**Formspree integration pattern:**

```tsx
"use client";

import { useForm } from "@formspree/react";
import { useState } from "react";

export default function ContactForm() {
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_FORMSPREE_ID ?? ""
  );

  if (state.succeeded) {
    return (
      <div role="status" className="rounded-xl border border-accent/30 bg-[rgba(43,204,115,0.06)] p-8 text-center">
        <p className="font-display text-display-sm font-bold text-text-primary">
          Thanks for reaching out.
        </p>
        <p className="mt-2 text-body-md text-text-secondary">
          We will get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Fields with React Hook Form validation layered on top */}
      {/* See §6.8 field specification table for field definitions */}
      <button type="submit" disabled={state.submitting}>
        Send Message
      </button>
    </form>
  );
}
```

**Section 3: Direct Contact**

| Element | Content |
|---------|---------|
| Address | 116 Agnes Rd, Ste 200, Knoxville, TN 37919 |
| Note | "Prefer email? Reach us directly at `[contact email]`." The email address is pending confirmation; see [§1.4](#14-human-in-the-loop-requirements), item 7. A placeholder message ("Email address coming soon") renders until the address is provided. |

<a name="69-audience-landing-pages" id="69-audience-landing-pages"></a>
### 6.9. Audience Landing Pages (`/for/...`)

<div style="text-align:justify">

The knowledge base defines four distinct audience segments (KB §11) with different needs, buying motions, and messaging requirements. Each segment receives a dedicated landing page under the `/for/` route prefix. These pages share the same structural template but contain segment-specific headlines, pain points, relevant services, and social proof (case studies). They serve as targeted entry points from paid advertising, email campaigns, and segment-specific content marketing. The header navigation does not link directly to these pages; they are reached via ad campaigns, internal CTAs, and organic search.

</div>

**Shared landing page template structure:**

| Section | Purpose |
|---------|---------|
| Hero | Segment-specific headline and subheadline addressing the visitor's core pain point |
| Pain Points | 3 pain point cards identifying problems the segment commonly faces |
| Services (filtered) | Subset of ShruggieTech services most relevant to this segment |
| Social Proof | Relevant case study card(s) from the `/work` portfolio |
| CTA | ShruggieCTA component linking to `/contact` |

**Landing Page A: Small Business Owners** (`/for/small-business`)

| Element | Content |
|---------|---------|
| Headline (h1) | "Your business deserves technology that works for you, not against you." |
| Subheadline | "If your website was built by someone who disappeared, your marketing vendor charges you monthly for things you cannot see, or you are not sure who actually owns your domain, we can help." |
| Pain point 1 | **"Trapped by your vendor."** "You pay a monthly fee but do not own your website, your domain, or your data. Canceling feels impossible." |
| Pain point 2 | **"Invisible online."** "Your competitors show up on Google. You do not. Your website looks like it was built in 2015 because it was." |
| Pain point 3 | **"No one to call."** "When something breaks or needs updating, you do not have a reliable technical partner. You have a ticket queue." |
| Relevant services | Rescue & Replatform, web development, local SEO, Google Ads, review generation |
| Case study | Scruggs Tire & Alignment |

**Landing Page B: Nonprofits & Mission-Driven Organizations** (`/for/nonprofits`)

| Element | Content |
|---------|---------|
| Headline (h1) | "Your mission is too important for a bad website." |
| Subheadline | "You need a digital presence that reflects the seriousness of your work, meets accessibility standards, and stays within a grant-funded budget. We build exactly that." |
| Pain point 1 | **"Outdated and inaccessible."** "Your website does not meet accessibility standards, and your team does not have the technical staff to fix it." |
| Pain point 2 | **"Brand inconsistency."** "Your parent organization has brand guidelines, but your local site does not follow them. It undermines credibility with donors and partners." |
| Pain point 3 | **"Maintenance limbo."** "Nobody on staff knows how to update the site. Content goes stale. Plugins go unpatched. Security vulnerabilities accumulate." |
| Relevant services | Website redesign, accessibility compliance, brand guideline alignment, ongoing maintenance |
| Case study | United Way of Anderson County |

**Landing Page C: Technical Founders & Product Teams** (`/for/technical-teams`)

| Element | Content |
|---------|---------|
| Headline (h1) | "You need an engineering partner, not another agency." |
| Subheadline | "We speak your language. AI integrations, custom tooling, RAG architectures, and automation pipelines, built by engineers with published research and production experience." |
| Pain point 1 | **"AI hype, no delivery."** "Every vendor promises AI transformation. Few can actually architect a RAG system, deploy a vector search pipeline, or debug a prompt chain." |
| Pain point 2 | **"Scaling without headcount."** "You need more engineering throughput but cannot justify full-time hires. You need a team that can absorb specification-driven work and deliver." |
| Pain point 3 | **"Vendor skill mismatch."** "Your existing agency can build landing pages but cannot touch your API layer, your data pipeline, or your deployment infrastructure." |
| Relevant services | AI consulting, chatbot development, RAG systems, workflow automation, custom tool development |
| Case study | (Cross-reference to published research: ADF, multi-agent guide) |

**Landing Page D: Developers & Open Source Community** (`/for/developers`)

| Element | Content |
|---------|---------|
| Headline (h1) | "Built by engineers. Open by default." |
| Subheadline | "We build open-source tools for file indexing, metadata processing, and asset management. We publish our research. We share what we learn." |
| Pain point 1 | **"Metadata is a mess."** "You manage large file collections and need structured indexing with content-addressed identity, not just filenames." |
| Pain point 2 | **"ExifTool is showing its age."** "Thirty years of Perl-based metadata infrastructure is reaching its limits. The ecosystem needs a modern, embeddable successor." |
| Pain point 3 | **"AI agents need better specs."** "You are experimenting with multi-agent coding workflows but struggling with context management, specification quality, and agent coordination." |
| Relevant products | shruggie-indexer, metadexer, rustif |
| Relevant research | ADF, Multi-Agent Coding Workflows guide, rustif Declaration |

<a name="610-error-pages" id="610-error-pages"></a>
### 6.10. Error Pages

**Purpose:** Provide a branded, helpful experience when users encounter broken links or server errors instead of a generic browser error page.

**6.10.1. 404 Not Found (`app/not-found.tsx`)**

<div style="text-align:justify">

Next.js App Router uses a `not-found.tsx` file at the app root to handle all unmatched routes. The 404 page uses the same root layout (header, footer, Lenis provider) as every other page, ensuring a consistent branded experience. The page content is centered vertically and horizontally within the viewport.

</div>

| Element | Specification |
|---------|--------------|
| Headline | "404" rendered in `display-xl` using Space Grotesk Bold, in the brand green accent color |
| Subheadline | "This page does not exist." in `display-sm`, standard text color |
| Body text | "You may have followed a broken link, or the page may have been moved. Here are some places to start instead." in `body-md`, secondary text color |
| Navigation links | Three links displayed as a horizontal row (desktop) or vertical stack (mobile): "Homepage" → `/`, "Services" → `/services`, "Contact" → `/contact`. Each link uses the standard text link style with animated underline on hover. |
| Shruggie flourish | The shruggie emoticon "¯\\\_(ツ)\_/¯" rendered in `body-lg` muted text below the navigation links, centered. Uses `aria-hidden="true"` as it is decorative. |
| Visual treatment | Minimal. Dark background (default theme), no hero gradient, no animations. The page should load instantly and communicate its purpose immediately. |

**Implementation pattern:**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-display-xl font-bold text-accent">
        404
      </h1>
      <p className="mt-4 font-display text-display-sm font-bold text-text-primary">
        This page does not exist.
      </p>
      <p className="mt-4 max-w-md text-body-md text-text-secondary">
        You may have followed a broken link, or the page may have been moved.
        Here are some places to start instead.
      </p>
      <nav className="mt-8 flex gap-6" aria-label="Suggested pages">
        <Link href="/" className="text-accent hover:text-accent-hover">
          Homepage
        </Link>
        <Link href="/services" className="text-accent hover:text-accent-hover">
          Services
        </Link>
        <Link href="/contact" className="text-accent hover:text-accent-hover">
          Contact
        </Link>
      </nav>
      <span aria-hidden="true" className="mt-8 text-body-lg text-text-muted">
        ¯\_(ツ)_/¯
      </span>
    </div>
  );
}
```

**6.10.2. Global Error Boundary (`app/error.tsx`)**

<div style="text-align:justify">

Next.js App Router uses an `error.tsx` file at the app root to catch unhandled runtime errors. The error boundary renders a client component that displays a user-friendly message and a retry button. It logs the error to `console.error` for diagnostics. The visual treatment matches the 404 page layout for consistency.

</div>

| Element | Specification |
|---------|--------------|
| Headline | "Something went wrong." in `display-sm`, standard text color |
| Body text | "An unexpected error occurred. Please try again, or return to the homepage if the problem persists." in `body-md`, secondary text color |
| Actions | Two buttons: "Try Again" (primary variant, calls `reset()` from the error boundary props) and "Go Home" (secondary variant, links to `/`) |

**Implementation pattern:**

```tsx
"use client";

import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Unhandled error:", error);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-display-sm font-bold text-text-primary">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-md text-body-md text-text-secondary">
        An unexpected error occurred. Please try again, or return to the
        homepage if the problem persists.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="primary" onClick={() => reset()}>
          Try Again
        </Button>
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
```

<a name="611-privacy-policy" id="611-privacy-policy"></a>
### 6.11. Privacy Policy (`/privacy`)

**Purpose:** Disclose data collection practices required by the use of Google Analytics 4, Google Tag Manager, and Formspree on the site. Provides the legal page linked from the site footer.

<div style="text-align:justify">

The privacy policy page is a static content page using the narrow container layout (`container-narrow`). The content is rendered as prose with the Tailwind typography plugin (`.prose` class), consistent with the blog post reading experience. The page does not use MDX; it is a standard React Server Component with the policy text hardcoded, because policy updates require deliberate review rather than low-friction authoring.

</div>

**Section 1: Page Hero**

| Element | Content |
|---------|---------|
| Headline (h1) | "Privacy Policy" |
| Effective date | "Effective: `[date]`" rendered in `body-sm` muted text below the headline. The date is updated manually when policy changes are made. |

**Section 2: Policy Content**

<div style="text-align:justify">

The policy text must address the following topics at minimum. The exact legal language should be reviewed by the founders before publication, but the structural sections and the data practices they describe are defined here so that an implementing agent can produce a complete draft.

</div>

| Section | Content Summary |
|---------|----------------|
| Information We Collect | The site collects: (a) information you voluntarily provide via the contact form (name, email, company, message, referral source), and (b) usage data collected automatically via Google Analytics 4 and Google Tag Manager (pages visited, time on site, device type, browser, approximate geographic location derived from IP address). No account registration, login, or payment information is collected through the website. |
| How We Use Your Information | Contact form submissions are used solely to respond to inquiries. Analytics data is used to understand site traffic patterns and improve the user experience. ShruggieTech does not sell, rent, or share personal information with third parties for marketing purposes. |
| Third-Party Services | The site uses Google Analytics 4 (privacy policy: policies.google.com/privacy), Google Tag Manager, and Formspree (privacy policy: formspree.io/legal/privacy-policy) to process form submissions. These services may set cookies or collect data as described in their respective privacy policies. |
| Cookies | The site uses: (a) a theme preference cookie (`theme`) to persist the user's dark/light mode selection, and (b) cookies set by Google Analytics 4 for traffic measurement. Users can disable cookies via browser settings; doing so will not affect core site functionality but will reset the theme preference on each visit. |
| Data Retention | Contact form submissions are retained in Formspree until manually deleted. Analytics data retention follows the configured GA4 property settings. |
| Your Rights | Users may request access to, correction of, or deletion of their personal data by contacting ShruggieTech at the address listed on the Contact page. |
| Changes to This Policy | ShruggieTech may update this policy periodically. Changes will be reflected by updating the effective date at the top of the page. |
| Contact | Questions about this policy can be directed to ShruggieTech at the address listed on the Contact page ([§6.8](#68-contact)). |

**Section 3: Cookie Consent Banner**

<div style="text-align:justify">

Because the site uses Google Analytics 4 (which sets tracking cookies), a cookie consent banner must be displayed to first-time visitors. The banner appears as a fixed bar at the bottom of the viewport, above the footer, with a translucent dark background and backdrop-blur consistent with the header treatment. The banner contains a brief notice and two action buttons.

</div>

| Element | Specification |
|---------|--------------|
| Notice text | "This site uses cookies for analytics to help us improve your experience." in `body-sm`, secondary text color |
| Accept button | "Accept" — small primary button. On click: sets a `consent=granted` cookie (1-year expiry), initializes GA4 tracking, and dismisses the banner. |
| Decline button | "Decline" — small secondary button. On click: sets a `consent=denied` cookie (1-year expiry), does NOT initialize GA4 tracking, and dismisses the banner. |
| Behavior | If a `consent` cookie already exists (either value), the banner does not render. GA4 tracking scripts are loaded conditionally based on the consent cookie value. The banner uses `aria-live="polite"` and `role="dialog"` with `aria-label="Cookie consent"`. |
| Privacy link | "Learn more" text link adjacent to the notice text, linking to `/privacy`. |

<div style="text-align:justify">

**Implementation note:** The GA4 and GTM scripts in the root layout must be wrapped in a conditional check that reads the consent cookie before injecting the tracking scripts. If no consent cookie exists or consent is denied, the scripts are not loaded. This ensures compliance with cookie consent expectations and avoids tracking users who have not opted in. The implementation follows the same cookie-reading pattern used for the theme toggle ([§2.6](#26-dark-and-light-mode)): an inline `<script>` in `<head>` reads the cookie value before first paint to determine whether analytics scripts should load.

</div>

<a name="7-blog-architecture" id="7-blog-architecture"></a>
<hr class="print-page-break">

## 7. Blog Architecture

<a name="71-content-strategy" id="71-content-strategy"></a>
### 7.1. Content Strategy

<div style="text-align:justify">

The blog serves all four audience segments identified in KB §11. Content should span technical deep-dives (Segment C and D), practical business guidance (Segment A and B), project updates and announcements, and industry commentary on AI, marketing technology, and web development. The knowledge base identifies a publication rhythm of 3-4 social posts per week (KB §5.4) for clients; the ShruggieTech blog should target a minimum of 2 posts per month at launch, scaling to weekly as content capacity allows.

</div>

**Content categories (used as filterable tags):**

| Category | Audience Focus |
|----------|---------------|
| Engineering | Technical deep-dives, open-source project updates (Segments C, D) |
| AI | AI adoption, agent architecture, LLM workflows (Segments C, D) |
| Marketing | SEO, AEO, content strategy, paid advertising (Segments A, B) |
| Business | Client stories, operational insights, business growth (Segments A, B) |
| Announcements | Product releases, company milestones (all segments) |

<a name="72-mdx-pipeline" id="72-mdx-pipeline"></a>
### 7.2. MDX Pipeline

<div style="text-align:justify">

Blog posts are authored as `.mdx` files stored in `content/blog/`. MDX was chosen over a headless CMS for several reasons: zero external dependencies (no API keys, no third-party service), version control via Git (every post change is tracked in the repository), the ability to embed interactive React components directly in posts (code playgrounds, charts, interactive diagrams), and near-zero authoring friction (write Markdown, commit, deploy).

</div>

**Content loading (`lib/blog.ts`):**

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;          // ISO 8601 (YYYY-MM-DD)
  author: string;
  category: string;
  excerpt: string;
  readingTime: string;   // e.g., "6 min read"
  published: boolean;    // false = draft, excluded from production builds
  ogImage?: string;      // Optional custom OG image path
}

export function getAllPostsMeta(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(POSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title,
      date: data.date,
      author: data.author ?? "ShruggieTech",
      category: data.category ?? "Announcements",
      excerpt: data.excerpt ?? "",
      readingTime: stats.text,
      published: data.published !== false,
      ogImage: data.ogImage,
    } satisfies PostMeta;
  });

  return posts
    .filter((p) => process.env.NODE_ENV === "development" || p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title,
      date: data.date,
      author: data.author ?? "ShruggieTech",
      category: data.category ?? "Announcements",
      excerpt: data.excerpt ?? "",
      readingTime: stats.text,
      published: data.published !== false,
      ogImage: data.ogImage,
    } satisfies PostMeta,
    content,
  };
}

export function getPaginatedPosts(page: number, perPage: number = 10) {
  const all = getAllPostsMeta();
  const totalPages = Math.ceil(all.length / perPage);
  const start = (page - 1) * perPage;
  const posts = all.slice(start, start + perPage);

  return { posts, totalPages, currentPage: page };
}
```

<a name="73-blog-post-template" id="73-blog-post-template"></a>
### 7.3. Blog Post Template

**Frontmatter schema:**

```yaml
---
title: "Your Post Title Here"
date: "2026-03-10"
author: "William Thompson"
category: "Engineering"
excerpt: "A brief 1-2 sentence summary that appears on the blog index and in meta descriptions."
published: true
ogImage: "/images/og/your-post-og.png"   # Optional
---
```

**MDX rendering (`app/blog/[slug]/page.tsx`):**

```tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPostsMeta } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/MDXComponents";
import PostHeader from "@/components/blog/PostHeader";
import rehypeShiki from "@shikijs/rehype";

export async function generateStaticParams() {
  const posts = getAllPostsMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { meta, content } = getPostBySlug(params.slug);

  return (
    <article className="container-narrow py-20">
      <PostHeader meta={meta} />
      <div className="prose prose-lg dark:prose-invert mt-12 max-w-none">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
            },
          }}
        />
      </div>
    </article>
  );
}
```

**Custom MDX components (`components/blog/MDXComponents.tsx`):**

<div style="text-align:justify">

MDX components override default HTML elements to apply ShruggieTech styling and accessibility requirements. They also enable custom components like callout boxes and embedded code examples.

</div>

```tsx
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      className="mt-12 mb-4 font-display text-display-sm font-bold text-text-primary"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mt-8 mb-3 font-display text-[1.375rem] font-bold text-text-primary"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-5 text-body-md leading-relaxed text-text-secondary" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent"
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, ...props }) => (
    <code
      className="rounded bg-bg-secondary px-1.5 py-0.5 font-mono text-body-sm text-accent"
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-6 italic text-text-muted"
      {...props}
    >
      {children}
    </blockquote>
  ),
  // Custom component: Callout box
  Callout: ({ type = "info", children }: { type?: "info" | "warning"; children: React.ReactNode }) => (
    <aside
      role="note"
      className={clsx(
        "my-6 rounded-lg border-l-4 p-4",
        type === "info" && "border-accent bg-[rgba(43,204,115,0.06)]",
        type === "warning" && "border-cta bg-[rgba(255,83,0,0.06)]"
      )}
    >
      {children}
    </aside>
  ),
};
```

<a name="74-authoring-workflow" id="74-authoring-workflow"></a>
### 7.4. Authoring Workflow

**To publish a new blog post:**

1. Create a new `.mdx` file in `content/blog/` with the filename matching the desired URL slug (e.g., `my-first-post.mdx` → `/blog/my-first-post`).
2. Add frontmatter following the schema in §7.3.
3. Write the post body in standard Markdown. Use `<Callout>` for callout boxes and standard fenced code blocks for code samples.
4. Set `published: true` when ready (or `false` to preview in development without deploying to production).
5. Commit and push to the repository. Vercel rebuilds automatically.

<div style="text-align:justify">

No CMS login, no API keys, no database. Adding a post is a Git commit. This workflow aligns with ShruggieTech's specification-driven methodology: the content is version-controlled, reviewable, and deployable through the same pipeline as the codebase.

</div>

<a name="8-seo-and-aeo-infrastructure" id="8-seo-and-aeo-infrastructure"></a>
<hr class="print-page-break">

## 8. SEO and AEO Infrastructure

<a name="81-metadata-strategy" id="81-metadata-strategy"></a>
### 8.1. Metadata Strategy

<div style="text-align:justify">

Every page must export a `generateMetadata` function (Next.js App Router pattern) that returns a complete metadata object including title, description, canonical URL, Open Graph data, and Twitter card data. The metadata is constructed programmatically from page content and constants defined in `lib/constants.ts`.

</div>

**Default metadata (`lib/constants.ts`):**

```typescript
export const SITE_URL = "https://shruggie.tech";
export const SITE_NAME = "ShruggieTech";
export const SITE_DESCRIPTION =
  "ShruggieTech builds modern digital systems, software, and AI-driven experiences that help businesses present sharper, operate smarter, and scale further.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og/default.png`;
```

**Per-page metadata example:**

```typescript
import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services | ShruggieTech",
  description:
    "Digital strategy, web development, marketing operations, and AI consulting. ShruggieTech delivers full-stack capability at studio scale.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "Services | ShruggieTech",
    description: "Digital strategy, web development, marketing operations, and AI consulting.",
    url: `${SITE_URL}/services`,
    siteName: SITE_NAME,
    type: "website",
  },
};
```

<a name="82-json-ld-schema-markup" id="82-json-ld-schema-markup"></a>
### 8.2. JSON-LD Schema Markup

<div style="text-align:justify">

AEO is identified in KB §12.3 as a strategic differentiator. The ShruggieTech website must practice what it preaches by implementing comprehensive JSON-LD schema markup on every page type. This structured data enables AI-powered answer engines (ChatGPT, Perplexity, Google AI Overviews) to cite ShruggieTech's content as a primary source.

</div>

**Schema generators (`lib/schema.ts`):**

```typescript
import { SITE_URL, SITE_NAME } from "./constants";

// Organization schema — injected on every page via root layout
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Shruggie LLC",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    description:
      "A modern technical studio that builds digital systems, software, and AI-driven experiences.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "116 Agnes Rd, Ste 200",
      addressLocality: "Knoxville",
      addressRegion: "TN",
      postalCode: "37919",
      addressCountry: "US",
    },
    sameAs: ["https://github.com/shruggietech"],
    knowsAbout: [
      "Web Development",
      "AI Consulting",
      "Digital Marketing",
      "Search Engine Optimization",
      "Answer Engine Optimization",
    ],
  };
}

// WebSite schema — injected on homepage
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

// BlogPosting schema — injected on each blog post
export function generateBlogPostSchema(post: {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  slug: string;
  ogImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    image: post.ogImage ?? `${SITE_URL}/images/og/default.png`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

// Service schema — injected on services page
export function generateServiceSchema(service: {
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    name: service.name,
    description: service.description,
    areaServed: {
      "@type": "Place",
      name: "Knoxville, Tennessee and surrounding regions",
    },
  };
}

// TechArticle schema — injected on research/publication pages
export function generateTechArticleSchema(paper: {
  title: string;
  author: string;
  datePublished: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: paper.title,
    author: {
      "@type": "Person",
      name: paper.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    datePublished: paper.datePublished,
    description: paper.description,
    url: paper.url,
  };
}

// SoftwareSourceCode schema — injected on products page
export function generateSoftwareSchema(product: {
  name: string;
  description: string;
  url: string;
  codeRepository: string;
  programmingLanguage: string;
  version?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: product.name,
    description: product.description,
    url: product.url,
    codeRepository: product.codeRepository,
    programmingLanguage: product.programmingLanguage,
    ...(product.version && { version: product.version }),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
  };
}
```

**JSON-LD injection component (`components/shared/JsonLd.tsx`):**

```tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

<a name="83-sitemap-and-robots" id="83-sitemap-and-robots"></a>
### 8.3. Sitemap and Robots

**Sitemap (`app/sitemap.ts`):**

```typescript
import { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "", "/services", "/work", "/research", "/products", "/about", "/blog", "/contact",
    "/for/small-business", "/for/nonprofits", "/for/technical-teams", "/for/developers",
    "/privacy",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const blogPosts = getAllPostsMeta().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPosts];
}
```

**Robots (`app/robots.ts`):**

```typescript
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

<a name="84-open-graph-and-social-cards" id="84-open-graph-and-social-cards"></a>
### 8.4. Open Graph and Social Cards

<div style="text-align:justify">

Every page must include Open Graph metadata for link previews on social platforms. Blog posts use either a custom `ogImage` from frontmatter or a dynamically generated image via Vercel's `@vercel/og` library. The dynamic generation creates a branded card with the post title, author, date, and the ShruggieTech logo on a dark background using the brand color palette.

</div>

**Dynamic OG image route (`app/api/og/route.tsx`):**

```tsx
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "ShruggieTech";
  const author = searchParams.get("author") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 14, color: "#2BCC73", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          SHRUGGIETECH
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, marginTop: 16, lineHeight: 1.15, maxWidth: 900 }}>
          {title}
        </div>
        {author && (
          <div style={{ fontSize: 18, color: "#D1D3D4", marginTop: 24 }}>
            {author}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

<a name="9-performance-budget" id="9-performance-budget"></a>
<hr class="print-page-break">

## 9. Performance Budget

<a name="91-core-web-vitals-targets" id="91-core-web-vitals-targets"></a>
### 9.1. Core Web Vitals Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Largest Contentful Paint (LCP) | < 2.5s | Hero section text render is the LCP candidate on most pages |
| Interaction to Next Paint (INP) | < 200ms | Ensure no heavy synchronous JS on interactive elements |
| Cumulative Layout Shift (CLS) | < 0.1 | Font preloading with `display: swap` + explicit image dimensions |
| First Contentful Paint (FCP) | < 1.8s | Critical CSS inlined by Next.js; no render-blocking requests |
| Lighthouse Performance score | > 90 | Target 95+ |

<a name="92-asset-optimization" id="92-asset-optimization"></a>
### 9.2. Asset Optimization

**Images:** All images served via Next.js `<Image>` component with automatic WebP/AVIF conversion, responsive `srcset`, and lazy loading. Hero images use `priority` prop for eager loading.

**Fonts:** Self-hosted WOFF2 with `next/font/local`. Preloaded for display and body fonts. Monospace font loads on demand (blog posts with code blocks only).

**JavaScript:** Lenis and Framer Motion are client-side only; they are code-split and tree-shaken. The blog MDX renderer uses `next-mdx-remote/rsc` (React Server Components) to avoid sending the MDX parser to the client.

**CSS:** Tailwind CSS purges unused classes at build time. The `@tailwindcss/typography` plugin is applied only to `.prose` containers (blog posts).

<a name="10-deployment-and-cicd" id="10-deployment-and-cicd"></a>
<hr class="print-page-break">

## 10. Deployment and CI/CD

<a name="101-vercel-configuration" id="101-vercel-configuration"></a>
### 10.1. Vercel Configuration

<div style="text-align:justify">

ShruggieTech already has an existing Vercel account with a Next.js deployment (KB §1.3, deployment target). No new Vercel setup is required. The repository is connected to Vercel for automatic deployments on push to `main`. Preview deployments are generated for pull requests.

</div>

**`next.config.ts`:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true,
  },
  headers: async () => [
    {
      source: "/fonts/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
```

<a name="102-environment-variables" id="102-environment-variables"></a>
### 10.2. Environment Variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`). See [§1.4](#14-human-in-the-loop-requirements), item 2. |
| `NEXT_PUBLIC_GTM_ID` | Client | Google Tag Manager container ID (`GTM-XXXXXXX`). See [§1.4](#14-human-in-the-loop-requirements), item 3. |
| `NEXT_PUBLIC_SITE_URL` | Client | `https://shruggie.tech` |
| `NEXT_PUBLIC_FORMSPREE_ID` | Client | Formspree form ID for contact form submission. See [§1.4](#14-human-in-the-loop-requirements), item 4. |

<div style="text-align:justify">

All environment variables are configured in the Vercel project dashboard under Settings → Environment Variables. The `NEXT_PUBLIC_` prefix exposes variables to the client bundle. No server-only environment variables are required because the contact form is handled entirely by Formspree (client-side submission, no backend route).

</div>

---

*This specification is intended as the authoritative reference for the ShruggieTech website build. It covers architecture, design system, accessibility, content pipeline, SEO/AEO infrastructure, audience landing pages, error handling, legal/privacy pages, and deployment. Nothing in this document should be treated as final production code; all code samples are implementation demonstrations that establish the logic, patterns, and conventions to be followed during development. The document is versioned and should be updated as decisions are made on open items (team photographs, case study screenshot assets, contact email address).*

---

<a name="document-history" id="document-history"></a>

## Document History

| Date | Version | Change |
|------|---------|--------|
| <span style="white-space: nowrap;">2026-03-10</span> | 1.0.0 | Initial specification. Established architectural decisions, design system, page content specifications, component library, accessibility requirements, Lenis smooth scrolling integration, blog MDX pipeline, SEO/AEO infrastructure, audience landing pages, and Vercel deployment configuration. |
| <span style="white-space: nowrap;">2026-03-10</span> | 1.1.0 | Added ShruggieCTA component specification (§2.4) with desktop hover and mobile scroll-triggered tagline reveal. Expanded contact form specification (§6.8) with Formspree integration pattern and Zod validation. Added cookie-based theme persistence to dark/light mode specification (§2.6). Minor content refinements across page specifications. |
| <span style="white-space: nowrap;">2026-03-10</span> | 1.2.0 | Added Document Information preamble with purpose, scope, terminology table, and reference documents. Added §1.5 (Favicon and Web App Manifest) with required asset sizes and manifest configuration. Added human-in-the-loop items 7 (contact email) and 8 (favicon source artwork) to §1.4. Added case study MDX frontmatter templates for Scruggs Tire and I Heart PR Tours; documented Belle Toh Piano Studio exclusion rationale in §6.3. Added §6.10 (Error Pages) with 404 and global error boundary specifications. Added §6.11 (Privacy Policy) with policy content structure and cookie consent banner specification. Updated footer structure (§5.2) to include Privacy Policy link. Updated sitemap (§8.3) to include `/privacy` route. Resolved contact email placeholder in §6.8 with reference to §1.4 item 7. Updated project structure (§1.2) to include new routes, favicon assets, and web manifest. Added Document History table. |
