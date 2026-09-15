import { SITE_URL } from "./constants";

export interface ProductLink {
  href: string;
  kind: "external" | "internal";
  label: string;
}

export interface HomepageProductFeature {
  cta: ProductLink;
  description: string;
  order: number;
}

export interface ProductCatalogEntry {
  codeRepository?: string;
  description: string;
  developerFeature?: {
    description: string;
    href: string;
  };
  footer: boolean;
  footerHref?: string;
  homepageFeature?: HomepageProductFeature;
  id: string;
  links: readonly ProductLink[];
  markSrc?: string;
  name: string;
  programmingLanguage?: string;
  statusBadge: string;
  version?: string;
}

const PRODUCT_CATALOG_SOURCE = [
  {
    id: "glitchpad",
    name: "Glitchpad",
    description:
      "A local-first, cross-platform viewer and editor for Markdown, Mermaid, plain text, and recognized source files, with compact multi-document tabs.",
    statusBadge: "v0.1.3 — Community Release",
    links: [
      { label: "Website", href: "https://glitchpad.com", kind: "external" },
      {
        label: "Docs",
        href: "https://glitchpad.com/docs",
        kind: "external",
      },
      {
        label: "GitHub",
        href: "https://github.com/shruggietech/glitchpad",
        kind: "external",
      },
    ],
    programmingLanguage: "TypeScript and Rust",
    codeRepository: "https://github.com/shruggietech/glitchpad",
    version: "0.1.3",
    footer: true,
    markSrc: "/images/products/glitchpad-mark-color.svg",
    homepageFeature: {
      order: 1,
      description:
        "A fast, local-first workspace for viewing and editing the files you actually use, across desktop and Android.",
      cta: {
        label: "Visit Glitchpad",
        href: "https://glitchpad.com",
        kind: "external",
      },
    },
    developerFeature: {
      description:
        "A local-first desktop and Android viewer and editor for Markdown, Mermaid, plain text, and source files.",
      href: "https://glitchpad.com",
    },
  },
  {
    id: "go-schedule",
    name: "go-schedule",
    description:
      "A cross-platform task scheduler with readable schedules, supported cron, a background daemon, CLI, desktop GUI, trigger sets, and filesystem events.",
    statusBadge: "v1.1.1 — Active",
    links: [
      {
        label: "Docs",
        href: "https://shruggietech.github.io/go-schedule/",
        kind: "external",
      },
      {
        label: "GitHub",
        href: "https://github.com/shruggietech/go-schedule",
        kind: "external",
      },
    ],
    programmingLanguage: "Go",
    codeRepository: "https://github.com/shruggietech/go-schedule",
    version: "1.1.1",
    footer: true,
    markSrc: "/images/products/go-schedule-mark-color.svg",
    homepageFeature: {
      order: 2,
      description:
        "Readable schedules, supported cron, a background daemon, CLI, desktop GUI, and event-driven automation in one Go tool.",
      cta: {
        label: "Explore go-schedule",
        href: "https://shruggietech.github.io/go-schedule/",
        kind: "external",
      },
    },
  },
  {
    id: "fragcap",
    name: "fragcap",
    description:
      "A Windows game-traffic capture tool that attributes flows to processes and writes Wireshark-compatible pcapng files, with explicit target-scoped Deep Capture.",
    statusBadge: "v0.9.0 — Active",
    links: [
      { label: "Docs", href: "https://fragcap.com", kind: "external" },
      {
        label: "GitHub",
        href: "https://github.com/h8rt3rmin8r/fragcap",
        kind: "external",
      },
    ],
    programmingLanguage: "Rust",
    codeRepository: "https://github.com/h8rt3rmin8r/fragcap",
    version: "0.9.0",
    footer: true,
    markSrc: "/images/products/fragcap-mark-color.svg",
  },
  {
    id: "shruggietech-skills",
    name: "ShruggieTech Skills",
    description:
      "Six open-source AI skills that encode repeatable standards for scripts, documents, and specification-driven delivery.",
    statusBadge: "Active · Releases on GitHub",
    links: [
      { label: "Explore Skills", href: "/skills", kind: "internal" },
      {
        label: "GitHub",
        href: "https://github.com/shruggietech/skills",
        kind: "external",
      },
    ],
    programmingLanguage: "Markdown",
    codeRepository: "https://github.com/shruggietech/skills",
    footer: true,
    footerHref: "/skills",
  },
  {
    id: "shruggie-indexer",
    name: "shruggie-indexer",
    description:
      "Cross-platform file and directory indexing tool. Produces structured JSON output with hash-based content identities, filesystem metadata, and EXIF extraction.",
    statusBadge: "v0.1.2 — Active",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/shruggietech/shruggie-indexer",
        kind: "external",
      },
      {
        label: "Docs",
        href: "https://github.com/shruggietech/shruggie-indexer#readme",
        kind: "external",
      },
    ],
    programmingLanguage: "TypeScript",
    codeRepository: "https://github.com/shruggietech/shruggie-indexer",
    version: "0.1.2",
    footer: true,
  },
  {
    id: "metadexer",
    name: "metadexer",
    description:
      "Content-addressed asset management system. Storage, cataloging, deduplication, and search across large, heterogeneous digital collections.",
    statusBadge: "Pre-release — In Development",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/shruggietech/metadexer",
        kind: "external",
      },
    ],
    programmingLanguage: "TypeScript",
    codeRepository: "https://github.com/shruggietech/metadexer",
    footer: true,
  },
  {
    id: "shruggie-feedtools",
    name: "shruggie-feedtools",
    description:
      "ShruggieTech's reference project for Python tool conventions, packaging patterns, and GUI design language.",
    statusBadge: "Active",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/shruggietech/shruggie-feedtools",
        kind: "external",
      },
    ],
    programmingLanguage: "Python",
    codeRepository: "https://github.com/shruggietech/shruggie-feedtools",
    footer: true,
  },
  {
    id: "rustif",
    name: "rustif",
    description:
      "A proposed Rust-native metadata processing engine. The next-generation successor to thirty years of metadata infrastructure.",
    statusBadge: "Declaration Phase",
    links: [
      {
        label: "Read Declaration",
        href: "/research/rustif",
        kind: "internal",
      },
    ],
    programmingLanguage: "Rust",
    codeRepository: `${SITE_URL}/research/rustif`,
    footer: true,
  },
] as const satisfies readonly ProductCatalogEntry[];

export type ProductId = (typeof PRODUCT_CATALOG_SOURCE)[number]["id"];

export const PRODUCT_CATALOG: readonly (ProductCatalogEntry & {
  id: ProductId;
})[] = PRODUCT_CATALOG_SOURCE;

export const PRODUCT_IDS = PRODUCT_CATALOG.map((product) => product.id);

export const FOOTER_PRODUCT_LINKS = PRODUCT_CATALOG.filter(
  (product) => product.footer,
).map((product) => ({
  href: product.footerHref ?? `/products#${product.id}`,
  label: product.name,
}));

function hasHomepageFeature(
  product: ProductCatalogEntry & { id: ProductId },
): product is ProductCatalogEntry & {
  homepageFeature: HomepageProductFeature;
  id: ProductId;
} {
  return product.homepageFeature !== undefined;
}

export const HOMEPAGE_PRODUCTS = PRODUCT_CATALOG.filter(
  hasHomepageFeature,
).sort(
  (left, right) => left.homepageFeature.order - right.homepageFeature.order,
);

export function getProductById(id: ProductId): ProductCatalogEntry {
  const product = PRODUCT_CATALOG.find((candidate) => candidate.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
}
