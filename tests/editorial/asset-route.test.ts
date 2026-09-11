import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContentUnavailableError } from "../../lib/editorial/errors";

const mocks = vi.hoisted(() => ({
  assertCanonicalMutationOrigin: vi.fn(),
  put: vi.fn(),
  requireEditor: vi.fn(),
}));

vi.mock("../../lib/editorial/firebase-admin", () => ({
  createFirebaseEditorialBackend: () => ({
    assets: { put: mocks.put },
  }),
  getFirebaseEditorialAuth: vi.fn(),
}));

vi.mock("../../lib/editorial/http", async (importActual) => {
  const actual =
    await importActual<typeof import("../../lib/editorial/http")>();
  return { ...actual, requireEditor: mocks.requireEditor };
});

vi.mock("../../lib/editorial/security", async (importActual) => {
  const actual =
    await importActual<typeof import("../../lib/editorial/security")>();
  return {
    ...actual,
    assertCanonicalMutationOrigin: mocks.assertCanonicalMutationOrigin,
    loadEditorialSecurityConfig: () => ({
      canonicalOrigin: "https://shruggie.tech",
    }),
  };
});

import { POST } from "../../app/api/admin/assets/route";

function uploadRequest(altText: string): Request {
  const form = new FormData();
  form.set("altText", altText);
  form.set("articleId", "article:example");
  form.set(
    "file",
    new File([new Uint8Array([137, 80, 78, 71])], "hero.png", {
      type: "image/png",
    }),
  );
  form.set("id", "asset:hero");
  return new Request("https://shruggie.tech/api/admin/assets", {
    body: form,
    headers: { origin: "https://shruggie.tech" },
    method: "POST",
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireEditor.mockResolvedValue({ id: "editor:natalie" });
  mocks.put.mockImplementation(async (input) => ({
    schemaVersion: 1,
    id: input.id,
    articleId: input.articleId,
    originalFileName: input.fileName,
    contentType: input.contentType,
    sizeBytes: input.bytes.length,
    width: 1,
    height: 1,
    altText: input.altText,
    checksumSha256: "a".repeat(64),
    storagePath: `articles/${input.articleId}/${input.id}.png`,
    deliveryUrl: `https://shruggie.tech/media/${input.id}`,
    createdAt: input.createdAt,
    createdBy: input.createdBy,
  }));
});

describe("POST /api/admin/assets", () => {
  it.each([
    ["whitespace-only decorative alt text", " \t ", ""],
    [
      "descriptive alt text",
      "  A green terminal window showing a successful build  ",
      "A green terminal window showing a successful build",
    ],
  ])("uploads an image with %s", async (_label, submitted, expected) => {
    const response = await POST(uploadRequest(submitted));

    expect(response.status).toBe(201);
    expect(mocks.put).toHaveBeenCalledWith(
      expect.objectContaining({ altText: expected }),
    );
    await expect(response.json()).resolves.toMatchObject({
      asset: { altText: expected, id: "asset:hero" },
    });
  });

  it("keeps the provider cause in server diagnostics but returns a safe failure", async () => {
    const providerError = Object.assign(
      new Error("Anonymous caller is missing storage.objects.create"),
      { code: 401 },
    );
    mocks.put.mockRejectedValue(
      new ContentUnavailableError("store an article image", providerError),
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = await POST(uploadRequest("A descriptive image"));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: {
        code: "CONTENT_UNAVAILABLE",
        message:
          "Editorial storage is unavailable while attempting to store an article image.",
        retryable: true,
      },
    });
    expect(JSON.stringify(body)).not.toContain("storage.objects.create");
    expect(consoleError).toHaveBeenCalledWith(
      "Retryable editorial route error",
      expect.objectContaining({ cause: providerError }),
    );
  });
});
