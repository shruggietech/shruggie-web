/**
 * CTASection — Bottom call-to-action with orange gradient bloom
 * and shruggie watermark personality element.
 *
 * Redesign spec reference: §5.5 (CTA Section Redesign)
 */

import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function CTASection() {
  return (
    <section
      id="cta-section"
      className="group/cta relative section-bg-cta py-32 md:py-48 overflow-hidden"
    >
      {/* Orange gradient bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="cta-bloom h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,_rgba(255,83,0,0.08)_0%,_transparent_70%)] md:animate-[cta-bloom-pulse_8s_ease-in-out_infinite] motion-reduce:animate-none" />
      </div>

      {/* Shruggie watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="font-display text-[120px] leading-none text-white opacity-[0.04] md:opacity-[0.03] md:transition-opacity md:duration-[600ms] md:group-hover/cta:opacity-[0.08]">
          ¯\_(ツ)_/¯
        </span>
      </div>

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
    </section>
  );
}

export { CTASection };
