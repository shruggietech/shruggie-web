// @vitest-environment jsdom
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { act, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ScrollReveal from "@/components/shared/ScrollReveal";

let intersection: IntersectionObserverCallback;
let motionChange: (event: MediaQueryListEvent) => void;
const disconnect = vi.fn();
const observe = vi.fn();
const animation = {
  cancel: vi.fn(),
  onfinish: null as (() => void) | null,
  oncancel: null as (() => void) | null,
};
const animate = vi.fn(() => animation);
let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
  vi.stubGlobal("matchMedia", () => ({
    matches: reducedMotion,
    addEventListener: (_type: string, listener: typeof motionChange) => {
      motionChange = listener;
    },
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersection = callback;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: 2000,
    bottom: 2100,
    left: 0,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 2000,
    toJSON: () => ({}),
  });
  vi.stubGlobal("Animation", class {});
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value: animate,
  });
  animation.onfinish = null;
  animation.oncancel = null;
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
});

const wrapper = () => screen.getByRole("link").parentElement!;
const enterViewport = () =>
  act(() => {
    intersection(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });

describe("progressive entrance reveals", () => {
  it("restores and registers a fresh observer during StrictMode effect replay", () => {
    render(
      <React.StrictMode>
        <ScrollReveal>
          <a href="/contact">Contact</a>
        </ScrollReveal>
      </React.StrictMode>,
    );
    expect(observe).toHaveBeenCalledTimes(2);
    expect(wrapper().style.opacity).toBe("0");
    enterViewport();
    act(() => animation.onfinish?.());
    expect(wrapper().style.opacity).toBe("");
  });
  it("keeps initial HTML readable without JavaScript", () => {
    const html = renderToStaticMarkup(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    expect(html).toContain('href="/contact"');
    expect(html).not.toContain("opacity:0");
    expect(html).not.toContain("translateY");
  });

  it("never hides content already visible or above the restored viewport", () => {
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({
      top: -20,
    } as DOMRect);
    render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    expect(wrapper().style.opacity).toBe("");
    expect(observe).not.toHaveBeenCalled();
    expect(animate).not.toHaveBeenCalled();
  });

  it("reveals below-viewport content once and restores its styles on completion", () => {
    render(
      <ScrollReveal delay={0.1} initialY={12}>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    expect(wrapper().style.opacity).toBe("0");
    enterViewport();
    expect(animate).toHaveBeenCalledWith(
      [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      expect.objectContaining({ duration: 600, delay: 100, fill: "both" }),
    );
    act(() => animation.onfinish?.());
    expect(wrapper().style.opacity).toBe("");
    expect(wrapper().style.transform).toBe("");
    enterViewport();
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("makes pending focused content visible immediately", () => {
    render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    act(() => screen.getByRole("link").focus());
    expect(wrapper().style.opacity).toBe("");
    expect(disconnect).toHaveBeenCalled();
    expect(animate).not.toHaveBeenCalled();
  });

  it("skips reduced motion and restores an active animation when the preference changes", () => {
    reducedMotion = true;
    const { unmount } = render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    expect(wrapper().style.opacity).toBe("");
    expect(observe).not.toHaveBeenCalled();
    unmount();
    reducedMotion = false;
    render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    enterViewport();
    act(() => motionChange({ matches: true } as MediaQueryListEvent));
    expect(wrapper().style.opacity).toBe("");
    expect(animation.cancel).toHaveBeenCalled();
  });

  it("fails open when APIs are missing or setup/animation fails", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const first = render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    expect(wrapper().style.opacity).toBe("");
    first.unmount();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          intersection = callback;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    observe.mockImplementationOnce(() => {
      throw new Error("observation unavailable");
    });
    const second = render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    expect(wrapper().style.opacity).toBe("");
    second.unmount();
    animate.mockImplementationOnce(() => {
      throw new Error("animation unavailable");
    });
    render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    enterViewport();
    expect(wrapper().style.opacity).toBe("");
  });

  it("restores cancelled/unmounted content and does not hide a completed reveal on prop changes", () => {
    const view = render(
      <ScrollReveal>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    const element = wrapper();
    enterViewport();
    act(() => animation.oncancel?.());
    expect(element.style.opacity).toBe("");
    view.rerender(
      <ScrollReveal delay={0.2}>
        <a href="/contact">Contact</a>
      </ScrollReveal>,
    );
    expect(element.style.opacity).toBe("");
    view.unmount();
    expect(element.style.opacity).toBe("");
    expect(element.style.transform).toBe("");
  });
});
