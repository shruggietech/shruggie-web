/**
 * OwnershipSection — Client component for the "You Own Everything We Build"
 * section with animated SVG illustration.
 *
 * Uses IntersectionObserver (via Framer Motion useInView) to trigger the
 * .is-animating class for CSS keyframe entrance animations, matching the
 * pattern established in ServicePillarSection.
 */

"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { OwnershipIllustrationLarge } from "@/components/home/ServiceIllustrationsLarge";

export default function OwnershipSection() {
  const illustrationRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(illustrationRef, {
    once: true,
    margin: "-20% 0px -20% 0px",
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-t border-accent/10 py-16 md:py-24">
      <div className="container-content">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            {/* Text content */}
            <div className="flex-1 order-2 md:order-1">
              <h2 className="font-display text-display-md font-bold text-text-primary">
                You Own Everything We Build
              </h2>

              <p className="mt-6 text-body-lg text-text-secondary">
                Your domain, your hosting credentials, your content, your data. We earn revenue by building things that work. Your assets stay yours. Every engagement operates under a formal Master Services Agreement and Scope of Work. No handshakes. No ambiguity.
              </p>
            </div>

            {/* Illustration — above text on mobile, right side on desktop */}
            <div
              ref={illustrationRef}
              className={cn(
                "w-full mx-auto h-[280px] max-w-[360px] md:h-auto md:max-w-none md:w-2/5 shrink-0 order-1 md:order-2",
                (isInView || shouldReduceMotion) && "is-animating",
              )}
            >
              <OwnershipIllustrationLarge className="h-full w-full" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
