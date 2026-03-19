/**
 * ServicesPreview — 2x2 card grid showcasing four service pillars.
 *
 * Each card has a side-by-side layout: text content (icon, title,
 * description) on the left, a purpose-built SVG illustration on the
 * right. Illustrations are hidden on narrow viewports where the
 * side-by-side layout would be cramped. Uses Card component with
 * ScrollReveal staggered delays.
 *
 * Spec reference: §6.1 (Homepage — Section 2: Services Preview)
 */

import Link from "next/link";
import {
  Palette,
  Code2,
  TrendingUp,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { type ComponentType } from "react";

import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";
import {
  StrategyBrandIllustration,
  DevelopmentIllustration,
  MarketingIllustration,
  AIDataIllustration,
} from "@/components/home/ServiceIllustrations";

interface ServiceCard {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  Illustration: ComponentType<{ className?: string }>;
}

const services: ServiceCard[] = [
  {
    title: "Digital Strategy & Brand",
    description:
      "Brand identity, content architecture, visual systems, and marketing collateral. The strategic foundation everything else stands on.",
    icon: Palette,
    href: "/services#strategy-brand",
    Illustration: StrategyBrandIllustration,
  },
  {
    title: "Development & Integration",
    description:
      "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform.",
    icon: Code2,
    href: "/services#development",
    Illustration: DevelopmentIllustration,
  },
  {
    title: "Revenue Flows & Marketing Ops",
    description:
      "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Turning visibility into revenue.",
    icon: TrendingUp,
    href: "/services#marketing",
    Illustration: MarketingIllustration,
  },
  {
    title: "AI & Data Analysis",
    description:
      "Chatbots, RAG systems, workflow automation, and AI consulting. AI that solves real problems, not just demos well.",
    icon: Brain,
    href: "/services#ai-data",
    Illustration: AIDataIllustration,
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-[var(--section-gap)]">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, boutique delivery."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.08}>
              <Link href={service.href} className="block h-full">
                <Card className="flex h-full flex-col md:flex-row md:items-center md:gap-6">
                  {/* Text content */}
                  <div className="flex flex-1 flex-col">
                    <service.icon
                      className="mb-4 h-8 w-8 text-accent"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-display-sm font-bold text-text-primary">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-body-md text-text-secondary">
                      {service.description}
                    </p>
                  </div>

                  {/* SVG illustration — visible on md+ */}
                  <div
                    className="hidden flex-shrink-0 md:block"
                    aria-hidden="true"
                  >
                    <service.Illustration className="h-[140px] w-[160px] opacity-80" />
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ServicesPreview };