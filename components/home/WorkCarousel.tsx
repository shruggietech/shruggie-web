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

  // Controlled touch handler state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);
  const isScrolling = useRef(false);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    [],
  );

  // Programmatically scroll to a specific card index
  const scrollToCard = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (!card || !scrollRef.current) return;
    const container = scrollRef.current;
    const cardRect = card.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      cardRect.left -
      containerRect.left -
      (containerRect.width - cardRect.width) / 2;
    isScrolling.current = true;
    setActiveIndex(index);
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    setTimeout(() => {
      isScrolling.current = false;
    }, 400);
  }, []);

  // Store activeIndex in a ref so native event listeners always read the latest value
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Attach non-passive native touch listeners so preventDefault() actually works
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isSwiping.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isScrolling.current) {
        e.preventDefault();
        return;
      }
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (deltaX > deltaY && deltaX > 10) {
        isSwiping.current = true;
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const THRESHOLD = 30;
      if (Math.abs(deltaX) > THRESHOLD) {
        const current = activeIndexRef.current;
        const direction = deltaX < 0 ? 1 : -1;
        const targetIndex = Math.max(
          0,
          Math.min(caseStudies.length - 1, current + direction),
        );
        if (targetIndex !== current) {
          scrollToCard(targetIndex);
        }
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [scrollToCard]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return;
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
        className="mt-[var(--component-gap)] flex gap-4 overflow-x-auto px-[var(--padding-x)] pb-4"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {caseStudies.map((study, index) => (
          <div
            key={study.slug}
            ref={setCardRef(index)}
            className="w-[90vw] flex-shrink-0"
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
              scrollToCard(index);
            }}
          />
        ))}
      </div>
    </section>
  );
}
