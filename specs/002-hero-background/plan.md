# Implementation Plan: Homepage hero digital environment

**Branch**: `codex/62-hero-background-spec` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)
**Input**: Issue #62 and the owner's 2026-09-28 concept-comparison and documentation directions.
**State**: Signal foundry implemented locally. Automated and responsive checks are partly complete; performance and some accessibility gates remain open.

## Summary

Replace the cursor-dependent dot grid behind the homepage hero with the selected Signal foundry construction scene, meaningful at rest. Implement the decorative background as a static inline SVG with bounded native animation and only necessary text-safe-zone adjustment. Verify accessibility and production performance against the existing budgets. Align the authoritative homepage specification to the delivered visual and the currently rendered, unchanged copy.

## Technical Context

**Language/Version**: TypeScript strict, React 19, Next.js 16 App Router.
**Primary Dependencies**: Inline SVG and native Web Animations API. The existing `framer-motion` and `gsap` packages are not needed by this hero; no new runtime dependency is added.
**Storage**: None.
**Testing**: Vitest and Testing Library for lifecycle/fallback behavior; browser visual, keyboard, accessibility, and production-build performance checks.
**Target Platform**: Desktop and mobile browsers serving `/`, including touch, keyboard, reduced-motion, no-JavaScript, and constrained devices.
**Project Type**: Next.js web application.
**Performance Goals**: Existing §9.1 targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, FCP < 1.8 s, Lighthouse Performance > 90. Report unavailable field INP as unverified.
**Constraints**: Keep the current foreground copy and links, stay inside the hero, meet WCAG 2.2 AA, settle within five seconds, obey the 800 ms per-element rule, and avoid infinite automatic animation.
**Scale/Scope**: One decorative homepage surface and its focused tests and specification update.

## Constitution Check

| Principle | Plan response | Gate |
| --- | --- | --- |
| I. Specification precedence | The current §6.1 looping-gradient description and copy are stale against code and the motion rule. The implementing change updates §6.1 to the selected behavior and aligns copy documentation without changing visible copy. A motion-rule deviation needs explicit owner approval before code. | Pass at planning; re-check before implementation merge. |
| II. Design system | Use existing brand tokens and hero primitives. Any scene-only constants or bespoke geometry need a documented reason and cannot duplicate shared UI. | Pass at planning. |
| III. Accessibility | Preserve semantic server-rendered foreground, contrast safe zone, reduced-motion and static states, focus, high contrast, and decorative semantics. | Pass at planning. |
| IV. Performance | Measure baseline and final production builds under matched profiles; stop idle/offscreen/hidden work and cap rendering cost. Do not claim field INP from lab data. | Pass at planning; measurement gate remains open. |
| V. Document integrity | Keep all generated artifacts under this feature directory, UTF-8 without BOM, LF, and one final newline. Retire or mark them complete when the feature lands. | Pass at planning. |

## Decision sequence

1. Attempt matched production-build baseline and foreground capture, including issue #31's mobile budget context. The baseline measurement was blocked by automatic command policy; keep the performance gate open rather than treating an unmatched result as evidence. Do not treat #31 as a blocker or fold its separate work into this slice.
2. Produce the three sketches in [research.md](research.md) with first, active, settled, mobile, and reduced-motion views. Compare them on the issue's eight criteria and record observations. The owner chose to compare before selection.
3. Implement the selected Signal foundry scene with static inline SVG and native animation. No new dependency is justified by the prototypes. Revisit this decision only if live implementation evidence shows the selected renderer cannot meet the visual and performance gates.
4. Build a static first-paint composition and stable text safe zone. Replace the decorative Canvas renderer with fixed SVG layers. Keep arrival bounded, input response optional, and idle/offscreen/hidden work stopped.
5. Implement motion, touch/keyboard, no-JavaScript, reduced-motion, high-contrast, resize, constrained-device, and asset/renderer failure states. The background cannot intercept actions.
6. Update §6.1 of `ShruggieTech_Website_Specification.md` to the delivered visual and the unchanged live copy. Keep §2.5's prohibition on infinite looping and 800 ms per-element cap unless the owner expressly approves a deviation. Add the user-facing change to `CHANGELOG.md`.
7. Run focused automated tests and visual/regression checks, plus lint, typecheck, `npm test`, build, and the production dependency audit. The repository CI also runs Firebase-backed integration and publication tests for other site capabilities; record their status without treating their local emulator startup as a hero behavior result. Collect matched before/after performance evidence and report any failed or unavailable gate without closing #62.

## Project Structure

### Documentation

```text
specs/002-hero-background/
  spec.md
  research.md
  plan.md
  tasks.md
  checklists/requirements.md
```

### Expected source touchpoints

```text
components/home/HeroSection.tsx
components/home/HeroBackground.tsx
components/home/hero-background/       # only if separating scene and lifecycle improves clarity
styles/globals.css                      # only for a static first-paint layer or safe zone
tests/hero-background.test.tsx          # focused lifecycle and fallback tests
ShruggieTech_Website_Specification.md
CHANGELOG.md
```

The selected renderer can alter the internal file split; it cannot broaden the external scope. Do not create a reusable site-wide animation layer for this hero.

The SVG paths and coordinates are authored scene geometry, not layout spacing tokens. The mobile crop and stable contrast veil are hero-local because shared UI primitives do not provide this background behavior. Native Web Animations runs each arrival group for 650 ms with 220 ms staggering, below the specification's 800 ms per-element limit and with a total arrival under five seconds. Pointer response is limited to a small transform of secondary detail; fixed vector geometry has no device-pixel-ratio scaling or particle-density growth.

## Open evidence gates

- The selected sketch is implemented and the production page was inspected at 1280, 390, and 320 CSS pixels. First/active arrival frames, forced colors, no-JavaScript browser mode, and weak-device behavior still need manual validation.
- Matched production bundle-size estimates are recorded in [measurements/bundle-comparison.md](measurements/bundle-comparison.md). Before/after timing, actual network transfer, constrained-device, and Lighthouse budget results remain unavailable because the Lighthouse command was rejected by automatic command policy.
- Focused hero tests, `npm test`, lint, typecheck, build, and the high-severity production audit pass. The separate repository-wide `test:all` command cannot start its unrelated Firebase integration portion locally because Firestore's emulator cannot create a loopback selector with either installed JDK 21 or JDK 24. No Firestore files or behavior were changed for S002.
- Details are in [validation.md](validation.md). Issue #62 must stay open until its individual acceptance criteria and release gates are satisfied.
