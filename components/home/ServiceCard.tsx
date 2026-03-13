/**
 * ServiceCard — Scroll-driven card with individual reveal + icon draw.
 *
 * Each card independently tracks its own scroll position so cards in
 * the same grid row stagger naturally. Right-column cards (odd index)
 * are delayed by 15% of the scroll range to prevent both cards in a
 * row from appearing simultaneously.
 *
 * The SVG icon draw is triggered once, when the card reaches
 * sufficient visibility (~60% of its reveal progress).
 *
 * Works seamlessly with Lenis — Framer Motion reads the smoothed
 * native scroll position.
 *
 * Spec reference: §2.5 (Motion and Scroll Behavior)
 */

"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

import { Card } from "@/components/ui/Card";
import AnimatedIcon from "@/components/home/AnimatedIcon";

interface ServiceCardProps {
  /** Pre-rendered icon JSX (e.g. <Palette />) */
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  /** Card index in the grid — used for stagger (0-based) */
  index: number;
}

/** How far below its resting position the card starts (px) */
const INITIAL_Y = 80;

export default function ServiceCard({
  icon,
  title,
  description,
  href,
  index,
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const [drawIcon, setDrawIcon] = useState(false);

  // Track this element from "top enters viewport bottom" →
  // "top reaches 45% from viewport top" (fully visible by mid-page)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.45"],
  });

  // Right-column cards (odd index) start 15% later in the scroll range
  // so same-row cards stagger instead of appearing together.
  const staggerStart = index % 2 === 0 ? 0 : 0.15;

  const y = useTransform(
    scrollYProgress,
    [staggerStart, 1],
    [INITIAL_Y, 0],
  );
  const opacity = useTransform(
    scrollYProgress,
    [staggerStart, staggerStart + 0.5],
    [0, 1],
  );
  const scale = useTransform(
    scrollYProgress,
    [staggerStart, 1],
    [0.97, 1],
  );

  // Trigger icon draw once card is ~60% through its reveal
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!drawIcon && v > staggerStart + 0.4) {
      setDrawIcon(true);
    }
  });

  if (shouldReduce) {
    return (
      <a href={href} className="block h-full">
        <Card className="flex h-full flex-col">
          <AnimatedIcon draw>{icon}</AnimatedIcon>
          <h3 className="font-display text-display-sm font-bold text-text-primary">
            {title}
          </h3>
          <p className="mt-2 text-body-md text-text-secondary">
            {description}
          </p>
        </Card>
      </a>
    );
  }

  return (
    <motion.div ref={ref} style={{ y, opacity, scale }}>
      <a href={href} className="block h-full">
        <Card className="flex h-full flex-col">
          <AnimatedIcon draw={drawIcon}>{icon}</AnimatedIcon>
          <h3 className="font-display text-display-sm font-bold text-text-primary">
            {title}
          </h3>
          <p className="mt-2 text-body-md text-text-secondary">
            {description}
          </p>
        </Card>
      </a>
    </motion.div>
  );
}
