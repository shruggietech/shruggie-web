/**
 * CTASection — Bottom call-to-action with Knoxville skyline silhouette
 * and interactive particle-node starry sky.
 *
 * Redesign spec reference: §5.5 (CTA Section Redesign), §4.1-4.2 (Knoxville Skyline)
 */

import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CTABackground from "@/components/shared/CTABackground";

export default function CTASection() {
  return (
    <CTABackground>
      <div id="cta-section" className="container-narrow text-center">
        <ScrollReveal>
          <h2 className="font-display text-display-md md:text-display-lg font-bold text-text-hero">
            Ready to build something?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-[600px] text-body-lg text-text-body-light">
            New build, rescue mission, or something in between. The first step
            is a conversation.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10">
            <ShruggieCTA href="/contact">Let&apos;s Talk</ShruggieCTA>
          </div>
        </ScrollReveal>
      </div>
    </CTABackground>
  );
}

export { CTASection };
