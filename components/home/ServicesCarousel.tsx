/**
 * ServicesCarousel — Mobile-only horizontal swipeable services strip.
 *
 * Renders a snap-scrolling carousel of service cards at ~88vw each
 * with indicator dots driven by IntersectionObserver. Designed for
 * viewports below 768px where GSAP pinning is disabled.
 *
 * Redesign reference: §4.3, §5.2, §7.2
 */

"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Palette,
  Code2,
  TrendingUp,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { type ComponentType } from "react";

import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import {
  StrategyBrandIllustrationLarge,
  DevelopmentIllustrationLarge,
  MarketingIllustrationLarge,
  AIDataIllustrationLarge,
} from "@/components/home/ServiceIllustrationsLarge";

interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  IllustrationLarge: ComponentType<{ className?: string }>;
}

const services: ServiceItem[] = [
  {
    title: "Digital Strategy & Brand",
    description:
      "From brand identity to content architecture, we build the visual and strategic foundation your business stands on.",
    icon: Palette,
    href: "/services#strategy-brand",
    IllustrationLarge: StrategyBrandIllustrationLarge,
  },
  {
    title: "Development & Integration",
    description:
      "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform.",
    icon: Code2,
    href: "/services#development",
    IllustrationLarge: DevelopmentIllustrationLarge,
  },
  {
    title: "Revenue Flows & Marketing Ops",
    description:
      "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Everything that turns visibility into revenue.",
    icon: TrendingUp,
    href: "/services#marketing",
    IllustrationLarge: MarketingIllustrationLarge,
  },
  {
    title: "AI & Data Analysis",
    description:
      "Chatbots, RAG systems, workflow automation, and AI consulting. We help you adopt AI that actually works for your business.",
    icon: Brain,
    href: "/services#ai-data",
    IllustrationLarge: AIDataIllustrationLarge,
  },
];

export default function ServicesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const illRefs = useRef<(HTMLDivElement | null)[]>([]);
  const illContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);

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

  const setIllRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      illRefs.current[index] = el;
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
    // Reset scrolling flag after animation completes
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
      // If horizontal movement dominates, treat as swipe and prevent native scroll
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
          Math.min(services.length - 1, current + direction),
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

  // Track when the illustration area enters the viewport.
  useEffect(() => {
    const el = illContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Retrigger SVG draw-on animations when the active card changes,
  // but only after the section has scrolled into view.
  useEffect(() => {
    if (!sectionVisible) return;

    illRefs.current.forEach((el) => el?.classList.remove("is-animating"));

    const raf = requestAnimationFrame(() => {
      illRefs.current[activeIndex]?.classList.add("is-animating");
    });

    return () => cancelAnimationFrame(raf);
  }, [activeIndex, sectionVisible]);

  return (
    <section className="section-bg-services py-[var(--section-gap)]">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, studio-scale delivery."
          />
        </ScrollReveal>
      </div>

      {/* Large illustration display area */}
      <div ref={illContainerRef} className="relative mx-auto mt-[var(--component-gap)] h-[280px] max-w-[360px]" aria-hidden="true">
        {services.map((service, index) => (
          <div
            key={service.title}
            ref={setIllRef(index)}
            data-illustration
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === activeIndex
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <service.IllustrationLarge className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Horizontal scroll strip — controlled touch handler, no snap/smooth */}
      <div
        ref={scrollRef}
        className="mt-6 flex gap-4 overflow-x-auto px-[var(--padding-x)] pb-4"
        style={{
          scrollbarWidth: "none",
        }}
      >
        {services.map((service, index) => (
          <div
            key={service.title}
            ref={setCardRef(index)}
            className="w-[88vw] flex-shrink-0"
          >
            <Card className="flex h-full flex-col p-6">
              {/* Service number watermark */}
              <span
                className="mb-3 block bg-gradient-to-r from-brand-green-bright to-[var(--gradient-teal)] bg-clip-text font-display text-display-lg font-bold text-transparent opacity-20"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <service.icon
                className="mb-3 h-7 w-7 text-accent"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              {/* Title */}
              <h3 className="font-display text-display-sm font-bold text-text-primary">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-2 flex-1 text-body-md text-text-secondary">
                {service.description}
              </p>

              {/* Link */}
              <Link
                href={service.href}
                className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </Link>
            </Card>
          </div>
        ))}
      </div>

      {/* Indicator dots */}
      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Service cards">
        {services.map((service, index) => (
          <button
            key={service.title}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to ${service.title}`}
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
