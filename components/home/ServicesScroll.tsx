/**
 * ServicesScroll — Scroll-locked services section with card cycling.
 *
 * Replaces ServicesPreview. Pins the section via GSAP ScrollTrigger
 * and cycles through 4 service cards as the user scrolls. Updates
 * scrollState.servicesProgress and scrollState.servicesActive so the
 * canvas network graph morphs shapes in sync.
 *
 * Desktop: cards on the left half, canvas graph on the right half.
 * Mobile: canvas graph in the top ~40%, cards in the bottom ~60%.
 *
 * prefers-reduced-motion: static 2×2 grid, no pinning, no animation.
 *
 * Spec reference: §6.1 (Homepage — Section 2: What We Do)
 */

"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { type ComponentType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Palette,
  Code2,
  TrendingUp,
  Brain,
  type LucideIcon,
} from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { scrollState } from "@/lib/canvas/scroll-state";
import {
  StrategyBrandIllustration,
  DevelopmentIllustration,
  MarketingIllustration,
  AIDataIllustration,
} from "@/components/home/ServiceIllustrations";

gsap.registerPlugin(ScrollTrigger);

/* ── Service data ───────────────────────────────────────────────────────── */

interface ServiceDef {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  Illustration: ComponentType<{ className?: string }>;
}

const services: ServiceDef[] = [
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

/* ── Card transition helpers ────────────────────────────────────────────── */

/**
 * Transition midpoints — centered between adjacent snap points.
 * With snap at 0, 1/3, 2/3, 1, the crossfade midpoints are at
 * 1/6, 3/6, 5/6, so each snap position sits in the CENTER of a
 * card's fully-visible zone rather than at the boundary.
 */
const TRANSITION_MIDPOINTS = [1 / 6, 3 / 6, 5 / 6];

/** Half-width of each crossfade zone. */
const TRANSITION_HALF_WIDTH = 0.06;

/**
 * Compute opacity and translateY for a card based on servicesProgress.
 * Card i enters at transition (i-1) and exits at transition i.
 * Card 0 has no enter transition (starts visible).
 * Card 3 has no exit transition (stays visible through unpin).
 */
function getCardStyle(cardIndex: number, progress: number) {
  const enterMid = cardIndex > 0 ? TRANSITION_MIDPOINTS[cardIndex - 1] : null;
  const exitMid = cardIndex < 3 ? TRANSITION_MIDPOINTS[cardIndex] : null;

  // Before enter zone — hidden
  if (enterMid !== null && progress < enterMid - TRANSITION_HALF_WIDTH) {
    return { opacity: 0, translateY: 30 };
  }

  // In enter crossfade
  if (enterMid !== null && progress < enterMid + TRANSITION_HALF_WIDTH) {
    const t =
      (progress - (enterMid - TRANSITION_HALF_WIDTH)) /
      (2 * TRANSITION_HALF_WIDTH);
    return { opacity: t, translateY: 30 * (1 - t) };
  }

  // Fully visible zone
  const exitStart =
    exitMid !== null ? exitMid - TRANSITION_HALF_WIDTH : Infinity;
  if (progress <= exitStart) {
    return { opacity: 1, translateY: 0 };
  }

  // In exit crossfade
  if (exitMid !== null && progress < exitMid + TRANSITION_HALF_WIDTH) {
    const t = (progress - exitStart) / (2 * TRANSITION_HALF_WIDTH);
    return { opacity: 1 - t, translateY: -30 * t };
  }

  // Past exit zone — hidden
  return { opacity: 0, translateY: -30 };
}

/* ── Component ──────────────────────────────────────────────────────────── */

export default function ServicesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const illustrationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      scrollState.servicesActive = false;
      return;
    }

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      // ── ScrollTrigger: pin + snap ──────────────────────────────────────
      ScrollTrigger.create({
        trigger: sectionEl,
        pin: true,
        scrub: 0.6,
        snap: {
          snapTo: 1 / 3,
          duration: { min: 0.3, max: 0.8 },
          delay: 0.1,
          ease: "power1.inOut",
          inertia: false,
        },
        end: "+=400%",
        onUpdate: (self) => {
          scrollState.servicesProgress = self.progress;
          scrollState.servicesActive = self.isActive;
        },
        onLeave: () => {
          scrollState.servicesActive = false;
        },
        onLeaveBack: () => {
          scrollState.servicesActive = false;
          scrollState.servicesProgress = 0;
        },
      });
    }, sectionRef);

    // ── rAF loop for card position updates ─────────────────────────────
    let running = true;

    function updateCards() {
      if (!running) return;

      const progress = scrollState.servicesProgress;

      for (let i = 0; i < services.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const { opacity, translateY } = getCardStyle(i, progress);
        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${translateY}px)`;
        // Hide from screen readers + interaction when invisible
        el.style.pointerEvents = opacity > 0.01 ? "auto" : "none";
        el.ariaHidden = opacity > 0.01 ? "false" : "true";

        // Sync illustration visibility
        const illEl = illustrationRefs.current[i];
        if (!illEl) continue;
        illEl.style.opacity = String(opacity);
        illEl.style.transform = `translateY(${translateY}px)`;
      }

      rafRef.current = requestAnimationFrame(updateCards);
    }

    rafRef.current = requestAnimationFrame(updateCards);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="services-section"
      ref={sectionRef}
      className="relative"
    >
      {/* ── Animated layout (scroll-locked): shown when motion allowed ── */}
      <div className="services-scroll-animated flex h-screen flex-col md:flex-row">
        {/* Left half (desktop) / bottom portion (mobile) */}
        <div className="order-2 flex flex-[0_0_60%] flex-col justify-start px-6 pb-8 pt-4 md:order-1 md:flex-[0_0_50%] md:justify-center md:px-12 md:py-16 lg:px-20">
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, studio-scale delivery."
          />

          {/* Card stack — all cards are stacked, opacity-controlled */}
          <div
            ref={cardsContainerRef}
            className="relative mt-8 md:mt-10"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className={`${index === 0 ? "relative" : "absolute inset-0"}`}
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    transform: index === 0 ? "translateY(0px)" : "translateY(30px)",
                  }}
                >
                  <a href={service.href} className="block">
                    <Card className="flex flex-col">
                      <Icon
                        className="mb-4 h-8 w-8 text-accent"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="font-display text-display-sm font-bold text-text-primary">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-body-md text-text-secondary">
                        {service.description}
                      </p>
                    </Card>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right half (desktop) / top portion (mobile) — SVG illustrations */}
        <div className="order-1 flex-[0_0_40%] md:order-2 md:flex-[0_0_50%] flex items-center justify-center">
          <div className="relative h-[200px] w-[240px] md:h-[280px] md:w-[320px]">
            {services.map((service, index) => (
              <div
                key={`ill-${service.title}`}
                ref={(el) => { illustrationRefs.current[index] = el; }}
                className={`${index === 0 ? "relative" : "absolute inset-0"} flex items-center justify-center`}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  transform: index === 0 ? "translateY(0px)" : "translateY(30px)",
                }}
                aria-hidden="true"
              >
                <service.Illustration className="h-full w-full opacity-80" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Static layout (reduced motion): 2×2 grid ──────────────────── */}
      <div className="services-scroll-static py-[var(--section-gap)]">
        <div className="container-content">
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, studio-scale delivery."
          />
          <div className="mt-[var(--component-gap)] grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <a
                  key={service.title}
                  href={service.href}
                  className="block h-full"
                >
                  <Card className="flex h-full flex-col md:flex-row md:items-center md:gap-6">
                    <div className="flex flex-1 flex-col">
                      <Icon
                        className="mb-4 h-8 w-8 text-accent"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="font-display text-display-sm font-bold text-text-primary">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-body-md text-text-secondary">
                        {service.description}
                      </p>
                    </div>
                    <div className="hidden flex-shrink-0 md:block" aria-hidden="true">
                      <service.Illustration className="h-[140px] w-[160px] opacity-80" />
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export { ServicesScroll };
