# shruggie-web Constitution

This constitution holds the non-negotiable gates that every feature is judged
against during `/speckit-plan` and `/speckit-analyze`. It governs process and
quality; it does not restate content that already has a canonical home.
`ShruggieTech_Website_Specification.md` (repository root) remains the
authoritative source for externally observable behavior: page structure,
copy, design tokens, and content requirements. Where this constitution and the
specification overlap, the specification's specifics govern; this document
governs how work gets planned, built, and merged.

## Core Principles

### I. Specification Precedence

`ShruggieTech_Website_Specification.md` is the single source of truth for
what the site is supposed to do and look like. A feature MUST NOT contradict
it. When a task requires deviating from the specification (a genuine error in
it, or new scope it doesn't cover), the deviation MUST be called out
explicitly in the feature's spec/plan rather than silently coded around, and
the specification MUST be updated in the same change so it stays current.
Stale planning documents that drift from the specification and from the
codebase are a constitution violation, not a tolerable byproduct; see
Principle V.

### II. Design System Discipline

All UI work uses the existing design system tokens (color, spacing,
typography from `styles/globals.css` / `tailwind.config`) and the shared
component library under `components/ui/` and `components/shared/`. Raw hex
values, one-off spacing magic numbers, and bespoke components that duplicate
an existing primitive are not permitted without a documented reason in the
plan. Reuse an existing component (e.g. `CTABackground`, `SectionHeading`,
`ScrollReveal`) before writing a new one; if a component logically belongs to
more than one page, it lives in a shared path, not nested under a single
route directory.

### III. Accessibility Is Non-Negotiable (NON-NEGOTIABLE)

WCAG 2.2 Level AA is the compliance target (§3 of the specification), because
accessibility competence is something this company sells to clients and must
demonstrably practice on its own site. Every feature MUST satisfy, at
minimum: keyboard reachability and visible focus indicators for every
interactive element; one hierarchical `<h1>`-`<h6>` structure per page;
descriptive `alt` text on content images and `alt="" aria-hidden="true"` on
decorative ones; associated `<label>` elements and `aria-describedby` /
`aria-invalid` on form fields; and every animation gated behind
`prefers-reduced-motion` (Framer Motion's `useReducedMotion`, or the CSS media
query). A feature that cannot satisfy these does not ship.

### IV. Performance Budget

Core Web Vitals targets from §9.1 of the specification (LCP < 2.5s, INP <
200ms, CLS < 0.1, FCP < 1.8s, Lighthouse Performance > 90) are a gate, not an
aspiration. Images go through `next/image`; fonts are self-hosted WOFF2 via
`next/font/local`; client-side JavaScript (Lenis, Framer Motion, MDX
rendering where avoidable) is code-split and does not ship to routes that
don't need it. A feature that measurably regresses these targets requires an
explicit tradeoff decision recorded in its plan, not a silent merge.

### V. Document Integrity and No Stale Backlogs

Every authored spec, plan, task list, and constitution amendment MUST be
UTF-8 without BOM, LF line endings, a single trailing newline, no trailing
whitespace. Planning artifacts live in `specs/NNN-slug/` via the spec-kit
workflow, not as hand-maintained, undated backlog documents outside that
structure — this repository previously carried a `docs/` backlog and a
`.handoff/` sprint-plan directory that both drifted to describe work already
shipped, which is precisely the failure mode this principle exists to
prevent. A `specs/NNN-slug/` directory is retired (not silently left to rot)
once its work has landed: mark it complete or delete it in the same change
that closes it out.

## Additional Constraints

- **Stack**: Next.js (App Router; track the major version actually pinned in
  `package.json`, currently 16.x — update this line when that major version
  bumps rather than letting it drift), TypeScript strict mode (no `any`),
  Tailwind CSS. Blog content is MDX rendered via `next-mdx-remote/rsc`.
- **TypeScript**: strict mode; use `satisfies` for type narrowing where it
  improves clarity over a plain annotation.
- **Imports**: React/Next.js first, then third-party packages, then local
  `@/` imports.
- **Components**: functional components; named exports for components, a
  default export for page components (`app/**/page.tsx`); `forwardRef` for
  components that wrap a native HTML element.
- Vendor-shipped spec-kit assets (`.specify/scripts/`, `.specify/templates/`
  boilerplate, `.claude/skills/speckit-*`) are exempt from the document
  integrity formatting rules above where they are reinstalled verbatim by the
  `specify` CLI on upgrade; the generated artifacts under `specs/` are held
  to the full standard.

## Development Workflow

- Feature-sized work uses Spec-Driven Development:
  `/speckit-specify` → (`/speckit-clarify` if requirements are ambiguous) →
  `/speckit-plan` → (`/speckit-checklist` optionally) → `/speckit-tasks` →
  (`/speckit-analyze` for cross-artifact consistency) → `/speckit-implement`.
  Specs live in `specs/NNN-slug/`. A trivial one-commit change (typo, copy
  fix, dependency bump) may skip the full workflow.
- `npm run build` and `npx tsc --noEmit` MUST pass with zero errors before a
  feature is considered done.
- Commits follow `<scope>: <imperative description>` (e.g.
  `web: add CTA to blog article template`); `CHANGELOG.md` is updated for
  user-facing changes.
- Use `/speckit-converge` periodically to reconcile `specs/` against the live
  codebase rather than letting a separate, hand-maintained backlog document
  accumulate drift (see Principle V).

## Governance

This constitution supersedes ad hoc process practices for matters of
principle. It is subordinate to `ShruggieTech_Website_Specification.md` for
externally observable behavior (Principle I). Amendments require an explicit
commit that states the rationale and bumps the version below.

Versioning is semantic: MAJOR for a removed or redefined principle or other
backward-incompatible governance change, MINOR for a new principle or
materially expanded guidance, PATCH for clarifications and non-semantic
wording. Every feature plan verifies compliance at the Constitution Check
gate; unjustified complexity is rejected.

**Version**: 1.0.0 | **Ratified**: 2026-08-22 | **Last Amended**: 2026-08-22
