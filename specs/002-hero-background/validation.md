# S002 local validation and remaining gates

**Updated**: 2026-09-29
**Branch**: `codex/62-hero-background-spec`
**Issue**: [#62](https://github.com/shruggietech/shruggie-web/issues/62)
**Disposition**: The owner-selected radar is available on the local homepage. Performance and several manual acceptance gates remain open; issue #62 stays open.

## Decision and scope

The owner rejected face-adjacent symbolism, compared three face-free live concepts, selected Radar sweep, then selected the complete scope above the copy from three live mobile placements. The temporary scenes and preview routes were removed. The homepage background is now two server-rendered SVG variants selected by CSS. The existing headline, body, CTA labels and destinations, navigation, and lower sections were not edited. The owner requested one full clockwise revolution and reveal within about 1.5 seconds; the website specification records this 1400ms exception to its general 800ms rule.

## Completed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Concept comparison | Pass | Eighteen first/active/settled desktop/mobile PNGs remain under `concepts/`; the eight-criterion comparison, owner selection, rejected options, and dependency impact are in `research.md`. |
| Focused hero tests | Pass | Eight tests cover server-rendered copy/actions and SVG, browser API fallback, clockwise pointer advance, angular speed/queue caps, mobile pointer stability, offscreen/hidden/reduced-motion pause, and cleanup. |
| Standard test suite | Pass | `npm test`: seven contrast tests, 166 Vitest tests in 32 files, and two skyline asset checks passed. |
| Lint and typecheck | Pass | `npm run lint` and `npx tsc --noEmit` exited zero after final scene selection. |
| Production build | Pass | `npm run build` compiled and generated 38 pages. The temporary preview routes are absent from the route list. |
| Production dependency audit | Pass at high-severity threshold | `npm audit --omit=dev --audit-level=high` exited zero; six existing moderate transitive findings remain. |
| Desktop first and settled frames | Pass for inspected states | A production-browser reload showed the headline and both CTAs readable while the radar was nearly dark, then the complete scope behind a stable text veil. |
| Intro timing and desktop cursor response | Pass | Browser-computed reveal and sweep durations are both 1.4s; the sweep animation fill mode is `none`. The rendered SVG transform advanced from about 130 to 304 degrees after the cursor moved in the opposite direction. The previous retained transform had hidden the pointer response. |
| Mobile placement, input, and overflow | Pass for inspected widths | At a requested 390px viewport, the scope ran from about 78 to 329px, the heading started at 320px, and both CTAs were within an 844px screen. Mouse travel left the mobile sweep's computed transform unchanged. At a requested 320px viewport, document scroll width equaled client width (305px after scrollbar). The CTAs remain in normal page flow and require scrolling at 700px viewport height. |
| Text/static fallback | Partial pass | The hero unit test confirms the complete decorative SVG and semantic copy/actions render as HTML without Canvas, image, or client drawing. An actual scripting-disabled browser session remains untested. |
| Diff integrity | Pass | `git diff --check` reported no whitespace errors. |

## Open checks

- **Performance (T001/T019, SC-005)**: Matched production bundle-size estimates are in [measurements/bundle-comparison.md](measurements/bundle-comparison.md), but the earlier Lighthouse invocation was rejected by automatic command policy. No matched before/after cold-run timings, constrained-profile result, or Lighthouse budget result is available. Field INP remains unverified.
- **Manual mode coverage (T009/T012/T015, SC-002/003/006)**: Browser checks still need a scripting-disabled session, forced-colors mode, a reduced-motion browser session, constrained-device behavior, and a measured layout-shift/contrast audit of active frames. The visible first and settled desktop frames and selected mobile layout were inspected; these checks do not substitute for the remaining modes.
- **Issue disposition (T020)**: The GitHub issue remains open. No PR, merge, deployment, or release claim has been made.
