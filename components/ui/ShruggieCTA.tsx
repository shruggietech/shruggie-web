/**
 * ShruggieCTA — Specialized CTA button with shruggie tagline flourish.
 *
 * Wraps a primary Button inside an anchor tag. Below the button, renders
 * the shruggie tagline "¯\_(ツ)_/¯ We'll figure it out."
 *
 * Tagline hidden by default, fades down into view on hover via CSS
 * group-hover. Absolutely positioned so it never affects layout or
 * alignment of sibling elements (e.g. adjacent buttons).
 * Tagline uses aria-hidden="true" for clean screen reader output.
 * Respects prefers-reduced-motion via motion-reduce utilities.
 *
 * Spec reference: §2.4 (Component Primitives)
 */

import Button from "./Button";

interface ShruggieCTAProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function ShruggieCTA({
  href,
  children,
  variant = "primary",
}: ShruggieCTAProps) {
  return (
    <div className="group relative inline-flex flex-col items-center">
      <a href={href}>
        <Button variant={variant}>{children}</Button>
      </a>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-body-xs text-[#595959] dark:text-white opacity-0 -translate-y-1 transition-all duration-300 ease-out group-hover:translate-y-1 group-hover:opacity-100 motion-reduce:transition-none"
      >
        <span className="text-accent">¯\_(ツ)_/¯</span>{" "}
        We&apos;ll figure it out.
      </span>
    </div>
  );
}

export { ShruggieCTA };
export type { ShruggieCTAProps };
