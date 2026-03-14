/**
 * WorkCarousel — Mobile-only horizontal swipeable work/case-study strip.
 *
 * Renders a snap-scrolling carousel of case study cards at ~90vw each
 * with indicator dots driven by IntersectionObserver. Designed for
 * viewports below 768px where GSAP pinning is disabled.
 *
 * Redesign reference: §4.3, §5.3, §7.2
 */

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  summary: string;
  heroImage?: string;
}

const caseStudies: CaseStudy[] = [
  {
    slug: "united-way",
    client: "United Way of Anderson County",
    industry: "Nonprofit",
    summary:
      "Accessibility-compliant website redesign aligned with global United Way brand guidelines, built on infrastructure the client owns.",
    heroImage: undefined,
  },
  {
    slug: "scruggs-tire",
    client: "Scruggs Tire & Alignment",
    industry: "Automotive Services",
    summary:
      "Forensic vendor audit, contract disentanglement, and full replatform onto client-owned infrastructure for a Knoxville auto shop.",
    heroImage: undefined,
  },
  {
    slug: "i-heart-pr-tours",
    client: "I Heart PR Tours",
    industry: "Tourism & Hospitality",
    summary:
      "Multi-platform booking integration, OTA optimization, and brand identity for a Puerto Rico tour operator.",
    heroImage: undefined,
  },
];

export default function WorkCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(
              entry.target as HTMLDivElement,
            );
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.6 },
    );

    for (const card of cardRefs.current) {
      if (card) observer.observe(card);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="work-section"
      className="section-bg-work py-[var(--section-gap)]"
    >
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="OUR WORK"
            title="Real results for real businesses."
          />
        </ScrollReveal>
      </div>

      {/* Horizontal scroll strip */}
      <div
        ref={scrollRef}
        className="mt-[var(--component-gap)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--padding-x)] pb-4"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {caseStudies.map((study, index) => (
          <div
            key={study.slug}
            ref={setCardRef(index)}
            className="w-[90vw] flex-shrink-0 snap-center"
          >
            <Card className="flex h-full flex-col p-5">
              {/* Device mockup with placeholder */}
              <div className="mb-4">
                <DeviceMockup
                  src={study.heroImage}
                  alt={`${study.client} website`}
                  variant="browser"
                  placeholderLabel={study.client}
                />
              </div>

              {/* Client name */}
              <h3 className="font-display text-display-sm font-bold text-text-primary">
                {study.client}
              </h3>

              {/* Industry badge */}
              <Badge className="mt-2 self-start">{study.industry}</Badge>

              {/* Summary */}
              <p className="mt-3 flex-1 text-body-md text-text-secondary">
                {study.summary}
              </p>

              {/* Link */}
              <Link
                href={`/work/${study.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Read case study
                <span aria-hidden="true">→</span>
              </Link>
            </Card>
          </div>
        ))}
      </div>

      {/* Indicator dots */}
      <div
        className="mt-4 flex justify-center gap-2"
        role="tablist"
        aria-label="Case study cards"
      >
        {caseStudies.map((study, index) => (
          <button
            key={study.slug}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to ${study.client}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-6 bg-brand-green-bright"
                : "w-2 bg-white/20"
            }`}
            onClick={() => {
              cardRefs.current[index]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }}
          />
        ))}
      </div>
    </section>
  );
}
