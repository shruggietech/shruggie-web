# Research and concept evaluation brief: Hero background

**Date**: 2026-09-28
**Status**: Three low-cost sketches rendered and compared on 2026-09-28. Signal foundry selected as the implementation direction; live-site validation remains open.
**Source**: [Issue #62](https://github.com/shruggietech/shruggie-web/issues/62), current `HeroBackground.tsx`, and the website specification.

## Current evidence

- `components/home/HeroBackground.tsx` is a 708-line Canvas 2D component. Its draw function requests another frame whenever reduced motion is off. The lifecycle has resize and motion listeners but no viewport/visibility pause, and resolution uses uncapped device pixel ratio.
- `components/home/HeroSection.tsx` keeps text and CTAs in semantic server-rendered markup above an `aria-hidden` canvas. That layering should remain.
- `ShruggieTech_Website_Specification.md` section 6.1 still calls for a slowly looping gradient, while section 2.5 prohibits infinite loops and animations over 800 ms per element. The live hero copy also differs from section 6.1. Owner direction is to align documentation to the unchanged rendered copy during implementation.
- The repository already installs `framer-motion` and `gsap`. A new renderer or animation package carries bundle and lifecycle costs that need prototype evidence.
- No matched baseline measurements are available. The local Lighthouse invocation was rejected by automatic command policy before it ran, so the before/after performance gate remains open in [validation.md](validation.md).

## Three distinct sketches and their states

The self-contained [concept preview](concepts.html) and [render script](render-concepts.mjs) produce first, arrival, settled, and mobile states with the unchanged hero text. The rendered PNGs in `concepts/` are low-cost visual sketches, not production screenshots. They use a system font and approximate foreground spacing, so the selected scene still requires in-browser verification with the actual site styles. The settled state doubles as the reduced-motion sketch because no additional motion is needed to understand it.

| Candidate | Low-cost sketch brief | Distinguishing question | First renderer hypothesis |
| --- | --- | --- | --- |
| Signal foundry | Sparse points, vectors, and translucent planes enter from separate origins and connect into an asymmetric ShruggieTech signature to the right of the copy. Nearby construction layers respond to pointer input after settling. | Can an original brand signature feel like a functioning system rather than a particle-logo reveal? | Refactored Canvas 2D; use installed GSAP only if a staged sequence cannot stay clear as plain scene state. |
| Liminal systems atrium | Nested perspective frames and data planes resolve toward a distant focal surface, while a deliberately quiet foreground corridor protects the text. A small brand-specific structural detail appears at the focal plane. | Can apparent depth and a memorable room be made legible and fast without a 3D runtime? | CSS/SVG or Canvas 2D with 2.5D projection. |
| Compile field | Separate fragments transition through source-like marks, graph connections, and a resolved architectural form. The final state communicates assembly without fake terminal output or falling code. | Can the sequence convey technical craft within the motion duration rules and without explanatory text? | Canvas 2D or a modest SVG scene using installed motion facilities. |

The phase-blueprint idea from issue #62 remains available as a refinement or replacement if one of these sketches proves weak. Combining candidates is allowed only if the resulting composition has one clear visual idea.

## Comparison protocol and decision record

The three sketches use identical bounds and unchanged copy with approximate foreground spacing. The following comparison records concrete observations rather than invented numeric scores. Production-page visual checks are separately recorded in [validation.md](validation.md).

| Criterion | Evidence to record |
| --- | --- |
| Memorability | What remains recognizable in the composed state without motion? |
| Brand fit | Which geometry, colors, or signature makes it specifically ShruggieTech? |
| Technical credibility | Does the construction read as an intentional system rather than generic particles? |
| Text legibility | Do first, active, and settled frames preserve contrast and scan order? |
| Mobile behavior | Does the narrow crop retain the idea without crowding copy? |
| Accessibility | Are reduced-motion, high-contrast, no-JS, touch, and keyboard states coherent? |
| Performance risk | What work runs, what pauses, and what ships to the client? |
| Trope similarity | Does it resemble a common agency grid, globe, star field, or demo? |

### Observed comparison

| Criterion | Signal foundry | Systems atrium | Compile field |
| --- | --- | --- | --- |
| Memorability | The connected asymmetrical structure and resolved shruggie face remain legible at rest. | The nested impossible room has stronger depth but its central face is a small insert. | The three-stage diagram is readable but resembles a product workflow illustration. |
| Brand fit | The signature is assembled from network joints, not pasted over the background. | The signature is placed on a distant panel. | The signature is placed in a final status panel. |
| Technical credibility | Distinct signals converge into a constrained structural node system. | Perspective geometry suggests a built environment, but does not explain its construction. | Source-to-graph-to-result progression is explicit, though more explanatory than immersive. |
| Text legibility | Right-weighted geometry leaves the left safe zone dark in first, active, and settled sketches. | The room stays on the right but its outer frames approach the headline edge. | The bright final panel stays behind the right side but its rectangular edge attracts attention near the copy. |
| Mobile behavior | The composition can be cropped to a recognizable lower-page emblem beneath the CTAs. | The mobile crop preserves the room, though detail becomes thin. | The mobile crop retains the diagram but looks like a small card. |
| Accessibility | A complete static state works without motion; no visual meaning needs pointer input. | Same static advantage, but thin frames may disappear in high contrast. | Same static advantage, with the clearest state progression if animation is removed. |
| Performance risk | A modest fixed vector scene supports a small client enhancement with no frame loop. | A modest fixed vector scene, but perspective movement could encourage heavier transforms. | Lowest geometry cost, with little reason for a dedicated renderer. |
| Trope similarity | Network lines are a common motif, so the implementation must preserve the unusual brand-specific assembly and avoid a generic dot grid. | Closest to a conventional neon wireframe corridor. | Closest to a familiar software architecture diagram. |

**Selection**: Signal foundry. Keep the settled geometric signature visible on first paint, then enhance only a few construction layers with a bounded arrival. The initial sketch's generic network lines are a risk; refine them into distinct signal routes and translucent planes so the scene reads as a constructed system rather than another particle background. The mobile scene belongs below the preserved copy and CTAs, not as a shrunken desktop canvas.

**Renderer decision**: Use semantic-independent inline SVG with CSS for the static first paint and the Web Animations API for optional, short progressive assembly and direct-input response. The geometry count is small and fixed, so extending the current 708-line Canvas 2D renderer would retain drawing/lifecycle complexity without a needed capability. Existing `framer-motion` and GSAP would add animation runtime to this hero for effects supported by native browser APIs. React Three Fiber, Lottie, and Rive add a runtime or asset pipeline without evidence of a spatial or authored-asset need. No new dependency is selected. If implementation evidence invalidates this choice, re-open the decision before broadening the stack.

## Existing architecture and contract choices

- Preserve `HeroSection`'s semantic text and links; the background remains decorative and pointer-transparent.
- Use a durable static scene or CSS layer for the first paint and no-JavaScript path. A client renderer may enrich it without causing layout shift.
- Separate scene description/state, drawing, input, and lifecycle if Canvas continues. The 708-line monolith should not be extended in place without boundaries.
- Default to a bounded arrival, then only input-triggered redraws. Stop when idle, offscreen, hidden, or reduced motion. A single animation element must finish within the specification's 800 ms limit; the full scene may stage several such elements but settles within five seconds.
- Cap pixel ratio and geometry density by observed cost, with a lower-complexity path for small/constrained devices. Do not assume device class from touch support alone.
- Keep WebGL context-loss handling and a static non-WebGL fallback conditional on selecting a WebGL renderer; do not add that infrastructure for a 2D scene.

## Verification evidence to collect during implementation

Capture a baseline and final production build with the same Lighthouse/device/network settings and three cold runs per mobile and desktop profile. Include one constrained profile, JS and transferred bundle comparison, relevant performance traces, and screenshots of the required visual states. Report median and individual runs. Record field INP only if field data is available; otherwise mark it unverified. Check the exact issue #62 acceptance list before any issue closure.
