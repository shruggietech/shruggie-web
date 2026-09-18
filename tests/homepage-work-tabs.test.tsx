// @vitest-environment jsdom
import React, { type ReactNode } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import WorkTabs from "@/components/home/WorkTabs";

vi.mock("@/components/shared/ScrollReveal", () => ({
  default: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}));
vi.mock("@/components/ui/DeviceMockup", () => ({
  DeviceMockup: ({ alt }: { alt: string }) => (
    <span role="img" aria-label={alt} />
  ),
}));

afterEach(cleanup);

describe("Work category tabs", () => {
  it("exposes one selected category and associated panel initially", () => {
    render(<WorkTabs />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Nonprofit",
      "Automotive",
      "Tourism",
    ]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    const panel = screen.getByRole("tabpanel");
    expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tabs[0].id);
    expect(within(panel).getByRole("link")).toHaveAttribute(
      "href",
      "/work/united-way",
    );
  });

  it("switches categories on click and excludes inactive panels and links", async () => {
    const user = userEvent.setup();
    render(<WorkTabs />);
    await user.click(screen.getByRole("tab", { name: "Automotive" }));
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(
      within(screen.getByRole("tabpanel")).getByRole("heading"),
    ).toHaveTextContent("Scruggs Tire & Alignment");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/work/scruggs-tire",
    );
    const inactive = screen
      .getAllByRole("tabpanel", { hidden: true })
      .filter((panel) => panel.getAttribute("aria-hidden") === "true");
    expect(inactive).toHaveLength(2);
    for (const panel of inactive) {
      expect(panel).toHaveAttribute("inert");
      expect(panel).toHaveClass("invisible");
      expect(panel).toHaveAttribute("tabindex", "-1");
    }
  });

  it("supports arrow wrapping and Home/End with roving focus", async () => {
    const user = userEvent.setup();
    render(<WorkTabs />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    await user.keyboard("{ArrowLeft}");
    expect(tabs[2]).toHaveFocus();
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/work/i-heart-pr-tours",
    );
    await user.keyboard("{ArrowRight}");
    expect(tabs[0]).toHaveFocus();
    await user.keyboard("{End}");
    expect(tabs[2]).toHaveFocus();
    await user.keyboard("{Home}");
    expect(tabs[0]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
  });

  it("has no detectable accessibility violations in the tab structure", async () => {
    const { container } = render(<WorkTabs />);
    const result = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
});
