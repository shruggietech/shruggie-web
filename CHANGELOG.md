# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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