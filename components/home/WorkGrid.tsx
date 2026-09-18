/** Natural-flow desktop case-study showcases. */
import Image from "next/image";
import Link from "next/link";

import ScrollReveal from "@/components/shared/ScrollReveal";
import Badge from "@/components/ui/Badge";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import SectionHeading from "@/components/ui/SectionHeading";
import { caseStudies } from "@/lib/case-studies";

export default function WorkGrid() {
  return (
    <section
      id="work-section"
      className="section-bg-work py-[var(--section-gap)]"
    >
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="OUR WORK"
            title="Real results for real businesses"
          />
          <div className="mt-8 flex flex-wrap items-center gap-6 md:gap-12">
            {caseStudies.map((study) => (
              <div key={study.slug} className="relative h-10 w-40 lg:h-12">
                <Image
                  src={study.logo}
                  alt={`${study.client} logo`}
                  fill
                  sizes="160px"
                  className="object-contain object-left opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] space-y-8 lg:space-y-12">
          {caseStudies.map((study) => (
            <ScrollReveal key={study.slug}>
              <article className="grid items-center gap-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
                <div className="min-w-0">
                  <Badge className="mb-4">{study.industry}</Badge>
                  <h3 className="font-display text-display-sm text-text-hero font-bold">
                    {study.client}
                  </h3>
                  <p className="text-body-lg text-text-body-light mt-4">
                    {study.summary}
                  </p>
                  <p className="text-body-md text-accent mt-4 flex items-center gap-2 font-medium">
                    <span
                      aria-hidden="true"
                      className="bg-brand-green-bright size-1.5 shrink-0 rounded-full"
                    />
                    {study.metric}
                  </p>
                  <Link
                    href={`/work/${study.slug}`}
                    aria-label={`Read the ${study.client} case study`}
                    className="text-body-md text-accent hover:text-orange-foreground mt-6 inline-flex items-center gap-1.5 font-medium transition-colors"
                  >
                    Read case study <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <DeviceMockup
                  src={study.image}
                  alt={`${study.client} website screenshot`}
                  variant="browser"
                  className="w-full min-w-0 shadow-2xl shadow-black/40"
                />
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
