/**
 * Work (Case Studies) index page — /work
 *
 * Renders a hero section with headline and subheadline, followed by
 * case study cards in a responsive 2-column grid (desktop) / 1-column (mobile).
 * Cards without hero images display a "Coming Soon" badge overlay.
 *
 * Spec reference: §6.3 (Work / Case Studies)
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";

import { SITE_URL } from "@/lib/constants";
import { getAllCaseStudiesMeta, type CaseStudyMeta } from "@/lib/work";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Real problems, real solutions, real results. Here is what we have built for our clients.",
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "Work | ShruggieTech",
    description:
      "Real problems, real solutions, real results. Here is what we have built for our clients.",
    url: `${SITE_URL}/work`,
    type: "website",
  },
};

function heroImageExists(heroImage: string): boolean {
  if (!heroImage) return false;
  const absolutePath = path.join(process.cwd(), "public", heroImage);
  return fs.existsSync(absolutePath);
}

function CaseStudyCard({ study }: { study: CaseStudyMeta }) {
  const hasHeroImage = heroImageExists(study.heroImage);

  return (
    <Link href={`/work/${study.slug}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 group-hover:border-accent/40">
        {/* Hero Image Area */}
        <div className="relative -mx-6 -mt-6 mb-6 aspect-video bg-bg-secondary md:-mx-8 md:-mt-8 md:mb-8">
          {hasHeroImage ? (
            <Image
              src={study.heroImage}
              alt={`${study.client} case study screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Badge className="bg-bg-elevated text-text-muted">
                Coming Soon
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{study.industry}</Badge>
            <span className="text-body-xs text-text-muted">
              {new Date(study.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <h3 className="font-display text-display-xs font-bold text-text-primary transition-colors group-hover:text-accent">
            {study.client}
          </h3>

          <p className="text-body-md text-text-secondary">{study.summary}</p>

          <span className="text-body-sm font-medium text-accent transition-colors">
            Read case study &rarr;
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default function WorkPage() {
  const studies = getAllCaseStudiesMeta();

  return (
    <div className="py-20">
      {/* Hero */}
      <section className="container-narrow mb-16">
        <SectionHeading
          title="Work"
          description="Real problems, real solutions, real results. Here is what we have built for our clients."
          align="center"
        />
      </section>

      {/* Case Study Grid */}
      <section className="container-content">
        {studies.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {studies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
        ) : (
          <p className="text-center text-body-lg text-text-muted">
            No case studies yet. Check back soon!
          </p>
        )}
      </section>
    </div>
  );
}
