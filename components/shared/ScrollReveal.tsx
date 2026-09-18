"use client";

import { type ReactNode, useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  /** Initial translateY in pixels (default 24). */
  initialY?: number;
  className?: string;
}

/** Server-visible content with optional, once-only below-viewport motion. */
export default function ScrollReveal({
  children,
  delay = 0,
  initialY = 24,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed.current) return;
    if (
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver !== "function" ||
      typeof element.animate !== "function" ||
      element.getBoundingClientRect().top < window.innerHeight
    ) {
      revealed.current = true;
      return;
    }

    const opacity = element.style.opacity;
    const transform = element.style.transform;
    let observer: IntersectionObserver | undefined;
    let animation: Animation | undefined;
    let motion: MediaQueryList | undefined;
    const restore = () => {
      observer?.disconnect();
      element.style.opacity = opacity;
      element.style.transform = transform;
      if (animation) {
        animation.onfinish = null;
        animation.oncancel = null;
        animation.cancel();
        animation = undefined;
      }
    };
    const revealImmediately = () => {
      revealed.current = true;
      restore();
    };
    const motionChanged = (event: MediaQueryListEvent) => {
      if (event.matches) revealImmediately();
    };

    try {
      motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (motion.matches) {
        revealed.current = true;
        return;
      }
      observer = new IntersectionObserver((entries) => {
        if (revealed.current || !entries.some((entry) => entry.isIntersecting))
          return;
        revealed.current = true;
        observer?.disconnect();
        try {
          animation = element.animate(
            [
              { opacity: 0, transform: `translateY(${initialY}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 600,
              delay: Math.max(0, delay) * 1000,
              easing: "cubic-bezier(0.21, 0.47, 0.32, 0.98)",
              fill: "both",
            },
          );
          animation.onfinish = restore;
          animation.oncancel = revealImmediately;
        } catch {
          revealImmediately();
        }
      });
      motion.addEventListener("change", motionChanged);
      element.addEventListener("focusin", revealImmediately);
      observer.observe(element);
      // Only hide below-viewport content after the enhancement is ready.
      element.style.opacity = "0";
      element.style.transform = `translateY(${initialY}px)`;
    } catch {
      revealImmediately();
    }
    return () => {
      restore();
      motion?.removeEventListener?.("change", motionChanged);
      element.removeEventListener("focusin", revealImmediately);
    };
  }, [delay, initialY]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export { ScrollReveal };
export type { ScrollRevealProps };
