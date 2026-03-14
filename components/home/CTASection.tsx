/**
 * CTASection — Bottom call-to-action with gradient background.
 *
 * Full-width section with gradient from gray-900 to black, thin 1px
 * top border in green at 20% opacity. Uses ShruggieCTA linking to /contact.
 *
 * Spec reference: §6.1 (Homepage — Section 5: Bottom CTA)
 */

import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function CTASection() {
  return (
    <section
      id="cta-section"
      className="relative border-t border-green-bright-20 bg-gradient-to-b from-gray-900 to-brand-black py-[var(--section-gap)] pb-[40vh]"
    >
      <div className="container-content relative z-[2] text-center">
        <ScrollReveal>
          <h2 className="font-display text-display-md font-bold text-brand-white">
            Ready to build something?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-gray-400">
            Whether you need a website, a marketing engine, an AI integration,
            or all of the above, the first step is the same: a conversation
            about what you need.
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
