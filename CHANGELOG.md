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
