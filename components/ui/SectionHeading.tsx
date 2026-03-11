/**
 * SectionHeading — Structured heading block for page sections.
 *
 * Renders an optional uppercase accent label, an h2 title, and an
 * optional description paragraph. Supports left or center alignment.
 *
 * Spec reference: §2.4 (Component Primitives)
 */

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small all-caps label above heading (e.g., "SERVICES") */
  label?: string;
  /** Main heading text */
  title: string;
  /** Optional supporting paragraph */
  description?: string;
  /** Alignment — defaults to "left" */
  align?: "left" | "center";
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {label && (
        <span className="mb-3 block font-display text-body-sm font-medium uppercase tracking-widest text-accent">
          {label}
        </span>
      )}
      <h2 className="font-display text-display-md font-bold text-text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-body-lg text-text-secondary">{description}</p>
      )}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };
