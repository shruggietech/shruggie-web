/**
 * Public portfolio destinations that complement the repository-backed case
 * studies on /work. Keep externally hosted company work here so Services and
 * Work can reference one canonical label, URL, and description.
 */

export interface CompanyWorkEntry {
  description: string;
  href: string;
  linkLabel: string;
  name: string;
  typeLabel: string;
}

export const BRAND_PORTFOLIO = {
  name: "Brand Building",
  typeLabel: "Brand portfolio",
  description:
    "Explore identity systems, brand standards, and applied visual work from ShruggieTech engagements.",
  href: "https://brand.shruggie.tech/",
  linkLabel: "Explore the Brand Building portfolio",
} as const satisfies CompanyWorkEntry;
