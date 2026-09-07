import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  disable: vi.fn(),
  enable: vi.fn(),
  errorResponse: vi.fn((error: unknown) =>
    Response.json(
      { error: error instanceof Error ? error.message : "unknown" },
      { status: 400 },
    ),
  ),
  getBySlug: vi.fn(),
  requireEditor: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({
    disable: mocks.disable,
    enable: mocks.enable,
    isEnabled: false,
  })),
}));

vi.mock("@/lib/editorial/firebase-admin", () => ({
  createFirebaseEditorialBackend: () => ({
    articles: { getBySlug: mocks.getBySlug },
  }),
}));

vi.mock("@/lib/editorial/http", () => ({
  editorialErrorResponse: mocks.errorResponse,
  requireEditor: mocks.requireEditor,
}));

vi.mock("@/lib/editorial/security", () => ({
  loadEditorialSecurityConfig: () => ({
    canonicalOrigin: "https://shruggie.tech",
  }),
}));

import { GET as enterPreview } from "../../app/api/admin/preview/route";
import { GET as exitPreview } from "../../app/api/admin/preview/exit/route";
import { articleFixture } from "./fixtures";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireEditor.mockResolvedValue({
    id: "editor:natalie",
    role: "admin",
    uid: "firebase-user",
  });
  mocks.getBySlug.mockResolvedValue(articleFixture());
});

describe("editorial draft preview routes", () => {
  it("authenticates, verifies the saved article, and enables Draft Mode", async () => {
    const request = new Request(
      "https://shruggie.tech/api/admin/preview?slug=example-article",
      { headers: { cookie: "__Host-shruggie_editor=session" } },
    );

    const response = await enterPreview(request);

    expect(mocks.requireEditor).toHaveBeenCalledWith(request);
    expect(mocks.getBySlug).toHaveBeenCalledWith("example-article", "all");
    expect(mocks.enable).toHaveBeenCalledOnce();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://shruggie.tech/blog/example-article?preview=1",
    );
    expect(response.headers.get("set-cookie")).toContain(
      "__Host-shruggie_preview=example-article",
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("does not enable Draft Mode when authentication fails", async () => {
    mocks.requireEditor.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await enterPreview(
      new Request(
        "https://shruggie.tech/api/admin/preview?slug=example-article",
      ),
    );

    expect(response.status).toBe(400);
    expect(mocks.getBySlug).not.toHaveBeenCalled();
    expect(mocks.enable).not.toHaveBeenCalled();
  });

  it("does not enable Draft Mode for an unknown article", async () => {
    mocks.getBySlug.mockResolvedValueOnce(null);

    const response = await enterPreview(
      new Request(
        "https://shruggie.tech/api/admin/preview?slug=missing-article",
      ),
    );

    expect(response.status).toBe(400);
    expect(mocks.enable).not.toHaveBeenCalled();
  });

  it("authenticates before disabling Draft Mode and returning to admin", async () => {
    const request = new Request(
      "https://shruggie.tech/api/admin/preview/exit",
      { headers: { cookie: "__Host-shruggie_editor=session" } },
    );

    const response = await exitPreview(request);

    expect(mocks.requireEditor).toHaveBeenCalledWith(request);
    expect(mocks.disable).toHaveBeenCalledOnce();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://shruggie.tech/admin",
    );
    expect(response.headers.get("set-cookie")).toContain(
      "__Host-shruggie_preview=",
    );
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
