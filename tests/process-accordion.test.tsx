// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it } from "vitest";
import ProcessAccordion from "@/components/shared/ProcessAccordion";
afterEach(cleanup);
it("keeps one selected phase, matching panel semantics and keyboard focus", async () => {
  const user = userEvent.setup();
  render(<ProcessAccordion />);
  const discuss = screen.getByRole("button", { name: /01\s*Discuss/ });
  const create = screen.getByRole("button", { name: /02\s*Create/ });
  expect(discuss).toHaveAttribute("aria-expanded", "true");
  expect(screen.getAllByRole("region")).toHaveLength(1);
  create.focus();
  await user.keyboard("{Enter}");
  expect(create).toHaveFocus();
  expect(create).toHaveAttribute("aria-expanded", "true");
  expect(discuss).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("region", { name: /02\s*Create/ })).toHaveAttribute(
    "id",
    create.getAttribute("aria-controls"),
  );
  expect(
    document.getElementById(discuss.getAttribute("aria-controls")!),
  ).toHaveAttribute("inert");
  await user.click(create);
  expect(create).toHaveAttribute("aria-expanded", "true");
  expect(screen.getAllByRole("region")).toHaveLength(1);
});
