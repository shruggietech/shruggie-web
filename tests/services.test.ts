import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { BRAND_PORTFOLIO } from "@/lib/company-work";
import { SERVICES } from "@/lib/services";

describe("service proof catalog", () => {
  it("gives every service at least one delivery-backed proof example", () => {
    for (const service of SERVICES) {
      expect(service.proofs.length, service.slug).toBeGreaterThan(0);
      expect(
        service.proofs.some((proof) => proof.kind !== "Portfolio"),
        `${service.slug} needs client, product, or research evidence`,
      ).toBe(true);
    }
  });

  it("keeps proof destinations and available image assets valid", () => {
    for (const service of SERVICES) {
      for (const proof of service.proofs) {
        expect(proof.href).toMatch(/^(\/|https:\/\/)/);
        expect(proof.linkLabel.trim()).not.toBe("");

        if (proof.external) {
          expect(proof.href).toMatch(/^https:\/\//);
        }

        if (proof.image) {
          expect(proof.image.alt.trim()).not.toBe("");
          expect(
            existsSync(join(process.cwd(), "public", proof.image.src)),
            proof.image.src,
          ).toBe(true);
        }
      }
    }
  });

  it("uses the canonical brand portfolio record in the strategy service", () => {
    const strategy = SERVICES.find(
      (service) => service.slug === "strategy-brand",
    );
    const portfolioProof = strategy?.proofs.find(
      (proof) => proof.href === BRAND_PORTFOLIO.href,
    );

    expect(portfolioProof).toMatchObject({
      external: true,
      kind: "Portfolio",
      linkLabel: BRAND_PORTFOLIO.linkLabel,
      name: BRAND_PORTFOLIO.name,
    });
  });
});
