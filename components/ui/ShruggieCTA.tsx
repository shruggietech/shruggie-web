/**
 * ShruggieCTA — Specialized CTA button with shruggie tagline flourish.
 *
 * Wraps a primary Button inside an anchor tag. Below the button, renders
 * the shruggie tagline "¯\_(ツ)_/¯ We'll figure it out."
 *
 * Desktop: tagline hidden by default, revealed via group-hover.
 * Mobile: revealed via Framer Motion whileInView (fires once).
 * Tagline uses aria-hidden="true" for clean screen reader output.
 * Respects prefers-reduced-motion via useReducedMotion.
 *
 * Spec reference: §2.4 (Component Primitives)
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";

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
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="group inline-flex flex-col items-center gap-2">
      <a href={href}>
        <Button variant={variant}>{children}</Button>
      </a>
      <motion.span
        aria-hidden="true"
        className="text-body-xs text-text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.4,
          delay: 0.2,
        }}
      >
        <span className="text-accent">¯\_(ツ)_/¯</span>{" "}
        We&apos;ll figure it out.
      </motion.span>
    </div>
  );
}

export { ShruggieCTA };
export type { ShruggieCTAProps };
