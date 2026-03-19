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
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { caseStudies } from "@/lib/case-studies";

export default function WorkPreview() {
  return (
    <section id="work-section" className="relative py-[var(--section-gap)]" data-case-study-count={caseStudies.length}>
      <div className="container-content relative z-[2]">
        <ScrollReveal>
          <SectionHeading
            label="OUR WORK"
            title="We don't do mock-ups. These shipped."
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
                  {/* Case study screenshot */}
                  <div className="mb-4">
                    <DeviceMockup
                      src={study.image}
                      alt={`${study.client} website screenshot`}
                      variant="browser"
                    />
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
