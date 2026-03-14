/**
 * WorkPreview — Horizontal scroll strip of featured case study cards.
 *
 * Three case study cards (United Way, Scruggs Tire, I Heart PR Tours)
 * in a snap-scroll strip. Each card shows client name, industry badge,
 * one-line summary, placeholder hero image, and link.
 *
 * Spec reference: §6.1 (Homepage — Section 3: Work Preview)
 */

import Link from "next/link";

import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  summary: string;
}

const caseStudies: CaseStudy[] = [
  {
    slug: "united-way-anderson-county",
    client: "United Way of Anderson County",
    industry: "Nonprofit",
    summary:
      "Accessibility-compliant website redesign aligned with global United Way brand guidelines, built on infrastructure the client owns.",
  },
  {
    slug: "scruggs-tire",
    client: "Scruggs Tire & Alignment",
    industry: "Automotive Services",
    summary:
      "Forensic vendor audit, contract disentanglement, and full replatform onto client-owned infrastructure for a Knoxville auto shop.",
  },
  {
    slug: "i-heart-pr-tours",
    client: "I Heart PR Tours",
    industry: "Tourism",
    summary:
      "Multi-platform booking integration, OTA optimization, and brand identity for a Puerto Rico tour operator.",
  },
];

export default function WorkPreview() {
  return (
    <section id="work-section" className="relative py-[var(--section-gap)]" data-case-study-count={caseStudies.length}>
      <div className="container-content relative z-[2]">
        <ScrollReveal>
          <SectionHeading
            label="OUR WORK"
            title="Real results for real businesses."
            description="We solve messy problems for businesses that need more than a template."
          />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-[var(--component-gap)] -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:-mx-0 md:px-0">
            {caseStudies.map((study) => (
              <div
                key={study.slug}
                className="w-[85vw] flex-shrink-0 snap-start sm:w-[400px]"
              >
                <Card className="flex h-full flex-col">
                  {/* Placeholder hero image area */}
                  <div
                    className="mb-4 flex h-48 items-center justify-center rounded-lg bg-bg-secondary"
                    aria-hidden="true"
                  >
                    <span className="font-display text-body-sm text-text-muted">
                      Screenshot coming soon
                    </span>
                  </div>

                  <Badge className="mb-3 self-start">{study.industry}</Badge>
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    {study.client}
                  </h3>
                  <p className="mt-2 flex-1 text-body-md text-text-secondary">
                    {study.summary}
                  </p>
                  <Link
                    href={`/work/${study.slug}`}
                    className="mt-4 inline-flex items-center font-display text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Read case study →
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { WorkPreview };
