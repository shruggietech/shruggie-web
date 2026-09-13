import { describe, expect, it } from "vitest";

import { dynamic } from "../../app/sitemap";

describe("editorial sitemap cache contract", () => {
  it("renders the metadata route dynamically around the tagged article list", () => {
    expect(dynamic).toBe("force-dynamic");
  });
});
