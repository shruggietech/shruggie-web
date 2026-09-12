import { afterEach, describe, expect, it } from "vitest";

import { getContentAuthority } from "../../lib/editorial/content-authority";

afterEach(() => {
  delete process.env.CMS_CONTENT_AUTHORITY;
  delete process.env.VERCEL_ENV;
});

describe("editorial content authority", () => {
  it("defaults deployed production to Firestore", () => {
    expect(getContentAuthority({ VERCEL_ENV: "production" })).toBe("firestore");
  });

  it("defaults local and CI execution to the repository recovery corpus", () => {
    expect(getContentAuthority({})).toBe("repository");
  });

  it("honors explicit repository and Firestore modes", () => {
    expect(getContentAuthority({ CMS_CONTENT_AUTHORITY: "repository" })).toBe(
      "repository",
    );
    expect(getContentAuthority({ CMS_CONTENT_AUTHORITY: "firestore" })).toBe(
      "firestore",
    );
  });

  it("rejects ambiguous source modes", () => {
    expect(() =>
      getContentAuthority({ CMS_CONTENT_AUTHORITY: "hybrid" }),
    ).toThrow(/repository or firestore/);
  });
});
