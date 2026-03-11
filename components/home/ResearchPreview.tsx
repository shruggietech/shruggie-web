/**
 * ResearchPreview — Publication cards for original research.
 *
 * Three research publications (ADF, Multi-Agent Guide, rustif Declaration)
 * displayed vertically. Each card shows title, description, author, and
 * link to /research.
 *
 * Spec reference: §6.1 (Homepage — Section 4: Research Preview)
 */

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface Publication {
  title: string;
  description: string;
  author: string;
}

const publications: Publication[] = [
  {
    title: "Affective Dynamics Framework",
    description:
      "A framework for emotional state simulation in AI agents, enabling contextual affective responses in conversational systems.",
    author: "William Thompson",
  },
  {
    title: "Multi-Agent Development Guide",
    description:
      "Practical patterns for orchestrating multi-agent coding workflows with specification-driven handoffs.",
    author: "William Thompson",
  },
  {
    title: "rustif Declaration",
    description:
      "A manifesto for building transparent, specification-first metadata systems in Rust.",
    author: "William Thompson",
  },
];

export default function ResearchPreview() {
  return (
    <section className="py-[var(--section-gap)]">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="RESEARCH"
            title="We write about what we build."
            description="Original research in AI agent architecture, multi-agent development workflows, and metadata systems engineering."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] flex flex-col gap-6">
          {publications.map((pub, index) => (
            <ScrollReveal key={pub.title} delay={index * 0.08}>
              <Card className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="flex-1">
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    {pub.title}
                  </h3>
                  <p className="mt-1 text-body-md text-text-secondary">
                    {pub.description}
                  </p>
                  <p className="mt-2 text-body-sm text-text-muted">
                    {pub.author}
                  </p>
                </div>
                <Link
                  href="/research"
                  className="inline-flex items-center whitespace-nowrap font-display text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  Read paper →
                </Link>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ResearchPreview };
