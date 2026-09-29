# Research: Production mobile quality repair

**Date**: 2026-09-17

## Initial rendering

**Decision**: Render hero primitives without an animation/client boundary and keep shared reveal HTML visible by default.

**Rationale**: The installed Next.js server/client-component guide confirms that HTML supplies the immediate first-load preview. Existing opacity-zero wrappers hide that preview until client execution. Production and controlled local audits identify delayed text LCP.

**Alternatives considered**: Removing only homepage reveals misses shared inner-page and first-card candidates. Setting a visibility flag during hydration still ships unnecessary reveal runtime and can hide restored-position content. Replacing the background renderer is outside #96 and belongs to #62.

## Progressive reveal lifecycle

**Decision**: Use native observation/animation only for wrappers initially below the viewport. Prefer zero observer margin, restore inline styles on cleanup/error/cancellation, and reveal immediately on focus or reduced-motion changes.

**Rationale**: The bounded research review identified permanently hidden short last-page content with a negative observer margin and invisible focus if pending content is not restored. Animation cancellation rejects the finished promise, so use completion/cancellation handlers rather than an unhandled promise.

**Alternatives considered**: Retaining initial opacity-zero Motion markup fails no-JavaScript readability. Animating already-visible content creates a visible-to-hidden transition. A continuously running rendering loop is unnecessary for entrance effects.

Sources: [React effects](https://react.dev/reference/react/useEffect), [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [Animation cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel), and installed Next.js 16.3.4 server/client and lazy-loading guides.

## Navigation

**Decision**: Give dots stable 44px button boxes with decorative 8px/24px selected spans. Use destination-specific service names and Privacy policy copy.

**Rationale**: The expanded production audit pinpoints undersized pagination buttons and generic service/privacy labels. Separating visual dots from hit areas preserves the established treatment and selected-state layout.

**Alternatives considered**: Scaling the dots alone changes the visual treatment; rebuilding swipe logic would expand risk without addressing a required outcome.

## Rendering follow-up

The first 24-run controlled candidate improves reveal delay and accessibility, but still fails simulated mobile LCP. A second font trial reduces common font transfers but still leaves a blocking stylesheet waterfall. Add compact Latin Geist faces with unchanged mappings, outline geometry, hinting, advance widths, and vertical metrics; original files provide all excluded glyphs through complementary Unicode ranges. Keep the original faces ahead of Next's metric-adjusted fallback by composing the public `style.fontFamily` export, avoiding private generated names. The offline generator uses fonttools 4.65.0; no production dependency is added.

Installed Next.js `inlineCss.md` documents global production-only stylesheet inlining. A separately measured trial tested removal of cold-visit render-blocking requests, with CSS repeated in HTML/RSC instead of cached independently. The experimental flag was rejected after the repeated comparison below; it is absent from the proposed code.

## CSS experiment rejected

The inline-CSS variant did not restore mobile LCP and increased initial document/CPU cost. The review source retains external stylesheet caching. ResearchSection is server-rendered and reuses the progressive reveal for its decorative background. Server HTML defaults to the existing mandatory dark theme so scripting-disabled content retains contrast; the pre-paint blog cookie script remains authoritative when scripting is available.

## Measurement interpretation and unresolved gate

The default simulated review runs improve rendering scores but retain mobile LCP failures. Installed Lighthouse 13.4.1 uses observed trace timings in the LCP breakdown and Lantern dependency simulations for scored metrics; fast localhost completion can put additional font/script transfers into the simulated LCP graph. A second controlled baseline/review comparison uses applied DevTools network/CPU throttling to inspect that distinction. Its settings and results are reported separately: neither method replaces final production evidence, and the default-simulation failures remain visible. See [official Lighthouse throttling documentation](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md) and [validation.md](validation.md).

PR #99's HTTPS preview is successfully built but requires Vercel sign-in. Authorized preview access and passing final production measurements remain open work on #96/#97/#31. No protection setting was changed, and no production budget or field-INP success is claimed.

## Completion decisions and transport correction

- Move the exact authoritative Knoxville artwork to an offline component and generate lazy SVG crops. Both assets match the original rendered desktop/mobile markup byte for byte. Main-document window-grid hydration is removed without changing geometry, color or placement; SVG parsing/painting occurs inside the loaded image instead.
- Use native one-time illustration observation and CSS accordion grid/opacity transitions. Preserve initial/live reduced-motion behavior, failure cleanup, one selected phase, diagram state, matching panel IDs and inert inactive panels. Scope reduced-motion suppression to every process control/diagram transition. This removes the shared general animation runtime from these components, while retaining it for unrelated interactions.
- Generate all five common font faces with standard shaping/kerning and licensing metadata. Original files retain every excluded character before system fallbacks. Include the site's macron: excluding it in the first English trial triggered a full original-face request. Verify geometry, hinting, metrics, complete character coverage and repeated byte-identical generation. Preload the compact site-wide monospace face because the shared footer and proof labels use it; the old blog-only/on-demand statement was inaccurate.
- Restrict Tailwind detection to runtime templates/content, so planning examples cannot enlarge shipped CSS. See [official Tailwind source-detection documentation](https://tailwindcss.com/docs/detecting-classes-in-source-files). Preserve external stylesheet caching. Graph grouping, footer content-visibility, and a CSS-inlining retry after skyline removal did not restore the measured gate, and are rejected. Focused failures are retained.
- The original production LHR proves every recorded request uses h2; local next start records HTTP/1.1. Lantern models their connection queues differently. Add a paired controlled HTTP/2 comparison with the identical numeric budget and simulated throttling, rather than substituting raw timings or adjusting multipliers. The disposable loopback proxy/certificate exception is explicitly disclosed; no system trust or external protection is changed. Retain all original HTTP/1.1 and supplemental applied results. Final production acceptance still requires deployed production evidence; local transport matching cannot close that gate.

The exact reviewed source and every repeated metric are recorded in [validation.md](validation.md). Opening the protected preview through an existing browser session was rejected by automatic approval review for lack of explicit session-access authorization; that authorization is requested, and no workaround is attempted.
