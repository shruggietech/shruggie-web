import { beforeEach, describe, expect, it, vi } from "vitest";

import { articleFixture } from "./fixtures";
import { EditorialSecurityError } from "../../lib/editorial/security";

const mocks = vi.hoisted(() => ({
  getArticleById: vi.fn(),
  getAssetById: vi.fn(),
  read: vi.fn(),
  requireEditor: vi.fn(),
}));

vi.mock("../../lib/editorial/firebase-admin", () => ({
  createFirebaseEditorialBackend: () => ({
    articles: { getById: mocks.getArticleById },
    assets: { getById: mocks.getAssetById, read: mocks.read },
  }),
}));

vi.mock("../../lib/editorial/http", async (importActual) => {
  const actual =
    await importActual<typeof import("../../lib/editorial/http")>();
  return { ...actual, requireEditor: mocks.requireEditor };
});

import { GET } from "../../app/media/[id]/route";

const asset = {
  schemaVersion: 1 as const,
  id: "asset:hero",
  articleId: "article:example",
  originalFileName: "hero.png",
  contentType: "image/png" as const,
  sizeBytes: 4,
  width: 1,
  height: 1,
  altText: "Green example image",
  checksumSha256: "a".repeat(64),
  storagePath: "articles/article:example/asset:hero.png",
  deliveryUrl: "https://shruggie.tech/media/asset:hero",
  createdAt: "2026-09-05T12:00:00.000Z",
  createdBy: "editor:natalie",
};

function request() {
  return new Request("https://shruggie.tech/media/asset:hero");
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.read.mockResolvedValue({
    asset,
    bytes: new Uint8Array([137, 80, 78, 71]),
  });
  mocks.getAssetById.mockResolvedValue(asset);
});

describe("editorial media delivery", () => {
  it("serves referenced published media with bounded public caching", async () => {
    mocks.getArticleById.mockResolvedValue(
      articleFixture({ state: "published", publishedAt: asset.createdAt }),
    );

    const response = await GET(request(), {
      params: Promise.resolve({ id: asset.id }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    expect(response.headers.get("Cache-Control")).toContain("public");
    expect(mocks.requireEditor).not.toHaveBeenCalled();
  });

  it("requires an editor session for unpublished media", async () => {
    mocks.getArticleById.mockResolvedValue(articleFixture());
    mocks.requireEditor.mockResolvedValue({ id: "editor:natalie" });

    const response = await GET(request(), {
      params: Promise.resolve({ id: asset.id }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("private");
    expect(mocks.requireEditor).toHaveBeenCalledOnce();
  });

  it("does not return unpublished bytes without an authorized session", async () => {
    mocks.getArticleById.mockResolvedValue(articleFixture());
    mocks.requireEditor.mockRejectedValue(
      new EditorialSecurityError(
        "UNAUTHENTICATED",
        "Authentication is required.",
        401,
      ),
    );

    const response = await GET(request(), {
      params: Promise.resolve({ id: asset.id }),
    });

    expect(response.status).toBe(401);
    expect(mocks.read).not.toHaveBeenCalled();
  });
});
