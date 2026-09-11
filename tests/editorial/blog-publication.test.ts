import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContentUnavailableError } from "../../lib/editorial/errors";
import { articleFixture } from "./fixtures";

const mocks = vi.hoisted(() => ({
  editorialBySlug: vi.fn(),
  editorialList: vi.fn(),
  repositoryBySlug: vi.fn(),
  repositoryList: vi.fn(),
}));

vi.mock("../../lib/editorial/mdx-article-reader", () => ({
  MdxArticleReader: class {
    getBySlug = mocks.repositoryBySlug;
    list = mocks.repositoryList;
  },
}));

vi.mock("../../lib/editorial/publication-cache", () => ({
  getEditorialArticleForPublicRoute: mocks.editorialBySlug,
  getEditorialArticlesForPublicRoutes: mocks.editorialList,
  hasEditorialBackendConfiguration: () => true,
}));

vi.mock("../../lib/editorial/firebase-admin", () => ({
  createFirebaseEditorialBackend: vi.fn(),
}));

import { getAllPostsMeta, getPostBySlug } from "../../lib/blog";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.repositoryList.mockResolvedValue([]);
  mocks.repositoryBySlug.mockResolvedValue(null);
  mocks.editorialList.mockResolvedValue([]);
  mocks.editorialBySlug.mockResolvedValue(null);
});

describe("hybrid public blog publication", () => {
  it("serves a newly published editorial slug without a deployment", async () => {
    const published = articleFixture({
      featuredImage: {
        altText: "A published editorial image",
        assetId: "asset:published",
        deliveryUrl: "https://shruggie.tech/media/asset:published",
      },
      publishedAt: "2026-09-10T12:00:00.000Z",
      slug: "published-after-deployment",
      state: "published",
    });
    mocks.editorialBySlug.mockResolvedValue(published);

    await expect(getPostBySlug(published.slug)).resolves.toMatchObject({
      content: published.body.source,
      meta: {
        featuredImage: "/media/asset:published",
        featuredImageAlt: "A published editorial image",
        published: true,
        slug: published.slug,
      },
    });
    expect(mocks.repositoryBySlug).not.toHaveBeenCalled();
  });

  it("preserves an empty decorative alternative in the public view model", async () => {
    const published = articleFixture({
      featuredImage: {
        altText: "",
        assetId: "asset:decorative",
        deliveryUrl: "https://shruggie.tech/media/asset:decorative",
      },
      publishedAt: "2026-09-10T12:00:00.000Z",
      state: "published",
    });
    mocks.editorialBySlug.mockResolvedValue(published);

    await expect(getPostBySlug(published.slug)).resolves.toMatchObject({
      meta: { featuredImageAlt: "" },
    });
  });

  it("merges published editorial articles and shadows repository copies", async () => {
    const repositoryArticle = articleFixture({
      id: "article:repository",
      slug: "shared-slug",
      state: "published",
      publishedAt: "2026-09-01T12:00:00.000Z",
      title: "Repository version",
    });
    const editorialArticle = articleFixture({
      id: "article:editorial",
      slug: "shared-slug",
      state: "published",
      publishedAt: "2026-09-10T12:00:00.000Z",
      title: "Editorial version",
    });
    mocks.repositoryList.mockResolvedValue([repositoryArticle]);
    mocks.editorialList.mockResolvedValue([editorialArticle]);

    await expect(getAllPostsMeta()).resolves.toEqual([
      expect.objectContaining({
        slug: "shared-slug",
        title: "Editorial version",
      }),
    ]);
  });

  it("keeps an unpublished editorial slug from falling through to repository content", async () => {
    const draft = articleFixture({ slug: "shared-slug" });
    mocks.editorialBySlug.mockResolvedValue(draft);

    await expect(getPostBySlug(draft.slug)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    expect(mocks.repositoryBySlug).not.toHaveBeenCalled();
  });

  it("uses repository content during an editorial outage and surfaces cold misses", async () => {
    const repositoryArticle = articleFixture({
      publishedAt: "2026-09-01T12:00:00.000Z",
      state: "published",
    });
    const outage = new ContentUnavailableError("read public articles");
    mocks.editorialBySlug.mockRejectedValue(outage);
    mocks.repositoryBySlug.mockResolvedValueOnce(repositoryArticle);

    await expect(getPostBySlug(repositoryArticle.slug)).resolves.toMatchObject({
      meta: { slug: repositoryArticle.slug },
    });

    mocks.repositoryBySlug.mockResolvedValueOnce(null);
    await expect(getPostBySlug("editorial-only-slug")).rejects.toBe(outage);
  });
});
