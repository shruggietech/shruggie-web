# Tasks: Production mobile quality repair

**Input**: [plan.md](plan.md), [spec.md](spec.md), and associated design artifacts.

## Phase 1: Setup

- [x] T001 Verify #96/#97, branch isolation, and preserved local files; record scope in `specs/001-mobile-quality/spec.md`.

## Phase 2: Foundation

- [x] T002 Read installed Next.js guides, complete reveal research, and start the retained baseline build; record decisions in `specs/001-mobile-quality/research.md`.

## Phase 3: User Story 1 - Read and act on arrival

Independent check: visible HTML, immediate first viewport, and safe reveal lifecycle.

- [x] T003 [US1] Write failing rendering/lifecycle regression cases in `tests/scroll-reveal.test.tsx`.
- [x] T004 [US1] Implement progressive reveal and fail-open cleanup in `components/shared/ScrollReveal.tsx`.
- [x] T005 [US1] Render static heroes in `components/shared/PageHero.tsx` and `components/home/HeroSection.tsx`.

## Phase 4: User Story 2 - Mobile navigation

Independent check: target bounds, selected card, destination names, and unchanged consent.

- [x] T006 [US2] Write mobile pagination/link/consent regression cases in `tests/mobile-navigation.test.tsx`.
- [x] T007 [US2] Enlarge hit areas and retain dot treatment in `components/home/ServicesCarousel.tsx` and `components/home/WorkCarousel.tsx`.
- [x] T008 [US2] Clarify links in `components/home/ServicesCarousel.tsx`, `components/home/ServicesGrid.tsx`, and `components/shared/CookieConsent.tsx`.

## Rendering refinement

- [x] T013 [US1] Compact font delivery with full glyph fallbacks, server-render Research, and default readable dark HTML in `app/layout.tsx`, `components/home/ResearchSection.tsx`, `styles/font-extended.css` and `scripts/prepare-fonts.py`. Reject the unsuccessful inline-CSS experiment.

## Phase 5: Validation and review

- [x] T009 Update progressive reveal and cookie/navigation contracts in `ShruggieTech_Website_Specification.md` and user-facing changes in `CHANGELOG.md`.
- [ ] T010 Run required checks and compare repeated optimized-build measurements; summarize evidence in `specs/001-mobile-quality/validation.md`.
- [ ] T011 Verify browser interactions, widths, focus, reduced motion and initial HTML; record limitations in `specs/001-mobile-quality/validation.md`.
- [ ] T012 Publish the reviewable slice and link #96/#97 without premature closure; mark implementation status in `specs/001-mobile-quality/spec.md`.

## Dependencies and strategy

T001/T002 establish the unchanged compiled baseline; tests precede their corresponding implementation. US1 is the first useful increment. US2 is independent and shares the final audit/PR. The two independent test files can be prepared separately; no concurrent edits to the same components are needed. Production deployment and final issue closure remain explicitly tracked on #96/#97/#31 rather than being asserted by these local tasks.
