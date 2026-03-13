/**
 * ScrollDrivenReveal — Scroll-position-driven fade-up wrapper.
 *
 * Unlike ScrollReveal (fire-once whileInView), this component ties
 * opacity and translateY directly to the element's scroll progress.
 * Cards float up as the user scrolls down and drift back when
 * scrolling up — providing continuous, reversible motion that
 * leverages Lenis smooth scrolling.
 *
 * Uses Framer Motion's useScroll + useTransform; zero Lenis coupling
 * required since Lenis drives the native scrollTop that FM reads.
 *
 * Spec reference: §2.5 (Motion and Scroll Behavior)
 */

"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface ScrollDrivenRevealProps {
  children: ReactNode;
  /** Initial translateY in px — how far below the element starts (default 48) */
  initialY?: number;
  className?: string;
}

export default function ScrollDrivenReveal({
  children,
  initialY = 48,
  className,
}: ScrollDrivenRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track element: starts when top enters viewport bottom,
  // fully revealed when top reaches the middle of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.5"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [initialY, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { ScrollDrivenReveal };
export type { ScrollDrivenRevealProps };
