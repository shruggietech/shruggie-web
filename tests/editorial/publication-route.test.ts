import { beforeEach, describe, expect, it, vi } from "vitest";

import { articleFixture, mutationContext, nextRevision } from "./fixtures";

const mocks = vi.hoisted(() => ({
  getById: vi.fn(),
  getRevision: vi.fn(),
  revalidate: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../../lib/editorial/firebase-admin", () => ({
  createFirebaseEditorialBackend: () => ({
    articles: {
      getById: mocks.getById,
      getRevision: mocks.getRevision,
      update: mocks.update,
    },
  }),
}));

vi.mock("../../lib/editorial/security", async (importActual) => {
  const actual =
    await importActual<typeof import("../../lib/editorial/security")>();
  return {
    ...actual,
    assertCanonicalMutationOrigin: vi.fn(),
    loadEditorialSecurityConfig: () => ({
      canonicalOrigin: "https://shruggie.tech",
    }),
    mutationContextFor: () => mutationContext(),
  };
});

vi.mock("../../lib/editorial/http", async (importActual) => {
  const actual =
    await importActual<typeof import("../../lib/editorial/http")>();
  return {
    ...actual,
    requireEditor: vi.fn(async () => ({
      id: "editor:natalie",
      role: "editor",
      uid: "firebase-user",
    })),
  };
});

vi.mock("../../lib/editorial/publication-cache", () => ({
  publicationAffectsPublicRoutes: (
    previous: { state: string },
    next: { state: string },
  ) => previous.state === "published" || next.state === "published",
  revalidateArticlePublication: mocks.revalidate,
}));

import { PUT } from "../../app/api/admin/articles/[id]/route";

function updateRequest(article: ReturnType<typeof articleFixture>) {
  return new Request(`https://shruggie.tech/api/admin/articles/${article.id}`, {
    body: JSON.stringify({
      article,
      expectedRevision: 1,
      idempotencyKey: "publish:00000000-0000-4000-8000-000000000028",
    }),
    headers: {
      "Content-Type": "application/json",
      Origin: "https://shruggie.tech",
    },
    method: "PUT",
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("article publication route", () => {
  it("commits a transition and converges public caches before reporting success", async () => {
    const draft = articleFixture();
    const published = nextRevision(draft, {
      publishedAt: "2026-09-10T12:00:00.000Z",
      state: "published",
    });
    mocks.getRevision.mockResolvedValue(draft);
    mocks.update.mockResolvedValue(published);

    const response = await PUT(updateRequest(published), {
      params: Promise.resolve({ id: published.id }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      article: published,
      publicationConverged: true,
    });
    expect(mocks.update).toHaveBeenCalledWith(
      expect.objectContaining({
        article: published,
        expectedRevision: 1,
        idempotencyKey: "publish:00000000-0000-4000-8000-000000000028",
      }),
    );
    expect(mocks.revalidate).toHaveBeenCalledWith(draft, published);
  });

  it("returns a retryable failure when persistence succeeds but convergence fails", async () => {
    const draft = articleFixture();
    const published = nextRevision(draft, {
      publishedAt: "2026-09-10T12:00:00.000Z",
      state: "published",
    });
    mocks.getRevision.mockResolvedValue(draft);
    mocks.update.mockResolvedValue(published);
    mocks.revalidate.mockImplementation(() => {
      throw new Error("cache service unavailable");
    });

    const response = await PUT(updateRequest(published), {
      params: Promise.resolve({ id: published.id }),
    });

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "PUBLICATION_CONVERGENCE_FAILED",
        retryable: true,
      },
    });
    expect(mocks.update).toHaveBeenCalledOnce();
  });
});
