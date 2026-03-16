/**
 * ServicePillarSection — Client component for individual service pillar sections.
 *
 * Renders a glassmorphism Card with Lucide icon, pillar content,
 * and an animated SVG illustration in a two-column desktop layout.
 * Uses IntersectionObserver (via Framer Motion useInView) to trigger
 * the .is-animating class that starts CSS keyframe entrance animations
 * on the SVG illustrations.
 *
 * Spec reference: ShruggieTech-Site-Design-Consistency-Plan §2.2, §2.3
 */

"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Palette, Code2, TrendingUp, Brain } from "lucide-react";

import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
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
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const Icon = ICON_MAP[id];
  const Illustration = ILLUSTRATION_MAP[id];

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "scroll-mt-24 py-16 md:py-24",
        bgClass,
        (isInView || shouldReduceMotion) && "is-animating",
      )}
    >
      <div className="container-content">
        <ScrollReveal delay={index * 0.05}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,0.6fr] gap-8 items-center">
            {/* Illustration — above card on mobile, right column on desktop */}
            {Illustration && (
              <div className="order-1 lg:order-2 max-h-[250px] md:max-h-[400px] lg:max-h-none overflow-hidden">
                <Illustration />
              </div>
            )}

            {/* Card content — below illustration on mobile, left column on desktop */}
            <Card
              hover={false}
              className="order-2 lg:order-1 border-l-2 border-l-accent/20"
            >
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
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
