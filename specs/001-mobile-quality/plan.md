# Implementation Plan: Production mobile quality repair

**Branch**: `codex/96-97-mobile-quality` | **Date**: 2026-09-17 | **Spec**: [spec.md](spec.md)

## Summary

Bundle #96 and #97 into one repair slice. Render both hero primitives directly, and make shared entrance reveals a progressive enhancement: visible HTML, animation only for wrappers initially below the viewport, with immediate visibility for reduced motion, focus, missing APIs, and cancellation. Increase the mobile pagination hit areas without increasing the decorative dots, and clarify service/privacy link names.

## Technical Context

- TypeScript strict, React 19.2.3, installed Next.js 16.3.4 App Router, Tailwind 4.
- Native IntersectionObserver and Web Animations API; no added package or persistent state.
- Vitest/Testing Library lifecycle tests, required repository checks, local headless Lighthouse 13.4.1, and browser visual/interaction QA.
- Existing specification budgets are unchanged. Three repeated controlled measurements per route/profile; production and field-INP gates remain on GitHub.
- Scope: shared compact font delivery, dark server HTML, and server-rendered Research, two hero primitives, shared reveal, two mobile carousels, service-grid link name, cookie notice, regression tests, specification and changelog.

## Constitution Check

- Specification precedence: explicitly revise the Framer-specific reveal example and cookie Learn more copy in the same slice. This deviation is authorized by #96/#97.
- Design discipline: reuse existing primitives and tokens; 44px targets use existing Tailwind sizing, with decorative dots unchanged.
- Accessibility: initially readable HTML, live reduced-motion/focus fallbacks, visible focus and descriptive links. Verify keyboard and touch scenarios.
- Performance: compare unchanged and repaired production builds under the same local conditions; disclose variability and retain failures. No field-INP claims.
- Document integrity: UTF-8 without BOM, LF, one final newline; GitHub issues own remaining release work. Mark this spec implemented when code is complete and retain only release evidence/tasks on GitHub after landing.

All pre-design gates pass. Post-design research confirms fail-open animation, zero observer margin, cleanup restoration, and no new dependency.

## Project Structure

- `components/shared/ScrollReveal.tsx`, `PageHero.tsx`, `CookieConsent.tsx`.
- `components/home/HeroSection.tsx`, `ServicesCarousel.tsx`, `WorkCarousel.tsx`, `ServicesGrid.tsx`.
- `tests/scroll-reveal.test.tsx`, `tests/mobile-navigation.test.tsx`.
- This feature's spec, research, data-model, UI contract, quickstart, tasks, and requirements checklist.

## Delivery and Validation

1. Retain an unchanged local production build baseline while source changes are prepared.
2. Test visible HTML and lifecycle fallbacks before replacing the reveal implementation.
3. Implement both user stories, then run unit tests, typecheck, lint, and production build.
4. Re-measure the rebuilt application on the same port/hardware with three sequential cold runs per route/profile. Verify navigation/focus, representative mobile/desktop widths, themes, and reduced motion.
5. Publish a reviewable PR using non-closing issue references because #96/#97 require final production evidence. Link results and keep issues/parent/milestone open.

## Complexity Tracking

No new renderer, runtime package, credential, analytics collection, or workflow is introduced. Existing Motion remains available for interactions that still need it; the simple reveal no longer imports it.

## Rendering refinement

Include complementary Latin/original Geist font faces, server-rendered Research with the shared native reveal, and default dark server HTML after repeated measurements retained mobile LCP failures. Verify original glyph shapes, hinting, metrics, full coverage, and the unchanged pre-paint blog preference. The CSS-inlining experiment failed to meet the gate and is rejected; keep external stylesheet caching. No runtime package is added. These are part of #96, not separate capabilities.
