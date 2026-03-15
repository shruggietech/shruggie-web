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
import Image from "next/image";

import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { caseStudies } from "@/lib/case-studies";

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
        <ScrollReveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center">
            <p className="mb-4 text-body-xs uppercase tracking-widest text-text-muted">
              Trusted by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {caseStudies.map((study) => (
                <Image
                  key={study.slug}
                  src={study.logo}
                  alt={`${study.client} logo`}
                  width={120}
                  height={32}
                  className="h-6 w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-8"
                />
              ))}
            </div>
          </div>
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
              <div className="mb-4">
                <DeviceMockup
                  src={study.image}
                  alt={`${study.client} website screenshot`}
                  variant="browser"
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
