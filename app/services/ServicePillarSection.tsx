/**
 * ServicePillarSection — Client component for individual service pillar sections.
 *
 * Renders pillar content and animated SVG illustration in a two-column
 * side-by-side layout that alternates illustration position per index.
 * Uses IntersectionObserver (via Framer Motion useInView) to trigger
 * the .is-animating class for CSS keyframe entrance animations on SVGs.
 *
 * Spec reference: ShruggieTech-Site-Updates-Plan-v2 §2.1, §2.2
 */

"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Palette, Code2, TrendingUp, Brain } from "lucide-react";

import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/shared/ScrollReveal";
import {
  StrategyBrandIllustrationLarge,
  DevelopmentIllustrationLarge,
  MarketingIllustrationLarge,
  AIDataIllustrationLarge,
} from "@/components/home/ServiceIllustrationsLarge";

/* ── Icon and illustration mapping ──────────────────────────────────── */

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size: number; className?: string }>
> = {
  "strategy-brand": Palette,
  development: Code2,
  marketing: TrendingUp,
  "ai-data": Brain,
};

const ILLUSTRATION_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "strategy-brand": StrategyBrandIllustrationLarge,
  development: DevelopmentIllustrationLarge,
  marketing: MarketingIllustrationLarge,
  "ai-data": AIDataIllustrationLarge,
};

/* ── Component ──────────────────────────────────────────────────────── */

interface ServicePillarSectionProps {
  id: string;
  title: string;
  lead: string;
  body: string;
  capabilities: string[];
  index: number;
  bgClass: string;
}

export default function ServicePillarSection({
  id,
  title,
  lead,
  body,
  capabilities,
  index,
  bgClass,
}: ServicePillarSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(illustrationRef, { once: true, margin: "-20% 0px -20% 0px" });
  const shouldReduceMotion = useReducedMotion();

  const Icon = ICON_MAP[id];
  const Illustration = ILLUSTRATION_MAP[id];
  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "scroll-mt-24 py-16 md:py-24",
        bgClass,
      )}
    >
      <div className="container-content">
        <ScrollReveal delay={index * 0.05}>
          <div
            className={cn(
              "flex flex-col gap-8 md:gap-12 items-center",
              isEven ? "md:flex-row" : "md:flex-row-reverse",
            )}
          >
            {/* Illustration — above text on mobile, alternating side on desktop */}
            {Illustration && (
              <div
                ref={illustrationRef}
                className={cn(
                  "w-full mx-auto h-[280px] max-w-[360px] md:h-auto md:max-w-none md:w-2/5 shrink-0",
                  (isInView || shouldReduceMotion) && "is-animating",
                )}
              >
                <Illustration className="h-full w-full" />
              </div>
            )}

            {/* Text content — below illustration on mobile */}
            <div className="w-full md:flex-1">
              {Icon && <Icon size={32} className="text-accent mb-4" />}

              <h2 className="font-display text-display-md font-bold text-text-primary">
                {title}
              </h2>

              <p className="mt-4 text-body-lg font-medium text-text-primary">
                {lead}
              </p>

              <p className="mt-4 text-body-md text-text-secondary">
                {body}
              </p>

              <ul className="mt-8 space-y-3">
                {capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-start gap-3 text-body-md text-text-secondary"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
