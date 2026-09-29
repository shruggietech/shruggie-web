/**
 * OwnershipSection — Client component for the "You Own Everything We Build"
 * section with animated SVG illustration.
 *
 * Uses IntersectionObserver (native) to trigger the
 * .is-animating class for CSS keyframe entrance animations, matching the
 * pattern established in ServicePillarSection.
 */

"use client";

import { useIllustrationInView } from "@/hooks/useIllustrationInView";

import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { OwnershipIllustrationLarge } from "@/components/home/ServiceIllustrationsLarge";

export default function OwnershipSection() {
  const { ref: illustrationRef, active: isInView } =
    useIllustrationInView("-20% 0px -20% 0px");

  return (
    <section className="border-accent/10 border-t py-16 md:py-24">
      <div className="container-content">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-16">
            {/* Text content */}
            <div className="order-2 flex-1 md:order-1">
              <h2 className="font-display text-display-md text-text-primary font-bold">
                You Own Everything We Build
              </h2>

              <p className="text-body-lg text-text-secondary mt-6">
                Your domain, your hosting credentials, your content, your data.
                We earn revenue by building things that work. Your assets stay
                yours. Every engagement operates under a formal Master Services
                Agreement and Scope of Work. No handshakes. No ambiguity.
              </p>
            </div>

            {/* Illustration — above text on mobile, right side on desktop */}
            <div
              ref={illustrationRef}
              className={cn(
                "order-1 mx-auto h-[280px] w-full max-w-[360px] shrink-0 md:order-2 md:h-auto md:w-2/5 md:max-w-none",
                isInView && "is-animating",
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
