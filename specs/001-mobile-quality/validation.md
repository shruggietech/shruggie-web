# Validation: mobile quality repair

## Review state

Code implementation and repository checks are complete in draft [PR #99](https://github.com/shruggietech/shruggie-web/pull/99). The default Lighthouse mobile budget remains unmet locally. Production acceptance on #96/#97/#31 remains open; no merge, production deployment, milestone closure or field-INP claim is made.

## Repository checks

- The standard Linux [CI run 35303019017](https://github.com/shruggietech/shruggie-web/actions/runs/35303019017) passes on source commit ee585d3f8472e8cbc431b1835115a8de2778407a: clean dependency installation, production dependency audit, lint, explicit TypeScript, complete unit/Firebase-emulator/publication tests, and optimized build.
- Seven contrast tests and 153 unit/editorial tests pass, including 13 new reveal lifecycle/navigation/consent regressions. Eight Firebase integration tests and one optimized-build publication/cache-convergence test pass.
- Local Windows lint, typecheck and optimized build pass with Next.js 16.3.4. Equivalent direct Node CLI invocation passes the complete production-publication test. The normal wrapper cannot launch npm.cmd on this Windows Node 24 host (EINVAL); independent maintenance [#98](https://github.com/shruggietech/shruggie-web/issues/98) records that remaining portability defect. Java 21 required a process-only nonexistent Unix-domain temp-path fallback for its loopback pipe; no OS settings changed.
- The high-severity production dependency audit passes with six pre-existing moderate findings covered by [#42](https://github.com/shruggietech/shruggie-web/issues/42).
- Offline font generation verifies original character coverage, retained glyph outlines, hinting, advances and vertical metrics, and byte-identical repeated output. Original full font files remain available for the complementary Unicode ranges. No runtime dependency is added.

## Measurement method and provenance

Baseline is unchanged main 5518abdfdd0e9c2b5c7018a593eef1f71be0e303; review is source ee585d3f8472e8cbc431b1835115a8de2778407a. Both are optimized builds served at the same localhost:3200 origin on the same Windows host. Node 24.11.1, Chrome 153 and Lighthouse 13.4.1 are unchanged. Each row contains three sequential fresh Chrome-profile navigations, with no concurrent builds or tests. Same route order and settings are used within each comparison. HTTP localhost differs from production HTTPS/CDN.

[measurements.json](measurements.json) retains every run, precise metric values, category scores, user agent, benchmark index, throttle configuration, fetch time, warnings/errors, transfer sizes and SHA-256 of its full LHR. Full JSON/HTML reports are retained under the task artifact directory mobile-quality-96-97; condensed evidence remains portable in this repository. All runs have no runtime errors or Lighthouse warnings. Intermediate failures are retained rather than excluded from a median.

Mobile benchmark medians are 2468.5 baseline versus 2463.5 review for simulation, and 2472 versus 2510 for applied throttling. Ranges are 1938.5-2547 / 2278.5-2535 and 2366.5-2539.5 / 2336-2557 respectively; host variability is retained and CPU multipliers are not adjusted between builds. Median measured font transfer falls from 169376 to 100156 bytes (about 41%).

The first five phases use Lighthouse's default simulated throttling. Mobile targets RTT 150ms, throughput 1638.4Kbps and CPU multiplier 4. The applied phases separately use DevTools request throttling: request latency 562.5ms, download 1474.56Kbps, upload 675Kbps, CPU multiplier 4. They are supplemental comparisons, not substitutions for the approved production gate. Neither lab method establishes real-user INP; TBT is diagnostic only.

The preliminary candidate-fonts trial had an incorrect extended-family stack and is not the reviewed source. candidate-inline-css corrected that stack but tried global stylesheet inlining; its worse result caused that flag to be rejected. The final review uses external CSS, the corrected full-glyph font stack, server-rendered Research and dark initial HTML.

## Default simulated mobile runs

| Build phase | Route | Scores 1 / 2 / 3 | LCP ms 1 / 2 / 3 | FCP ms 1 / 2 / 3 | CLS 1 / 2 / 3 |
| --- | --- | --- | --- | --- | --- |
| baseline | homepage | 85 / 77 / 78 | 4280 / 6060 / 6042 | 1064 / 1513 / 1512 | 0.000000 / 0.000000 / 0.000000 |
| baseline | services | 79 / 79 / 79 | 5580 / 5524 / 5576 | 1510 / 1510 / 1509 | 0.000000 / 0.000000 / 0.000000 |
| baseline | about | 79 / 79 / 79 | 5517 / 5466 / 5462 | 1056 / 1511 / 1511 | 0.000000 / 0.000000 / 0.000000 |
| baseline | work | 79 / 78 / 79 | 5759 / 5817 / 5660 | 1211 / 1209 / 1207 | 0.000000 / 0.000000 / 0.000000 |
| candidate | homepage | 88 / 88 / 88 | 3900 / 3842 / 3842 | 1519 / 1513 / 1512 | 0.000000 / 0.000000 / 0.000000 |
| candidate | services | 91 / 91 / 88 | 3403 / 3474 / 3915 | 1512 / 1510 / 1511 | 0.000000 / 0.000000 / 0.000000 |
| candidate | about | 89 / 89 / 89 | 3771 / 3772 / 3771 | 1511 / 1511 / 1509 | 0.000000 / 0.000000 / 0.000000 |
| candidate | work | 86 / 88 / 89 | 3937 / 3906 / 3760 | 1211 / 1209 / 1210 | 0.000210 / 0.000210 / 0.000210 |
| candidate-fonts | homepage | 91 / 91 / 92 | 3424 / 3434 / 3352 | 1209 / 1207 / 1207 | 0.000000 / 0.000000 / 0.000000 |
| candidate-fonts | services | 91 / 95 / 95 | 3436 / 2942 / 2864 | 1206 / 1207 / 1206 | 0.000000 / 0.000000 / 0.000000 |
| candidate-fonts | about | 91 / 91 / 91 | 3418 / 3456 / 3443 | 1207 / 1206 / 1209 | 0.000000 / 0.000000 / 0.000000 |
| candidate-fonts | work | 92 / 83 / 92 | 3292 / 4605 / 3286 | 1207 / 1733 / 1205 | 0.000000 / 0.000000 / 0.000000 |
| candidate-inline-css | homepage | 89 / 88 / 88 | 3717 / 3744 / 3733 | 1224 / 1237 / 1233 | 0.000000 / 0.000000 / 0.000000 |
| candidate-inline-css | services | 88 / 92 / 92 | 3805 / 3246 / 3242 | 1263 / 1263 / 1228 | 0.000000 / 0.000000 / 0.000000 |
| candidate-inline-css | about | 89 / 89 / 89 | 3743 / 3724 / 3718 | 1210 / 1223 / 1219 | 0.000000 / 0.000000 / 0.000000 |
| candidate-inline-css | work | 90 / 89 / 89 | 3678 / 3678 / 3693 | 1207 / 1208 / 1206 | 0.000210 / 0.000210 / 0.000210 |
| review | homepage | 91 / 92 / 91 | 3420 / 3361 / 3428 | 1369 / 1366 / 1360 | 0.000000 / 0.000000 / 0.000000 |
| review | services | 90 / 94 / 90 | 3580 / 3022 / 3564 | 1360 / 1360 / 1361 | 0.000000 / 0.000000 / 0.000000 |
| review | about | 90 / 90 / 90 | 3573 / 3531 / 3567 | 1362 / 1364 / 1363 | 0.000000 / 0.000000 / 0.000000 |
| review | work | 90 / 90 / 89 | 3587 / 3590 / 3687 | 1211 / 1210 / 1211 | 0.000210 / 0.000210 / 0.000210 |

The final review improves the median mobile score from 78/79/79/79 to 91/90/90/90 for homepage/Services/About/Work. Every final mobile LCP remains above 2500ms, and eight of twelve scores fail the strict >90 criterion. Every final FCP is below 1800ms and CLS below 0.1. These are improvements, not a restored production performance budget.

## Default simulated desktop runs

| Build phase | Route | Scores 1 / 2 / 3 | LCP ms 1 / 2 / 3 | FCP ms 1 / 2 / 3 | CLS 1 / 2 / 3 |
| --- | --- | --- | --- | --- | --- |
| baseline | homepage | 97 / 97 / 97 | 1233 / 1235 / 1233 | 332 / 332 / 332 | 0.000000 / 0.000000 / 0.000000 |
| baseline | services | 98 / 98 / 98 | 1144 / 1133 / 1134 | 331 / 329 / 329 | 0.000000 / 0.000000 / 0.000000 |
| baseline | about | 98 / 98 / 98 | 1115 / 1110 / 1120 | 331 / 331 / 332 | 0.000000 / 0.000000 / 0.000000 |
| baseline | work | 100 / 100 / 100 | 777 / 775 / 774 | 332 / 331 / 330 | 0.000000 / 0.000000 / 0.000000 |
| review | homepage | 100 / 100 / 100 | 786 / 786 / 780 | 332 / 333 / 332 | 0.000000 / 0.000000 / 0.000000 |
| review | services | 100 / 100 / 100 | 800 / 798 / 802 | 331 / 329 / 330 | 0.000000 / 0.000000 / 0.000000 |
| review | about | 100 / 100 / 100 | 775 / 784 / 753 | 332 / 331 / 331 | 0.000000 / 0.000000 / 0.000000 |
| review | work | 100 / 100 / 100 | 758 / 770 / 754 | 333 / 332 / 331 | 0.000035 / 0.000035 / 0.000035 |

All twelve final desktop runs meet the four numeric lab budgets. Intermediate desktop runs remain in the condensed evidence. Every final run on both profiles reports accessibility, SEO and best practices scores of 100; these automated results do not establish complete accessibility conformance.

## Supplemental applied mobile throttling

| Build phase | Route | Scores 1 / 2 / 3 | LCP ms 1 / 2 / 3 | FCP ms 1 / 2 / 3 | CLS 1 / 2 / 3 |
| --- | --- | --- | --- | --- | --- |
| baseline-applied | homepage | 63 / 58 / 59 | 5863 / 5943 / 5844 | 2077 / 1940 / 1824 | 0.000000 / 0.000000 / 0.000000 |
| baseline-applied | services | 62 / 61 / 62 | 5880 / 5701 / 5817 | 2027 / 2065 / 2014 | 0.000000 / 0.000000 / 0.000000 |
| baseline-applied | about | 64 / 60 / 60 | 5492 / 5441 / 5561 | 1789 / 1822 / 1808 | 0.000000 / 0.000000 / 0.000000 |
| baseline-applied | work | 67 / 71 / 69 | 5484 / 5513 / 5561 | 1898 / 2060 / 2058 | 0.000000 / 0.000000 / 0.000000 |
| review-applied | homepage | 80 / 80 / 80 | 2134 / 2138 / 2064 | 2134 / 2138 / 2064 | 0.000000 / 0.000000 / 0.000000 |
| review-applied | services | 80 / 82 / 79 | 2042 / 1961 / 1925 | 2042 / 1961 / 1925 | 0.000000 / 0.000000 / 0.000000 |
| review-applied | about | 86 / 85 / 87 | 1928 / 1987 / 1939 | 1928 / 1987 / 1939 | 0.000000 / 0.000000 / 0.000000 |
| review-applied | work | 89 / 89 / 93 | 2112 / 2082 / 2087 | 2112 / 2082 / 2087 | 0.000210 / 0.000210 / 0.000210 |

Compare baseline and review within this method. These scores are not directly comparable to the simulated table and cannot satisfy the final production gate.

Applied review runs exceed the LCP budget in 0/12 runs, the FCP budget in 12/12, and fail the strict score criterion in 11/12. These results also do not certify the performance repair.

In applied homepage run 1, baseline FCP/LCP are 2077/5863ms and review FCP/LCP are both 2134ms: the hero paragraph no longer waits for an entrance after first paint. Remaining review dependencies are HTML completion around 759ms, three render-blocking CSS transfers finishing around 1239-1822ms, and prepaint document/layout work at 1843-2068ms. Mono finishes at 3403ms, after this actual hero LCP. Review TBT 649ms is chiefly attributed to ReactDOM (~349ms blocking), Next app-router (~117ms) and post-FCP document tasks (~132ms). These URL/task attributions do not identify individual responsible components. Offscreen animation is a plausible efficiency follow-up, but these reports do not establish it as the current TBT cause; no speculative renderer change is included.

## Trace interpretation

For review homepage-mobile-2, captured FCP/LCP are both 209ms, while simulated FCP/LCP are 1366/3361ms. Installed Lighthouse 13.4.1 uses raw trace-engine timings for the LCP breakdown insight and Lantern's dependency simulations for scored metrics. Resources completing before observed LCP can become simulated dependencies; on fast localhost, five fonts and twelve initial scripts finish before that paint. This explains the differing timings and motivates the separate applied comparison. It is not proof of what production mobile visitors see, and the failed simulated results remain binding evidence. See [Lighthouse's official throttling documentation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md).

## Browser and initial-HTML checks

- Actual optimized-server responses for all four routes return 200. Parsing with scripts disabled retains nonempty headings, supporting text and links; hero ancestors have no opacity-zero/translated initial markup. Server HTML carries the required dark class. This is server-response/DOM evidence, not a scripting-disabled physical-device screenshot.
- Browser checks at 320px and 390px confirm no horizontal overflow and seven stable 44-by-44px carousel targets with decorative 8px dots. Click and Enter select the expected service/work cards and show the 2px focus outline.
- Services process expansion shows its corresponding content; client navigation to About retains immediately visible hero text. Desktop About/Work at 1280px retain visible heroes and natural layouts.
- Blog light/dark preference survives reload and navigation; non-blog routes remain dark. The initial light preference was restored after testing. The computed body font stack places the original extended face before Next's metric fallback.
- Synthetic touch events verify retained swipe behavior in regression tests. Initial/live reduced-motion handling, focus, missing APIs, cancellation, cleanup and StrictMode effect replay are unit-tested. No physical phone gesture or OS-level reduced-motion emulation is claimed.

## Preview and release gates

Vercel successfully built source ee585d3 as preview deployment 6PMSaj93SgAScHK5rQ6j2jceHPQM. Its alias redirects unauthenticated requests to Vercel sign-in; that response is not audited as site content. Preview performance/interaction checks remain pending authorized access. Protection settings were not changed.

#96 remains incomplete until the approved final-production measurements pass and all runs/deployment evidence are disclosed. #97 has implemented controls and links with local regression/browser evidence, but its final production verification is still pending. #31's child checkboxes and milestone remain open. The unavailable field-data gate is separate from these lab checks.
