/**
 * Products Page — /products
 *
 * Four product cards with SoftwareSourceCode JSON-LD, followed by the
 * "How We Build Software" engineering philosophy section.
 *
 * Spec reference: §6.5 (Products), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

import { SITE_URL } from "@/lib/constants";
import { generateSoftwareSchema } from "@/lib/schema";
import JsonLd from "@/components/shared/JsonLd";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Products",
  description:
    "Open-source tools and software products built by ShruggieTech. We build things we need, then share them with the community.",
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "Products | ShruggieTech",
    description:
      "Open-source tools and software products built by ShruggieTech. We build things we need, then share them with the community.",
    url: `${SITE_URL}/products`,
    type: "website",
  },
};

/* ── Product Data (spec §6.5) ───────────────────────────────────────────── */

interface ProductLink {
  label: string;
  href: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  statusBadge: string;
  links: ProductLink[];
  programmingLanguage: string;
  codeRepository: string;
  version?: string;
}

const PRODUCTS: Product[] = [
  {
    id: "shruggie-indexer",
    name: "shruggie-indexer",
    description:
      "Cross-platform file and directory indexing tool. Produces structured JSON output with hash-based content identities, filesystem metadata, and EXIF extraction.",
    statusBadge: "v0.1.2 — Active",
    links: [
      { label: "GitHub", href: "https://github.com/shruggietech/shruggie-indexer" },
      { label: "Docs", href: "https://github.com/shruggietech/shruggie-indexer#readme" },
    ],
    programmingLanguage: "TypeScript",
    codeRepository: "https://github.com/shruggietech/shruggie-indexer",
    version: "0.1.2",
  },
  {
    id: "metadexer",
    name: "metadexer",
    description:
      "Content-addressed asset management system. Storage, cataloging, deduplication, and search across large, heterogeneous digital collections.",
    statusBadge: "Pre-release — In Development",
    links: [
      { label: "GitHub", href: "https://github.com/shruggietech/metadexer" },
    ],
    programmingLanguage: "TypeScript",
    codeRepository: "https://github.com/shruggietech/metadexer",
  },
  {
    id: "shruggie-feedtools",
    name: "shruggie-feedtools",
    description:
      "ShruggieTech's reference project for Python tool conventions, packaging patterns, and GUI design language.",
    statusBadge: "Active",
    links: [
      { label: "GitHub", href: "https://github.com/shruggietech/shruggie-feedtools" },
    ],
    programmingLanguage: "Python",
    codeRepository: "https://github.com/shruggietech/shruggie-feedtools",
  },
  {
    id: "rustif",
    name: "rustif",
    description:
      "A proposed Rust-native metadata processing engine. The next-generation successor to thirty years of metadata infrastructure.",
    statusBadge: "Declaration Phase",
    links: [
      { label: "Read Declaration", href: "#" },
    ],
    programmingLanguage: "Rust",
    codeRepository: "https://github.com/shruggietech/rustif",
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ProductsPage() {
  return (
    <>
      {/* JSON-LD for each product */}
      {PRODUCTS.map((product) => (
        <JsonLd
          key={product.id}
          data={generateSoftwareSchema({
            name: product.name,
            description: product.description,
            url: `${SITE_URL}/products`,
            codeRepository: product.codeRepository,
            programmingLanguage: product.programmingLanguage,
            version: product.version,
          })}
        />
      ))}

      {/* Hero */}
      <section className="container-content py-24 md:py-32">
        <ScrollReveal>
          <SectionHeading
            title="Products"
            description="Open-source tools and software products built by ShruggieTech. We build things we need, then share them with the community."
            align="center"
          />
        </ScrollReveal>
      </section>

      {/* Product Cards */}
      <section className="container-content pb-16 md:pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.08}>
              <Card hover className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-display-xs font-bold text-text-primary">
                    {product.name}
                  </h3>
                  <Badge className="shrink-0">{product.statusBadge}</Badge>
                </div>
                <p className="mt-4 flex-1 text-body-md text-text-secondary">
                  {product.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  {product.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-display text-body-sm font-medium text-accent transition-colors hover:text-accent-hover"
                    >
                      {link.label}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Engineering Philosophy */}
      <section className="container-narrow pb-24 md:pb-32">
        <ScrollReveal>
          <div className="border-t border-border pt-16 md:pt-24">
            <SectionHeading title="How We Build Software" />
            <p className="mt-6 text-body-lg leading-relaxed text-text-secondary">
              Every ShruggieTech product begins with a specification written for
              AI-first consumption. Our specifications are structured so that AI
              coding agents can produce correct implementations within single
              context windows without interactive clarification. This methodology
              multiplies engineering throughput without proportional headcount. It
              is how a two-person studio builds production-grade software tools.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
