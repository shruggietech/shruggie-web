/**
 * About Page — /about
 *
 * Four sections: Hero, Origin Story, Team, Values.
 *
 * Spec reference: §6.6 (About), §1.4 item 5 (team photos)
 */

import type { Metadata } from "next";
import Image from "next/image";

import { SITE_URL } from "@/lib/constants";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

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

interface TeamMember {
  name: string;
  title: string;
  description: string;
  image: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "William Thompson",
    title: "Co-Founder & Chief Architect",
    description:
      "Software architect, systems designer, and the author of ShruggieTech's internal products and published research. Background in cryptography, electronic warfare, and high-performance computing. Writes specifications that AI agents can execute without asking questions.",
    image: "/images/team/william.png",
  },
  {
    name: "Natalie Thompson",
    title: "Co-Founder & COO",
    description:
      "Self-taught full-stack developer, client relationship lead, and the person who makes everything actually happen. Pairs deep technical ability with the soft skills that keep complex projects moving forward. From branding to business development, she runs point on it all.",
    image: "/images/team/natalie.png",
  },
  {
    name: "Josiah Thompson",
    title: "Founders Assistant",
    description:
      "Josiah contributes to ShruggieTech's production work, assisting with social media content creation, blog article drafting, and website maintenance. His role is designed to build real professional skills early, equipping him with the technical fluency and operational discipline for a career in technology.",
    image: "/images/team/josiah.png",
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
      <section className="pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="container-content">
          <ScrollReveal>
            <h1 className="font-display text-display-xl font-bold text-text-primary">
              About ShruggieTech
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-text-secondary">
              A modern technical studio in Knoxville, Tennessee. We build
              digital systems, software, and AI-driven experiences that help
              businesses present sharper, operate smarter, and scale further.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 2: Origin Story ──────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container-content">
          <ScrollReveal>
            <div className="max-w-3xl">
              <SectionHeading title="Where We Come From" />
              <p className="mt-6 text-body-lg text-text-secondary">
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 3: Team ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
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
                <div className="flex flex-col items-center text-center">
                  <div className="aspect-square h-40 w-40 md:h-48 md:w-48 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={192}
                      height={192}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h3 className="mt-6 font-display text-display-sm font-bold text-text-primary">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-body-sm font-medium text-accent">
                    {member.title}
                  </p>
                  <p className="mt-4 text-body-md text-text-secondary">
                    {member.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Values ────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
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
                <div className="rounded-xl border border-border bg-bg-elevated p-6 md:p-8">
                  <h3 className="font-display text-display-sm font-bold text-text-primary">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-body-md text-text-secondary">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
