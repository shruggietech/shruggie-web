/**
 * HeroSection — Full-width dark hero with animated gradient mesh.
 *
 * Headline "Your vision deserves better than a template." in display-xl
 * Space Grotesk Bold. Dual CTAs: primary via ShruggieCTA, secondary via Button.
 * Background: CSS animated gradient mesh using brand green at 5-8% opacity
 * with a 30s animation cycle, disabled for prefers-reduced-motion.
 *
 * Spec reference: §6.1 (Homepage — Section 1: Hero)
 */

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-brand-black">
      {/* Animated gradient mesh background */}
      <div
        className="hero-gradient-mesh pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

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

      {/* Gradient mesh animation styles in styles/globals.css — respects prefers-reduced-motion */}
    </section>
  );
}

export { HeroSection };
