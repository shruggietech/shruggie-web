/**
 * HeroSection — Full-width dark hero with animated dot-grid canvas.
 *
 * Headline "We advance your vision." in display-xl
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
import HeroBackground from "@/components/home/HeroBackground";

export default function HeroSection() {
  return (
    <section
      id="hero-section"
      className="bg-brand-black relative min-h-[85vh] overflow-hidden"
    >
      <HeroBackground />

      <div className="container-content relative z-10 flex min-h-[85vh] flex-col items-start justify-center pt-44 pb-32 md:py-40">
        <div>
          <h1 className="font-display text-display-md md:text-display-xl text-brand-white max-w-4xl font-bold">
            We advance your vision.
          </h1>
        </div>

        <div>
          <p className="text-body-lg mt-6 max-w-2xl text-[#595959] dark:text-white">
            You have a business to run. We handle the technology that makes it
            grow: modern websites, marketing engines, AI integrations, and
            custom software, shaped around how you actually work.
          </p>
        </div>

        <div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
            <Link href="/work">
              <Button
                variant="secondary"
                className="border-white bg-white dark:bg-black"
              >
                See Our Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
