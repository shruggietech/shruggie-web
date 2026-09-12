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

import {
  getAllPostsMeta,
  getPostBySlug,
  getPrerenderedPostSlugs,
} from "../../lib/blog";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.repositoryList.mockResolvedValue([]);
  mocks.repositoryBySlug.mockResolvedValue(null);
  mocks.editorialList.mockResolvedValue([]);
  mocks.editorialBySlug.mockResolvedValue(null);
  process.env.CMS_CONTENT_AUTHORITY = "firestore";
});

describe("authoritative public blog publication", () => {
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

  it("lists only published editorial articles after cutover", async () => {
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
    expect(mocks.repositoryList).not.toHaveBeenCalled();
  });

  it("does not enumerate Firestore slugs during production builds", async () => {
    const repositoryArticle = articleFixture({
      id: "article:repository",
      slug: "repository-build-slug",
      state: "published",
      publishedAt: "2026-09-01T12:00:00.000Z",
    });
    mocks.repositoryList.mockResolvedValue([repositoryArticle]);

    await expect(getPrerenderedPostSlugs()).resolves.toEqual([]);
    expect(mocks.repositoryList).not.toHaveBeenCalled();
    expect(mocks.editorialList).not.toHaveBeenCalled();
  });

  it("keeps an unpublished editorial slug from falling through to repository content", async () => {
    const draft = articleFixture({ slug: "shared-slug" });
    mocks.editorialBySlug.mockResolvedValue(draft);

    await expect(getPostBySlug(draft.slug)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
    expect(mocks.repositoryBySlug).not.toHaveBeenCalled();
  });

  it("does not fall through to repository content during an editorial outage", async () => {
    const repositoryArticle = articleFixture({
      publishedAt: "2026-09-01T12:00:00.000Z",
      state: "published",
    });
    const outage = new ContentUnavailableError("read public articles");
    mocks.editorialBySlug.mockRejectedValue(outage);
    mocks.repositoryBySlug.mockResolvedValue(repositoryArticle);

    await expect(getPostBySlug(repositoryArticle.slug)).rejects.toBe(outage);
    expect(mocks.repositoryBySlug).not.toHaveBeenCalled();
  });

  it("keeps repository mode available only as an explicit local recovery source", async () => {
    process.env.CMS_CONTENT_AUTHORITY = "repository";
    const repositoryArticle = articleFixture({
      publishedAt: "2026-09-01T12:00:00.000Z",
      state: "published",
    });
    mocks.repositoryBySlug.mockResolvedValue(repositoryArticle);
    mocks.repositoryList.mockResolvedValue([repositoryArticle]);

    await expect(getPostBySlug(repositoryArticle.slug)).resolves.toMatchObject({
      meta: { slug: repositoryArticle.slug },
    });
    await expect(getPrerenderedPostSlugs()).resolves.toEqual([
      repositoryArticle.slug,
    ]);
    expect(mocks.editorialBySlug).not.toHaveBeenCalled();
  });
});
