/**
 * Service detail page — /services/[slug]
 *
 * One dedicated page per service pillar (strategy-brand, development,
 * marketing, ai-data), with full copy, capabilities, real FAQs, and both
 * Service + FAQPage JSON-LD. Statically generated from lib/services.ts.
 *
 * This implements the flagship post's guidance: give important services their
 * own pages instead of one crowded list, with FAQs marked up as FAQPage.
 *
 * Spec reference: §6.2 (Services), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { SERVICES, getServiceBySlug } from "@/lib/services";
import {
  generateServiceSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import CTABackground from "@/components/shared/CTABackground";
import SectionHeading from "@/components/ui/SectionHeading";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import ServiceFAQ from "@/components/services/ServiceFAQ";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

/* ── Static generation ──────────────────────────────────────────────────── */

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

/* ── Metadata ───────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  const url = `${SITE_URL}/services/${service.slug}`;
  const ogImage = getOgImageUrl(service.title, {
    description: service.metaDescription,
  });

  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.title} | ShruggieTech`,
      description: service.metaDescription,
      url,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${service.title} | ShruggieTech`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | ShruggieTech`,
      description: service.metaDescription,
      images: [ogImage],
    },
  };
}

/* ── Page Component ─────────────────────────────────────────────────────── */

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const url = `${SITE_URL}/services/${service.slug}`;
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* JSON-LD: Service + FAQPage + BreadcrumbList */}
      <JsonLd
        data={generateServiceSchema({
          name: service.title,
          description: service.lead,
        })}
      />
      <JsonLd data={generateFAQSchema(service.faqs)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Services", url: `${SITE_URL}/services` },
          { name: service.shortName, url },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        headline={service.title}
        subheadline={service.lead}
        bgClass="section-bg-services"
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mt-8">
          <ol className="flex items-center gap-2 text-body-sm text-text-secondary">
            <li>
              <Link href="/services" className="hover:text-accent">
                Services
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-text-muted" />
            </li>
            <li className="text-text-primary font-medium">
              {service.shortName}
            </li>
          </ol>
        </nav>
      </PageHero>

      {/* ── Overview + Capabilities ──────────────────────────────────── */}
      <section className="bg-bg-primary py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="text-body-lg text-text-secondary">{service.body}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-12">
              <h2 className="font-display text-display-sm font-bold text-text-primary">
                What we do
              </h2>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-start gap-3 text-body-md text-text-secondary"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section-bg-services py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="FAQ"
              title="Frequently asked questions"
            />
          </ScrollReveal>
          <ScrollReveal>
            <div className="max-w-3xl">
              <ServiceFAQ faqs={service.faqs} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Other services ───────────────────────────────────────────── */}
      <section className="bg-bg-primary py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <h2 className="font-display text-display-sm font-bold text-text-primary">
              Explore other services
            </h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {otherServices.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/services/${other.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-elevated p-5 transition-colors duration-300 hover:border-accent/40 dark:border-white/[0.06] dark:bg-white/[0.02]"
                  >
                    <span className="font-display text-body-lg font-bold text-text-primary">
                      {other.shortName}
                    </span>
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md font-bold text-text-primary">
              Let&apos;s scope your project.
            </h2>
            <div className="mt-8">
              <ShruggieCTA href="/contact">Get in Touch</ShruggieCTA>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
