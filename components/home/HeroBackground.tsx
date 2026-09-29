"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { RadarSweepScene } from "@/components/home/hero-background/RadarSweepScene";

import styles from "./HeroBackground.module.css";

/** Server-rendered radar with independent reveal and automatic sweep. */
export function HeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [clickedPaused, setClickedPaused] = useState(false);
  const [hoverInverted, setHoverInverted] = useState(false);
  const paused = clickedPaused !== hoverInverted;

  const clearHoverTimer = () => {
    if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const onPointerEnter = (event: PointerEvent<SVGCircleElement>) => {
    if (event.pointerType === "touch") return;
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => {
      setHoverInverted(true);
      hoverTimer.current = null;
    }, 200);
  };
  const onPointerLeave = () => {
    clearHoverTimer();
    setHoverInverted(false);
  };
  const toggle = () => setClickedPaused((value) => !value);
  const onKeyDown = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle();
  };

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
    root.dataset.enhanced = "true";
    observer.observe(section);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      root.dataset.visible = "false";
      if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className={styles.root}
        data-enhanced="false"
        data-user-paused={paused ? "true" : "false"}
        data-visible="false"
        ref={rootRef}
      >
        <RadarSweepScene className={`${styles.desktopScene} ${styles.radarScene}`} size="desktop" />
        <RadarSweepScene className={`${styles.mobileScene} ${styles.radarScene}`} size="mobile" />
        <div className={styles.safeZone} />
      </div>
      {(["desktop", "mobile"] as const).map((size) => (
        <svg
          className={`${styles.controlScene} ${size === "desktop" ? styles.desktopControl : styles.mobileControl}`}
          key={size}
          preserveAspectRatio={size === "mobile" ? "xMidYMid meet" : "xMidYMid slice"}
          viewBox={size === "mobile" ? "680 100 550 490" : "0 0 1280 690"}
        >
          <circle
            aria-label={paused ? "Resume radar sweep" : "Pause radar sweep"}
            aria-pressed={paused}
            className={styles.controlTarget}
            cx="1000"
            cy="345"
            data-hero-control={size}
            onClick={toggle}
            onKeyDown={onKeyDown}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            r="158"
            role="button"
            tabIndex={0}
          />
        </svg>
      ))}
    </>
  );
}
