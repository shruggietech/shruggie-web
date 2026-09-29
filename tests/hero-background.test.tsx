// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeroBackground } from "@/components/home/HeroBackground";
import HeroSection from "@/components/home/HeroSection";

let intersection: IntersectionObserverCallback;
let motionChange: (event: MediaQueryListEvent) => void;
let reducedMotion = false;
const observe = vi.fn();
const disconnect = vi.fn();
const animations: {
  playState: string;
  pause: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
}[] = [];
const animate = vi.fn((_keyframes: Keyframe[] | PropertyIndexedKeyframes | null, _options?: number | KeyframeAnimationOptions) => {
  void _keyframes;
  void _options;
  const animation = {
    playState: "running",
    pause: vi.fn(() => { animation.playState = "paused"; }),
    play: vi.fn(() => { animation.playState = "running"; }),
    cancel: vi.fn(() => { animation.playState = "idle"; }),
  };
  animations.push(animation);
  return animation as unknown as Animation;
});

beforeEach(() => {
  reducedMotion = false;
  animations.length = 0;
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
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0, y: 0, top: 0, left: 0, right: 1280, bottom: 690, width: 1280, height: 690,
    toJSON: () => ({}),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "visibilityState");
  Reflect.deleteProperty(Element.prototype, "animate");
});

function mount() {
  return render(<section id="hero-section"><HeroBackground /></section>);
}

function enterViewport() {
  act(() => intersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
}

describe("homepage hero background", () => {
  it("preserves the server-rendered headline, body, and both action destinations", () => {
    const html = renderToStaticMarkup(<HeroSection />);
    expect(html).toContain("We advance your vision.");
    expect(html).toContain("You have a business to run.");
    expect(html).toContain('href="/contact"');
    expect(html).toContain("Start a Conversation");
    expect(html).toContain('href="/work"');
    expect(html).toContain("See Our Work");
  });

  it("server-renders a complete decorative scene with no canvas or image dependency", () => {
    const html = renderToStaticMarkup(<HeroBackground />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("<svg");
    expect(html).toContain('data-hero-signature="true"');
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("opacity:0");
    expect(html).not.toContain("<img");
  });

  it("runs one bounded assembly only when visible, then does not restart", () => {
    mount();
    expect(observe).toHaveBeenCalledTimes(1);
    expect(animate).not.toHaveBeenCalled();
    enterViewport();
    expect(animate.mock.calls.length).toBeGreaterThanOrEqual(3);
    for (const [, options] of animate.mock.calls) {
      expect(Number((options as KeyframeAnimationOptions).duration)).toBeLessThanOrEqual(800);
      expect((options as KeyframeAnimationOptions).iterations ?? 1).toBe(1);
    }
    const count = animate.mock.calls.length;
    enterViewport();
    expect(animate).toHaveBeenCalledTimes(count);
  });

  it("pauses active assembly offscreen and in a hidden tab", () => {
    mount();
    enterViewport();
    act(() => intersection([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(animations.some((animation) => animation.pause.mock.calls.length > 0)).toBe(true);
    enterViewport();
    expect(animations.some((animation) => animation.play.mock.calls.length > 0)).toBe(true);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(animations.every((animation) => animation.playState === "paused")).toBe(true);
  });

  it("keeps the static signature when reduced motion is requested or enabled live", () => {
    reducedMotion = true;
    const first = mount();
    enterViewport();
    expect(animate).not.toHaveBeenCalled();
    expect(first.container.querySelector('[data-hero-signature="true"]')).toBeInTheDocument();
    first.unmount();
    reducedMotion = false;
    mount();
    enterViewport();
    reducedMotion = true;
    act(() => motionChange({ matches: true } as MediaQueryListEvent));
    expect(animations.some((animation) => animation.cancel.mock.calls.length > 0)).toBe(true);
  });

  it("keeps a static scene when animation or observation APIs are unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    Reflect.deleteProperty(Element.prototype, "animate");
    const { container } = mount();
    expect(container.querySelector('[data-hero-signature="true"]')).toBeInTheDocument();
    expect(animate).not.toHaveBeenCalled();
  });

  it("reacts to a mouse near the hero, then settles without responding to touch movement", () => {
    const { container } = mount();
    enterViewport();
    const section = container.querySelector("section")!;
    const responsive = container.querySelector<SVGGElement>("[data-hero-responsive]")!;
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 1000, clientY: 400 });
    expect(responsive.style.transform).not.toBe("");
    const lastTransform = responsive.style.transform;
    fireEvent.pointerMove(section, { pointerType: "touch", clientX: 200, clientY: 200 });
    expect(responsive.style.transform).toBe(lastTransform);
    fireEvent.pointerLeave(section);
    expect(responsive.style.transform).toBe("");
  });

  it("settles active motion on resize and disconnects on unmount", () => {
    const view = mount();
    enterViewport();
    const count = animate.mock.calls.length;
    act(() => window.dispatchEvent(new Event("resize")));
    expect(animations.every((animation) => animation.cancel.mock.calls.length > 0)).toBe(true);
    enterViewport();
    expect(animate).toHaveBeenCalledTimes(count);
    view.unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
