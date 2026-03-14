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
  StrategyBrandIllustration,
  DevelopmentIllustration,
  MarketingIllustration,
  AIDataIllustration,
} from "@/components/home/ServiceIllustrations";

interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  Illustration: ComponentType<{ className?: string }>;
}

const services: ServiceItem[] = [
  {
    title: "Digital Strategy & Brand",
    description:
      "From brand identity to content architecture, we build the visual and strategic foundation your business stands on.",
    icon: Palette,
    href: "/services#strategy-brand",
    Illustration: StrategyBrandIllustration,
  },
  {
    title: "Development & Integration",
    description:
      "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform.",
    icon: Code2,
    href: "/services#development",
    Illustration: DevelopmentIllustration,
  },
  {
    title: "Revenue Flows & Marketing Ops",
    description:
      "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Everything that turns visibility into revenue.",
    icon: TrendingUp,
    href: "/services#marketing",
    Illustration: MarketingIllustration,
  },
  {
    title: "AI & Data Analysis",
    description:
      "Chatbots, RAG systems, workflow automation, and AI consulting. We help you adopt AI that actually works for your business.",
    icon: Brain,
    href: "/services#ai-data",
    Illustration: AIDataIllustration,
  },
];

export default function ServicesCarousel() {
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
    <section className="section-bg-services py-[var(--section-gap)]">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, studio-scale delivery."
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
        {services.map((service, index) => (
          <div
            key={service.title}
            ref={setCardRef(index)}
            className="w-[88vw] flex-shrink-0 snap-center"
          >
            <Card className="flex h-full flex-col p-6">
              {/* Service number watermark */}
              <span
                className="mb-3 block bg-gradient-to-r from-brand-green-bright to-[var(--gradient-teal)] bg-clip-text font-display text-display-lg font-bold text-transparent opacity-20"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Static illustration */}
              <div className="mb-4" aria-hidden="true">
                <service.Illustration className="h-[100px] w-[120px] opacity-70" />
              </div>

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
