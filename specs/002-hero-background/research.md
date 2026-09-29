# Research and concept evaluation: Homepage hero background

**Created**: 2026-09-28 | **Updated**: 2026-09-29
**Issue**: [#62](https://github.com/shruggietech/shruggie-web/issues/62)
**State**: The owner selected Radar sweep after reviewing three face-free live concepts, then selected the above-copy mobile placement.

## Owner correction

The original Signal foundry prototype and its two alternatives incorporated face-like geometry. On 2026-09-29 the owner rejected that visual language as tacky and asked for all face-adjacent symbolism to leave the hero. The old concept PNGs, gallery, and selected scene have been removed from the working tree. The existing site logo in the navigation is outside the hero background and remains unchanged.

## Revised concepts

The `concepts/` directory preserves first, active, and settled desktop/mobile PNGs using the unchanged hero foreground. The owner also reviewed all three directions on live local routes with the actual site styles, copy, and navigation. After choosing Radar sweep, the owner compared three 390 × 844 live mobile placements and selected the complete scope above the copy. The temporary preview routes and generator were removed from the deliverable.

| Direction | Visual idea | Motion | Sketch evidence |
| --- | --- | --- | --- |
| Radar sweep | Offset range rings, asymmetric bearings, and three resolved returns form a specific scanning instrument. No icon or face is hidden in the scope. | One clockwise 360-degree arrival sweep and reveal in 1.4 seconds. Desktop mouse travel queues clockwise rotation with a 150-degree/second cap; mobile input does not move the scope. | [Radar desktop](concepts/radar-desktop-settled.png), [radar mobile](concepts/radar-mobile-settled.png) |
| Signal loom | Thirteen routed strands pass through registration guides and a moving shuttle. The result suggests systems woven together, not a generic dot network. | The live preview modulated strands slowly while visible, with a Pause waves control. | [Loom desktop](concepts/loom-desktop-settled.png), [loom mobile](concepts/loom-mobile-settled.png) |
| Lightwell | Offset translucent vertical fins frame a central light slit. It creates a spatial construction without a corridor or status card. | Fins and frame arrived once; direct mouse position shifted the fins and central slit subtly. | [Lightwell desktop](concepts/lightwell-desktop-settled.png), [lightwell mobile](concepts/lightwell-mobile-settled.png) |

The settled PNGs show the reduced-motion concept states, but the radar mobile sketch predates the owner's final above-copy placement. The delivered placement is defined by the homepage CSS and was checked in the production browser. SVG is present in server HTML without JavaScript; the text-safe veil is stable. None of these directions requires a new rendering dependency.

## Eight-criterion comparison

| Criterion | Radar sweep | Signal loom | Lightwell |
| --- | --- | --- | --- |
| Memorability | Clear circular instrument and directed scan. Radar is a known motif, so the asymmetric returns carry its identity. | Distinctive layered routed-strand pattern and registration line. | Strong architectural silhouette and central light slit. |
| ShruggieTech fit | Suggests finding useful signals in complex work; green-on-black visual language fits the site. | Suggests combining disparate systems into one delivery; uses restrained brand green. | Suggests clarity emerging from technical layers; uses the same restrained palette. |
| Technical credibility | Range geometry and annotated returns are internally consistent. | Paths have a coherent routing structure and measured guide spacing. | Repeated fins and beam follow a consistent perspective. |
| Text legibility | Right-weighted ring reaches near the headline edge, but the fixed veil keeps the copy clear. | Outer strands start behind the headline edge; the veil protects text, while the pattern stays visible on the right. | Angled planes stay right of the main copy except faint top/bottom framing. |
| Mobile behavior | The owner chose the complete scope above the copy after comparing it with the below-copy and right-edge-cropped placements. It is visible in the first screen and leaves the actions clear. | Retains repeated strands but loses some sense of horizontal routing. | Retains the light slit and fins but their detail is thin on narrow screens. |
| Accessibility | Static scope communicates the design in reduced motion or without JS; pointer response is optional. | Static woven pattern stands without animation; the preview loop has a visible pause control and stops for reduced motion or invisibility. | Static construction stands without animation; pointer response is optional. |
| Performance risk | Fixed SVG paths and one native arrival transform; pointer events run only during direct input. | Thirteen fixed paths with CSS transforms in the live preview, paused offscreen, hidden, or on request. The continuous preview motion requires explicit contract resolution if selected for delivery. | Seven fixed fins plus native arrival and direct-input transforms; no render loop. |
| Common-effect resemblance | Radar is recognizable and may feel familiar if motion/annotation are not distinctive. | Avoids the usual particle globe, dot mesh, and tunnel effects. | Layered glass can resemble a generic technology backdrop unless the proportions stay deliberate. |

**Decision**: The owner selected Radar sweep on 2026-09-29, then selected the complete scope above the mobile copy after reviewing three live placements. Loom, Lightwell, and the preview routes were removed from the release build. The radar's one-time 1.4-second intro is an owner-directed exception to the site's general 800 ms per-element rule. Final visual and performance acceptance remain open.

## Rendering decision

Inline SVG remains appropriate for the selected radar. The fixed geometry has no dependency on a Canvas frame loop, 3D runtime, image asset, or new runtime package. CSS performs a single 1.4-second clockwise revolution and reveals the full scene from darkness. After that, desktop mouse travel adds clockwise-only rotation through a bounded requestAnimationFrame queue, capped at 150 degrees per second and stopped when idle, offscreen, hidden, or reduced motion. Mobile has no pointer response. Loom's continuous modulation and Lightwell's parallax were explored only in temporary previews; neither ships.

## Remaining evidence

The original baseline and revised final build still need matched production performance runs against the website budget. Direct reduced-motion, no-JavaScript, forced-colors, first/active-frame, and constrained-device checks remain open. Field INP is unverified unless real field data becomes available. Do not close issue #62 on concept selection alone.
