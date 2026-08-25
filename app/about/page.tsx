/**
 * About Page — /about
 *
 * Five sections: Hero, Origin Story, Team, Values, CTA.
 *
 * Spec reference: §6.6 (About), §1.4 item 5 (team photos)
 */

import type { Metadata } from "next";

import { SITE_URL, getOgImageUrl } from "@/lib/constants";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import Card from "@/components/ui/Card";
import CTABackground from "@/components/shared/CTABackground";
import TeamCard from "@/components/about/TeamCard";
import { TEAM_MEMBERS } from "@/lib/team";
import OriginIllustration from "@/components/about/OriginIllustration";

/* ── Metadata ───────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "About ShruggieTech",
  description:
    "A modern technical studio in Knoxville, Tennessee. We build digital systems, software, and AI-driven experiences that help businesses present sharper, operate smarter, and scale further.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About ShruggieTech | ShruggieTech",
    description:
      "A modern technical studio in Knoxville, Tennessee. We build digital systems, software, and AI-driven experiences that help businesses present sharper, operate smarter, and scale further.",
    url: `${SITE_URL}/about`,
    type: "website",
    images: [
      {
        url: getOgImageUrl("About ShruggieTech", { description: "A modern technical studio in Knoxville, Tennessee. We build digital systems, software, and AI-driven experiences." }),
        width: 1200,
        height: 630,
        alt: "About ShruggieTech | ShruggieTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ShruggieTech | ShruggieTech",
    description:
      "A modern technical studio in Knoxville, Tennessee. We build digital systems, software, and AI-driven experiences that help businesses present sharper, operate smarter, and scale further.",
    images: [getOgImageUrl("About ShruggieTech", { description: "A modern technical studio in Knoxville, Tennessee. We build digital systems, software, and AI-driven experiences." })],
  },
};

/* ── Origin Story (spec §6.6, Section 2) ────────────────────────────────── */

/**
 * Single source of truth for the "Where We Come From" section. Both the
 * mobile and desktop layouts below render from these constants — layout
 * handles the breakpoint, the copy lives in one place so the two rendered
 * copies can never drift apart.
 */
const ORIGIN_HEADING = "Where We Come From";

const ORIGIN_STORY =
  "Founded by William and Natalie Thompson, a husband-and-wife team who have been building technology together for nearly a decade. Before ShruggieTech, they ran an international consulting firm that delivered research to national governments and launch support for technology projects across multiple continents. That venture taught them how to deliver structured, high-stakes work under pressure. That same operational discipline now drives a broader mission: solving whatever technology problem stands between a business owner and their vision.";

/* ── Values Data (spec §6.6, Section 4) ─────────────────────────────────── */

interface Value {
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    title: "Ownership, not rentership.",
    description:
      "We believe clients should own their digital assets. Every domain, every credential, every line of content. We earn revenue by building things that work, not by holding things hostage.",
  },
  {
    title: "Specification-driven.",
    description:
      "We write thorough specifications before we write code. This discipline produces better software, clearer communication, and the ability to scale through AI-augmented workflows.",
  },
  {
    title: "Ship and iterate.",
    description:
      "We do not hide behind process. We deliver working systems, measure their performance, and improve them continuously.",
  },
];

/* ── Page Component ─────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      {/* ── Section 1: Hero ──────────────────────────────────────────── */}
      <PageHero
        headline="About"
        subheadline="A small team solving real problems with modern technology. Based in Knoxville, Tennessee."
        bgClass="section-bg-services"
      />

      {/* ── Section 2: Origin Story ──────────────────────────────────── */}
      <section className="bg-bg-primary py-16 md:py-24 overflow-hidden">
        {/* Mobile: standard container layout */}
        <div className="container-content md:hidden">
          <ScrollReveal>
            <div className="mb-8 flex justify-center">
              <OriginIllustration />
            </div>
            <SectionHeading title={ORIGIN_HEADING} />
            <p className="mt-6 text-body-lg text-justify dark:text-[var(--text-body-light)] text-text-secondary">
              {ORIGIN_STORY}
            </p>
          </ScrollReveal>
        </div>

        {/* Desktop: full-bleed layout matching Services section pattern */}
        <div className="hidden md:flex w-full items-center gap-8 lg:gap-12">
          <ScrollReveal>
            <div className="flex w-full items-center gap-8 lg:gap-12">
              {/* Left column — aligned to container-content grid */}
              <div
                className="flex shrink-0 flex-col"
                style={{
                  width: 'min(45%, calc(var(--max-width-content) * 0.45))',
                  marginLeft: 'max(var(--padding-x), calc((100% - var(--max-width-content)) / 2 + var(--padding-x)))',
                }}
              >
                <SectionHeading title={ORIGIN_HEADING} />
                <p className="mt-6 text-body-lg dark:text-[var(--text-body-light)] text-text-secondary">
                  {ORIGIN_STORY}
                </p>
              </div>

              {/* Right column — illustration fills to viewport edge */}
              <div
                className="flex min-w-0 flex-1 items-center justify-center pr-[var(--padding-x)] py-12"
                aria-hidden="true"
              >
                <OriginIllustration />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 3: Team ──────────────────────────────────────────── */}
      <section className="section-bg-services py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="THE TEAM"
              title="Who We Are"
              align="center"
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {TEAM_MEMBERS.map((member, index) => (
              <ScrollReveal key={member.name} delay={index * 0.08}>
                <TeamCard member={member} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Values ────────────────────────────────────────── */}
      <section className="bg-bg-primary py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <SectionHeading
              label="HOW WE OPERATE"
              title="What We Believe"
              align="center"
            />
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {VALUES.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.08}>
                <Card
                  hover={false}
                  className="h-full border-accent/20 shadow-[0_0_15px_rgba(43,204,115,0.15)] dark:border-brand-green-bright/20 dark:shadow-[0_0_20px_rgba(43,204,115,0.1)]"
                >
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-body-md text-text-secondary">
                    {value.description}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA ───────────────────────────────────────────── */}
      <CTABackground>
        <div className="container-content text-center">
          <ScrollReveal>
            <h2 className="font-display text-display-md font-bold text-text-primary">
              Ready to work with a team that actually cares?
            </h2>
            <div className="mt-8">
              <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
            </div>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
