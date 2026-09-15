import { describe, expect, it } from "vitest";

import { SITE_URL } from "../lib/constants";
import {
  SKILLS,
  SKILLS_COLLECTION,
  SKILL_SLUGS,
  getSkillBySlug,
} from "../lib/skills";
import {
  generateBreadcrumbSchema,
  generateSoftwareSchema,
} from "../lib/schema";

describe("AI skills catalog", () => {
  it("publishes the six selected skills in deliberate order", () => {
    expect(SKILL_SLUGS).toEqual([
      "shruggie-bash",
      "shruggie-docs",
      "shruggie-html",
      "shruggie-markdown",
      "shruggie-powershell",
      "shruggie-speckit",
    ]);
    expect(new Set(SKILL_SLUGS)).toHaveLength(6);
    expect(getSkillBySlug("shruggie-graph-memory")).toBeUndefined();
  });

  it("keeps every detail page complete and tied to real release assets", () => {
    for (const entry of SKILLS) {
      expect(entry.purpose).toBeTruthy();
      expect(entry.triggerSummary).toBeTruthy();
      expect(entry.enforces.length).toBeGreaterThanOrEqual(4);
      expect(entry.lastUpdated).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(entry.sourceUrl).toBe(
        `https://github.com/shruggietech/skills/tree/main/skills/${entry.slug}`,
      );
      expect(getSkillBySlug(entry.slug)).toEqual(entry);
    }
  });

  it("links to GitHub's automatically updated latest release", () => {
    expect(SKILLS_COLLECTION).toMatchObject({
      license: "Apache-2.0",
      latestReleaseUrl:
        "https://github.com/shruggietech/skills/releases/latest",
    });
    expect(SKILLS_COLLECTION).not.toHaveProperty("collectionRelease");
    expect(SKILLS_COLLECTION).not.toHaveProperty("publishedAt");

    const entry = SKILLS[0];
    const schema = generateSoftwareSchema({
      name: entry.name,
      description: entry.purpose,
      url: `${SITE_URL}/skills/${entry.slug}`,
      codeRepository: SKILLS_COLLECTION.repositoryUrl,
      programmingLanguage: "Markdown",
    });

    expect(schema).toMatchObject({
      "@type": "SoftwareSourceCode",
      codeRepository: SKILLS_COLLECTION.repositoryUrl,
      programmingLanguage: "Markdown",
      url: `${SITE_URL}/skills/${entry.slug}`,
    });
    expect(schema).not.toHaveProperty("version");
  });

  it("emits canonical breadcrumbs for every skill route", () => {
    for (const entry of SKILLS) {
      const url = `${SITE_URL}/skills/${entry.slug}`;
      expect(
        generateBreadcrumbSchema([
          { name: "AI Skills", url: `${SITE_URL}/skills` },
          { name: entry.name, url },
        ]),
      ).toMatchObject({
        "@type": "BreadcrumbList",
        itemListElement: [
          { position: 1, name: "AI Skills", item: `${SITE_URL}/skills` },
          { position: 2, name: entry.name, item: url },
        ],
      });
    }
  });
});
