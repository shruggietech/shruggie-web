# S002 local validation and remaining gates

**Updated**: 2026-09-29
**Branch**: `codex/62-hero-background-spec`
**Issue**: [#62](https://github.com/shruggietech/shruggie-web/issues/62)
**Disposition**: The owner-selected radar and center motion control are available on the local homepage. Performance and remaining manual mode checks are open; issue #62 stays open.

## Decision and scope

The owner rejected face-adjacent symbolism, compared three face-free live concepts, selected Radar sweep, then selected the complete scope above the copy from three live mobile placements. The temporary scenes and preview routes were removed. The homepage background is now two server-rendered SVG variants selected by CSS. The existing headline, body, CTA labels and destinations, navigation, and lower sections were not edited. The owner replaced the pointer-driven one-turn motion with a continuous six-second clockwise sweep independent of the 1.5-second fade, declined a visible pause button, and then selected an invisible click target inside the three inner rings with delayed hover inversion. The website specification records these narrow exceptions to its general motion rules.

## Completed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Concept comparison | Pass | Eighteen first/active/settled desktop/mobile PNGs remain under `concepts/`; the eight-criterion comparison, owner selection, rejected options, and dependency impact are in `research.md`. |
| Focused hero tests | Pass | Seven tests cover server-rendered copy/actions and SVG, center toggle, delayed hover inversion, touch ignoring hover, keyboard activation, visibility lifecycle, pointer independence, browser observation fallback, and cleanup. |
| Standard test suite | Pass | `npm test`: seven contrast tests, 165 Vitest tests in 32 files, and two skyline asset checks passed after the center-control change. |
| Lint and typecheck | Pass | `npm run lint` and `npx tsc --noEmit` exited zero after the center-control change. |
| Production build | Pass | `npm run build` compiled and generated 38 pages after the center-control change. The temporary preview routes are absent from the route list. |
| Production dependency audit | Pass at high-severity threshold | `npm audit --omit=dev --audit-level=high` exited zero after the center-control change; six existing moderate transitive findings remain. |
| Desktop first and settled frames | Pass for inspected states | A production-browser reload showed the headline and both CTAs readable while the radar was nearly dark, then the complete scope behind a stable text veil. |
| Fade, sweep, and center control | Pass for inspected states | The rebuilt production preview at `http://127.0.0.1:3010/` retains the 1.5-second fade and six-second sweep. The desktop center appears in the accessibility tree as a named button without visible button chrome. Clicking the center and pressing Enter toggled motion; keyboard focus produced a green outline. Browser hover temporarily inverted the click state, and leaving restored it. Focused tests cover the exact 200ms delay. |
| Mobile placement and overflow | Pass for inspected widths | At requested 390px and 320px viewports, the center target matched the radar, an activation at 390px toggled motion, and document scroll width equaled client width. At 320px, hit testing at the target center resolved to the control. The CTAs remain below the target in normal page flow. |
| Text/static fallback | Partial pass | The hero unit test confirms the complete decorative SVG and semantic copy/actions render as HTML without Canvas, image, or client drawing. An actual scripting-disabled browser session remains untested. |
| Diff integrity | Pass | `git diff --check` reported no whitespace errors. |

## Open checks

- **Performance (T001/T019, SC-005)**: Matched production bundle-size estimates are in [measurements/bundle-comparison.md](measurements/bundle-comparison.md), but the earlier Lighthouse invocation was rejected by automatic command policy. No matched before/after cold-run timings, constrained-profile result, or Lighthouse budget result is available. Field INP remains unverified.
- **Manual mode coverage (T009/T012/T015, SC-002/003/006)**: Browser checks still need a scripting-disabled session, forced-colors mode, a reduced-motion browser session, constrained-device behavior, and a measured layout-shift/contrast audit of active frames.
- **Continuous-motion accessibility (SC-006)**: The owner-selected center target offers stop/resume without a visible pause button. It appears in the browser accessibility tree with an action name and keyboard focus indicator. A final assistive-technology check is still needed before claiming [WCAG 2.2 SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide) conformance.
- **Issue disposition (T020)**: The GitHub issue remains open. No PR, merge, deployment, or release claim has been made.
