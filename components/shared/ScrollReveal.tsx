/**
 * ScrollReveal — Framer Motion whileInView wrapper.
 *
 * Fade-up animation (opacity 0→1, translateY 24→0) over 600ms with
 * an easing curve. Fires once per element. Renders a plain <div>
 * (no animation) when prefers-reduced-motion is active.
 *
 * Spec reference: §2.4 (Component Primitives), §2.5 (Motion and Scroll Behavior)
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { ScrollReveal };
export type { ScrollRevealProps };
