import { isValidElement, type ReactElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  draftMode: vi.fn(),
  getPostBySlug: vi.fn(),
  getPreviewPostBySlug: vi.fn(),
  headers: vi.fn(),
  requireEditor: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: mocks.draftMode,
  headers: mocks.headers,
}));

vi.mock("@/lib/blog", () => ({
  getAllPostsMeta: vi.fn(async () => []),
  getPostBySlug: mocks.getPostBySlug,
  getPreviewPostBySlug: mocks.getPreviewPostBySlug,
}));

vi.mock("@/lib/editorial/http", () => ({
  requireEditor: mocks.requireEditor,
}));

import BlogPostPage, { generateMetadata } from "../../app/blog/[slug]/page";

function findImageBySource(
  node: ReactNode,
  source: string,
): ReactElement<{ alt: string; src: string }> | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findImageBySource(child, source);
      if (found) return found;
    }
    return null;
  }
  if (!isValidElement(node)) return null;
  const props = node.props as {
    alt?: string;
    children?: ReactNode;
    src?: string;
  };
  if (props.src === source) {
    return node as ReactElement<{ alt: string; src: string }>;
  }
  return findImageBySource(props.children, source);
}

function post(slug: string, title: string, published: boolean) {
  return {
    content: "## Article body",
    meta: {
      author: "ShruggieTech",
      category: "Engineering",
      date: "2026-09-06",
      excerpt: "A sufficiently descriptive article excerpt.",
      published,
      readingTime: "1 min read",
      slug,
      title,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.draftMode.mockResolvedValue({ isEnabled: true });
  mocks.headers.mockResolvedValue(
    new Headers({ cookie: "__Host-shruggie_editor=session" }),
  );
  mocks.requireEditor.mockResolvedValue({
    id: "editor:natalie",
    role: "admin",
    uid: "firebase-user",
  });
});

describe("blog preview routing", () => {
  it("uses published content when Draft Mode remains enabled without an exact preview slug", async () => {
    mocks.getPostBySlug.mockResolvedValue(
      post("published-article", "Published article", true),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "published-article" }),
    });

    expect(metadata.title).toBe("Published article");
    expect(mocks.getPostBySlug).toHaveBeenCalledWith("published-article");
    expect(mocks.getPreviewPostBySlug).not.toHaveBeenCalled();
    expect(mocks.draftMode).toHaveBeenCalledOnce();
    expect(mocks.requireEditor).toHaveBeenCalledOnce();
  });

  it("uses authorized Firestore content for the exact preview slug", async () => {
    mocks.headers.mockResolvedValue(
      new Headers({
        cookie:
          "__Host-shruggie_editor=session; __Host-shruggie_preview=saved-draft",
      }),
    );
    mocks.getPreviewPostBySlug.mockResolvedValue(
      post("saved-draft", "Saved draft", false),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "saved-draft" }),
    });

    expect(metadata.title).toBe("Saved draft");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(mocks.getPreviewPostBySlug).toHaveBeenCalledWith("saved-draft");
    expect(mocks.getPostBySlug).not.toHaveBeenCalled();
    expect(mocks.requireEditor).toHaveBeenCalledOnce();
  });

  it.each([
    ["decorative", "", ""],
    [
      "informative",
      "A green abstract editorial image",
      "A green abstract editorial image",
    ],
  ])(
    "renders %s featured-image alt text without a fallback",
    async (_label, alt, expected) => {
      const slug = `render-${_label}`;
      const source = "/media/asset:render-test";
      mocks.getPostBySlug.mockResolvedValue({
        ...post(slug, "Rendered article", true),
        meta: {
          ...post(slug, "Rendered article", true).meta,
          featuredImage: source,
          featuredImageAlt: alt,
        },
      });

      const page = await BlogPostPage({ params: Promise.resolve({ slug }) });
      const image = findImageBySource(page, source);

      expect(image).not.toBeNull();
      expect(image?.props.alt).toBe(expected);
    },
  );
});
