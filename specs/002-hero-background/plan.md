# Implementation Plan: Homepage hero digital environment

**Branch**: `codex/62-hero-background-spec` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)
**Input**: Issue #62 and the owner's 2026-09-28 concept-comparison and documentation directions.
**State**: Owner selected Radar sweep and the above-copy mobile placement. Performance and some accessibility gates remain open.

## Summary

Replace the cursor-dependent dot grid behind the homepage hero with the owner-selected face-free Radar sweep, meaningful at rest. Radar sweep, Signal loom, and Lightwell were compared live with the actual page copy and spacing. The owner then chose the complete scope above the mobile copy from three live placements. Use static inline SVG, a one-time CSS revolution and reveal, capped clockwise desktop pointer response, and a stable text-safe zone. Unused preview infrastructure is removed from the release build.

## Technical Context

**Language/Version**: TypeScript strict, React 19, Next.js 16 App Router.
**Primary Dependencies**: Inline SVG, CSS animation, and native requestAnimationFrame. The existing `framer-motion` and `gsap` packages are not needed by this hero; no new runtime dependency is added.
**Storage**: None.
**Testing**: Vitest and Testing Library for lifecycle/fallback behavior; browser visual, keyboard, accessibility, and production-build performance checks.
**Target Platform**: Desktop and mobile browsers serving `/`, including touch, keyboard, reduced-motion, no-JavaScript, and constrained devices.
**Project Type**: Next.js web application.
**Performance Goals**: Existing §9.1 targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, FCP < 1.8 s, Lighthouse Performance > 90. Report unavailable field INP as unverified.
**Constraints**: Keep the current foreground copy and links, stay inside the hero, meet WCAG 2.2 AA, complete the single 1.4-second radar intro within 1.5 seconds, cap desktop input at 150 degrees per second, and avoid infinite automatic animation. The intro has the owner's explicit exception to the general 800 ms rule.
**Scale/Scope**: One decorative homepage surface and its focused tests and specification update.

## Constitution Check

| Principle | Plan response | Gate |
| --- | --- | --- |
| I. Specification precedence | The current §6.1 visual description is stale against the selected Radar sweep. The implementing change updates §6.1 without changing visible copy. The owner directed a 1.4-second intro on 2026-09-29; record that precise exception in §2.5 while preserving the general 800 ms rule. | Re-check at implementation completion. |
| II. Design system | Use existing brand tokens and hero primitives. Any scene-only constants or bespoke geometry need a documented reason and cannot duplicate shared UI. | Pass at planning. |
| III. Accessibility | Preserve semantic server-rendered foreground, contrast safe zone, reduced-motion and static states, focus, high contrast, and decorative semantics. | Pass at planning. |
| IV. Performance | Measure baseline and final production builds under matched profiles; stop idle/offscreen/hidden work and cap rendering cost. Do not claim field INP from lab data. | Pass at planning; measurement gate remains open. |
| V. Document integrity | Keep all generated artifacts under this feature directory, UTF-8 without BOM, LF, and one final newline. Retire or mark them complete when the feature lands. | Pass at planning. |

## Decision sequence

1. Attempt matched production-build baseline and foreground capture, including issue #31's mobile budget context. The baseline measurement was blocked by automatic command policy; keep the performance gate open rather than treating an unmatched result as evidence. Do not treat #31 as a blocker or fold its separate work into this slice.
2. Produce and compare three revised face-free sketches in [research.md](research.md) with first, active, settled, mobile, and reduced-motion views, then expose live previews. The owner rejected the original face-like concepts on 2026-09-29 and asked to see the revised choices live before selection.
3. Implement the owner-selected Radar sweep and above-copy mobile placement with static inline SVG and native animation. No new dependency is justified by the prototypes. Remove temporary previews after the owner's choice.
4. Build a static first-paint composition and stable text safe zone. Replace the decorative Canvas renderer with fixed SVG layers. Keep arrival bounded, input response optional, and idle/offscreen/hidden work stopped.
5. Implement motion, touch/keyboard, no-JavaScript, reduced-motion, high-contrast, resize, constrained-device, and asset/renderer failure states. The background cannot intercept actions.
6. Update §6.1 of `ShruggieTech_Website_Specification.md` to the delivered visual and the unchanged live copy. Record the owner's 1.4-second radar-intro exception in §2.5 while keeping the general 800 ms cap and prohibition on infinite looping. Add the user-facing change to `CHANGELOG.md`.
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

The SVG paths and coordinates are authored scene geometry, not layout spacing tokens. The above-copy mobile placement and stable contrast veil are hero-local because shared UI primitives do not provide this background behavior. CSS runs one 1.4-second full revolution while revealing the scope from darkness. Desktop mouse travel adds only clockwise rotation, limited to 150 degrees per second with at most 75 degrees queued. Mobile pointer input cannot move the scope. Fixed vector geometry has no device-pixel-ratio scaling or particle-density growth. The sweep animation must release its transform after the intro so the pointer rotation remains visible.

## Open evidence gates

- The selected sketch is implemented and the production page was inspected at desktop, 390, and 320 CSS pixels. The browser confirmed the rendered desktop bearing advances from about 130 to 304 degrees even when cursor travel reverses. First/active arrival frames, forced colors, no-JavaScript browser mode, and weak-device behavior still need manual validation.
- Matched production bundle-size estimates are recorded in [measurements/bundle-comparison.md](measurements/bundle-comparison.md). Before/after timing, actual network transfer, constrained-device, and Lighthouse budget results remain unavailable because the Lighthouse command was rejected by automatic command policy.
- Focused hero tests and the production build pass on the final selected implementation. Full lint, typecheck, `npm test`, and the dependency audit must be rerun after the latest changes.
- Details are in [validation.md](validation.md). Issue #62 must stay open until its individual acceptance criteria and release gates are satisfied.
