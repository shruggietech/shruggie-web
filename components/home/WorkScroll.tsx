/**
 * WorkScroll — Desktop GSAP-pinned work / case-study presentation.
 *
 * Self-contained ScrollTrigger pinning with 3 frames (one per case
 * study). Each frame shows the case study content on the left (50%)
 * and a large DeviceMockup on the right (50%). A SectionProgress
 * indicator tracks the current frame on the left edge.
 *
 * Falls back to a horizontal snap-scroll strip when prefers-reduced-motion
 * is active.
 *
 * Redesign reference: §4.2, §5.3
 */

"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { SectionProgress } from "@/components/ui/SectionProgress";
import { caseStudies } from "@/lib/case-studies";

/* ── Client Logo Row ───────────────────────────────────────────────── */

function ClientLogos() {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-start gap-6 md:gap-12">
        {caseStudies.map((study) => (
          <Image
            key={study.slug}
            src={study.logo}
            alt={`${study.client} logo`}
            width={160}
            height={48}
            className="h-8 w-auto opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-10 lg:h-12"
          />
        ))}
      </div>
    </div>
  );
}

/* ── Reduced-Motion Fallback ──────────────────────────────────────────── */

function WorkGrid() {
  return (
    <section className="section-bg-work py-[var(--section-gap)]">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="OUR WORK"
            title="Real results for real businesses."
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ClientLogos />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {caseStudies.map((study, index) => (
            <ScrollReveal key={study.slug} delay={index * 0.08}>
              <div className="w-[400px] flex-shrink-0 snap-start">
                <Card className="flex h-full flex-col">
                  <div className="mb-4">
                    <DeviceMockup
                      src={study.image}
                      alt={`${study.client} website screenshot`}
                      variant="browser"
                    />
                  </div>
                  <Badge className="mb-3 self-start">{study.industry}</Badge>
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    {study.client}
                  </h3>
                  <p className="mt-2 flex-1 text-body-md text-text-secondary">
                    {study.summary}
                  </p>
                  <Link
                    href={`/work/${study.slug}`}
                    className="mt-4 inline-flex items-center text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Read case study →
                  </Link>
                </Card>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pinned Desktop Layout ────────────────────────────────────────────── */

export default function WorkScroll() {
  const shouldReduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
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
        const frames = pinnedRef.current!.querySelectorAll<HTMLElement>("[data-work-frame]");
        const totalFrames = frames.length;
        if (totalFrames === 0) return;

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
            end: "+=300%",
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

        // Position all frames absolutely, first visible
        frames.forEach((frame, i) => {
          if (i === 0) {
            gsap.set(frame, { opacity: 1, y: 0, position: "absolute", inset: 0 });
          } else {
            gsap.set(frame, { opacity: 0, y: 20, position: "absolute", inset: 0 });
          }
        });

        // Animate transitions between frames
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

  if (shouldReduce) {
    return <WorkGrid />;
  }

  return (
    <section
      ref={sectionRef}
      id="work-section"
      className="section-bg-work"
    >
      {/* Section intro — scrolls naturally */}
      <div className="pt-[var(--section-gap)] pb-0">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="OUR WORK"
              title="Real results for real businesses."
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ClientLogos />
          </ScrollReveal>
        </div>
      </div>

      {/* Pinned area */}
      <div ref={pinnedRef} className="relative mt-8 h-screen w-full overflow-hidden">
        <SectionProgress
          total={caseStudies.length}
          current={currentFrame}
          className="left-6 xl:left-10"
          labels={caseStudies.map((s) => s.client)}
          onSelect={(i) => {
            const st = scrollTriggerRef.current;
            if (!st) return;
            const totalFrames = caseStudies.length;
            const target = st.start + (i / (totalFrames - 1)) * (st.end - st.start);
            window.scrollTo({ top: target, behavior: "smooth" });
          }}
        />

        {caseStudies.map((study, index) => (
          <div
            key={study.slug}
            data-work-frame
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
                  <Badge className="mb-4 self-start">{study.industry}</Badge>

                  <h3 className="font-display text-display-md font-bold text-text-hero">
                    {study.client}
                  </h3>

                  <p className="mt-4 max-w-lg text-body-lg text-text-body-light">
                    {study.summary}
                  </p>

                  {/* Key metric */}
                  <div className="mt-4 inline-flex items-center gap-2 text-body-md font-medium text-accent">
                    <span className="inline-block size-1.5 rounded-full bg-brand-green-bright" />
                    {study.metric}
                  </div>

                  <Link
                    href={`/work/${study.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-body-md font-medium text-accent transition-colors hover:text-brand-orange"
                  >
                    Read case study
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {/* Right column — fills remaining space to viewport edge */}
                <div className="flex min-w-0 flex-1 items-center justify-center pr-[var(--padding-x)] py-12">
                  <DeviceMockup
                    src={study.image}
                    alt={`${study.client} website screenshot`}
                    variant="browser"
                    className="w-full max-w-3xl shadow-2xl shadow-black/40 transition-shadow duration-300 hover:shadow-[0_25px_60px_-12px_rgba(59,130,246,0.15)]"
                  />
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
