/**
 * AI Skills hub — /skills
 *
 * Public catalog of the six ShruggieTech AI skills. Catalog metadata is a
 * checked-in, verified snapshot from lib/skills.ts; no build-time network call
 * is required.
 *
 * Spec reference: §6.12 (AI Skills Catalog), §8.2 (JSON-LD)
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Braces,
  FileCode2,
  FileText,
  GitBranch,
  SquareTerminal,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import { SKILLS, SKILLS_COLLECTION, type SkillSlug } from "@/lib/skills";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CTABackground from "@/components/shared/CTABackground";

const SKILL_ICONS: Record<SkillSlug, LucideIcon> = {
  "shruggie-bash": Terminal,
  "shruggie-docs": FileText,
  "shruggie-html": Braces,
  "shruggie-markdown": FileCode2,
  "shruggie-powershell": SquareTerminal,
  "shruggie-speckit": GitBranch,
};

const description =
  "Six open-source AI skills that encode ShruggieTech's working standards for scripts, documents, and delivery workflows.";

export const metadata: Metadata = {
  title: "AI Skills",
  description,
  alternates: { canonical: `${SITE_URL}/skills` },
  openGraph: {
    title: "AI Skills | ShruggieTech",
    description,
    url: `${SITE_URL}/skills`,
    type: "website",
    images: [
      {
        url: getOgImageUrl("AI Skills", { description }),
        width: 1200,
        height: 630,
        alt: "AI Skills | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skills | ShruggieTech",
    description,
    images: [getOgImageUrl("AI Skills", { description })],
  },
};

export default function SkillsPage() {
  return (
    <>
      <PageHero
        headline="AI Skills"
        subheadline="Open-source instructions that turn working standards into repeatable AI workflows."
        bgClass="section-bg-products"
      />

      <section className="bg-bg-primary pb-16 md:pb-24">
        <div className="container-content pt-16 md:pt-24">
          <ScrollReveal>
            <div className="border-border bg-bg-elevated flex flex-col gap-5 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06] dark:bg-white/[0.025]">
              <div>
                <p className="font-display text-body-lg text-text-primary font-bold">
                  Collection release v{SKILLS_COLLECTION.collectionRelease}
                </p>
                <p className="text-body-sm text-text-secondary mt-1">
                  Six skills, actively maintained, licensed Apache-2.0.
                </p>
              </div>
              <a
                href={SKILLS_COLLECTION.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-body-sm text-accent hover:text-orange-foreground focus-visible:outline-focus inline-flex w-fit items-center gap-2 rounded-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                View the repository
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-16">
              <SectionHeading
                label="THE COLLECTION"
                title="Six focused skills."
                description="Each skill has a narrow trigger, explicit guardrails, and a download you can inspect before using."
              />
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {SKILLS.map((entry, index) => {
              const Icon = SKILL_ICONS[entry.slug];
              return (
                <ScrollReveal key={entry.slug} delay={index * 0.06}>
                  <Card hover className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <Icon
                        aria-hidden="true"
                        className="text-accent h-7 w-7 shrink-0"
                      />
                      <Badge>Open source</Badge>
                    </div>
                    <h2 className="font-display text-display-xs text-text-primary mt-5 font-bold">
                      {entry.name}
                    </h2>
                    <p className="text-body-md text-text-secondary mt-3 flex-1 leading-relaxed">
                      {entry.purpose}
                    </p>
                    <p className="text-body-sm text-text-muted mt-5">
                      <span className="text-text-secondary font-medium">
                        Triggers for:
                      </span>{" "}
                      {entry.triggerSummary}
                    </p>
                    <Link
                      href={`/skills/${entry.slug}`}
                      className="group/link font-display text-body-sm text-accent hover:text-orange-foreground focus-visible:outline-focus mt-6 inline-flex w-fit items-center gap-2 rounded-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      Explore {entry.name}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md text-text-primary font-bold">
              Inspect the source before you install.
            </h2>
            <p className="text-body-lg text-text-secondary mx-auto mt-5 max-w-2xl">
              Every instruction, supporting asset, and release artifact is
              public.
            </p>
            <div className="mt-8">
              <a
                href={SKILLS_COLLECTION.releaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cta font-display focus-visible:outline-focus inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Browse release v{SKILLS_COLLECTION.collectionRelease}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
