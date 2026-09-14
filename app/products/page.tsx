/**
 * Products Page — /products
 *
 * Product cards from the canonical catalog with SoftwareSourceCode JSON-LD,
 * followed by the
 * "How We Build Software" engineering philosophy section.
 *
 * Spec reference: §6.5 (Products), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ExternalLink,
  ArrowRight,
  Package,
  Database,
  FileText,
  Cpu,
  Blocks,
} from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { PRODUCT_CATALOG, type ProductId } from "@/lib/products";
import { generateSoftwareSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import CTABackground from "@/components/shared/CTABackground";
import SpecToShipIllustration from "@/components/products/SpecToShipIllustration";

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Products",
  description:
    "We build things we need, then share them with the community.",
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "Products | ShruggieTech",
    description:
      "We build things we need, then share them with the community.",
    url: `${SITE_URL}/products`,
    type: "website",
    images: [
      {
        url: getOgImageUrl("Products", { description: "We build things we need, then share them with the community." }),
        width: 1200,
        height: 630,
        alt: "Products | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | ShruggieTech",
    description:
      "We build things we need, then share them with the community.",
    images: [getOgImageUrl("Products", { description: "We build things we need, then share them with the community." })],
  },
};

/* ── Product presentation (spec §6.5) ───────────────────────────────────── */

const PRODUCT_ICONS: Partial<Record<ProductId, LucideIcon>> = {
  "shruggietech-skills": Blocks,
  "shruggie-indexer": Package,
  metadexer: Database,
  "shruggie-feedtools": FileText,
  rustif: Cpu,
};

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ProductsPage() {
  return (
    <>
      {/* JSON-LD is emitted only for products with a public code repository. */}
      {PRODUCT_CATALOG.filter((product) => product.codeRepository).map((product) => (
        <JsonLd
          key={product.id}
          data={generateSoftwareSchema({
            name: product.name,
            description: product.description,
            url: `${SITE_URL}/products#${product.id}`,
            codeRepository: product.codeRepository!,
            programmingLanguage: product.programmingLanguage,
            version: product.version,
          })}
        />
      ))}

      {/* Hero */}
      <PageHero
        headline="Products"
        subheadline="We build things we need, then share them with the community."
        bgClass="section-bg-products"
      />

      {/* Product Cards */}
      <section className="bg-bg-primary pb-16 md:pb-24">
        <div className="container-content pt-16 md:pt-24">
          <ScrollReveal>
            <SectionHeading title="What We're Building" />
          </ScrollReveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {PRODUCT_CATALOG.map((product, i) => {
              const Icon = PRODUCT_ICONS[product.id];
              return (
                <ScrollReveal key={product.id} delay={i * 0.08}>
                  <Card id={product.id} hover className="flex h-full flex-col">
                    {product.markSrc ? (
                      <Image
                        src={product.markSrc}
                        alt=""
                        width={40}
                        height={40}
                        className="mb-3 h-10 w-10 object-contain"
                        aria-hidden="true"
                      />
                    ) : Icon ? (
                      <Icon className="mb-3 h-7 w-7 text-accent" aria-hidden="true" />
                    ) : null}
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                      <h3 className="font-display text-display-xs font-bold text-text-primary">
                        {product.name}
                      </h3>
                      <Badge className="shrink-0">{product.statusBadge}</Badge>
                    </div>
                    <p className="mt-4 flex-1 text-body-md text-text-secondary">
                      {product.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      {product.links.map((link) =>
                        link.kind === "internal" ? (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="group/link focus-visible:outline-focus inline-flex items-center gap-1.5 rounded-sm font-display text-body-sm font-medium text-accent transition-colors hover:text-orange-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
                          >
                            {link.label}
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </Link>
                        ) : (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus-visible:outline-focus inline-flex items-center gap-1.5 rounded-sm font-display text-body-sm font-medium text-accent transition-colors hover:text-orange-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
                          >
                            {link.label}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="sr-only">
                              {" "}(opens in a new tab)
                            </span>
                          </a>
                        ),
                      )}
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engineering Philosophy */}
      <section className="section-bg-cta pb-16 md:pb-24">
        <div className="container-content pt-16 md:pt-24">
          <ScrollReveal>
            <div className="pt-16 md:pt-24">
              <div className="flex flex-col-reverse md:flex-row md:items-center md:gap-16">
                {/* Text content */}
                <div className="md:flex-1">
                  <SectionHeading title="How We Build Software" />
                  <p className="mt-6 text-body-lg leading-relaxed dark:text-[var(--text-body-light)] text-text-secondary">
                    Every product begins with a specification written for AI-first consumption. Our specs are structured so AI coding agents can produce correct implementations within single context windows without interactive clarification. This methodology multiplies engineering throughput without proportional headcount. It is how a small team builds production-grade software tools.
                  </p>
                </div>

                {/* Spec-to-Ship Pipeline illustration */}
                <div className="mb-8 md:mb-0 flex items-center justify-center md:w-[320px] lg:w-[380px] shrink-0">
                  <SpecToShipIllustration />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md font-bold text-text-primary">
              Explore our open source work.
            </h2>
            <div className="mt-8">
              <ShruggieCTA href="https://github.com/shruggietech">View on GitHub</ShruggieCTA>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
