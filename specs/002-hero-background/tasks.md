# Tasks: Homepage hero digital environment

**Input**: [spec.md](spec.md), [plan.md](plan.md), [research.md](research.md), and [issue #62](https://github.com/shruggietech/shruggie-web/issues/62).
**Status**: Local implementation in progress. Checked tasks are complete; remaining verification gates stay open.
**Organization**: One coherent issue #62 slice. #31 is coordination, not a dependency; #21 is complete.

## Phase 1: Evidence and concept decision (blocks scene implementation)

- [ ] T001 [US1] Capture current hero screenshots and matched production-build mobile/desktop baseline measurements, including a constrained profile, bundle size, and available field INP status. Record raw settings and results in this feature directory. Matched bundle sizes are recorded; timing and constrained-profile baselines remain open.
- [x] T002 [US1] Produce first, active, settled, mobile, and reduced-motion sketch states for Signal foundry using unchanged hero copy and approximate foreground spacing.
- [x] T003 [US1] Produce the same sketch states for Liminal systems atrium using unchanged hero copy and approximate foreground spacing.
- [x] T004 [US1] Produce the same sketch states for Compile field using unchanged hero copy and approximate foreground spacing.
- [x] T005 [US1] Compare T002-T004 against all eight criteria in `research.md`; record the chosen concept, renderer, rejected options, dependency impact, and any owner decision before full implementation. If the scene needs a new runtime or motion-rule exception, resolve that explicit approval gate first.

## Phase 2: User Story 1 - Arrival and readable foreground (P1)

- [x] T006 [US1] Add focused tests for first-paint/static presentation, preserved foreground content, arrival settling, and non-interception in `tests/hero-background.test.tsx` or the closest existing test suite.
- [x] T007 [US1] Implement the chosen static first-paint state and stable foreground safe zone in `components/home/HeroSection.tsx`, `components/home/HeroBackground.tsx`, and `styles/globals.css` only as needed.
- [x] T008 [US1] Implement the selected bounded construction/assembly scene. If retaining Canvas, separate scene state, drawing, input, and lifecycle into focused files under `components/home/hero-background/` rather than expanding the current 708-line component.
- [ ] T009 [US1] Verify the first, active, and settled states at representative desktop and 390/320 px mobile widths. Confirm no copy, CTA, link, navigation, or lower-homepage change.

## Phase 3: User Story 2 - Intentional modes and fallbacks (P1)

- [x] T010 [US2] Add deterministic tests for live reduced-motion changes, missing renderer/asset, and touch or keyboard-only behavior in `tests/hero-background.test.tsx` where practical.
- [x] T011 [US2] Implement static/no-JavaScript, reduced-motion, high-contrast, touch, keyboard-only, and selected-renderer failure paths in the hero files. Add a non-WebGL fallback and context-loss handling only if T005 selects WebGL.
- [ ] T012 [US2] Manually check keyboard order/focus, contrast in all visual states, forced colors, touch interaction, no-JavaScript content, and failed visual initialization. Record screenshots and findings in this feature directory or the PR.

## Phase 4: User Story 3 - Calm lifecycle and measured cost (P2)

- [ ] T013 [US3] Add lifecycle tests for settled idle state, offscreen and hidden pause, resize/rotation, cleanup, and resolution/geometry caps where deterministic. Offscreen, hidden, resize, and cleanup are covered; constrained-profile evidence remains open.
- [ ] T014 [US3] Implement demand-driven visual updates and stop work when idle, offscreen, hidden, or reduced motion. Cap effective resolution and geometry complexity based on constrained-profile measurements. Fixed SVG geometry and no redraw loop are implemented; constrained-profile measurements remain open.
- [ ] T015 [US3] Check no horizontal overflow, layout shift, blocked clicks, hydration errors, or console errors at desktop/mobile sizes and a constrained profile.

## Phase 5: Contract, analysis, and release evidence

- [x] T016 Update `ShruggieTech_Website_Specification.md` §6.1 to the selected delivered visual and the unchanged rendered hero copy; retain §2.5 motion limits unless an explicit owner-approved exception is recorded. Update `CHANGELOG.md`.
- [x] T017 Run `/speckit-analyze` on `spec.md`, `plan.md`, and `tasks.md`; resolve actionable coverage or constitution findings before implementation completion.
- [x] T018 Run focused hero tests, `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and the production dependency audit. Record repository-wide CI status separately; the unrelated Firebase emulator suite does not test this hero.
- [ ] T019 Repeat matched production-build mobile/desktop measurements from T001 (three cold runs per profile), include a constrained profile and bundle/renderer cost, and compare each budget with raw evidence. State field INP as unverified if unavailable. Bundle costs are recorded; cold-run timing and numeric budget comparison remain open.
- [ ] T020 Audit every issue #62 acceptance criterion and all FR/SC items, attach the concept decision and visual/performance evidence to the implementing PR, and keep #62 open until its own acceptance and release gates are complete. Coordinate any relevant performance result with #31.

## Dependencies and completion rule

T001-T005 precede choosing the final implementation. T006-T009 precede a visual acceptance claim. T010-T015 and T016 must be complete before T018-T020 can establish readiness. Passing unrelated CI checks or lab-only measurements cannot substitute for the issue's visual and production gates.
