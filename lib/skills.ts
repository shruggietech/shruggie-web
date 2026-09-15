/**
 * ShruggieTech AI skills catalog.
 *
 * The site deliberately keeps a checked-in content snapshot instead of fetching
 * GitHub during the build. Release discovery uses GitHub's stable latest-release
 * redirect so the site never presents a stale repository-wide version as if it
 * were per-skill semantic versioning.
 *
 * Verified against shruggietech/skills on 2026-09-14.
 * Spec reference: §6.12 (AI Skills Catalog)
 */

const SKILLS_REPOSITORY_URL = "https://github.com/shruggietech/skills";

export const SKILLS_COLLECTION = {
  license: "Apache-2.0",
  latestReleaseUrl: `${SKILLS_REPOSITORY_URL}/releases/latest`,
  repositoryUrl: SKILLS_REPOSITORY_URL,
} as const;

export interface SkillCatalogEntry {
  enforces: readonly string[];
  lastUpdated: string;
  name: string;
  purpose: string;
  slug: string;
  sourceUrl: string;
  triggerSummary: string;
}

const skill = (
  entry: Omit<SkillCatalogEntry, "sourceUrl">,
): SkillCatalogEntry => ({
  ...entry,
  sourceUrl: `${SKILLS_REPOSITORY_URL}/tree/main/skills/${entry.slug}`,
});

export const SKILLS = [
  skill({
    slug: "shruggie-bash",
    name: "Shruggie Bash",
    purpose:
      "Authors and refactors Bash scripts to ShruggieTech's operator-ready scripting standard.",
    triggerSummary:
      "Use for a saved Bash or shell script, a new .sh file, or a request to bring an existing script up to ShruggieTech conventions.",
    enforces: [
      "Fixed four-section, 80-column script structure",
      "Man-page help, safe shell options, and snake_case naming",
      "Predictable quiet modes and a 0/1/2 exit-code contract",
      "UTF-8 without BOM, LF endings, and compliance checking",
    ],
    lastUpdated: "2026-08-22",
  }),
  skill({
    slug: "shruggie-docs",
    name: "Shruggie Docs",
    purpose:
      "Builds self-contained Word documents that use the official ShruggieTech parent-brand system.",
    triggerSummary:
      "Use for ShruggieTech-branded .docx files, contracts, statements or scopes of work, reports, invoices, and letters.",
    enforces: [
      "Embedded Space Grotesk and Geist typography",
      "Approved brand colors, logo treatment, and document geometry",
      "Human confirmation for legal, signatory, and payment fields",
      "Render and OOXML validation before delivery",
    ],
    lastUpdated: "2026-07-02",
  }),
  skill({
    slug: "shruggie-html",
    name: "Shruggie HTML",
    purpose:
      "Builds a self-contained HTML artifact in the official ShruggieTech parent-brand identity.",
    triggerSummary:
      "Use for a standalone branded HTML page, one-pager, mini-site, internal report, or pitch page, but not a component-framework application.",
    enforces: [
      "A single portable HTML deliverable",
      "Official color, typography, logo, and voice rules",
      "Dark-mode-first responsive presentation",
      "Clear separation from independent product sub-brands",
    ],
    lastUpdated: "2026-05-12",
  }),
  skill({
    slug: "shruggie-markdown",
    name: "Shruggie Markdown",
    purpose:
      "Applies ShruggieTech's house style to Markdown documents and diagrams.",
    triggerSummary:
      "Use when writing or refactoring a README, report, specification, plan, case study, or other Markdown document to house style.",
    enforces: [
      "One H1, consistent heading spacing, and prose-first structure",
      "Soft wrapping by default and hard wrapping only when requested",
      "GFM footnotes, language-tagged fences, and compatible diagrams",
      "Audience-aware rules for AI-only and human-facing documents",
    ],
    lastUpdated: "2026-08-21",
  }),
  skill({
    slug: "shruggie-powershell",
    name: "Shruggie PowerShell",
    purpose:
      "Authors and refactors PowerShell scripts to ShruggieTech's operator-ready scripting standard.",
    triggerSummary:
      "Use for a saved PowerShell script, a new .ps1 file, or a request to bring an existing script up to ShruggieTech conventions.",
    enforces: [
      "Fixed four-section, 80-column script structure",
      "Comment-based help, CmdletBinding, and explicit parameter sets",
      "ShouldProcess safety, LiteralPath handling, and a 0/1/2 exit contract",
      "UTF-8 without BOM, LF endings, and compliance checking",
    ],
    lastUpdated: "2026-08-22",
  }),
  skill({
    slug: "shruggie-speckit",
    name: "Shruggie Speckit Autopilot",
    purpose:
      "Runs an installed spec-kit feature slice from specification through verified local commit.",
    triggerSummary:
      "Use when the operator explicitly kicks off an entire spec-kit slice under autopilot, not for a single spec-kit command.",
    enforces: [
      "Ordered specify, clarify, plan, tasks, analyze, implement, and verify flow",
      "A blocking analysis gate with findings resolved before implementation",
      "Project-native tests, security checks, and delivery conventions",
      "A mandatory human halt before git push or release",
    ],
    lastUpdated: "2026-07-18",
  }),
] as const satisfies readonly SkillCatalogEntry[];

export type SkillSlug = (typeof SKILLS)[number]["slug"];

export const SKILL_SLUGS = SKILLS.map((entry) => entry.slug);

export function getSkillBySlug(slug: string): SkillCatalogEntry | undefined {
  return SKILLS.find((entry) => entry.slug === slug);
}
