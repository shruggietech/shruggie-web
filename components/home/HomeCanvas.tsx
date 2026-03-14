/**
 * HomeCanvas — Full-page canvas component for the homepage.
 *
 * Renders a single fixed-position canvas that spans the entire viewport,
 * sitting behind all section content. Composes the dot-grid renderer
 * and the shruggie easter egg to produce a unified visual layer that
 * extends across every section of the homepage.
 *
 * Responsibilities:
 *   - Canvas element management (DPR scaling, resize handling)
 *   - requestAnimationFrame loop
 *   - Mouse/touch tracking for focal point
 *   - Ambient drift on touch / no-mouse devices
 *   - Calling dot-grid renderer with scroll offset + page height
 *   - Calling shruggie update + render (confined to hero section)
 *   - prefers-reduced-motion: single static frame, no animation loop
 *
 * Zero external dependencies beyond React — all rendering is pure canvas.
 */

"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  renderDotGrid,
  updateDrift,
  type DriftState,
  type FocalPoint,
} from "@/lib/canvas/dot-grid";
import {
  createShruggieState,
  initShruggie,
  repositionShruggie,
  updateShruggie,
  renderShruggie,
  type ShruggieState,
} from "@/lib/canvas/shruggie-easter-egg";
import {
  createNetworkGraphState,
  updateNetworkGraph,
  renderNetworkGraph,
  type NetworkGraphState,
} from "@/lib/canvas/network-graph";
import {
  createWorkGraphState,
  initWorkGraph,
  loadWorkGraphLogo,
  updateWorkGraph,
  renderWorkGraph,
  type WorkGraphState,
} from "@/lib/canvas/work-graph";
import {
  createSkylineState,
  generateSkyline,
  renderSkyline,
  type SkylineState,
} from "@/lib/canvas/skyline";
import {
  createPlanetState,
  generatePlanet,
  renderPlanet,
  type PlanetState,
} from "@/lib/canvas/planet";
import { scrollState } from "@/lib/canvas/scroll-state";

/* ── Configuration ──────────────────────────────────────────────────────── */

/**
 * Estimated hero section height as a fraction of viewport height.
 * Matches the hero section's `min-h-[85vh]` CSS class.
 * Used for shruggie confinement until the actual hero height is measured.
 */
const HERO_HEIGHT_VH = 0.85;

export default function HomeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const driftRef = useRef<DriftState>({ x: 0, y: 0, angle: 0 });
  const reducedMotionRef = useRef(false);
  const isTouchRef = useRef(false);
  const isDarkRef = useRef(true);
  const shruggieRef = useRef<ShruggieState>(createShruggieState());
  const networkGraphRef = useRef<NetworkGraphState>(createNetworkGraphState());
  const workGraphRef = useRef<WorkGraphState>(createWorkGraphState());
  const skylineRef = useRef<SkylineState>(createSkylineState());
  const planetRef = useRef<PlanetState>(createPlanetState());
  const lastFrameTimeRef = useRef(0);
  const pageHeightRef = useRef(0);
  const heroHeightRef = useRef(0);
  const caseStudyCountRef = useRef(3);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const scrollY = window.scrollY;
    const pageH = pageHeightRef.current || document.documentElement.scrollHeight;
    const heroH = heroHeightRef.current || h * HERO_HEIGHT_VH;
    const now = performance.now() / 1000;

    const shrug = shruggieRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // ── Determine focal point (viewport coordinates) ──────────────────
    let focalX: number;
    let focalY: number;
    let hasFocus: boolean;

    if (mouseRef.current && !isTouchRef.current) {
      focalX = mouseRef.current.x;
      focalY = mouseRef.current.y;
      hasFocus = true;
    } else if (!reducedMotionRef.current) {
      // Ambient drift for touch / no-mouse devices
      const drift = driftRef.current;
      updateDrift(drift, w, h);
      focalX = drift.x;
      focalY = drift.y;
      hasFocus = true;
    } else {
      focalX = -9999;
      focalY = -9999;
      hasFocus = false;
    }

    // ── Render dot grid (full page) ───────────────────────────────────
    // Confine the spotlight to the hero section only
    const heroBottom = heroH - scrollY; // hero bottom edge in viewport coords
    const dotFocusActive = hasFocus && focalY < heroBottom;
    const focal: FocalPoint = { x: focalX, y: focalY, active: dotFocusActive };
    renderDotGrid(ctx, w, h, scrollY, pageH, focal);

    // ── Network graph (rendered between dot grid and shruggie) ────────
    const networkGraph = networkGraphRef.current;
    const frameDt = lastFrameTimeRef.current === 0
      ? 0.016
      : now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    // ── Compute position, spread, shape, and alpha from scroll state ──
    const heroP = scrollState.heroExitProgress;
    const sActive = scrollState.servicesActive;
    const sProgress = scrollState.servicesProgress;
    const sExitP = scrollState.servicesExitProgress;
    const wProgress = scrollState.workProgress;
    const wActive = scrollState.workActive;
    const wExitP = scrollState.workExitProgress;
    const researchP = scrollState.researchProgress;
    const researchExitP = scrollState.researchExitProgress;
    const ctaVisible = scrollState.ctaVisible;

    let centerX: number;
    let centerY: number;
    let spread: number;
    let shapeIndex: number;
    let graphAlpha: number;

    if (sActive) {
      // Services section is pinned — graph is on the right
      centerX = w * 0.73;
      centerY = h * 0.47;
      spread = w * 0.18;

      // Map servicesProgress 0–1 to shapes 1–4
      const segment = Math.min(Math.floor(sProgress * 4), 3);
      const segmentProgress = (sProgress * 4) - segment;
      const morphProgress = Math.min(segmentProgress / 0.4, 1);
      if (segment < 3) {
        shapeIndex = 1 + segment + morphProgress;
      } else {
        shapeIndex = 4;
      }
      graphAlpha = 1;
    } else if (heroP < 1) {
      // Hero visible or transitioning out
      centerX = w * (0.48 + heroP * 0.25);
      centerY = h * 0.47;
      spread = w * (0.22 - heroP * 0.04);
      shapeIndex = heroP;
      graphAlpha = 1;
    } else {
      // Past services
      if (sProgress >= 1) {
        centerX = w * 0.73;
        centerY = h * 0.47;
        spread = w * 0.18;
        shapeIndex = 4;
        // Fade out services graph as work transition progresses
        graphAlpha = Math.max(0, 1 - sExitP * 2); // Fades to 0 by sExitP=0.5
      } else {
        centerX = w * 0.73;
        centerY = h * 0.47;
        spread = w * 0.18;
        shapeIndex = 1;
        graphAlpha = 1;
      }
    }

    updateNetworkGraph(networkGraph, frameDt, centerX, centerY, spread, shapeIndex);
    renderNetworkGraph(ctx, networkGraph, focalX, focalY, graphAlpha);

    // ── Work graph (rendered after services graph) ────────────────────
    const workGraph = workGraphRef.current;
    if (sExitP > 0 || wActive || wExitP > 0) {
      // Initialize work graph if needed
      initWorkGraph(workGraph, caseStudyCountRef.current);
      loadWorkGraphLogo(workGraph);

      // Work graph area: right 2/3 of viewport
      const workCenterX = w * 0.58;
      const workCenterY = h * 0.5;
      // During work exit, contract spread
      const workSpread = w * 0.35 * (1 - wExitP * 0.6);

      // Get service node positions for seamless transition
      const serviceNodePositions = sExitP < 1
        ? networkGraph.nodes.map(n => ({ x: n.x, y: n.y }))
        : null;

      // Fade in from sExitP=0→0.5, fade out during work exit
      const workFadeIn = Math.min(sExitP * 2, 1);
      const workFadeOut = 1 - wExitP;
      const workAlpha = workFadeIn * workFadeOut;

      updateWorkGraph(
        workGraph, frameDt,
        workCenterX, workCenterY, workSpread,
        sExitP, wProgress, wActive,
        serviceNodePositions,
      );
      renderWorkGraph(ctx, workGraph, focalX, focalY, workAlpha);
    }

    // ── Skyline (Research section) ────────────────────────────────────
    if ((wExitP > 0 || researchP > 0) && researchExitP < 1) {
      const skyline = skylineRef.current;
      generateSkyline(skyline);

      // Skyline base area: right ~50% of viewport
      const baseSkyAreaX = w * 0.5;
      const baseSkyAreaY = h * 0.05;
      const baseSkyAreaW = w * 0.48;
      const baseSkyAreaH = h * 0.9;

      if (researchExitP > 0) {
        // Zoom-out transition: skyline shrinks toward planet center
        const planetCX = w * 0.5;
        const planetCY = h * 0.55;
        const ease = researchExitP * researchExitP; // ease-in
        const scale = 1 - ease * 0.85; // shrink to 15% of original
        const skyAlpha = 1 - ease;

        // Interpolate skyline area toward planet center
        const skyAreaCX = baseSkyAreaX + baseSkyAreaW * 0.5;
        const skyAreaCY = baseSkyAreaY + baseSkyAreaH * 0.5;
        const lerpX = skyAreaCX + (planetCX - skyAreaCX) * ease;
        const lerpY = skyAreaCY + (planetCY - skyAreaCY) * ease;
        const scaledW = baseSkyAreaW * scale;
        const scaledH = baseSkyAreaH * scale;

        if (skyAlpha > 0.01) {
          ctx.globalAlpha = skyAlpha;
          renderSkyline(ctx, skyline, researchP, lerpX - scaledW / 2, lerpY - scaledH / 2, scaledW, scaledH);
          ctx.globalAlpha = 1;
        }
      } else {
        renderSkyline(ctx, skyline, researchP, baseSkyAreaX, baseSkyAreaY, baseSkyAreaW, baseSkyAreaH);
      }
    }

    // ── Planet (CTA section) ──────────────────────────────────────────
    if (researchExitP > 0 || ctaVisible) {
      const planet = planetRef.current;
      generatePlanet(planet);

      // Planet sizing: ~65% of viewport width on desktop, ~80% on mobile
      const isMobile = w < 768;
      const planetDiameter = w * (isMobile ? 0.8 : 0.65);
      const planetRadius = planetDiameter / 2;

      // Centered horizontally, positioned so top 2/3 visible, bottom 1/3 below
      const planetCX = w * 0.5;
      // When fully visible, the planet center is at viewport height - radius/3
      // This places the top of the planet at (h - radius/3 - radius) and
      // bottom at (h - radius/3 + radius), with bottom 1/3 = 2*radius/3 below h
      const planetCY = h * 0.55;

      // Fade planet in during research exit transition
      const planetAlpha = Math.min(researchExitP * 1.5, 1);

      renderPlanet(ctx, planet, planetCX, planetCY, planetRadius, now, planetAlpha);
    }

    // ── Shruggie logic (hero section only) ────────────────────────────
    // Convert focal point from viewport to hero-relative coordinates.
    // Since the hero starts at page y=0, hero coords = page coords.
    // focalX stays the same; heroFocalY = viewportFocalY + scrollY
    const heroFocalX = focalX;
    const heroFocalY = focalY + scrollY;

    // Only update/render shruggie when the hero section is at least
    // partially visible (saves CPU when scrolled far past the hero)
    const heroVisible = scrollY < heroH + 200;

    if (heroVisible) {
      updateShruggie(shrug, now, heroFocalX, heroFocalY, hasFocus, w, heroH);
      renderShruggie(ctx, shrug, heroFocalX, heroFocalY, hasFocus, scrollY, isDarkRef.current);
    }

    ctx.restore();

    if (!reducedMotionRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Theme detection ───────────────────────────────────────────────
    isDarkRef.current = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ── Reduced motion detection ──────────────────────────────────────
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    // ── Touch device detection ────────────────────────────────────────
    isTouchRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        cancelAnimationFrame(animationRef.current);
        // Draw one static frame
        draw();
      } else {
        animationRef.current = requestAnimationFrame(draw);
      }
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // ── Canvas sizing ─────────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      // Measure actual page height
      pageHeightRef.current = document.documentElement.scrollHeight;

      // Measure actual hero section height
      const heroEl = document.getElementById("hero-section");
      heroHeightRef.current = heroEl
        ? heroEl.offsetHeight
        : window.innerHeight * HERO_HEIGHT_VH;

      // Re-position shruggie on resize
      const shrug = shruggieRef.current;
      repositionShruggie(shrug, window.innerWidth, heroHeightRef.current);

      // If reduced motion, just re-draw the static grid
      if (reducedMotionRef.current) {
        draw();
      }
    };

    // Use ResizeObserver on the body to detect page height changes
    const resizeObserver = new ResizeObserver(() => {
      pageHeightRef.current = document.documentElement.scrollHeight;
    });
    resizeObserver.observe(document.body);

    window.addEventListener("resize", resize);
    resize();

    // ── Load shruggie ─────────────────────────────────────────────────
    const shrug = shruggieRef.current;
    initShruggie(shrug, window.innerWidth, heroHeightRef.current);

    // ── Init work graph ───────────────────────────────────────────────
    const workEl = document.getElementById("work-section");
    const countAttr = workEl?.getAttribute("data-case-study-count");
    if (countAttr) {
      caseStudyCountRef.current = parseInt(countAttr, 10) || 3;
    }
    const wg = workGraphRef.current;
    initWorkGraph(wg, caseStudyCountRef.current);
    loadWorkGraphLogo(wg);

    // ── Mouse tracking ────────────────────────────────────────────────
    // Track on window so it works even over hero text / other content
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // ── Start animation loop ──────────────────────────────────────────
    if (!reducedMotionRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      draw(); // single static frame
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
