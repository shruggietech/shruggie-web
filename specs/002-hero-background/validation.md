# S002 local validation and remaining gates

**Updated**: 2026-09-29
**Branch**: `codex/62-hero-background-spec`
**Issue**: [#62](https://github.com/shruggietech/shruggie-web/issues/62)
**Disposition**: The owner-selected radar is available on the local homepage. Performance, manual mode checks, and WCAG 2.2.2 acceptance remain open; issue #62 stays open.

## Decision and scope

The owner rejected face-adjacent symbolism, compared three face-free live concepts, selected Radar sweep, then selected the complete scope above the copy from three live mobile placements. The temporary scenes and preview routes were removed. The homepage background is now two server-rendered SVG variants selected by CSS. The existing headline, body, CTA labels and destinations, navigation, and lower sections were not edited. The owner then replaced the pointer-driven one-turn motion with a continuous six-second clockwise sweep independent of the 1.5-second fade, and explicitly declined an on-page pause button. The website specification records these narrow exceptions to its general motion rules.

## Completed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Concept comparison | Pass | Eighteen first/active/settled desktop/mobile PNGs remain under `concepts/`; the eight-criterion comparison, owner selection, rejected options, and dependency impact are in `research.md`. |
| Focused hero tests | Pass | Six tests cover server-rendered copy/actions and SVG, no pause button, visibility lifecycle, pointer independence, browser observation fallback, and cleanup. |
| Standard test suite | Pass | `npm test`: seven contrast tests, 164 Vitest tests in 32 files, and two skyline asset checks passed after the no-button change. |
| Lint and typecheck | Pass | `npm run lint` and `npx tsc --noEmit` exited zero after the no-button change. |
| Production build | Pass | `npm run build` compiled and generated 38 pages. The temporary preview routes are absent from the route list. |
| Production dependency audit | Pass at high-severity threshold | `npm audit --omit=dev --audit-level=high` exited zero; six existing moderate transitive findings remain. |
| Desktop first and settled frames | Pass for inspected states | A production-browser reload showed the headline and both CTAs readable while the radar was nearly dark, then the complete scope behind a stable text veil. |
| Fade, sweep, and no-button live preview | Pass for inspected state | The rebuilt production preview at `http://127.0.0.1:3010/` reported a 1.5-second fade, six-second infinite sweep, and running state when the hero became visible. The DOM and accessibility snapshot contained no radar pause button. |
| Mobile placement and overflow | Pass for inspected widths | In the rebuilt production preview at requested 320px and 390px viewports, the above-copy headline began at 320px, no pause button appeared, and document scroll width equaled client width (305px and 375px after scrollbar). The CTAs remain in normal page flow. |
| Text/static fallback | Partial pass | The hero unit test confirms the complete decorative SVG and semantic copy/actions render as HTML without Canvas, image, or client drawing. An actual scripting-disabled browser session remains untested. |
| Diff integrity | Pass | `git diff --check` reported no whitespace errors. |

## Open checks

- **Performance (T001/T019, SC-005)**: Matched production bundle-size estimates are in [measurements/bundle-comparison.md](measurements/bundle-comparison.md), but the earlier Lighthouse invocation was rejected by automatic command policy. No matched before/after cold-run timings, constrained-profile result, or Lighthouse budget result is available. Field INP remains unverified.
- **Manual mode coverage (T009/T012/T015, SC-002/003/006)**: Browser checks still need a scripting-disabled session, forced-colors mode, a reduced-motion browser session, constrained-device behavior, and a measured layout-shift/contrast audit of active frames. The visible first and settled desktop frames and selected mobile layout were inspected; these checks do not substitute for the remaining modes.
- **Continuous-motion accessibility (SC-006)**: The owner requested an endless automatic sweep with no on-page pause button. OS reduced-motion settings stop the animation, but the page provides no user pause, stop, or hide mechanism. [WCAG 2.2 SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) calls for such a mechanism for nonessential movement lasting longer than five seconds alongside other content. This criterion is not claimed as passed.
- **Issue disposition (T020)**: The GitHub issue remains open. No PR, merge, deployment, or release claim has been made.
