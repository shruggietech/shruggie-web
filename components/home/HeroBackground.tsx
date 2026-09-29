"use client";

import { useEffect, useRef } from "react";

import { RadarSweepScene } from "@/components/home/hero-background/RadarSweepScene";

import styles from "./HeroBackground.module.css";

/** Server-rendered radar with independent reveal and automatic sweep. */
export function HeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section || typeof IntersectionObserver !== "function") return;

    let inViewport = false;
    const syncVisibility = () => {
      root.dataset.visible = inViewport && document.visibilityState === "visible" ? "true" : "false";
    };
    const observer = new IntersectionObserver((entries) => {
      inViewport = entries.some((entry) => entry.isIntersecting);
      syncVisibility();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      root.dataset.visible = "false";
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.root} data-visible="false" ref={rootRef}>
      <RadarSweepScene className={`${styles.desktopScene} ${styles.radarScene}`} size="desktop" />
      <RadarSweepScene className={`${styles.mobileScene} ${styles.radarScene}`} size="mobile" />
      <div className={styles.safeZone} />
    </div>
  );
}
