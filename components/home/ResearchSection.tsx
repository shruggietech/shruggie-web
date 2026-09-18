/**
 * ResearchSection — Full-width publication cards with decorative code background.
 *
 * Replaces ResearchPreview. Three research publications displayed as
 * full-width cards with two-column layout (desktop) or single-column
 * text-only (mobile). Decorative monospace code block behind cards on
 * desktop provides visual texture.
 *
 * Spec reference: Redesign §5.4 (Research Section Redesign), §7.2 (Mobile — Research)
 */

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { ADFVisual, RustifVisual } from "@/components/shared/ResearchVisuals";

interface Publication {
  title: string;
  description: string;
  author: string;
  date: string;
  visual: "adf" | "rustif";
  href: string;
}

const publications: Publication[] = [
  {
    title: "Affective Dynamics Framework",
    description:
      "A framework for emotional state simulation in AI agents, enabling contextual affective responses in conversational systems.",
    author: "William Thompson",
    date: "2026",
    visual: "adf",
    href: "/research/affective-dynamics",
  },
  {
    title: "rustif Declaration",
    description:
      "A manifesto for building transparent, specification-first metadata systems in Rust.",
    author: "William Thompson",
    date: "2026",
    visual: "rustif",
    href: "/research/rustif",
  },
];

/* ── Abstract Visual Treatments ─────────────────────────────────────────── */
/* Visuals imported from @/components/shared/ResearchVisuals */

const visualComponents: Record<Publication["visual"], React.ComponentType> = {
  adf: ADFVisual,
  rustif: RustifVisual,
};

/* ── Decorative Code Block ──────────────────────────────────────────────── */

const decorativeCode = `// research pipeline v3.2
interface AffectiveState {
  valence: number;
  arousal: number;
  dominance: number;
}

fn parse_metadata(input: &str) -> Result<Meta> {
  let tokens = tokenize(input)?;
  validate_schema(&tokens)?;
  Ok(Meta::from(tokens))
}

/// Transparent specification layers
pub struct RustifDecl {
  version: SemVer,
  entries: Vec<Entry>,
}`;

function DecorativeCodeBackground() {
  return (
    <ScrollReveal
      className="pointer-events-none absolute inset-0 hidden overflow-hidden select-none md:block"
      delay={0.3}
      initialY={0}
    >
      <pre
        className="text-body-sm text-text-muted font-mono leading-relaxed whitespace-pre"
        style={{
          opacity: 0.045,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskComposite: "source-in",
        }}
      >
        {decorativeCode}
      </pre>
    </ScrollReveal>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function ResearchSection() {
  return (
    <section
      id="research-section"
      className="section-bg-research relative py-[var(--section-gap)]"
    >
      <div className="container-content relative z-[2]">
        <ScrollReveal>
          <SectionHeading
            label="RESEARCH"
            title="We write about what we build."
          />
          <p className="text-body-md text-text-muted-warm mt-3">
            Published by humans. Cited by machines.
          </p>
        </ScrollReveal>

        <div className="relative mt-[var(--component-gap)] flex flex-col gap-[var(--component-gap)]">
          <DecorativeCodeBackground />

          {publications.map((pub, index) => {
            const Visual = visualComponents[pub.visual];
            return (
              <ScrollReveal key={pub.title} delay={index * 0.1}>
                <Link
                  href={pub.href}
                  className="focus-visible:ring-accent focus-visible:ring-offset-bg-primary block cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Card className="relative z-[1]">
                    <div className="flex flex-col gap-6 md:flex-row">
                      {/* Left column: text content */}
                      <div className="flex flex-1 flex-col gap-2 md:w-[60%] md:flex-none">
                        <h3 className="font-display text-display-sm text-text-primary font-bold">
                          {pub.title}
                        </h3>
                        <p className="text-body-sm text-text-muted">
                          {pub.author} · {pub.date}
                        </p>
                        <p className="text-body-md text-text-secondary mt-1">
                          {pub.description}
                        </p>
                        <span className="font-display text-body-sm text-accent group-hover:text-accent-hover mt-3 inline-flex items-center font-medium transition-colors">
                          Read paper →
                        </span>
                      </div>

                      {/* Right column: abstract visual (desktop only) */}
                      <div className="hidden md:flex md:w-[40%] md:items-center md:justify-center">
                        <Visual />
                      </div>
                    </div>
                  </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { ResearchSection };
