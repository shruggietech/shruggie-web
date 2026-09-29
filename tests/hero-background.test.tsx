// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeroBackground } from "@/components/home/HeroBackground";
import HeroSection from "@/components/home/HeroSection";
import { advanceClockwiseSweep, MAX_SWEEP_DEGREES_PER_SECOND, queueClockwiseSweep } from "@/components/home/hero-background/radar-motion";

let intersection: IntersectionObserverCallback;
let motionChange: (event: MediaQueryListEvent) => void;
let reducedMotion = false;
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
  reducedMotion = false;
  vi.clearAllMocks();
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
  vi.stubGlobal("matchMedia", () => ({
    get matches() { return reducedMotion; },
    addEventListener: (_type: string, listener: typeof motionChange) => { motionChange = listener; },
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe = observe;
    disconnect = disconnect;
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "visibilityState");
});

function mount() {
  return render(<section id="hero-section"><HeroBackground /></section>);
}

function enterViewport() {
  act(() => intersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
}

describe("homepage radar", () => {
  it("preserves the server-rendered headline, copy, and both action destinations", () => {
    const html = renderToStaticMarkup(<HeroSection />);
    expect(html).toContain("We advance your vision.");
    expect(html).toContain("You have a business to run.");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Start a Conversation");
    expect(html).toContain('href="/work"');
    expect(html).toContain("See Our Work");
  });

  it("serves the complete decorative scope without a canvas, image, or JavaScript renderer", () => {
    const html = renderToStaticMarkup(<HeroBackground />);
    expect(html).toContain('aria-hidden="true"');
    expect(html.match(/<svg/g)).toHaveLength(2);
    expect(html).toContain('data-hero-sweep="true"');
    expect(html).not.toContain("data-hero-signature");
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("<img");
  });

  it("keeps a static scene when browser observation APIs are unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = mount();
    expect(container.querySelector('[data-hero-sweep="true"]')).toBeInTheDocument();
  });

  it("advances clockwise under mouse travel and holds its bearing when the pointer reverses or leaves", () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const { container } = mount();
    enterViewport();
    const section = container.querySelector("section")!;
    const sweep = container.querySelector<SVGGElement>('[data-hero-size="desktop"] [data-hero-sweep]')!;
    fireEvent.animationEnd(sweep);
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 1100, clientY: 450 });
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 750, clientY: 180 });
    act(() => frames.shift()?.(16));
    const bearing = Number(sweep.style.transform.match(/rotate\(([\d.]+)deg\)/)?.[1]);
    expect(bearing).toBeGreaterThan(0);
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 1100, clientY: 450 });
    act(() => frames.shift()?.(32));
    const nextBearing = Number(sweep.style.transform.match(/rotate\(([\d.]+)deg\)/)?.[1]);
    expect(nextBearing).toBeGreaterThanOrEqual(bearing);
    fireEvent.pointerLeave(section);
    expect(sweep.style.transform).toContain("rotate(");
  });

  it("caps interactive angular speed and queued distance", () => {
    const first = queueClockwiseSweep(40, 40, 1000);
    const second = queueClockwiseSweep(40, first, 1000);
    expect(first).toBeGreaterThan(40);
    expect(second).toBeGreaterThanOrEqual(first);
    expect(second - 40).toBeLessThanOrEqual(75);
    const advanced = advanceClockwiseSweep(40, second, 100);
    expect(advanced).toBeGreaterThanOrEqual(40);
    expect(advanced - 40).toBeLessThanOrEqual(MAX_SWEEP_DEGREES_PER_SECOND * .05);
    expect(advanceClockwiseSweep(advanced, second, 0)).toBe(advanced);
  });

  it("does not move the mobile scope in response to a mouse or touch pointer", () => {
    vi.stubGlobal("innerWidth", 390);
    const requestFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    const { container } = mount();
    enterViewport();
    const section = container.querySelector("section")!;
    const sweep = container.querySelector<SVGGElement>('[data-hero-size="mobile"] [data-hero-sweep]')!;
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 300, clientY: 500 });
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 100, clientY: 200 });
    fireEvent.pointerMove(section, { pointerType: "touch", clientX: 200, clientY: 350 });
    expect(sweep.style.transform).toBe("");
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("stops interactive work offscreen, in hidden tabs, and for reduced motion", () => {
    const frames: FrameRequestCallback[] = [];
    const cancelFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }));
    vi.stubGlobal("cancelAnimationFrame", cancelFrame);
    const { container } = mount();
    const root = container.querySelector<HTMLElement>('[aria-hidden="true"]')!;
    enterViewport();
    const section = container.querySelector("section")!;
    const sweep = container.querySelector<SVGGElement>('[data-hero-size="desktop"] [data-hero-sweep]')!;
    fireEvent.animationEnd(sweep);
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 100, clientY: 100 });
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 500, clientY: 300 });
    expect(frames.length).toBe(1);
    act(() => intersection([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(root.dataset.active).toBe("false");
    expect(cancelFrame).toHaveBeenCalled();
    enterViewport();
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(root.dataset.active).toBe("false");
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    reducedMotion = true;
    act(() => motionChange({ matches: true } as MediaQueryListEvent));
    expect(root.dataset.active).toBe("false");
  });

  it("disconnects observation and cancels animation work on unmount", () => {
    const view = mount();
    enterViewport();
    view.unmount();
    expect(observe).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
