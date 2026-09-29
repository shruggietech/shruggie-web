# S002 local validation and remaining gates

**Created**: 2026-09-28 | **Updated**: 2026-09-29
**Branch**: `codex/62-hero-background-spec`
**Issue**: [#62](https://github.com/shruggietech/shruggie-web/issues/62)
**Disposition**: Local implementation is reviewable. Hero performance and remaining visual acceptance checks are open.

## Spec-Kit analysis

`/speckit-analyze` prerequisite discovery found the feature directory and complete `spec.md`, `plan.md`, and `tasks.md`. Cross-artifact review mapped FR-001 through FR-011 and SC-001 through SC-007 to the task list. No missing core requirement, uncovered user story, or constitution conflict was found. Two medium documentation findings were corrected: draft status text still described implementation as unstarted, and the plan's baseline-first sequence did not reflect the blocked Lighthouse invocation. The performance task remains unchecked.

## Completed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Concept comparison | Pass | Eighteen PNG sketch states across three concepts, two sizes, and three phases; eight-criterion comparison and renderer decision in `research.md`. The settled phase is also the reduced-motion sketch. |
| Focused hero tests | Pass | Eight tests cover server-rendered copy/actions and visual signature, one finite arrival, offscreen/hidden pause, live reduced-motion change, absent browser APIs, mouse/touch response, resize settlement, and cleanup. |
| Editorial, contrast, and skyline suites | Pass | Final `npm test` run: 166 Vitest tests, seven Node contrast tests, and skyline asset checks passed. |
| Lint | Pass | Final `npm run lint` returned zero errors or warnings. |
| Typecheck | Pass | Final `tsc --noEmit` returned zero errors. |
| Production build | Pass | Final `npm run build` compiled and generated 38 static pages. |
| Production dependency audit | Pass at CI threshold | `npm audit --omit=dev --audit-level=high` exited zero. It reported six moderate findings in transitive dependencies, with no high or critical findings. |
| Matched production bundle sizes | Measured | [Bundle comparison](measurements/bundle-comparison.md) from isolated `origin/main` and S002 builds: 19 observed scripts and five stylesheets in each state; combined independently gzipped HTML, JS, and CSS increases by 1,132 bytes (about 0.32%). This is a size proxy, not transfer timing or a Core Web Vitals result. |
| Actual page at 1280, 390, and 320 CSS px | Partial pass | In the production Next server, heading and both CTAs remained visible and linked. Browser DOM measurements showed document scroll width equal to client width at desktop and no horizontal overflow at 390/320. Browser error/warning log was empty. The 320 px screenshot showed the composed scene below and behind the actions. |
| Raw HTML and hero actions | Pass | The production HTML response contains the headline, both action links, and the complete `data-hero-signature` SVG without JavaScript. Both CTAs navigated to their existing destinations in the browser. Keyboard focus reached the actions with a visible outline. |

## Open or blocked checks

- **Matched performance gate (T001/T019, SC-005)**: The Lighthouse package invocation was rejected by automatic command policy before execution. Production bundle-size comparison is recorded, but there are no matched before/after mobile or desktop cold-run timing measurements, constrained profile, actual network transfer results, or Lighthouse budget result. The browser's restricted read-only page scope did not expose Performance API timing entries. Field INP is unverified.
- **Repository-wide CI status, separate from hero validation**: CI runs `npm run test:all`, which includes Firebase integration and production-publication suites for other site capabilities. That command passed its unit/editorial portion but could not start Firestore Emulator v1.22.0 locally with either installed JDK 21 or 24 (`Unable to establish loopback connection`). Those suites did not reach assertions and do not test the hero. No Firebase code, configuration, or data was changed in S002. CI must still report its own result when the branch is pushed.
- **Visual/accessibility acceptance (T009/T012/T015, SC-002/003/006)**: The real desktop and 390/320 px settled views were inspected. Both CTAs were clicked successfully; focus reaches them and has a visible outline. The raw HTML proves content and SVG are served without JavaScript, while a browser with scripting disabled remains untested. The actual first/active arrival frames, forced-colors mode, and low-power profile still need direct checks. Static markup, reduced-motion, browser API fallback, pointer mode, and lifecycle behavior have focused automated coverage. The offscreen mobile navigation is keyboard-focusable on desktop in both baseline and S002, so it is a pre-existing navigation issue rather than a hero regression.
- **Issue disposition (T020)**: #62 remains open. No PR has been created, and no issue closure or release claim is warranted until its individual acceptance and required verification are complete.

## Scope and implementation cost

The hero's 708-line Canvas renderer was replaced with a static inline SVG scene and a small client lifecycle controller. The scene is fixed vector geometry with no images, GPU context, device-pixel-ratio scaling, animation package, or continuous frame loop. The desktop and mobile compositions are served in the first HTML response; CSS chooses one by breakpoint. The client adds only a bounded arrival and direct mouse response. No route, foreground copy, CTA label, CTA destination, or lower homepage section was changed. The specification and changelog were updated in the same local change.
