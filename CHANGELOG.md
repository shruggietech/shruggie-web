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
- Prettier configuration with Tailwind CSS plugin
- `.handoff/` directory structure for sprint coordination
