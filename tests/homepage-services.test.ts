import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectPath = process.cwd();
const servicesSection = readFileSync(
  join(projectPath, "components/home/ServicesSection.tsx"),
  "utf8",
);
const servicesGrid = readFileSync(
  join(projectPath, "components/home/ServicesGrid.tsx"),
  "utf8",
);

describe("homepage Services interaction", () => {
  it("uses the natural-flow grid for desktop and retains the mobile carousel", () => {
    expect(servicesSection).toContain("import ServicesGrid from");
    expect(servicesSection).toContain("<ServicesGrid />");
    expect(servicesSection).toContain("<ServicesCarousel />");
    expect(servicesSection).not.toContain("ServicesScroll");
  });

  it("removes the Services-specific pinned ScrollTrigger implementation", () => {
    expect(
      existsSync(join(projectPath, "components/home/ServicesScroll.tsx")),
    ).toBe(false);
    expect(servicesGrid).not.toMatch(
      /gsap|ScrollTrigger|\bpin\b|\bscrub\b|\bsnap\b/,
    );
  });

  it("keeps all four service-detail destinations in the desktop grid", () => {
    expect(servicesGrid).toContain('href: "/services/strategy-brand"');
    expect(servicesGrid).toContain('href: "/services/development"');
    expect(servicesGrid).toContain('href: "/services/marketing"');
    expect(servicesGrid).toContain('href: "/services/ai-data"');
  });
});
