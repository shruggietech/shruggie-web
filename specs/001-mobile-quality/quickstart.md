# Validation guide

1. Run `npm run test:editorial -- tests/scroll-reveal.test.tsx tests/mobile-navigation.test.tsx` for targeted rendering, lifecycle, selection and consent checks.
2. Run `npm run lint`, `npx tsc --noEmit`, `npm run test:all`, and `npm run build` for repository gates.
3. Serve the optimized build with `npm run start -- --port 3200` and compare it with the unchanged build under identical Lighthouse 13.4.1 mobile/desktop settings. Retain three sequential cold runs per route/profile with every value and warning.
4. Verify `/`, `/services`, `/about`, `/work` at mobile/desktop widths, with reduced motion and saved blog theme preferences. Initial content remains visible; below-viewport content reveals once; native navigation and focus work.
5. Disable scripting or inspect the initial server-rendered HTML. No reveal wrapper starts with a hidden opacity/transform. Unsupported animation/observation APIs must fail open.
6. Check all mobile pagination bounds are at least 44px square. Select each card by keyboard, touch/click, and swipe; inspect service/privacy link names and consent dismissal.
7. Keep #96/#97 and #31 open until final production checks pass. Navigation TBT is diagnostic and does not establish real-user INP.
