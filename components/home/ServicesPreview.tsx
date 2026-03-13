/**
 * ServicesPreview — 2x2 card grid showcasing four service pillars.
 *
 * Each card has a Lucide icon, title, and description, and links to
 * the corresponding anchor on /services. Uses Card component with
 * ScrollReveal staggered delays.
 *
 * Spec reference: §6.1 (Homepage — Section 2: Services Preview)
 */

import Link from "next/link";
import { Palette, Code2, TrendingUp, Brain, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface ServiceCard {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const services: ServiceCard[] = [
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
    <section className="py-[var(--section-gap)]">
      <div className="container-content">
        <ScrollReveal>
          <SectionHeading
            label="WHAT WE DO"
            title="Full-stack capability, studio-scale delivery."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.08}>
              <Link href={service.href} className="block h-full">
                <Card className="flex h-full flex-col">
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
