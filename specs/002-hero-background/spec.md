# Feature Specification: Homepage hero digital environment

**Feature Branch**: `codex/62-hero-background-spec`
**Created**: 2026-09-28
**Status**: Radar and above-copy mobile placement selected; performance and remaining acceptance gates remain open
**Input**: [Issue #62](https://github.com/shruggietech/shruggie-web/issues/62), "reimagine the hero background experience."

## Scope and authority

Issue #62 is the sole delivery issue in this slice. It has no blocking issue dependency. Coordinate with the still-open homepage performance work in [#31](https://github.com/shruggietech/shruggie-web/issues/31); [#21](https://github.com/shruggietech/shruggie-web/issues/21) is complete and its product section remains untouched.

Only the homepage welcome area's decorative background and the minimum hero-local safe-zone or spacing changes needed to keep foreground content readable are in scope. Preserve the current server-rendered headline, supporting copy, both CTA labels, their links, navigation, and the rest of the homepage. No shared animation kit, unrelated route animation, stock scene, or copied library demo is part of this slice.

The website specification currently describes a slow looping gradient for this hero while its general motion rules prohibit infinite loops. The implementing change must replace that stale visual description with the selected, bounded behavior in the same delivery. It must not quietly loosen the general motion rules. The current implementation and specification also disagree about hero copy. Per the owner's 2026-09-28 direction, update the documentation to match the unchanged rendered copy in the same delivery.

## User Scenarios & Testing

### User Story 1 - Understand the site on arrival (Priority: P1)

A first-time visitor sees a distinctive ShruggieTech digital environment reach a composed state while the existing headline, support text, and actions are readable immediately.

**Why this priority**: The current first frame is mostly uniform darkness, so the intended first impression depends on discovering a pointer effect.

**Independent Test**: Open the homepage without moving a pointer at desktop and mobile widths. Observe the first frame, the arrival, and the settled state while reading and activating both CTAs.

**Acceptance Scenarios**:

1. **Given** a cold homepage load, **when** the hero first appears, **then** its meaning and actions are readable before decorative motion completes.
2. **Given** no pointer movement, **when** the arrival completes, **then** a visually composed digital construction or assembly is visible within five seconds.
3. **Given** any supported breakpoint, **when** the background changes, **then** the foreground safe zone and both actions remain clear and usable.

### User Story 2 - Receive an intentional experience in every mode (Priority: P1)

A visitor using touch, keyboard, reduced motion, or no JavaScript receives a deliberate visual state without needing hover or animation to understand the page.

**Why this priority**: The existing experience depends heavily on cursor discovery and substitutes ambient drift on touch devices.

**Independent Test**: Compare touch, keyboard-only, reduced-motion, no-JavaScript, and failed-renderer views at representative widths.

**Acceptance Scenarios**:

1. **Given** a touch or keyboard-only visit, **when** the hero settles, **then** it presents the same core visual idea without a cursor.
2. **Given** reduced motion or a live preference change, **when** the hero loads or changes state, **then** a composed static or near-static state appears without playing the full arrival.
3. **Given** unavailable JavaScript, visual assets, or rendering capability, **when** the homepage loads, **then** the foreground remains readable over an intentional static background.

### User Story 3 - Keep the experience responsive and calm (Priority: P2)

The background reacts meaningfully to direct interaction, settles afterward, and stops work when it cannot be seen.

**Why this priority**: A permanent animation loop and uncapped rendering can undermine the homepage's measured performance and comfort.

**Independent Test**: Observe rendering activity when idle, offscreen, hidden, resized, and on a constrained mobile profile; compare production measurements before and after the change.

**Acceptance Scenarios**:

1. **Given** a settled hero with no input, **when** it remains idle, **then** decorative animation stops.
2. **Given** the hero leaves the viewport or the tab becomes hidden, **when** visibility changes, **then** visual work pauses and resumes only when needed.
3. **Given** a small or weak device, **when** the hero loads or resizes, **then** it keeps content stable and degrades visual complexity before disrupting input or reading.

### Edge Cases

- A visitor can change reduced-motion preference after the arrival begins.
- A visitor can resize or rotate the device mid-sequence without a blank or shifted hero.
- A renderer or optional visual asset can fail after initial paint.
- Touch hardware can also report a mouse; the experience must follow the actual input, not a one-time device label.
- A restored scroll position can start below the hero.
- High contrast and forced-colors modes must leave semantic content and controls usable.

## Requirements

### Functional Requirements

- **FR-001**: Compare at least three materially different low-cost concept sketches or prototypes from issue #62 before selecting the final scene. Record the comparison across memorability, ShruggieTech specificity, technical credibility, text legibility, mobile behavior, accessibility, performance risk, and resemblance to common agency effects.
- **FR-002**: Record the selected concept and rendering approach, rejected alternatives, and dependency impact before full implementation. Any new 3D or animation dependency requires prototype evidence that the installed approaches cannot deliver the selected concept.
- **FR-003**: The background must establish a recognizable, face-free radar instrument and reach an intentionally composed state without pointer discovery.
- **FR-004**: Existing hero copy and actions must remain immediately readable, semantic, and operable above a decorative, non-interactive visual at every supported width and throughout the arrival.
- **FR-005**: The scene must use a near-black base, restrained brand green, and at most rare orange accents. A stable foreground safe zone must maintain applicable WCAG 2.2 AA contrast in every visual state.
- **FR-006**: Touch and keyboard-only visitors must receive an intentional composed experience. Desktop mouse travel may advance the radar sweep only clockwise, with a bounded queue and angular speed; moving the mouse in the opposite direction cannot reverse it. Mobile has no pointer-controlled radar movement. Optional pointer response must not hide essential brand meaning.
- **FR-007**: Reduced-motion visitors must receive a composed static or near-static state. Disabled JavaScript and visual failures must retain a deliberate static presentation and fully usable foreground content.
- **FR-008**: The selected radar performs exactly one automatic clockwise revolution while the complete scene reveals from darkness within 1.5 seconds of load. This 1.4-second radar intro is the owner's specific exception to the general 800 ms per-element duration limit; all other motion retains that limit. The radar rests after the intro, with no infinite automatic loop. Reduced motion skips the intro.
- **FR-009**: The background must stop visual work when idle, outside the viewport, or in a hidden document, and must limit complexity on small or constrained devices without shifting layout.
- **FR-010**: The delivery must update the authoritative homepage visual description in `ShruggieTech_Website_Specification.md` at the same time as the code, align that document's stale hero copy with the unchanged rendered copy, and record the owner's specific 1.4-second radar-intro exception to the general motion rule.
- **FR-011**: The implementation must preserve the existing homepage route structure and must not cause horizontal overflow, blocked interaction, focus regression, console errors, or hydration errors.
- **FR-012**: The hero background and its concept artifacts must contain no face-like, smile-like, eye-like, or mascot-adjacent motif. The owner's 2026-09-29 correction supersedes the original concept selection.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Three distinct concept sketches or prototypes are reviewed with the eight criteria in FR-001, and one direction plus renderer is selected with a written rationale.
- **SC-002**: In desktop, mobile, touch, keyboard-only, reduced-motion, no-JavaScript, high-contrast, and failure-state checks, the existing headline and both CTAs are visible and usable before and after the background settles.
- **SC-003**: The radar communicates its digital idea on first arrival without hover or face-adjacent symbolism, completes one clockwise revolution and the reveal within 1.5 seconds, then rests until desktop pointer input advances it. Pointer input never reverses the bearing or exceeds the speed cap.
- **SC-004**: No continuous visual work remains after settling or while the hero is offscreen or the document is hidden; resize and rotation produce no layout shift or horizontal overflow.
- **SC-005**: Before/after production-build evidence is recorded for mobile and desktop, including a constrained profile, bundle cost, Lighthouse Performance > 90, LCP < 2.5 s, INP < 200 ms where field data exists, CLS < 0.1, and FCP < 1.8 s. Unavailable field INP is explicitly reported as unverified, not substituted with a synthetic value.
- **SC-006**: Applicable WCAG 2.2 AA contrast and motion behavior pass representative first, active, settled, reduced-motion, and high-contrast states.
- **SC-007**: Required build, typecheck, lint, and test checks pass; automated tests cover deterministic lifecycle and fallback behavior where practical.

## Assumptions

- The owner selected Radar sweep on 2026-09-29 after comparing three revised face-free live concepts, then chose the complete scope above the mobile copy from three live placements.
- The first prototype can use the current lightweight rendering stack; a different renderer must win on observed concept and cost evidence.
- The hero's visible copy, labels, destinations, and navigation are fixed by issue #62's scope. The owner approved correcting the drifted documentation to match the current rendering on 2026-09-28.
- Production performance evidence must distinguish controlled lab results from unavailable field data.
