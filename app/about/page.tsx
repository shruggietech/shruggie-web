/**
 * About Page — /about
 *
 * Five sections: Hero, Origin Story, Team, Values, CTA.
 *
 * Spec reference: §6.6 (About), §1.4 item 5 (team photos)
 */

import type { Metadata } from "next";

import { SITE_URL } from "@/lib/constants";
import PageHero from "@/components/shared/PageHero";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ShruggieCTA from "@/components/ui/ShruggieCTA";
import Card from "@/components/ui/Card";
import CTABackground from "@/components/shared/CTABackground";
import TeamCard from "@/components/about/TeamCard";
import type { TeamMemberData } from "@/components/about/TeamCard";

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
  },
};

/* ── Team Data (spec §6.6, Section 3) ───────────────────────────────────── */

const TEAM_MEMBERS: TeamMemberData[] = [
  {
    name: "William Thompson",
    title: "Co-Founder & Chief Architect",
    description:
      "Software architect, systems designer, and the author of ShruggieTech's internal products and published research. Background in cryptography, electronic warfare, and high-performance computing. Writes specifications that AI agents can execute without asking questions.",
    image: "/images/team/william.png",
    socials: [
      { href: "https://www.linkedin.com/in/willthompsonpro/", label: "LinkedIn", icon: "Linkedin" },
      { href: "https://github.com/h8rt3rmin8r", label: "GitHub", icon: "Github" },
    ],
  },
  {
    name: "Natalie Thompson",
    title: "Co-Founder & COO",
    description:
      "Self-taught full-stack developer, client relationship lead, and the person who makes everything actually happen. Pairs deep technical ability with the soft skills that keep complex projects moving forward. From branding to business development, she runs point on it all.",
    image: "/images/team/natalie.png",
    socials: [
      { href: "https://www.linkedin.com/in/cryptasian/", label: "LinkedIn", icon: "Linkedin" },
      { href: "https://www.facebook.com/cryptasian", label: "Facebook", icon: "Facebook" },
      { href: "https://www.instagram.com/cryptasian/", label: "Instagram", icon: "Instagram" },
      { href: "https://github.com/cryptasian", label: "GitHub", icon: "Github" },
    ],
  },
  {
    name: "Josiah Thompson",
    title: "Founders Assistant",
    description:
      "Josiah contributes to ShruggieTech's production work, assisting with social media content creation, blog article drafting, and website maintenance. His role is designed to build real professional skills early, equipping him with the technical fluency and operational discipline for a career in technology.",
    image: "/images/team/josiah.png",
    socials: [
      { href: "https://twitch.tv/notratmaster", label: "Twitch", icon: "Twitch" },
      { href: "https://www.youtube.com/@notratmaster", label: "YouTube", icon: "Youtube" },
    ],
  },
];

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
      <section className="bg-bg-primary py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-start md:gap-16">
              {/* Text column */}
              <div className="max-w-3xl md:flex-1">
                <SectionHeading title="Where We Come From" />
                <p className="mt-6 text-body-lg dark:text-[var(--text-body-light)] text-text-secondary">
                  ShruggieTech was founded by William and Natalie Thompson, a
                  husband-and-wife team who have been building technology together
                  for nearly a decade. Before ShruggieTech, they ran an
                  international consulting firm that delivered research to national
                  governments and launch support for technology projects across
                  multiple continents. That venture taught them how to deliver
                  structured, high-stakes work under pressure. ShruggieTech
                  carries that same operational discipline into a broader mission:
                  solving whatever technology problem stands between a business
                  owner and their vision.
                </p>
              </div>

              {/* Decorative SVG — growth/journey graphic */}
              <div className="mt-10 md:mt-0 md:flex-shrink-0 md:w-64 lg:w-80 flex items-center justify-center">
                <svg
                  viewBox="0 0 280 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-48 md:w-full h-auto opacity-25"
                  aria-hidden="true"
                >
                  {/* Vertical journey line */}
                  <path
                    d="M140 30 L140 290"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    className="text-accent"
                  />

                  {/* Node 1 — origin */}
                  <circle cx="140" cy="50" r="8" className="fill-accent/30 stroke-accent" strokeWidth="1.5" />
                  <circle cx="140" cy="50" r="3" className="fill-accent" />

                  {/* Node 2 — growth */}
                  <circle cx="140" cy="140" r="8" className="fill-accent/30 stroke-accent" strokeWidth="1.5" />
                  <circle cx="140" cy="140" r="3" className="fill-accent" />

                  {/* Node 3 — current */}
                  <circle cx="140" cy="230" r="10" className="fill-accent/40 stroke-accent" strokeWidth="2" />
                  <circle cx="140" cy="230" r="4" className="fill-accent" />

                  {/* Branching lines from nodes */}
                  <path d="M148 50 L200 50" stroke="currentColor" strokeWidth="1" className="text-accent/40" />
                  <path d="M132 140 L80 140" stroke="currentColor" strokeWidth="1" className="text-accent/40" />
                  <path d="M150 230 L210 230" stroke="currentColor" strokeWidth="1" className="text-accent/40" />

                  {/* Small decorative dots at branch ends */}
                  <circle cx="204" cy="50" r="3" className="fill-accent/20" />
                  <circle cx="76" cy="140" r="3" className="fill-accent/20" />
                  <circle cx="214" cy="230" r="3" className="fill-accent/20" />

                  {/* Map pin at bottom — Knoxville */}
                  <path
                    d="M140 270 C140 270 125 255 125 245 C125 236.7 131.7 230 140 230 C148.3 230 155 236.7 155 245 C155 255 140 270 140 270Z"
                    className="fill-accent/15 stroke-accent"
                    strokeWidth="1.5"
                  />

                  {/* Subtle arcing growth curves */}
                  <path
                    d="M100 280 Q120 200 140 140 Q160 80 180 40"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    className="text-accent/20"
                  />
                </svg>
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
              title="The People Behind the Work"
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
        <div className="container-content flex flex-col items-center text-center">
          <ScrollReveal>
            <p className="mb-6 text-body-lg text-white/70">
              Ready to work with a team that actually cares?
            </p>
            <ShruggieCTA href="/contact">Start a Conversation</ShruggieCTA>
          </ScrollReveal>
        </div>
      </CTABackground>
    </>
  );
}
