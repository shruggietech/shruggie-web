/**
 * ResearchPreview — Publication cards for original research.
 *
 * Two research publications (ADF, rustif Declaration)
 * displayed vertically. Each card shows title, description, author, and
 * link to /research.
 *
 * Spec reference: §6.1 (Homepage — Section 4: Research Preview)
 */

import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface Publication {
  title: string;
  description: string;
  author: string;
  href: string;
}

const publications: Publication[] = [
  {
    title: "Affective Dynamics Framework",
    description:
      "A framework for emotional state simulation in AI agents, enabling contextual affective responses in conversational systems.",
    author: "William Thompson",
    href: "https://gist.github.com/h8rt3rmin8r/f4589f0afb6fcd10d4c499e4a29247ad",
  },
  {
    title: "rustif Declaration",
    description:
      "A manifesto for building transparent, specification-first metadata systems in Rust.",
    author: "William Thompson",
    href: "https://gist.github.com/h8rt3rmin8r/b20a59e60f039b7a8bccbf67288226de",
  },
];

export default function ResearchPreview() {
  return (
    <section id="research-section" className="relative py-[var(--section-gap)]">
      <div className="container-content relative z-[2]">
        <ScrollReveal>
          <SectionHeading
            label="RESEARCH"
            title="We write about what we build."
            description="Original research in AI agent architecture and metadata systems engineering."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] flex flex-col gap-6">
          {publications.map((pub, index) => (
            <ScrollReveal key={pub.title} delay={index * 0.08}>
              <Card className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="flex-1">
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    <a
                      href={pub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {pub.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-body-md text-text-secondary">
                    {pub.description}
                  </p>
                  <p className="mt-2 text-body-sm text-text-muted">
                    {pub.author}
                  </p>
                </div>
                <a
                  href={pub.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center whitespace-nowrap font-display text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
                >
                  Read paper →
                </a>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ResearchPreview };
