import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectPath = process.cwd();
const workSection = readFileSync(
  join(projectPath, "components/home/WorkSection.tsx"),
  "utf8",
);
const workGrid = readFileSync(
  join(projectPath, "components/home/WorkTabs.tsx"),
  "utf8",
);

describe("homepage Work interaction", () => {
  it("uses category-tabbed desktop showcases and retains the mobile carousel", () => {
    expect(workSection).toContain("<WorkTabs />");
    expect(workSection).toContain("<WorkCarousel />");
    expect(workSection).not.toContain("WorkScroll");
    expect(workGrid).toContain('id="work-section"');
  });

  it("removes the Work-specific pinned frame implementation", () => {
    expect(
      existsSync(join(projectPath, "components/home/WorkScroll.tsx")),
    ).toBe(false);
    expect(workGrid).not.toMatch(
      /gsap|ScrollTrigger|SectionProgress|\bpin\b|\bscrub\b|\bsnap\b|h-screen/,
    );
  });

  it("preserves canonical case-study content, imagery, metrics, and links in order", () => {
    expect(workGrid).toContain("caseStudies.map((study");
    for (const field of [
      "client",
      "industry",
      "summary",
      "metric",
      "logo",
      "image",
    ]) {
      expect(workGrid).toContain(`study.${field}`);
    }
    expect(workGrid).toContain("href={`/work/${study.slug}`}");
    expect(workGrid).toContain("ScrollReveal");
  });
});
