/** Client-logo tabs for curated work, without scroll-driven transitions. */
"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import ScrollReveal from "@/components/shared/ScrollReveal";
import Badge from "@/components/ui/Badge";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import SectionHeading from "@/components/ui/SectionHeading";
import { caseStudies } from "@/lib/case-studies";

export default function WorkTabs() {
  const [selected, setSelected] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % caseStudies.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (index - 1 + caseStudies.length) % caseStudies.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = caseStudies.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelected(next);
    tabsRef.current[next]?.focus();
  }

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
        </ScrollReveal>

        <ScrollReveal className="mt-[var(--component-gap)] grid items-start gap-6 md:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-8">
          <div>
            <div
              role="tablist"
              aria-label="Featured clients"
              aria-orientation="vertical"
              className="flex flex-col gap-3"
            >
              {caseStudies.map((study, index) => (
                <button
                  key={study.slug}
                  ref={(element) => {
                    tabsRef.current[index] = element;
                  }}
                  id={`${id}-tab-${study.slug}`}
                  role="tab"
                  type="button"
                  aria-selected={selected === index}
                  aria-controls={`${id}-panel-${study.slug}`}
                  tabIndex={selected === index ? 0 : -1}
                  onClick={() => setSelected(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`group focus-visible:outline-accent flex w-full flex-col items-start gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${selected === index ? "border-accent/40 bg-green-bright-20 text-text-hero" : "text-text-body-light border-white/[0.06] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.06]"}`}
                >
                  <span
                    aria-hidden="true"
                    className="relative block h-12 w-full"
                  >
                    <Image
                      src={study.logo}
                      alt=""
                      fill
                      sizes="160px"
                      className={`object-contain object-left transition-opacity ${selected === index ? "opacity-100" : "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"}`}
                    />
                  </span>
                  <span className="text-body-xs font-medium">
                    {study.client}
                  </span>
                </button>
              ))}
            </div>
            <Link
              href="/work"
              className="text-body-sm text-accent hover:text-orange-foreground mt-6 inline-flex items-center gap-2 font-medium transition-colors"
            >
              View all work <span aria-hidden="true">→</span>
            </Link>
          </div>
          {/* Overlapping grid cells reserve the tallest panel's space without fixed heights. */}
          <div className="grid">
            {caseStudies.map((study, index) => (
              <div
                key={study.slug}
                id={`${id}-panel-${study.slug}`}
                role="tabpanel"
                aria-labelledby={`${id}-tab-${study.slug}`}
                aria-hidden={selected !== index}
                inert={selected !== index}
                tabIndex={selected === index ? 0 : -1}
                className={`focus-visible:outline-accent col-start-1 row-start-1 grid items-center gap-8 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 focus-visible:outline-2 focus-visible:outline-offset-4 md:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12 ${selected !== index ? "pointer-events-none invisible" : ""}`}
              >
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
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
