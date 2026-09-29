# Implementation Plan: Homepage hero digital environment

**Branch**: `codex/62-hero-background-spec` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)
**Input**: Issue #62 and the owner's 2026-09-28 concept-comparison and documentation directions.
**State**: Owner selected Radar sweep, above-copy mobile placement, and a continuous slower sweep independent of the fade. Performance and some accessibility gates remain open.

## Summary

Replace the cursor-dependent dot grid behind the homepage hero with the owner-selected face-free Radar sweep. Radar sweep, Signal loom, and Lightwell were compared live with the actual page copy and spacing. The owner then chose the complete scope above the mobile copy from three live placements and changed the motion to an autonomous continuous sweep. Use static inline SVG, an independent 1.5-second fade, a six-second clockwise revolution that repeats while visible, and a stable text-safe zone. The owner selected a hidden click target inside the three inner rings with delayed hover inversion instead of a visible pause button. Unused preview infrastructure is removed from the release build.

## Technical Context

**Language/Version**: TypeScript strict, React 19, Next.js 16 App Router.
**Primary Dependencies**: Inline SVG and CSS animation. The existing `framer-motion` and `gsap` packages are not needed by this hero; no new runtime dependency is added.
**Storage**: None.
**Testing**: Vitest and Testing Library for lifecycle/fallback behavior; browser visual, keyboard, accessibility, and production-build performance checks.
**Target Platform**: Desktop and mobile browsers serving `/`, including touch, keyboard, reduced-motion, no-JavaScript, and constrained devices.
**Project Type**: Next.js web application.
**Performance Goals**: Existing §9.1 targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, FCP < 1.8 s, Lighthouse Performance > 90. Report unavailable field INP as unverified.
**Constraints**: Keep the current foreground copy and links, stay inside the hero, complete the fade in 1.5 seconds independently of a continuous six-second revolution, and stop work offscreen or hidden. The three inner rings provide a click/tap and keyboard motion toggle without a visible pause button. Hover inverts the saved state after 200ms and restores it on leave. The fade and sweep are owner-directed exceptions to the general 800 ms duration and no-infinite-loop rules.
**Scale/Scope**: One decorative homepage surface and its focused tests and specification update.

## Constitution Check

| Principle | Plan response | Gate |
| --- | --- | --- |
| I. Specification precedence | The current §6.1 describes a one-turn, pointer-driven radar. The owner replaced that behavior with continuous autonomous motion and an independent 1.5-second fade. Update §6.1 and record a narrow radar exception in §2.5 without changing visible copy or loosening the general rule for other components. | Re-check at implementation completion. |
| II. Design system | Use existing brand tokens and hero primitives. Any scene-only constants or bespoke geometry need a documented reason and cannot duplicate shared UI. | Pass at planning. |
| III. Accessibility | Preserve semantic server-rendered foreground, contrast safe zone, reduced-motion and static states, focus, high contrast, and decorative semantics. Keep the motion target outside the decorative `aria-hidden` tree, give it an accessible action name and focus-visible ring, and remove it when scripting or observation is unavailable. | Verify in browser. |
| IV. Performance | Measure baseline and final production builds under matched profiles; stop sweep work when offscreen, hidden, or reduced motion is requested. Do not claim field INP from lab data. | Pass at planning; measurement gate remains open. |
| V. Document integrity | Keep all generated artifacts under this feature directory, UTF-8 without BOM, LF, and one final newline. Retire or mark them complete when the feature lands. | Pass at planning. |

## Decision sequence

1. Attempt matched production-build baseline and foreground capture, including issue #31's mobile budget context. The baseline measurement was blocked by automatic command policy; keep the performance gate open rather than treating an unmatched result as evidence. Do not treat #31 as a blocker or fold its separate work into this slice.
2. Produce and compare three revised face-free sketches in [research.md](research.md) with first, active, settled, mobile, and reduced-motion views, then expose live previews. The owner rejected the original face-like concepts on 2026-09-29 and asked to see the revised choices live before selection.
3. Implement the owner-selected Radar sweep and above-copy mobile placement with static inline SVG and native animation. No new dependency is justified by the prototypes. Remove temporary previews after the owner's choice.
4. Build a static first-paint composition and stable text safe zone. Replace the decorative Canvas renderer with fixed SVG layers. Decouple the 1.5-second fade from the six-second repeating sweep, remove pointer steering, and pause motion when offscreen or hidden. Make the three inner rings the only hero-local interactive target.
5. Implement motion, touch/keyboard, no-JavaScript, reduced-motion, high-contrast, resize, constrained-device, and asset/renderer failure states. The background cannot intercept actions.
6. Update §6.1 of `ShruggieTech_Website_Specification.md` to the delivered visual and the unchanged live copy. Record the owner's continuous-radar exception in §2.5 while keeping the general 800 ms cap and prohibition on infinite looping for other components. Add the user-facing change to `CHANGELOG.md`.
7. Run focused automated tests and visual/regression checks, plus lint, typecheck, `npm test`, build, and the production dependency audit. Collect matched before/after performance evidence and report any failed or unavailable gate without closing #62.

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

The SVG paths and coordinates are authored scene geometry, not layout spacing tokens. The above-copy mobile placement and stable contrast veil are hero-local because shared UI primitives do not provide this background behavior. CSS fades the scope in over 1.5 seconds while a separate six-second clockwise sweep repeats. There is no pointer steering or requestAnimationFrame loop. A separate SVG hit target maps exactly to the three innermost rings in each scene. Click/tap or keyboard activation toggles the saved running state; hovering for 200ms temporarily applies the opposite state. The target is visually transparent until keyboard focus exposes an outline, and it is hidden when JavaScript observation is unavailable, reduced motion is requested, or forced colors removes the scope. CSS pauses the sweep when the hero is offscreen or hidden. Fixed vector geometry has no device-pixel-ratio scaling or particle-density growth.

## Open evidence gates

- The earlier production page was inspected at desktop, 390, and 320 CSS pixels after the no-button revision. The new center target needs fresh browser checks for hit geometry, hover/click inversion, keyboard activation, mobile tapping, CTA interception, forced colors, and reduced motion before acceptance. A scripting-disabled browser and weak-device behavior remain open.
- Matched production bundle-size estimates are recorded in [measurements/bundle-comparison.md](measurements/bundle-comparison.md). Before/after timing, actual network transfer, constrained-device, and Lighthouse budget results remain unavailable because the Lighthouse command was rejected by automatic command policy.
- Focused hero tests, full lint, `npm test`, typecheck, the production build, and the dependency audit passed after the new center-control change. Manual accessibility and performance gates remain open.
- Details are in [validation.md](validation.md). Issue #62 must stay open until its individual acceptance criteria and release gates are satisfied.
