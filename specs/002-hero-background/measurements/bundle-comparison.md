# S002 production bundle comparison

**Date**: 2026-09-29
**Baseline**: `origin/main` at `34a670d`, built in an isolated worktree
**S002**: `codex/62-hero-background-spec` at `83a5305`

Both states used the same lockfile, Node 26.5.0, and Next.js 16.3.4. Each was built with `npm run build` and served through `next start` on loopback. The browser asset inventory for `/` observed 19 JavaScript files and five stylesheets in each state. The table sums those corresponding built files and the generated `index.html`. Gzip figures compress each file independently with .NET `CompressionLevel.Optimal`; they are comparable size estimates, not measured network transfer or Lighthouse results.

| Homepage asset set | Baseline raw bytes | S002 raw bytes | Raw change | Baseline gzip bytes | S002 gzip bytes | Gzip change |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Generated HTML | 159,122 | 165,401 | +6,279 | 24,375 | 25,324 | +949 |
| 19 observed JavaScript files | 1,091,588 | 1,092,428 | +840 | 310,034 | 309,861 | -173 |
| Five observed stylesheets | 165,238 | 166,541 | +1,303 | 22,332 | 22,688 | +356 |
| **Total** | **1,415,948** | **1,424,370** | **+8,422** | **356,741** | **357,873** | **+1,132** |

The new complete desktop and mobile SVG compositions account for most of the HTML increase. The hero adds no runtime package, image asset, Canvas resolution scaling, or continuous animation loop. The 19 observed scripts were unchanged in count; one route chunk changed fingerprint. This comparison does not establish FCP, LCP, CLS, INP, Lighthouse score, low-power behavior, or production CDN transfer. Those acceptance checks remain open.
