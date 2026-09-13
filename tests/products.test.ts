import { describe, expect, it } from "vitest";

import { SITE_URL } from "../lib/constants";
import {
  FOOTER_PRODUCT_LINKS,
  PRODUCT_CATALOG,
  PRODUCT_IDS,
  getProductById,
} from "../lib/products";
import { generateSoftwareSchema } from "../lib/schema";

describe("canonical product catalog", () => {
  it("keeps stable unique IDs and derives every footer destination", () => {
    const ids = PRODUCT_CATALOG.map((product) => product.id);

    expect(ids).toEqual(PRODUCT_IDS);
    expect(new Set(ids)).toHaveLength(ids.length);
    expect(FOOTER_PRODUCT_LINKS).toEqual(
      PRODUCT_CATALOG.map((product) => ({
        href: `/products#${product.id}`,
        label: product.name,
      })),
    );
  });

  it("records the verified release truth and real destinations", () => {
    expect(getProductById("glitchpad")).toMatchObject({
      codeRepository: "https://github.com/shruggietech/glitchpad",
      statusBadge: "v0.1.3 — Community Release",
      version: "0.1.3",
    });
    expect(getProductById("go-schedule")).toMatchObject({
      codeRepository: "https://github.com/shruggietech/go-schedule",
      programmingLanguage: "Go",
      version: "1.1.1",
    });
    expect(getProductById("fragcap")).toMatchObject({
      codeRepository: "https://github.com/h8rt3rmin8r/fragcap",
      programmingLanguage: "Rust",
      version: "0.9.0",
    });
    expect(
      PRODUCT_CATALOG.some(
        (product) =>
          product.codeRepository === "https://github.com/shruggietech/fragcap",
      ),
    ).toBe(false);
  });

  it("provides secure external links and a direct Glitchpad developer entry", () => {
    for (const product of PRODUCT_CATALOG) {
      for (const link of product.links) {
        if (link.kind === "external") {
          expect(link.href).toMatch(/^https:\/\//);
        }
      }
    }

    expect(getProductById("glitchpad").developerFeature).toEqual({
      description:
        "A local-first desktop and Android viewer and editor for Markdown, Mermaid, plain text, and source files.",
      href: "https://glitchpad.com",
    });
  });

  it("emits complete SoftwareSourceCode data for the new public products", () => {
    for (const id of ["glitchpad", "go-schedule", "fragcap"] as const) {
      const product = getProductById(id);
      expect(
        generateSoftwareSchema({
          codeRepository: product.codeRepository!,
          description: product.description,
          name: product.name,
          programmingLanguage: product.programmingLanguage,
          url: `${SITE_URL}/products#${product.id}`,
          version: product.version,
        }),
      ).toMatchObject({
        "@type": "SoftwareSourceCode",
        codeRepository: product.codeRepository,
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        programmingLanguage: product.programmingLanguage,
        url: `${SITE_URL}/products#${product.id}`,
        version: product.version,
      });
    }
  });
});
