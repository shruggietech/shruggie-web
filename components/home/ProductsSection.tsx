/**
 * ProductsSection — Curated product proof for the homepage.
 *
 * Featured items and their order are declared in the canonical product
 * catalog. This server-rendered section adds no carousel or animation runtime
 * beyond the shared reduced-motion-aware ScrollReveal treatment.
 *
 * Spec reference: §6.1 (Homepage — Products Portfolio)
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { HOMEPAGE_PRODUCTS } from "@/lib/products";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ProductsSection() {
  return (
    <section
      id="products-section"
      className="section-bg-products relative overflow-hidden py-[var(--section-gap)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(43,204,115,0.08),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(255,83,0,0.06),transparent_30%)]"
      />

      <div className="container-content relative z-[1]">
        <ScrollReveal>
          <SectionHeading
            label="PRODUCTS"
            title="Built from problems worth solving."
            description="We turn recurring technical friction into focused, open-source software—and keep shipping."
          />
        </ScrollReveal>

        <div className="mt-[var(--component-gap)] grid gap-6 lg:grid-cols-2">
          {HOMEPAGE_PRODUCTS.map((product, index) => {
            const feature = product.homepageFeature;
            return (
              <ScrollReveal key={product.id} delay={index * 0.08}>
                <Card
                  hover
                  className="relative flex h-full flex-col overflow-hidden border-white/[0.08] bg-white/[0.035]"
                >
                  <div
                    aria-hidden="true"
                    className="via-accent/60 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
                  />

                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:gap-5">
                    {product.markSrc && (
                      <Image
                        src={product.markSrc}
                        alt=""
                        width={64}
                        height={64}
                        className="h-14 w-14 object-contain md:h-16 md:w-16"
                        aria-hidden="true"
                      />
                    )}
                    <Badge className="shrink-0">{product.statusBadge}</Badge>
                  </div>

                  <h3 className="font-display text-display-sm text-text-primary mt-6 font-bold">
                    {product.name}
                  </h3>
                  <p className="text-body-md text-text-secondary mt-3 flex-1 leading-relaxed">
                    {feature.description}
                  </p>

                  {feature.cta.kind === "external" ? (
                    <a
                      href={feature.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link font-display text-body-md text-accent hover:text-orange-foreground focus-visible:outline-focus mt-6 inline-flex w-fit items-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {feature.cta.label}
                      <ExternalLink
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
                      />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link
                      href={feature.cta.href}
                      className="group/link font-display text-body-md text-accent hover:text-orange-foreground focus-visible:outline-focus mt-6 inline-flex w-fit items-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {feature.cta.label}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  )}
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.16} className="mt-10">
          <Link
            href="/products"
            className="group/catalog border-border font-display text-body-md text-text-primary hover:border-accent hover:text-accent focus-visible:outline-focus inline-flex items-center gap-2 rounded-lg border bg-transparent px-6 py-3 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Explore all products
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover/catalog:translate-x-0.5"
            />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { ProductsSection };
