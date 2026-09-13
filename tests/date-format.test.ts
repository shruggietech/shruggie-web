import { describe, expect, it } from "vitest";

import { formatDateOnly } from "../lib/utils";

describe("formatDateOnly", () => {
  it("keeps date-only editorial values stable across host timezones", () => {
    expect(formatDateOnly("2026-03-08")).toBe("March 8, 2026");
    expect(formatDateOnly("2026-05-23")).toBe("May 23, 2026");
  });
});
