// @vitest-environment jsdom
import React, { type ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ServicesCarousel from "@/components/home/ServicesCarousel";
import WorkCarousel from "@/components/home/WorkCarousel";
import CookieConsent from "@/components/shared/CookieConsent";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}));
vi.mock("@/components/shared/ScrollReveal", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/ui/DeviceMockup", () => ({
  DeviceMockup: ({ alt }: { alt: string }) => (
    <span role="img" aria-label={alt} />
  ),
}));
const scrollTo = vi.fn();
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    configurable: true,
    value: scrollTo,
  });
  document.cookie = "consent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  scrollTo.mockClear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  delete (HTMLElement.prototype as Partial<HTMLElement>).scrollTo;
});

describe("mobile navigation", () => {
  it.each([ServicesCarousel, WorkCarousel])(
    "retains click, keyboard selection, and horizontal swipe",
    async (Carousel) => {
      const user = userEvent.setup();
      const { unmount } = render(<Carousel />);
      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      await user.click(tabs[1]);
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
      tabs[0].focus();
      await user.keyboard("{Enter}");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[0]).toHaveFocus();
      expect(scrollTo).toHaveBeenCalledTimes(2);
      unmount();
      render(<Carousel />);
      // Fresh mount avoids the existing smooth-scroll input lock.
      const strip = document.querySelector(".overflow-x-auto")!;
      fireEvent.touchStart(strip, {
        touches: [{ clientX: 250, clientY: 100 }],
      });
      fireEvent.touchMove(strip, { touches: [{ clientX: 100, clientY: 105 }] });
      fireEvent.touchEnd(strip, {
        changedTouches: [{ clientX: 100, clientY: 105 }],
      });
      expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
        "aria-selected",
        "true",
      );
    },
  );

  it("names each service destination in its own link", () => {
    render(<ServicesCarousel />);
    const destinations = [
      ["Digital Strategy & Brand", "strategy-brand"],
      ["Development & Integration", "development"],
      ["Revenue Flows & Marketing Ops", "marketing"],
      ["AI & Data Analysis", "ai-data"],
    ];
    for (const [name, slug] of destinations) {
      expect(
        screen.getByRole("link", { name: `Explore ${name}` }),
      ).toHaveAttribute("href", `/services/${slug}`);
    }
  });

  it.each([
    ["Accept", "granted"],
    ["Decline", "denied"],
  ])(
    "preserves %s consent and the privacy destination",
    async (button, value) => {
      const user = userEvent.setup();
      render(<CookieConsent />);
      expect(
        screen.getByRole("link", { name: "Privacy policy" }),
      ).toHaveAttribute("href", "/privacy");
      await user.click(screen.getByRole("button", { name: button }));
      expect(document.cookie).toContain(`consent=${value}`);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );
});
