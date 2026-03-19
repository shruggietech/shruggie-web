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
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";
import HeroBackground from "@/components/home/HeroBackground";

export default function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative min-h-[85vh] overflow-hidden bg-brand-black"
    >
      <HeroBackground />

      <div className="container-content relative z-10 flex min-h-[85vh] flex-col items-start justify-center pt-44 pb-32 md:py-40">
        <ScrollReveal>
          <h1 className="max-w-4xl font-display text-display-md md:text-display-xl font-bold text-brand-white">
            We advance your vision.
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-body-lg text-[#595959] dark:text-white">
            You have a business to run. We handle the technology that makes it
            grow: modern websites, marketing engines, AI integrations, and custom
            software, shaped around how you actually work.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
            <Link href="/work">
              <Button
                variant="secondary"
                className="bg-white dark:bg-black border-white"
              >
                See Our Work
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { HeroSection };
