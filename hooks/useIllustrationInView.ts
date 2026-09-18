"use client";

import { useEffect, useRef, useState } from "react";

/** One-time CSS illustration entrance, with native reduced-motion/failure fallbacks. */
export function useIllustrationInView(rootMargin = "-20% 0px -20% 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const activate = () => {
      setActive(true);
      observer?.disconnect();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) activate();
    };
    motion.addEventListener("change", onMotionChange);
    try {
      if (motion.matches || !("IntersectionObserver" in window)) {
        activate();
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) activate();
          },
          { rootMargin },
        );
        observer.observe(element);
      }
    } catch {
      activate();
    }
    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", onMotionChange);
    };
  }, [rootMargin]);

  return { ref, active };
}
