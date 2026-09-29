/**
 * PageHero — Reusable hero section for inner pages.
 *
 * Provides a full-width dark hero with extended typography tokens,
 * matching the homepage's visual density at subpage hierarchy.
 *
 * Spec reference: ShruggieTech-Site-Design-Consistency-Plan §6.3
 */

import { type ReactNode } from "react";

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
        <div>
          <h1 className="font-display text-display-lg text-text-primary font-bold dark:text-[var(--text-hero)]">
            {headline}
          </h1>
          {subheadline && (
            <p className="text-body-lg text-text-secondary mt-6 max-w-3xl dark:text-[var(--text-body-light)]">
              {subheadline}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

export { PageHero };
export type { PageHeroProps };
