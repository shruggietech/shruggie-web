/**
 * ServicesPreview — 2×2 card grid showcasing four service pillars.
 *
 * Each card has an animated Lucide icon, title, and description, and
 * links to the corresponding anchor on /services.
 *
 * Enhancements over the baseline spec:
 *  1. **Dot grid → lava blobs** — ServicesBackground continues the
 *     hero's dot grid at the top then cross-fades into slowly morphing
 *     gradient orbs, creating an organic, premium visual evolution.
 *  2. **Per-card scroll-driven reveal** — Each ServiceCard tracks its
 *     own scroll position with staggered offsets so same-row cards
 *     appear individually rather than simultaneously.
 *  3. **AnimatedIcon** — Icons stroke-draw once the card is
 *     sufficiently visible.
 *
 * Spec reference: §6.1 (Homepage — Section 2: Services Preview)
 */

import {
  Palette,
  Code2,
  TrendingUp,
  Brain,
  type LucideIcon,
} from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ServicesBackground from "@/components/home/ServicesBackground";
import ServiceCard from "@/components/home/ServiceCard";

interface ServiceDef {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const services: ServiceDef[] = [
  {
    title: "Digital Strategy & Brand",
    description:
      "From brand identity to content architecture, we build the visual and strategic foundation your business stands on.",
    icon: Palette,
    href: "/services#strategy-brand",
  },
  {
    title: "Development & Integration",
    description:
      "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform.",
    icon: Code2,
    href: "/services#development",
  },
  {
    title: "Revenue Flows & Marketing Ops",
    description:
      "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Everything that turns visibility into revenue.",
    icon: TrendingUp,
    href: "/services#marketing",
  },
  {
    title: "AI & Data Analysis",
    description:
      "Chatbots, RAG systems, workflow automation, and AI consulting. We help you adopt AI that actually works for your business.",
    icon: Brain,
    href: "/services#ai-data",
  },
];

export default function ServicesPreview() {
  return (
    <section id="services-section" className="relative py-[var(--section-gap)]">
      {/* Fading dot grid — visual bridge from hero canvas */}
      <ServicesBackground />

      <div className="container-content relative z-10">
        <ScrollReveal>
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, studio-scale delivery."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              href={service.href}
              index={index}
              icon={
                <service.icon
                  className="h-8 w-8 text-accent"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { ServicesPreview };
