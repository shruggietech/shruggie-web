"use client";

import { useEffect, useRef } from "react";

import { RadarSweepScene } from "@/components/home/hero-background/RadarSweepScene";
import { advanceClockwiseSweep, queueClockwiseSweep, RADAR_INTRO_MS } from "@/components/home/hero-background/radar-motion";

import styles from "./HeroBackground.module.css";

/** Server-rendered radar with one CSS reveal and bounded desktop pointer motion. */
export function HeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section || typeof IntersectionObserver !== "function" || typeof window.matchMedia !== "function") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sweep = root.querySelector<SVGGElement>('[data-hero-size="desktop"] [data-hero-sweep]');
    let visible = false;
    let introComplete = typeof sweep?.getAnimations === "function"
      ? !sweep.getAnimations().some((animation) => animation.playState !== "finished")
      : false;
    let introFallback: number | undefined;
    let bearing = 0;
    let queuedBearing = 0;
    let frame: number | null = null;
    let lastFrameTime: number | null = null;
    let lastPointer: { x: number; y: number } | null = null;

    const canSweep = () => visible && document.visibilityState === "visible" && !motionQuery.matches && window.innerWidth >= 768;
    const stopSweep = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      lastFrameTime = null;
      lastPointer = null;
      queuedBearing = bearing;
    };
    const advance = (now: number) => {
      frame = null;
      if (!canSweep() || !introComplete) {
        stopSweep();
        return;
      }
      const elapsed = lastFrameTime === null ? 16 : now - lastFrameTime;
      lastFrameTime = now;
      bearing = advanceClockwiseSweep(bearing, queuedBearing, elapsed);
      if (sweep) sweep.style.transform = `rotate(${bearing.toFixed(2)}deg)`;
      if (queuedBearing - bearing > .01) {
        frame = window.requestAnimationFrame(advance);
      } else {
        lastFrameTime = null;
      }
    };
    const scheduleSweep = () => {
      if (frame === null && queuedBearing - bearing > .01 && typeof window.requestAnimationFrame === "function") {
        frame = window.requestAnimationFrame(advance);
      }
    };
    const syncVisibility = () => {
      const active = visible && document.visibilityState === "visible" && !motionQuery.matches;
      root.dataset.active = active ? "true" : "false";
      if (active) scheduleSweep();
      else stopSweep();
    };
    const onIntroEnd = (event: AnimationEvent) => {
      if (event.target !== sweep) return;
      introComplete = true;
      scheduleSweep();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !canSweep()) return;
      if (lastPointer) {
        const distance = Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
        queuedBearing = queueClockwiseSweep(bearing, queuedBearing, distance);
        if (introComplete) scheduleSweep();
      }
      lastPointer = { x: event.clientX, y: event.clientY };
    };
    const onMotionChange = () => {
      if (motionQuery.matches) {
        introComplete = true;
      } else {
        introComplete = typeof sweep?.getAnimations === "function"
          ? !sweep.getAnimations().some((animation) => animation.playState !== "finished")
          : false;
      }
      syncVisibility();
    };

    if (sweep && typeof sweep.getAnimations !== "function") {
      introFallback = window.setTimeout(() => { introComplete = true; scheduleSweep(); }, RADAR_INTRO_MS);
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      syncVisibility();
    });
    observer.observe(section);
    root.addEventListener("animationend", onIntroEnd);
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", syncVisibility);
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", stopPointerTracking);
    window.addEventListener("resize", stopSweep);

    function stopPointerTracking() { lastPointer = null; }

    return () => {
      observer.disconnect();
      root.removeEventListener("animationend", onIntroEnd);
      if (introFallback !== undefined) window.clearTimeout(introFallback);
      stopSweep();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", syncVisibility);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", stopPointerTracking);
      window.removeEventListener("resize", stopSweep);
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef}>
      <RadarSweepScene className={`${styles.desktopScene} ${styles.radarScene}`} size="desktop" />
      <RadarSweepScene className={`${styles.mobileScene} ${styles.radarScene}`} size="mobile" />
      <div className={styles.safeZone} />
    </div>
  );
}
