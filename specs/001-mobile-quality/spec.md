# Feature Specification: Production mobile quality repair

**Feature Branch**: `codex/96-97-mobile-quality`

**Created**: 2026-09-17

**Status**: Repair implementation complete in PR #99; repeated production-transport local validation is in progress, and SC-001 requires final production verification

**Input**: Continue the production-audit repairs in [#96](https://github.com/shruggietech/shruggie-web/issues/96) and [#97](https://github.com/shruggietech/shruggie-web/issues/97), coordinated by [#31](https://github.com/shruggietech/shruggie-web/issues/31).

## User Scenarios & Testing

### User Story 1 - Read and act on arrival (Priority: P1)

Visitors can read the homepage, Services, About, and Work and use their initial links without waiting for an entrance animation, including when scripting is unavailable.

**Why this priority**: The measured release fails the parent's mobile performance gate.

**Independent Test**: Load each route with delayed or disabled scripting and under the existing mobile performance profile; initial text and links remain visible.

**Acceptance Scenarios**:

1. **Given** a fresh visit, **When** initial content appears, **Then** headings and supporting text do not wait for animation initialization.
2. **Given** unavailable scripting or reduced motion, **When** any content is reached, **Then** text and links remain readable.
3. **Given** normal motion and content initially below the viewport, **When** that content is reached, **Then** the existing one-time gentle reveal may run without trapping content invisibly.

### User Story 2 - Select and understand mobile navigation (Priority: P1)

Visitors can comfortably select the mobile service/work pagination and understand the service and privacy link destinations.

**Why this priority**: This addresses visible production controls and the reported navigation audits.

**Independent Test**: Tap and keyboard-activate each pagination control; inspect its target size and the accessible link names.

**Acceptance Scenarios**:

1. **Given** a mobile carousel, **When** its pagination is activated, **Then** the correct card is selected with visible keyboard focus and a hit area at least 44 by 44 pixels.
2. **Given** service or cookie-notice links, **When** their names are read, **Then** the destination is specific and the existing destination/consent behavior is preserved.

### Edge Cases

- Restored scroll positions and initially visible lower-page content must never be hidden on initialization.
- Missing animation/observation capabilities or an initialization error leave content visible.
- Switching to reduced motion, focusing pending content, cancellation, and navigation reveal/restore content immediately.
- The final short section must be reachable and visible at the maximum scroll position.

## Requirements

### Functional Requirements

- **FR-001**: Initial content must be readable before scripting finishes and when scripting is disabled.
- **FR-002**: Optional below-viewport reveals must run at most once and respect reduced motion, focus, and failure fallbacks.
- **FR-003**: Existing content, themes, page layout, desktop natural scrolling, swipe navigation, and process/proof content must remain intact.
- **FR-004**: Pagination targets must be at least 44 by 44 pixels with visible focus and stable selected-state sizing.
- **FR-005**: Service/privacy links must describe their destination without changing consent semantics.
- **FR-006**: Tests must cover rendering visibility, reveal lifecycle/fallbacks, pagination selection, and link/consent behavior.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Each audited production route achieves the approved score >90, LCP <2.5 seconds, FCP <1.8 seconds, and CLS <0.1 in three disclosed mobile/desktop runs. Failures remain tracked.
- **SC-002**: Every reported small pagination target is at least 44 by 44 pixels; reported generic link-name failures are resolved or explained.
- **SC-003**: All initial-content and optional-animation fallback scenarios remain readable and usable.
- **SC-004**: Required repository quality checks pass, with separate production evidence before issue closure.

## Assumptions

- The authorized issue contracts define scope and priority; the hero-background redesign #62 is excluded.
- Local controlled measurements validate the repair but cannot replace final production measurements or unavailable real-user INP data.
- Specification changes explicitly authorize progressive entrance reveals and descriptive cookie-link copy in this same slice.

## Rendering refinement

#96 also includes compact common Latin font faces with complete original-glyph fallbacks, server-rendered Research with the shared reveal, and default dark server HTML. The offline generator must verify character coverage, glyph outlines, hinting, advances, vertical metrics, and deterministic outputs. The existing pre-paint cookie script must preserve blog preferences. The unsuccessful global CSS-inlining variant is retained as experiment evidence and excluded from the proposed code.

The completion pass preserves exact skyline artwork as lazy desktop/mobile vector images, verifies generated assets, replaces shared illustration/accordion animation runtime with native behavior, and limits Tailwind scanning to runtime templates. Common-character subsets cover all five used font weights with complete original-character fallbacks; include the shruggie macron and retain standard shaping/kerning and licensing metadata. Recorded production transport is HTTP/2. Keep the HTTP/1.1 localhost failures and disclose an additional controlled HTTP/2 comparison with unchanged numeric budgets and throttling. Local results cannot close SC-001's production gate.
