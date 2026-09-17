/**
 * ServicesGrid — Naturally scrolling desktop presentation for the homepage.
 *
 * Four service pillars render as a responsive card grid in normal document
 * flow. The section intentionally contains capability summaries only; proof
 * stays on the linked service detail pages and the homepage's dedicated Work,
 * Products, and Research sections.
 *
 * Decision: GitHub #22. Implementation: GitHub #93.
 */

import Link from "next/link";
import {
  Brain,
  Code2,
  Palette,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";

import {
  AIDataIllustration,
  DevelopmentIllustration,
  MarketingIllustration,
  StrategyBrandIllustration,
} from "@/components/home/ServiceIllustrations";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

interface ServiceItem {
  description: string;
  href: string;
  icon: LucideIcon;
  Illustration: ComponentType<{ className?: string }>;
  title: string;
}

const services: ServiceItem[] = [
  {
    title: "Digital Strategy & Brand",
    description:
      "Brand identity, content architecture, visual systems, and marketing collateral. The strategic foundation everything else stands on.",
    href: "/services/strategy-brand",
    icon: Palette,
    Illustration: StrategyBrandIllustration,
  },
  {
    title: "Development & Integration",
    description:
      "Custom websites, modern web applications, booking systems, payment integrations, and platform migrations. Built to last, built to perform.",
    href: "/services/development",
    icon: Code2,
    Illustration: DevelopmentIllustration,
  },
  {
    title: "Revenue Flows & Marketing Ops",
    description:
      "SEO, AEO, paid campaigns, social strategy, review generation, and analytics. Turning visibility into revenue.",
    href: "/services/marketing",
    icon: TrendingUp,
    Illustration: MarketingIllustration,
  },
  {
    title: "AI & Data Analysis",
    description:
      "Chatbots, RAG systems, workflow automation, and AI consulting. AI that solves real problems, not just demos well.",
    href: "/services/ai-data",
    icon: Brain,
    Illustration: AIDataIllustration,
  },
];

export default function ServicesGrid() {
  return (
    <section
      id="services-section"
      className="section-bg-services py-[var(--section-gap)]"
    >
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, boutique delivery."
            description="One point of contact. Every layer."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] grid gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <ScrollReveal
              key={service.title}
              delay={index * 0.08}
              className="h-full"
            >
              <Link
                href={service.href}
                className="group/card focus-visible:outline-focus block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Card
                  hover
                  className="group-hover/card:border-accent/40 h-full overflow-hidden p-0 transition-colors duration-300"
                >
                  <div className="grid h-full min-h-[19rem] sm:grid-cols-[minmax(0,1fr)_11rem]">
                    <div className="flex min-w-0 flex-col p-6 md:p-8">
                      <div className="flex items-center justify-between gap-4">
                        <service.icon
                          className="text-accent h-8 w-8"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span
                          className="font-display text-text-muted text-body-xs tracking-[0.18em]"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="font-display text-display-xs text-text-primary group-hover/card:text-accent mt-6 font-bold transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-body-md text-text-secondary mt-3 flex-1 leading-relaxed">
                        {service.description}
                      </p>
                      <span className="font-display text-body-sm text-accent mt-6 inline-flex items-center gap-2 font-medium">
                        Explore this service
                        <span
                          className="transition-transform duration-300 group-hover/card:translate-x-1"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </span>
                    </div>

                    <div
                      className="border-border relative flex min-h-44 items-center justify-center overflow-hidden border-t bg-[radial-gradient(circle_at_50%_45%,rgba(43,204,115,0.12),transparent_66%)] p-4 sm:min-h-0 sm:border-t-0 sm:border-l dark:border-white/[0.06]"
                      aria-hidden="true"
                    >
                      <div className="bg-accent/10 absolute h-32 w-32 rounded-full blur-3xl transition-transform duration-500 group-hover/card:scale-125" />
                      <service.Illustration className="relative h-40 w-40 opacity-80 transition-all duration-500 group-hover/card:scale-[1.03] group-hover/card:opacity-100" />
                    </div>
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
