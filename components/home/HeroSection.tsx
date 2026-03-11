/**
 * HeroSection — Full-width dark hero with animated dot-grid canvas.
 *
 * Headline "Your vision deserves better than a template." in display-xl
 * Space Grotesk Bold. Dual CTAs: primary via ShruggieCTA, secondary via Button.
 * Background: interactive canvas dot grid using brand green (#2BCC73),
 * dots brighten and connect near cursor. Falls back to static grid
 * for prefers-reduced-motion.
 *
 * Spec reference: §6.1 (Homepage — Section 1: Hero)
 */

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import HeroBackground from "@/components/home/HeroBackground";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-brand-black">
      {/* Interactive dot-grid canvas background */}
      <HeroBackground />

      <div className="container-content relative z-10 flex min-h-[85vh] flex-col items-start justify-center py-32 md:py-40">
        <ScrollReveal>
          <h1 className="max-w-4xl font-display text-display-xl font-bold text-brand-white">
            Your vision deserves better than a template.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-body-lg text-gray-400">
            You have a business to run. We handle the technology that makes it
            grow. Modern websites, marketing engines, AI integrations, and custom
            software, built for you without the enterprise price tag or the
            vendor lock-in.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
            <Link href="/work">
              <Button variant="secondary">See Our Work</Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Canvas animation respects prefers-reduced-motion — see HeroBackground.tsx */}
    </section>
  );
}

export { HeroSection };
