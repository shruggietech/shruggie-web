# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fix React hydration mismatch in `HeroSection` caused by `<style jsx>` generating different class name hashes on server vs client; moved gradient mesh CSS to `styles/globals.css` and converted `HeroSection` to a server component

### Added

- Project initialization with Next.js 15 (App Router), TypeScript, and Tailwind CSS 4.x
- Production dependencies: lenis, framer-motion, next-mdx-remote, shiki, gray-matter, lucide-react, react-hook-form, @hookform/resolvers, @formspree/react, zod, clsx, tailwind-merge, reading-time
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
