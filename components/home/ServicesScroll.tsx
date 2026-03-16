/**
 * ServicesScroll — Desktop GSAP-pinned services presentation.
 *
 * Self-contained ScrollTrigger pinning with 4 frames (one per service
 * pillar). Each frame shows the service content on the left (55%) and
 * a large animated illustration on the right (45%). A SectionProgress
 * indicator tracks the current frame on the left edge.
 *
 * Falls back to a static grid layout when prefers-reduced-motion is active.
 *
 * Redesign reference: §4.2, §5.2
 */

"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import Link from "next/link";
import {
  Palette,
  Code2,
  TrendingUp,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { type ComponentType } from "react";
import { useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { SectionProgress } from "@/components/ui/SectionProgress";
import {
  StrategyBrandIllustration,
  DevelopmentIllustration,
  MarketingIllustration,
  AIDataIllustration,
} from "@/components/home/ServiceIllustrations";
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
  Illustration: ComponentType<{ className?: string }>;
  IllustrationLarge: ComponentType<{ className?: string }>;
}

const services: ServiceItem[] = [
  {
    title: "Digital Strategy & Brand",
    description:
      "From brand identity to content architecture, we build the visual and strategic foundation your business stands on.",
    icon: Palette,
    href: "/services#strategy-brand",
    Illustration: StrategyBrandIllustration,
    IllustrationLarge: StrategyBrandIllustrationLarge,
  },
  {
    title: "Development & Integration",
    description:
      "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform.",
    icon: Code2,
    href: "/services#development",
    Illustration: DevelopmentIllustration,
    IllustrationLarge: DevelopmentIllustrationLarge,
  },
  {
    title: "Revenue Flows & Marketing Ops",
    description:
      "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Everything that turns visibility into revenue.",
    icon: TrendingUp,
    href: "/services#marketing",
    Illustration: MarketingIllustration,
    IllustrationLarge: MarketingIllustrationLarge,
  },
  {
    title: "AI & Data Analysis",
    description:
      "Chatbots, RAG systems, workflow automation, and AI consulting. We help you adopt AI that actually works for your business.",
    icon: Brain,
    href: "/services#ai-data",
    Illustration: AIDataIllustration,
    IllustrationLarge: AIDataIllustrationLarge,
  },
];

/* ── Reduced-Motion Fallback ──────────────────────────────────────────── */

function ServicesGrid() {
  return (
    <section className="section-bg-services py-[var(--section-gap)]">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, studio-scale delivery."
            description="4 practice areas. 40+ capabilities. One team."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] grid grid-cols-1 gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.08}>
              <Link href={service.href} className="block h-full">
                <Card className="flex h-full flex-col p-6 md:flex-row md:items-center md:gap-6">
                  <div className="flex flex-1 flex-col">
                    <service.icon
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
                  <div
                    className="hidden flex-shrink-0 md:block"
                    aria-hidden="true"
                  >
                    <service.Illustration className="h-[140px] w-[160px] opacity-80" />
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pinned Desktop Layout ────────────────────────────────────────────── */

export default function ServicesScroll() {
  const shouldReduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const scrollTriggerRef = useRef<{ start: number; end: number } | null>(null);

  useLayoutEffect(() => {
    if (shouldReduce) return;

    let ctx: ReturnType<typeof import("gsap")["default"]["context"]> | undefined;

    async function init() {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      if (!pinnedRef.current || !sectionRef.current) return;

      ctx = gsap.context(() => {
        const frames = pinnedRef.current!.querySelectorAll<HTMLElement>("[data-service-frame]");
        const totalFrames = frames.length;
        if (totalFrames === 0) return;

        // Create a timeline that scrolls through all frames
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedRef.current,
            pin: true,
            scrub: 0.3,
            snap: {
              snapTo: 1 / (totalFrames - 1),
              duration: { min: 0.15, max: 0.4 },
              ease: "power2.inOut",
            },
            end: "+=400%",
            onUpdate: (self) => {
              const progress = self.progress;
              // Switch frame at start of Phase B (0.45 into each segment)
              const frame = Math.min(
                totalFrames - 1,
                Math.floor(progress * (totalFrames - 1) + 0.55),
              );
              setCurrentFrame(frame);

              // Store scroll positions for programmatic navigation
              scrollTriggerRef.current = { start: self.start, end: self.end };
            },
          },
        });

        // Animate each frame transition (fade + slide)
        frames.forEach((frame, i) => {
          if (i === 0) {
            // First frame starts visible
            gsap.set(frame, { opacity: 1, y: 0, position: "absolute", inset: 0 });
          } else {
            // Subsequent frames start hidden
            gsap.set(frame, { opacity: 0, y: 20, position: "absolute", inset: 0 });
          }
        });

        for (let i = 0; i < totalFrames - 1; i++) {
          // Phase A (0.0–0.35): Outgoing card fades out with upward slide
          tl.to(
            frames[i],
            { opacity: 0, y: -20, duration: 0.35, ease: "power2.in" },
            i,
          );
          // Dead zone (0.35–0.45): both cards at opacity 0 — no animation
          // Phase B (0.45–0.80): Incoming card fades in with upward slide
          tl.fromTo(
            frames[i + 1],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
            i + 0.45,
          );
          // Hold (0.80–1.0): incoming card rests at full opacity
        }
      }, sectionRef);
    }

    init();

    return () => {
      ctx?.revert();
    };
  }, [shouldReduce]);

  // Track when the pinned illustration area enters the viewport.
  useEffect(() => {
    const el = pinnedRef.current;
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

  // Retrigger SVG draw-on animations when the active frame changes,
  // but only after the section has scrolled into view.
  // Removing then re-adding .is-animating forces the browser to restart
  // CSS animations from scratch.
  useEffect(() => {
    if (!sectionVisible) return;

    const container = pinnedRef.current;
    if (!container) return;

    const wrappers = container.querySelectorAll<HTMLElement>("[data-illustration]");
    wrappers.forEach((w) => w.classList.remove("is-animating"));

    const raf = requestAnimationFrame(() => {
      wrappers[currentFrame]?.classList.add("is-animating");
    });

    return () => cancelAnimationFrame(raf);
  }, [currentFrame, sectionVisible]);

  if (shouldReduce) {
    return <ServicesGrid />;
  }

  return (
    <section
      ref={sectionRef}
      className="section-bg-services"
    >
      {/* Section intro — scrolls naturally */}
      <div className="pt-[var(--section-gap)] pb-0">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="WHAT WE DO"
              title="Full-stack capability, studio-scale delivery."
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-6 font-display text-body-lg font-medium text-text-body-light">
              4 practice areas. 40+ capabilities. One team.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Pinned area */}
      <div ref={pinnedRef} className="relative mt-8 h-screen w-full overflow-hidden">
        <SectionProgress
          total={services.length}
          current={currentFrame}
          className="left-6 xl:left-10"
          labels={services.map((s) => s.title)}
          onSelect={(i) => {
            const st = scrollTriggerRef.current;
            if (!st) return;
            const totalFrames = services.length;
            const target = st.start + (i / (totalFrames - 1)) * (st.end - st.start);
            window.scrollTo({ top: target, behavior: "smooth" });
          }}
        />

        {services.map((service, index) => (
          <div
            key={service.title}
            data-service-frame
            className={`absolute inset-0 flex h-full w-full items-center ${index === currentFrame ? 'pointer-events-auto' : 'pointer-events-none'}`}
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <div className="flex h-full w-full items-center gap-8 lg:gap-12">
              {/* Left column — positioned to match container-content alignment */}
              <div
                className="flex shrink-0 flex-col"
                style={{
                  width: 'min(38%, calc(var(--max-width-content) * 0.38))',
                  marginLeft: 'max(var(--padding-x), calc((100% - var(--max-width-content)) / 2 + var(--padding-x)))',
                }}
              >
                  {/* Service number watermark */}
                  <span
                    className="mb-4 block bg-gradient-to-r from-brand-green-bright to-[var(--gradient-teal)] bg-clip-text font-display text-[6rem] font-bold leading-none text-transparent opacity-15"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <service.icon
                    className="mb-4 h-8 w-8 text-accent"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <h3 className="font-display text-display-md font-bold text-text-hero">
                    {service.title}
                  </h3>

                  <p className="mt-4 max-w-lg text-body-lg text-text-body-light">
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-body-md font-medium text-accent transition-colors hover:text-brand-orange"
                  >
                    Learn more
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {/* Right column — large animated illustration, fills to viewport edge */}
                <div
                  data-illustration
                  className="flex min-w-0 flex-1 items-center justify-center pr-[var(--padding-x)] py-12"
                  aria-hidden="true"
                >
                  <service.IllustrationLarge className="h-[75vh] max-h-[85vh] w-full max-w-3xl opacity-90" />
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
