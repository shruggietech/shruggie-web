"use client";

import { useEffect, useRef } from "react";

import { SignalFoundryScene } from "@/components/home/hero-background/SignalFoundryScene";

import styles from "./HeroBackground.module.css";

const ARRIVAL_DURATION_MS = 650;
const ARRIVAL_STAGGER_MS = 220;

/** Decorative first-paint scene with a finite, optional browser enhancement. */
export function HeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section || typeof IntersectionObserver !== "function" || typeof window.matchMedia !== "function") {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let arrivalStarted = false;
    let animations: Animation[] = [];

    const activeScene = () => root.querySelector<SVGSVGElement>(
      window.innerWidth < 768 ? '[data-hero-size="mobile"]' : '[data-hero-size="desktop"]',
    );
    const responsiveLayer = () => activeScene()?.querySelector<SVGGElement>("[data-hero-responsive]");
    const shouldMove = () => visible && document.visibilityState === "visible" && !motionQuery.matches;

    const pause = () => {
      for (const animation of animations) {
        if (animation.playState === "running") animation.pause();
      }
    };
    const resume = () => {
      for (const animation of animations) {
        if (animation.playState === "paused") animation.play();
      }
    };
    const startArrival = () => {
      if (arrivalStarted || !shouldMove() || typeof Element.prototype.animate !== "function") return;
      arrivalStarted = true;
      try {
        const groups = activeScene()?.querySelectorAll<SVGGElement>("[data-hero-arrival]") ?? [];
        animations = Array.from(groups, (group, index) => group.animate(
          [
            { opacity: 0.22, transform: "translate3d(16px, 8px, 0)" },
            { opacity: 1, transform: "translate3d(0, 0, 0)" },
          ],
          {
            duration: ARRIVAL_DURATION_MS,
            delay: index * ARRIVAL_STAGGER_MS,
            easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
            iterations: 1,
          },
        ));
      } catch {
        for (const animation of animations) animation.cancel();
        animations = [];
      }
    };
    const syncMotion = () => {
      if (shouldMove()) {
        startArrival();
        resume();
      } else {
        pause();
      }
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      syncMotion();
    });
    observer.observe(section);

    const onMotionChange = () => {
      if (motionQuery.matches) {
        for (const animation of animations) animation.cancel();
        animations = [];
        arrivalStarted = true;
        const layer = responsiveLayer();
        if (layer) layer.style.transform = "";
      } else {
        syncMotion();
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !shouldMove()) return;
      const bounds = section.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.round(Math.max(-10, Math.min(10, ((event.clientX - bounds.left) / bounds.width - 0.5) * 20)));
      const y = Math.round(Math.max(-8, Math.min(8, ((event.clientY - bounds.top) / bounds.height - 0.5) * 16)));
      const layer = responsiveLayer();
      if (layer) layer.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onPointerLeave = () => {
      const layer = responsiveLayer();
      if (layer) layer.style.transform = "";
    };
    const onResize = () => {
      for (const animation of animations) animation.cancel();
      animations = [];
      arrivalStarted = true;
      for (const layer of root.querySelectorAll<SVGGElement>("[data-hero-responsive]")) {
        layer.style.transform = "";
      }
    };

    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", syncMotion);
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", syncMotion);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      for (const animation of animations) animation.cancel();
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef}>
      <SignalFoundryScene className={styles.desktopScene} size="desktop" />
      <SignalFoundryScene className={styles.mobileScene} size="mobile" />
      <div className={styles.safeZone} />
    </div>
  );
}
