/**
 * PageHero — Reusable hero section for inner pages.
 *
 * Provides a full-width dark hero with extended typography tokens,
 * matching the homepage's visual density at subpage hierarchy.
 *
 * Spec reference: ShruggieTech-Site-Design-Consistency-Plan §6.3
 */

"use client";

import { type ReactNode } from "react";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface PageHeroProps {
  headline: string;
  subheadline?: string;
  bgClass?: string;
  children?: ReactNode;
}

export default function PageHero({
  headline,
  subheadline,
  bgClass = "",
  children,
}: PageHeroProps) {
  return (
    <section className={`pt-32 pb-16 md:pt-40 md:pb-24 ${bgClass}`}>
      <div className="container-content">
        <ScrollReveal>
          <h1 className="font-display text-display-lg font-bold text-text-primary dark:text-[var(--text-hero)]">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-6 text-body-lg max-w-3xl text-text-secondary dark:text-[var(--text-body-light)]">
              {subheadline}
            </p>
          )}
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
}

export { PageHero };
export type { PageHeroProps };
