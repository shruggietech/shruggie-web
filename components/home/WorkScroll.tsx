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
import { useReducedMotion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { SectionProgress } from "@/components/ui/SectionProgress";
import { caseStudies } from "@/lib/case-studies";

/* ── Client Logo Placeholders ─────────────────────────────────────────── */

function ClientLogos() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      {caseStudies.map((study) => (
        <div
          key={study.slug}
          className="flex h-10 items-center rounded-lg bg-white/[0.04] px-4 transition-all duration-300 grayscale hover:grayscale-0 hover:bg-white/[0.06]"
        >
          <span className="text-body-xs font-medium text-white/50 transition-colors duration-300">
            {study.client}
          </span>
        </div>
      ))}
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
            scrub: 0.6,
            snap: {
              snapTo: 1 / (totalFrames - 1),
              duration: { min: 0.3, max: 0.8 },
              ease: "power1.inOut",
            },
            end: "+=300%",
            onUpdate: (self) => {
              const progress = self.progress;
              const frame = Math.round(progress * (totalFrames - 1));
              setCurrentFrame(frame);
            },
          },
        });

        // Position all frames absolutely, first visible
        frames.forEach((frame, i) => {
          if (i === 0) {
            gsap.set(frame, { opacity: 1, y: 0, position: "absolute", inset: 0 });
          } else {
            gsap.set(frame, { opacity: 0, y: 60, position: "absolute", inset: 0 });
          }
        });

        // Animate transitions between frames
        for (let i = 0; i < totalFrames - 1; i++) {
          tl.to(
            frames[i],
            { opacity: 0, y: -60, duration: 1, ease: "power2.inOut" },
            i,
          );
          tl.fromTo(
            frames[i + 1],
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.inOut" },
            i,
          );
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
      <div className="py-[var(--section-gap)]">
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
      <div ref={pinnedRef} className="relative h-screen w-full overflow-hidden">
        <SectionProgress
          total={caseStudies.length}
          current={currentFrame}
          className="left-6 xl:left-10"
        />

        {caseStudies.map((study, index) => (
          <div
            key={study.slug}
            data-work-frame
            className="flex h-full w-full items-center"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <div className="container-content flex h-full w-full items-center">
              <div className="grid w-full grid-cols-2 items-center gap-8 lg:gap-12">
                {/* Left column — content */}
                <div className="flex flex-col">
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
                    className="mt-6 inline-flex items-center gap-1.5 text-body-md font-medium text-accent transition-colors hover:text-accent-hover"
                  >
                    Read case study
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {/* Right column — device mockup */}
                <div className="flex items-center justify-center">
                  <DeviceMockup
                    src={study.image}
                    alt={`${study.client} website screenshot`}
                    variant="browser"
                    className="w-full shadow-2xl shadow-black/40 transition-shadow duration-300 hover:shadow-[0_25px_60px_-12px_rgba(59,130,246,0.15)]"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
