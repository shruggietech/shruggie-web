/**
 * CTASection — Bottom call-to-action with Knoxville skyline silhouette
 * and interactive particle-node starry sky.
 *
 * Redesign spec reference: §5.5 (CTA Section Redesign), §4.1-4.2 (Knoxville Skyline)
 */

import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ParticleSky from "@/components/home/ParticleSky";
import KnoxvilleSkyline from "@/components/home/KnoxvilleSkyline";

export default function CTASection() {
  return (
    <section
      id="cta-section"
      className="relative bg-[#060608] pt-32 pb-52 md:pt-48 md:pb-64 overflow-hidden"
    >
      {/* Interactive particle sky — full section background */}
      <ParticleSky className="absolute inset-0 h-full w-full" />

      {/* Content */}
      <div className="container-narrow relative z-10 text-center">
        <ScrollReveal>
          <h2 className="font-display text-display-md md:text-display-lg font-bold text-text-hero">
            Ready to build something?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-[600px] text-body-lg text-text-body-light">
            Whether you need a website, a strategy, or someone to untangle the
            mess your last vendor left behind — the first step is a
            conversation.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10">
            <ShruggieCTA href="/contact">Let&apos;s Talk</ShruggieCTA>
          </div>
        </ScrollReveal>
      </div>

      {/* Knoxville skyline — anchored to bottom */}
      <KnoxvilleSkyline className="absolute bottom-0 left-0 w-full z-[1]" />
    </section>
  );
}

export { CTASection };
