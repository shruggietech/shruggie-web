// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeroBackground } from "@/components/home/HeroBackground";
import HeroSection from "@/components/home/HeroSection";

let intersection: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
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

function setInViewport(value: boolean) {
  act(() => intersection([{ isIntersecting: value } as IntersectionObserverEntry], {} as IntersectionObserver));
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

  it("serves complete radar geometry and a static fallback without a client renderer", () => {
    const html = renderToStaticMarkup(<HeroBackground />);
    expect(html.match(/<svg/g)).toHaveLength(2);
    expect(html).toContain('data-hero-sweep="true"');
    expect(html).toContain('data-visible="false"');
    expect(html).not.toContain("Pause radar");
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("<img");
  });

  it("starts automatic sweep only while visible and stops it offscreen or in a hidden tab", () => {
    const { container } = mount();
    const root = container.querySelector<HTMLElement>('[aria-hidden="true"]')!;
    expect(root.dataset.visible).toBe("false");
    setInViewport(true);
    expect(root.dataset.visible).toBe("true");
    setInViewport(false);
    expect(root.dataset.visible).toBe("false");
    setInViewport(true);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(root.dataset.visible).toBe("false");
  });

  it("does not couple sweep movement to mouse or touch input", () => {
    const requestFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    const { container } = mount();
    setInViewport(true);
    const section = container.querySelector("section")!;
    fireEvent.pointerMove(section, { pointerType: "mouse", clientX: 400, clientY: 200 });
    fireEvent.pointerMove(section, { pointerType: "touch", clientX: 100, clientY: 500 });
    for (const sweep of container.querySelectorAll<SVGGElement>("[data-hero-sweep]")) {
      expect(sweep.style.transform).toBe("");
    }
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("keeps the sweep static when browser observation is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = mount();
    const root = container.querySelector<HTMLElement>('[aria-hidden="true"]')!;
    expect(root.dataset.visible).toBe("false");
    expect(container.querySelector('[data-hero-sweep="true"]')).toBeInTheDocument();
  });

  it("disconnects observation on unmount", () => {
    const view = mount();
    view.unmount();
    expect(observe).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
