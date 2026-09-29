// @vitest-environment jsdom
import React from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useIllustrationInView } from "@/hooks/useIllustrationInView";

let intersect: IntersectionObserverCallback;
let change: (event: MediaQueryListEvent) => void;
const disconnect = vi.fn();
const remove = vi.fn();
let reduced = false;
function Illustration() {
  const { ref, active } = useIllustrationInView();
  return <div ref={ref} data-testid="art" data-active={active} />;
}
beforeEach(() => {
  reduced = false;
  vi.clearAllMocks();
  vi.stubGlobal("matchMedia", () => ({
    matches: reduced,
    addEventListener: (_: string, callback: typeof change) => {
      change = callback;
    },
    removeEventListener: remove,
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("waits for intersection, activates once and releases the observer", () => {
  const view = render(<Illustration />);
  expect(screen.getByTestId("art").getAttribute("data-active")).toBe("false");
  act(() =>
    intersect(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );
  expect(screen.getByTestId("art").getAttribute("data-active")).toBe("true");
  expect(disconnect).toHaveBeenCalled();
  view.unmount();
  expect(remove).toHaveBeenCalledWith("change", change);
});
it("activates immediately for initial reduced motion", () => {
  reduced = true;
  render(<Illustration />);
  expect(screen.getByTestId("art").getAttribute("data-active")).toBe("true");
});
it("activates pending artwork when reduced motion is enabled", () => {
  render(<Illustration />);
  act(() => change({ matches: true } as MediaQueryListEvent));
  expect(screen.getByTestId("art").getAttribute("data-active")).toBe("true");
  expect(disconnect).toHaveBeenCalled();
});
it("fails open if observation initialization throws", () => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor() {
        throw new Error("unavailable");
      }
    },
  );
  render(<Illustration />);
  expect(screen.getByTestId("art").getAttribute("data-active")).toBe("true");
});
