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

import { useEffect, useRef } from "react";
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

gsap.registerPlugin(ScrollTrigger);

/* ── Service data ───────────────────────────────────────────────────────── */

interface ServiceDef {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const services: ServiceDef[] = [
  {
    title: "Digital Strategy & Brand",
    description:
      "From brand identity to content architecture, we build the visual and strategic foundation your business stands on.",
    icon: Palette,
    href: "/services#strategy-brand",
  },
  {
    title: "Development & Integration",
    description:
      "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform.",
    icon: Code2,
    href: "/services#development",
  },
  {
    title: "Revenue Flows & Marketing Ops",
    description:
      "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Everything that turns visibility into revenue.",
    icon: TrendingUp,
    href: "/services#marketing",
  },
  {
    title: "AI & Data Analysis",
    description:
      "Chatbots, RAG systems, workflow automation, and AI consulting. We help you adopt AI that actually works for your business.",
    icon: Brain,
    href: "/services#ai-data",
  },
];

/* ── Card transition helpers ────────────────────────────────────────────── */

/** Fraction of a card segment's scroll used for transitions. */
const TRANSITION_FRACTION = 0.2;

/**
 * Compute opacity and translateY for a card based on servicesProgress.
 * Each card owns 1/3 of the 0–1 range (3 transitions for 4 cards).
 *   card 0: visible from 0 → 1/3 (exits at 1/3)
 *   card 1: enters at 1/3, visible until 2/3 (exits at 2/3)
 *   card 2: enters at 2/3, visible until 1 (exits at 1)
 *   card 3: enters at 1, visible through section unpin
 */
function getCardStyle(cardIndex: number, progress: number) {
  const SEGMENT = 1 / 3;
  const enterStart = cardIndex * SEGMENT;
  const exitEnd = (cardIndex + 1) * SEGMENT;

  // Transition zones
  const enterZone = SEGMENT * TRANSITION_FRACTION;
  const exitZone = SEGMENT * TRANSITION_FRACTION;

  let opacity = 0;
  let translateY = 30; // px

  if (cardIndex === 0) {
    // First card: starts visible, exits at SEGMENT
    if (progress < exitEnd - exitZone) {
      opacity = 1;
      translateY = 0;
    } else if (progress < exitEnd) {
      // Fading out
      const t = (progress - (exitEnd - exitZone)) / exitZone;
      opacity = 1 - t;
      translateY = -30 * t;
    }
  } else if (cardIndex === 3) {
    // Last card: enters at 3*SEGMENT (=1.0), stays visible past unpin
    const enterEnd = enterStart + enterZone;
    if (progress < enterStart) {
      opacity = 0;
      translateY = 30;
    } else if (progress < enterEnd) {
      const t = (progress - enterStart) / enterZone;
      opacity = t;
      translateY = 30 * (1 - t);
    } else {
      opacity = 1;
      translateY = 0;
    }
  } else {
    // Middle cards (1, 2): enter and exit
    const enterEnd = enterStart + enterZone;
    if (progress < enterStart) {
      opacity = 0;
      translateY = 30;
    } else if (progress < enterEnd) {
      // Fading in
      const t = (progress - enterStart) / enterZone;
      opacity = t;
      translateY = 30 * (1 - t);
    } else if (progress < exitEnd - exitZone) {
      // Fully visible
      opacity = 1;
      translateY = 0;
    } else if (progress < exitEnd) {
      // Fading out
      const t = (progress - (exitEnd - exitZone)) / exitZone;
      opacity = 1 - t;
      translateY = -30 * t;
    }
  }

  return { opacity, translateY };
}

/* ── Component ──────────────────────────────────────────────────────────── */

export default function ServicesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      scrollState.servicesActive = false;
      return;
    }

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    // ── ScrollTrigger: pin + snap ──────────────────────────────────────
    const trigger = ScrollTrigger.create({
      trigger: sectionEl,
      pin: true,
      scrub: 1,
      snap: 1 / 3,
      end: "+=300%",
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
      }

      rafRef.current = requestAnimationFrame(updateCards);
    }

    rafRef.current = requestAnimationFrame(updateCards);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      trigger.kill();
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

        {/* Right half (desktop) / top portion (mobile) — canvas renders here */}
        <div className="order-1 flex-[0_0_40%] md:order-2 md:flex-[0_0_50%]" />
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
                  <Card className="flex h-full flex-col">
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export { ServicesScroll };
