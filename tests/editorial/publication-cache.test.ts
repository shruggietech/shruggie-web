import { beforeEach, describe, expect, it, vi } from "vitest";

import { articleFixture, nextRevision } from "./fixtures";

const mocks = vi.hoisted(() => ({
  getBySlug: vi.fn(),
  list: vi.fn(),
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
  unstable_cache:
    (operation: (...args: never[]) => unknown) =>
    (...args: never[]) =>
      operation(...args),
}));

vi.mock("../../lib/editorial/firebase-admin", () => ({
  createFirebaseEditorialBackend: () => ({
    articles: { getBySlug: mocks.getBySlug, list: mocks.list },
  }),
}));

import {
  BLOG_INDEX_CACHE_TAG,
  blogArticleCacheTag,
  getEditorialArticleForPublicRoute,
  getEditorialArticlesForPublicRoutes,
  revalidateArticlePublication,
} from "../../lib/editorial/publication-cache";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.FIREBASE_PROJECT_ID = "demo-shruggie-web";
  process.env.FIREBASE_STORAGE_BUCKET = "demo-shruggie-web.firebasestorage.app";
  process.env.NEXT_PUBLIC_SITE_URL = "https://shruggie.tech";
});

describe("published article cache contract", () => {
  it("reads cached editorial records through the server adapter", async () => {
    const article = articleFixture();
    mocks.list.mockResolvedValue([article]);
    mocks.getBySlug.mockResolvedValue(article);

    await expect(getEditorialArticlesForPublicRoutes()).resolves.toEqual([
      article,
    ]);
    await expect(
      getEditorialArticleForPublicRoute(article.slug),
    ).resolves.toEqual(article);
    expect(mocks.list).toHaveBeenCalledWith({ visibility: "all" });
    expect(mocks.getBySlug).toHaveBeenCalledWith(article.slug, "all");
  });

  it("does not invalidate public routes for a draft-only edit", () => {
    const draft = articleFixture();
    revalidateArticlePublication(draft, nextRevision(draft));
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("immediately expires a newly published slug and converges shared surfaces", () => {
    const draft = articleFixture();
    const published = nextRevision(draft, {
      publishedAt: "2026-09-05T13:00:00.000Z",
      state: "published",
    });

    revalidateArticlePublication(draft, published);

    expect(mocks.revalidateTag).toHaveBeenCalledWith(BLOG_INDEX_CACHE_TAG, {
      expire: 0,
    });
    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      blogArticleCacheTag(draft.slug),
      { expire: 0 },
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith(`/blog/${draft.slug}`);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/blog");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
  });

  it("keeps stale published content available while an update revalidates", () => {
    const published = articleFixture({
      publishedAt: "2026-09-05T12:00:00.000Z",
      state: "published",
    });
    const updated = nextRevision(published, { title: "Updated article" });

    revalidateArticlePublication(published, updated);

    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      blogArticleCacheTag(published.slug),
      "max",
    );
    expect(mocks.revalidateTag).toHaveBeenCalledWith(
      BLOG_INDEX_CACHE_TAG,
      "max",
    );
  });

  it("invalidates only same-origin editorial media", () => {
    const published = articleFixture({
      featuredImage: {
        altText: "A local image",
        assetId: "asset:local-image",
        deliveryUrl: "https://shruggie.tech/media/asset:local-image",
      },
      ogImage: {
        altText: "An external image",
        assetId: "asset:external-image",
        deliveryUrl: "https://cdn.example.com/media/external-image",
      },
      publishedAt: "2026-09-05T12:00:00.000Z",
      state: "published",
    });

    revalidateArticlePublication(
      published,
      nextRevision(published, { title: "Updated article" }),
    );

    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/media/asset:local-image",
    );
    expect(mocks.revalidatePath).not.toHaveBeenCalledWith(
      "/media/external-image",
    );
  });
});
