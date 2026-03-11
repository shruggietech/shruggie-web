/**
 * LandingPageTemplate — Shared template for audience-specific landing pages.
 *
 * Renders a consistent structure: hero, pain point cards, relevant services,
 * social proof (case study or research/product references), and CTA.
 * Reused by all four /for/ landing pages with segment-specific content.
 *
 * Spec reference: §6.9 (Audience Landing Pages)
 */

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SectionHeading from "@/components/ui/SectionHeading";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface PainPoint {
  title: string;
  description: string;
}

interface SocialProofItem {
  type: "case-study" | "research" | "product";
  title: string;
  description: string;
  href: string;
}

interface LandingPageTemplateProps {
  headline: string;
  subheadline: string;
  painPoints: PainPoint[];
  relevantServices: string[];
  socialProof: SocialProofItem[];
  ctaText?: string;
}

export default function LandingPageTemplate({
  headline,
  subheadline,
  painPoints,
  relevantServices,
  socialProof,
  ctaText = "Start a Conversation",
}: LandingPageTemplateProps) {
  return (
    <>
      {/* Hero */}
      <section className="py-[var(--section-gap)]">
        <div className="container-content">
          <ScrollReveal>
            <h1 className="max-w-4xl font-display text-display-lg font-bold text-text-primary">
              {headline}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-body-lg text-text-secondary">
              {subheadline}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-[var(--section-gap)]">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="CHALLENGES"
              title="Sound familiar?"
            />
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((point, i) => (
              <ScrollReveal key={point.title} delay={i * 0.08}>
                <Card>
                  <h3 className="font-display text-body-lg font-bold text-text-primary">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-body-md text-text-secondary">
                    {point.description}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant Services */}
      <section className="py-[var(--section-gap)]">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="HOW WE HELP"
              title="Services built for your needs."
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-3">
              {relevantServices.map((service) => (
                <Badge key={service}>{service}</Badge>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Social Proof */}
      {socialProof.length > 0 && (
        <section className="py-[var(--section-gap)]">
          <div className="container-content">
            <ScrollReveal>
              <SectionHeading
                label="PROOF"
                title="See the work."
              />
            </ScrollReveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {socialProof.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <a href={item.href} className="block">
                    <Card>
                      <Badge className="mb-3">
                        {item.type === "case-study"
                          ? "Case Study"
                          : item.type === "research"
                            ? "Research"
                            : "Product"}
                      </Badge>
                      <h3 className="font-display text-body-lg font-bold text-text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-body-md text-text-secondary">
                        {item.description}
                      </p>
                      <span className="mt-4 inline-block text-body-sm font-medium text-accent">
                        {item.type === "case-study"
                          ? "Read case study →"
                          : item.type === "research"
                            ? "Read paper →"
                            : "View project →"}
                      </span>
                    </Card>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative border-t border-green-bright-20 bg-gradient-to-b from-gray-900 to-brand-black py-[var(--section-gap)]">
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md font-bold text-brand-white">
              Ready to get started?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-body-lg text-gray-400">
              The first step is always a conversation. Tell us what you need,
              and we&apos;ll figure out the best way to help.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-10">
              <ShruggieCTA href="/contact">{ctaText}</ShruggieCTA>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

export { LandingPageTemplate };
export type {
  LandingPageTemplateProps,
  PainPoint,
  SocialProofItem,
};
