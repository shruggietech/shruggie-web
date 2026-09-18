# Validation: mobile quality repair

## Current review state

Implementation prepared; final repeated comparison and PR preview verification are in progress. Production acceptance on #96/#97/#31 remains open. This document will retain every measured run and failed variant.

## Repository checks

- Lint, explicit TypeScript check, and optimized production build pass with installed Next.js 16.3.4.
- Seven contrast tests and 153 unit/editorial tests pass, including 13 new lifecycle/navigation/consent regressions.
- Firebase integration: eight tests pass against demo auth/Firestore/Storage emulators.
- Optimized-build production publication: one complete publication/cache-convergence test passes through equivalent direct Node CLI invocations on Windows.
- The normal publication wrapper cannot launch `npm.cmd` on this Windows Node 24 host (`EINVAL`); tracked separately in #98. The standard Linux CI command will also be verified on this PR. Java 21 needed a process-only nonexistent Unix-domain temp-path fallback to establish its loopback pipe; no OS settings were changed.
- Production dependency audit passes the high-severity gate with six pre-existing moderate findings, already covered by #42's documented Firebase upstream follow-up.
- Offline font generator verifies all retained glyph outlines, hinting, advances and vertical metrics, complete original character coverage, and byte-identical repeated output. No runtime dependency is added.

## Measurement boundaries

Same host, port 3200, Node 24.11.1, Chrome 153, Lighthouse 13.4.1; three sequential cold profiles per route/profile. Baseline is the unchanged optimized build at main 5518abdfdd0e9c2b5c7018a593eef1f71be0e303. Local HTTP delivery differs from production HTTPS/CDN; local data establishes a controlled comparison, not the final production release gate. The reveal-only, preliminary font, and rejected inline-CSS experiments are retained. Navigation TBT is diagnostic and cannot establish field INP.
