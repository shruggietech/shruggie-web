import { describe, expect, it, vi } from "vitest";

import {
  assertCanonicalMutationOrigin,
  authorizeEditorIdentity,
  clearEditorSessionCookie,
  EDITOR_SESSION_COOKIE,
  EditorialSecurityError,
  loadEditorialSecurityConfig,
  mutationContextFor,
  requireEditorialRole,
  serializeEditorSessionCookie,
  verifyEditorIdToken,
  verifyEditorSession,
  type EditorialAuthVerifier,
  type EditorialSecurityConfig,
  type VerifiedFirebaseIdentity,
} from "../../lib/editorial/security";

const nowSeconds = 1_788_607_200;

function config(): EditorialSecurityConfig {
  return {
    adminEmails: new Set(["admin@shruggie.tech"]),
    canonicalOrigin: "https://shruggie.tech",
    editorEmails: new Set(["editor@shruggie.tech"]),
  };
}

function identity(
  overrides: Partial<VerifiedFirebaseIdentity> = {},
): VerifiedFirebaseIdentity {
  return {
    auth_time: nowSeconds - 30,
    email: "editor@shruggie.tech",
    email_verified: true,
    uid: "FirebaseUidWithMixedCase",
    ...overrides,
  };
}

function verifier(
  value: VerifiedFirebaseIdentity = identity(),
): EditorialAuthVerifier {
  return {
    verifyIdToken: vi.fn().mockResolvedValue(value),
    verifySessionCookie: vi.fn().mockResolvedValue(value),
  };
}

describe("editorial security boundary", () => {
  it("loads explicit editor and administrator allowlists", () => {
    const loaded = loadEditorialSecurityConfig({
      CMS_ADMIN_EMAILS: " Admin@Shruggie.Tech ",
      CMS_EDITOR_EMAILS: "editor@shruggie.tech, second@shruggie.tech",
      NEXT_PUBLIC_SITE_URL: "https://shruggie.tech/blog",
    });
    expect(loaded).toMatchObject({
      canonicalOrigin: "https://shruggie.tech",
    });
    expect([...loaded.adminEmails]).toEqual(["admin@shruggie.tech"]);
    expect([...loaded.editorEmails]).toEqual([
      "editor@shruggie.tech",
      "second@shruggie.tech",
    ]);
    expect(() =>
      loadEditorialSecurityConfig({
        CMS_EDITOR_EMAILS: "editor@shruggie.tech",
        NEXT_PUBLIC_SITE_URL: "http://shruggie.tech",
      }),
    ).toThrow(/must use HTTPS/);
  });

  it("authorizes only verified allowlisted identities with bounded roles", () => {
    const editor = authorizeEditorIdentity(identity(), config());
    const admin = authorizeEditorIdentity(
      identity({ email: "admin@shruggie.tech" }),
      config(),
    );
    expect(editor).toMatchObject({ role: "editor" });
    expect(editor.id).toMatch(/^editor:[a-f0-9]{32}$/);
    expect(JSON.stringify(editor)).not.toContain("editor@shruggie.tech");
    expect(admin).toMatchObject({ role: "admin" });
    expect(() => requireEditorialRole(editor, "admin")).toThrowError(
      EditorialSecurityError,
    );
    expect(() => requireEditorialRole(admin, "admin")).not.toThrow();
    expect(() =>
      authorizeEditorIdentity(
        identity({ email: "outsider@example.com" }),
        config(),
      ),
    ).toThrowError(/not approved/);
    expect(() =>
      authorizeEditorIdentity(identity({ email_verified: false }), config()),
    ).toThrowError(/verified/);
  });

  it("checks revocation and recent authentication before issuing a session", async () => {
    const auth = verifier();
    await expect(
      verifyEditorIdToken("fresh-token", auth, config(), nowSeconds),
    ).resolves.toMatchObject({ role: "editor" });
    expect(auth.verifyIdToken).toHaveBeenCalledWith("fresh-token", true);

    await expect(
      verifyEditorIdToken(
        "stale-token",
        verifier(identity({ auth_time: nowSeconds - 301 })),
        config(),
        nowSeconds,
      ),
    ).rejects.toMatchObject({ code: "STALE_SIGN_IN", status: 401 });

    const revoked = verifier();
    vi.mocked(revoked.verifyIdToken).mockRejectedValue({
      code: "auth/id-token-revoked",
    });
    await expect(
      verifyEditorIdToken("revoked-token", revoked, config(), nowSeconds),
    ).rejects.toMatchObject({ code: "INVALID_SESSION", status: 401 });

    const outage = verifier();
    vi.mocked(outage.verifyIdToken).mockRejectedValue({
      code: "auth/internal-error",
    });
    await expect(
      verifyEditorIdToken("token", outage, config(), nowSeconds),
    ).rejects.toMatchObject({ code: "AUTH_UNAVAILABLE", status: 503 });
  });

  it("fails closed for missing, revoked, and unauthorized sessions", async () => {
    await expect(
      verifyEditorSession(null, verifier(), config()),
    ).rejects.toMatchObject({ code: "UNAUTHENTICATED", status: 401 });

    const auth = verifier();
    await expect(
      verifyEditorSession(
        `${EDITOR_SESSION_COOKIE}=signed-cookie`,
        auth,
        config(),
      ),
    ).resolves.toMatchObject({ role: "editor" });
    expect(auth.verifySessionCookie).toHaveBeenCalledWith(
      "signed-cookie",
      true,
    );

    const revoked = verifier();
    vi.mocked(revoked.verifySessionCookie).mockRejectedValue({
      code: "auth/session-cookie-revoked",
    });
    await expect(
      verifyEditorSession(
        `${EDITOR_SESSION_COOKIE}=revoked-cookie`,
        revoked,
        config(),
      ),
    ).rejects.toMatchObject({ code: "INVALID_SESSION", status: 401 });
  });

  it("rejects missing and cross-origin mutations", () => {
    expect(() =>
      assertCanonicalMutationOrigin(null, "https://shruggie.tech"),
    ).toThrowError(/Origin header/);
    expect(() =>
      assertCanonicalMutationOrigin(
        "https://attacker.example",
        "https://shruggie.tech",
      ),
    ).toThrowError(/Cross-origin/);
    expect(() =>
      assertCanonicalMutationOrigin(
        "https://shruggie.tech/path",
        "https://shruggie.tech",
      ),
    ).not.toThrow();
  });

  it("creates redacted mutation context and hardened cookies", () => {
    const principal = authorizeEditorIdentity(identity(), config());
    expect(mutationContextFor(principal, "request:security-test-0001")).toEqual(
      {
        actorId: principal.id,
        requestId: "request:security-test-0001",
        role: "editor",
      },
    );
    expect(serializeEditorSessionCookie("signed value", 3600)).toContain(
      "HttpOnly; Secure; SameSite=Strict",
    );
    expect(clearEditorSessionCookie()).toContain("Max-Age=0");
  });
});
