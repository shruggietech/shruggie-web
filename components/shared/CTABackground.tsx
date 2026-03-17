/**
 * CTABackground — Reusable CTA section wrapper with interactive
 * ParticleSky background and KnoxvilleSkyline anchored at the bottom.
 *
 * Extracted from the homepage CTASection so every page-level CTA
 * can share the same visual treatment.
 */

import { cn } from "@/lib/utils";
import ParticleSky from "@/components/home/ParticleSky";
import KnoxvilleSkyline from "@/components/home/KnoxvilleSkyline";

interface CTABackgroundProps {
  children: React.ReactNode;
  /** Extra classes on the outer <section> */
  className?: string;
}

export default function CTABackground({
  children,
  className,
}: CTABackgroundProps) {
  return (
    <section
      className={cn(
        "relative bg-[#060608] pt-32 pb-52 md:pt-48 md:pb-64 overflow-hidden",
        className,
      )}
    >
      {/* Interactive particle sky — full section background */}
      <ParticleSky className="absolute inset-0 h-full w-full" />

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>

      {/* Knoxville skyline — anchored to bottom */}
      <KnoxvilleSkyline className="absolute bottom-0 left-0 w-full z-[1]" />
    </section>
  );
}

export { CTABackground };
