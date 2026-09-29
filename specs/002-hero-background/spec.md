# Feature Specification: Homepage hero digital environment

**Feature Branch**: `codex/62-hero-background-spec`
**Created**: 2026-09-28
**Status**: Radar and above-copy mobile placement selected; performance and remaining acceptance gates remain open
**Input**: [Issue #62](https://github.com/shruggietech/shruggie-web/issues/62), "reimagine the hero background experience."

## Scope and authority

Issue #62 is the sole delivery issue in this slice. It has no blocking issue dependency. Coordinate with the still-open homepage performance work in [#31](https://github.com/shruggietech/shruggie-web/issues/31); [#21](https://github.com/shruggietech/shruggie-web/issues/21) is complete and its product section remains untouched.

Only the homepage welcome area's decorative background and the minimum hero-local safe-zone or spacing changes needed to keep foreground content readable are in scope. Preserve the current server-rendered headline, supporting copy, both CTA labels, their links, navigation, and the rest of the homepage. No shared animation kit, unrelated route animation, stock scene, or copied library demo is part of this slice.

The owner's latest direction replaces the pointer-driven, one-turn radar with a slower autonomous sweep that continues beyond the 1.5-second fade. The owner declined a visible pause button and selected a hidden click target inside the radar's three innermost rings. Hover temporarily inverts the saved click state after a short delay. The website specification's general duration and looping limits need a narrow radar exception. The current implementation and specification also disagree about hero copy. Per the owner's 2026-09-28 direction, update the documentation to match the unchanged rendered copy in the same delivery.

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

### User Story 3 - Keep the continuous sweep calm (Priority: P2)

The radar sweeps autonomously at a steady speed. Visitors can stop or resume it through the center rings, and visual work stops when it cannot be seen.

**Why this priority**: The owner-selected continuous sweep must respect reduced-motion settings and avoid work offscreen or in a hidden tab.

**Independent Test**: Observe the sweep after the fade, click or tap the three inner rings, hover over and leave that region before and after toggling, use Enter and Space with keyboard focus, then check offscreen, hidden, resized, and constrained mobile states.

**Acceptance Scenarios**:

1. **Given** the fade is complete, **when** the hero remains visible, **then** the sweep continues at a steady speed without pointer steering. Clicking or keyboard-activating the center toggles the saved state; hovering there for 200ms temporarily applies the opposite state until pointer leave.
2. **Given** the hero leaves the viewport or the tab becomes hidden, **when** visibility changes, **then** visual work pauses and resumes only when visible.
3. **Given** a small or weak device, **when** the hero loads or resizes, **then** it keeps content stable and degrades visual complexity before disrupting input or reading.

### Edge Cases

- A visitor can change reduced-motion preference after the arrival begins.
- A visitor can resize or rotate the device mid-sequence without a blank or shifted hero.
- A renderer or optional visual asset can fail after initial paint.
- Mouse and touch movement must not alter sweep direction or speed; desktop hover over the three inner rings may temporarily invert the running state after 200ms.
- A restored scroll position can start below the hero.
- High contrast and forced-colors modes must leave semantic content and controls usable.

## Requirements

### Functional Requirements

- **FR-001**: Compare at least three materially different low-cost concept sketches or prototypes from issue #62 before selecting the final scene. Record the comparison across memorability, ShruggieTech specificity, technical credibility, text legibility, mobile behavior, accessibility, performance risk, and resemblance to common agency effects.
- **FR-002**: Record the selected concept and rendering approach, rejected alternatives, and dependency impact before full implementation. Any new 3D or animation dependency requires prototype evidence that the installed approaches cannot deliver the selected concept.
- **FR-003**: The background must establish a recognizable, face-free radar instrument and reach an intentionally composed state without pointer discovery.
- **FR-004**: Existing hero copy and actions must remain immediately readable, semantic, and operable above the decorative visual at every supported width and throughout the arrival. Only the three inner rings may intercept input for motion control.
- **FR-005**: The scene must use a near-black base, restrained brand green, and at most rare orange accents. A stable foreground safe zone must maintain applicable WCAG 2.2 AA contrast in every visual state.
- **FR-006**: Touch and keyboard-only visitors must receive the same autonomous radar idea. Pointer travel must not steer, reverse, or accelerate the sweep. Tap/click or keyboard activation within the three inner rings toggles motion; desktop hover there temporarily inverts the saved state after 200ms. Touch must not trigger hover inversion.
- **FR-007**: Reduced-motion visitors must receive a composed static or near-static state. Disabled JavaScript and visual failures must retain a deliberate static presentation and fully usable foreground content.
- **FR-008**: The complete scope must fade in from darkness within 1.5 seconds. Independently, the sweep rotates clockwise at a steady six seconds per revolution and continues while the hero is visible. The center control must not appear as a visible pause button, but it must have an accessible action name, a focus-visible indicator, and Enter/Space activation. Reduced motion displays a static composed scope with no fade or sweep. The fade and sweep are narrow owner-directed exceptions to the site's general 800 ms duration and no-infinite-loop rules.
- **FR-009**: The continuous sweep must pause outside the viewport or in a hidden document, and must limit complexity on small or constrained devices without shifting layout. Without JavaScript or observation support, the radar must remain static and readable.
- **FR-010**: The delivery must update the authoritative homepage visual description in `ShruggieTech_Website_Specification.md` at the same time as the code, align that document's stale hero copy with the unchanged rendered copy, and record the owner's specific continuous-radar exception to the general motion rules.
- **FR-011**: The implementation must preserve the existing homepage route structure and must not cause horizontal overflow, blocked interaction, focus regression, console errors, or hydration errors.
- **FR-012**: The hero background and its concept artifacts must contain no face-like, smile-like, eye-like, or mascot-adjacent motif. The owner's 2026-09-29 correction supersedes the original concept selection.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Three distinct concept sketches or prototypes are reviewed with the eight criteria in FR-001, and one direction plus renderer is selected with a written rationale.
- **SC-002**: In desktop, mobile, touch, keyboard-only, reduced-motion, no-JavaScript, high-contrast, and failure-state checks, the existing headline and both CTAs are visible and usable before and after the background fades in and while the sweep continues.
- **SC-003**: The radar communicates its digital idea without face-adjacent symbolism. The scope fades in within 1.5 seconds while its independent six-second clockwise sweep continues beyond that fade. The center region toggles the saved motion state on click/tap/keyboard activation, and hover temporarily inverts that state after 200ms; pointer movement does not steer the bearing. No visible pause button appears.
- **SC-004**: No continuous visual work remains while the hero is offscreen or the document is hidden; resize and rotation produce no layout shift or horizontal overflow.
- **SC-005**: Before/after production-build evidence is recorded for mobile and desktop, including a constrained profile, bundle cost, Lighthouse Performance > 90, LCP < 2.5 s, INP < 200 ms where field data exists, CLS < 0.1, and FCP < 1.8 s. Unavailable field INP is explicitly reported as unverified, not substituted with a synthetic value.
- **SC-006**: Applicable WCAG 2.2 AA contrast and motion behavior pass representative first, active, settled, reduced-motion, and high-contrast states.
- **SC-007**: Required build, typecheck, lint, and test checks pass; automated tests cover deterministic lifecycle and fallback behavior where practical.

## Assumptions

- The owner selected Radar sweep on 2026-09-29 after comparing three revised face-free live concepts, then chose the complete scope above the mobile copy from three live placements.
- The first prototype can use the current lightweight rendering stack; a different renderer must win on observed concept and cost evidence.
- The hero's visible copy, labels, destinations, and navigation are fixed by issue #62's scope. The owner approved correcting the drifted documentation to match the current rendering on 2026-09-28.
- Production performance evidence must distinguish controlled lab results from unavailable field data.
