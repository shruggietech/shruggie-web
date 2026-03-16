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

"use client";

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { ADFVisual, MultiAgentVisual, RustifVisual } from "@/components/shared/ResearchVisuals";
import { motion, useReducedMotion } from "framer-motion";

interface Publication {
  title: string;
  description: string;
  author: string;
  date: string;
  visual: "adf" | "multi-agent" | "rustif";
}

const publications: Publication[] = [
  {
    title: "Affective Dynamics Framework",
    description:
      "A framework for emotional state simulation in AI agents, enabling contextual affective responses in conversational systems.",
    author: "William Thompson",
    date: "2025",
    visual: "adf",
  },
  {
    title: "Multi-Agent Development Guide",
    description:
      "Practical patterns for orchestrating multi-agent coding workflows with specification-driven handoffs.",
    author: "William Thompson",
    date: "2025",
    visual: "multi-agent",
  },
  {
    title: "rustif Declaration",
    description:
      "A manifesto for building transparent, specification-first metadata systems in Rust.",
    author: "William Thompson",
    date: "2025",
    visual: "rustif",
  },
];

/* ── Abstract Visual Treatments ─────────────────────────────────────────── */
/* Visuals imported from @/components/shared/ResearchVisuals */

const visualComponents: Record<Publication["visual"], React.ComponentType> = {
  adf: ADFVisual,
  "multi-agent": MultiAgentVisual,
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

const orchestrator = new AgentPool({
  strategy: "round-robin",
  maxConcurrency: 4,
  handoff: "spec-driven",
});

/// Transparent specification layers
pub struct RustifDecl {
  version: SemVer,
  entries: Vec<Entry>,
}`;

function DecorativeCodeBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 hidden select-none overflow-hidden md:block"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.2, delay: 0.3 }}
    >
      <pre
        className="whitespace-pre font-mono text-body-sm leading-relaxed text-text-muted"
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
    </motion.div>
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
          <p className="mt-3 text-body-md text-text-muted-warm">
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
                  href="/research"
                  className="block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded-xl"
                >
                  <Card className="relative z-[1]">
                    <div className="flex flex-col gap-6 md:flex-row">
                      {/* Left column: text content */}
                      <div className="flex flex-1 flex-col gap-2 md:w-[60%] md:flex-none">
                        <h3 className="font-display text-display-sm font-bold text-text-primary">
                          {pub.title}
                        </h3>
                        <p className="text-body-sm text-text-muted">
                          {pub.author} · {pub.date}
                        </p>
                        <p className="mt-1 text-body-md text-text-secondary">
                          {pub.description}
                        </p>
                        <span className="mt-3 inline-flex items-center font-display text-body-sm font-medium text-accent transition-colors group-hover:text-accent-hover">
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
