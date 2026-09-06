import { describe, expect, it } from "vitest";

import { resolveFirebaseAuthDomain } from "../../lib/editorial/firebase-browser";

describe("Firebase browser auth domain", () => {
  it("keeps production redirect state on the first-party site domain", () => {
    expect(
      resolveFirebaseAuthDomain(
        "shruggie.tech",
        "shruggie-web.firebaseapp.com",
      ),
    ).toBe("shruggie.tech");
  });

  it("uses the configured Firebase handler outside production", () => {
    expect(
      resolveFirebaseAuthDomain(
        "localhost",
        "shruggie-web.firebaseapp.com",
      ),
    ).toBe("shruggie-web.firebaseapp.com");
  });
});
