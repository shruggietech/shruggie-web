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
import Link from "next/link";
import { useInView, useReducedMotion } from "framer-motion";
import { Palette, Code2, TrendingUp, Brain, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ServiceProof } from "@/lib/services";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ServiceProofCard from "@/components/services/ServiceProofCard";
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
  proofs: ServiceProof[];
  index: number;
  bgClass: string;
  /** Optional link to the service's dedicated detail page. */
  detailHref?: string;
}

export default function ServicePillarSection({
  id,
  title,
  lead,
  body,
  capabilities,
  proofs,
  index,
  bgClass,
  detailHref,
}: ServicePillarSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(illustrationRef, {
    once: true,
    margin: "-20% 0px -20% 0px",
  });
  const shouldReduceMotion = useReducedMotion();

  const Icon = ICON_MAP[id];
  const Illustration = ILLUSTRATION_MAP[id];
  const isEven = index % 2 === 0;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("scroll-mt-24 py-16 md:py-24", bgClass)}
    >
      <div className="container-content">
        <ScrollReveal delay={index * 0.05}>
          <div
            className={cn(
              "flex flex-col items-center gap-8 md:gap-12",
              isEven ? "md:flex-row" : "md:flex-row-reverse",
            )}
          >
            {/* Illustration — above text on mobile, alternating side on desktop */}
            {Illustration && (
              <div
                ref={illustrationRef}
                className={cn(
                  "mx-auto h-[280px] w-full max-w-[360px] shrink-0 md:h-auto md:w-2/5 md:max-w-none",
                  (isInView || shouldReduceMotion) && "is-animating",
                )}
              >
                <Illustration className="h-full w-full" />
              </div>
            )}

            {/* Text content — below illustration on mobile */}
            <div className="w-full md:flex-1">
              {Icon && <Icon size={32} className="text-accent mb-4" />}

              <h2 className="font-display text-display-md text-text-primary font-bold">
                {title}
              </h2>

              <p className="text-body-lg text-text-primary mt-4 font-medium">
                {lead}
              </p>

              <p className="text-body-md text-text-secondary mt-4">{body}</p>

              <ul className="mt-8 space-y-3">
                {capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="text-body-md text-text-secondary flex items-start gap-3"
                  >
                    <span
                      className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    {capability}
                  </li>
                ))}
              </ul>

              {detailHref && (
                <Link
                  href={detailHref}
                  className="group font-display text-body-md text-accent hover:text-accent-hover focus-visible:outline-focus mt-8 inline-flex items-center gap-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Explore {title}
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={index * 0.05 + 0.08}>
          <div className="border-border mt-12 border-t pt-8 dark:border-white/[0.08]">
            <p className="text-body-sm text-accent font-mono tracking-[0.16em] uppercase">
              Proof in practice
            </p>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {proofs.map((proof) => (
                <ServiceProofCard
                  key={`${proof.kind}-${proof.name}`}
                  proof={proof}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
