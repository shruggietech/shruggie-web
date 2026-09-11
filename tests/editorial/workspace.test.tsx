// @vitest-environment jsdom

import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import EditorialWorkspace from "../../components/editorial/EditorialWorkspace";
import type { Article, EditorialAsset } from "../../lib/editorial/domain";
import { articleFixture, nextRevision } from "./fixtures";

const firebaseBrowserMocks = vi.hoisted(() => ({
  completeGoogleSignIn: vi.fn(),
  startGoogleSignIn: vi.fn(),
}));

vi.mock("../../lib/editorial/firebase-browser", () => ({
  completeGoogleSignIn: firebaseBrowserMocks.completeGoogleSignIn,
  startGoogleSignIn: firebaseBrowserMocks.startGoogleSignIn,
}));

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sessionAndWorkspaceFetch(
  initialArticles: Article[] = [],
  revisions: Article[] = initialArticles,
  initialAssets: EditorialAsset[] = [],
) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    if (url === "/api/admin/session" && method === "GET") {
      return json({
        editor: {
          author: { id: "team:natalie", name: "Natalie Thompson" },
          id: "editor:natalie",
          role: "admin",
        },
      });
    }
    if (url === "/api/admin/articles?limit=100") {
      return json({ articles: initialArticles });
    }
    if (url === "/api/admin/assets" && method === "GET")
      return json({ assets: initialAssets });
    if (url === "/api/admin/assets" && method === "POST") {
      const form = init?.body as FormData;
      return json(
        {
          asset: {
            schemaVersion: 1,
            id: String(form.get("id")),
            articleId: String(form.get("articleId")),
            originalFileName: (form.get("file") as File).name,
            contentType: "image/png",
            sizeBytes: 128,
            width: 1200,
            height: 630,
            altText: String(form.get("altText")),
            checksumSha256: "a".repeat(64),
            storagePath: `articles/${String(form.get("articleId"))}/${String(form.get("id"))}.png`,
            deliveryUrl: `https://shruggie.tech/media/${String(form.get("id"))}`,
            createdAt: "2026-09-05T12:00:00.000Z",
            createdBy: "editor:natalie",
          },
        },
        201,
      );
    }
    if (url.includes("/revisions")) return json({ revisions });
    if (url === "/api/admin/articles" && method === "POST") {
      const payload = JSON.parse(String(init?.body)) as { article: Article };
      return json({ article: payload.article }, 201);
    }
    if (url.includes("/api/admin/articles/") && method === "PUT") {
      const payload = JSON.parse(String(init?.body)) as { article: Article };
      return json({ article: payload.article, publicationConverged: true });
    }
    throw new Error(`Unexpected request: ${method} ${url}`);
  });
}

beforeEach(() => {
  sessionStorage.clear();
  Object.defineProperties(Range.prototype, {
    getBoundingClientRect: {
      configurable: true,
      value: () => ({
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    },
    getClientRects: {
      configurable: true,
      value: () => [],
    },
  });
  firebaseBrowserMocks.completeGoogleSignIn.mockResolvedValue(null);
  firebaseBrowserMocks.startGoogleSignIn.mockResolvedValue(undefined);
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: sessionAndWorkspaceFetch(),
  });
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    configurable: true,
    value: vi.fn(() => "00000000-0000-4000-8000-000000000027"),
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("EditorialWorkspace", () => {
  it("uses a same-tab Google redirect instead of a popup", async () => {
    globalThis.fetch = vi.fn(async () =>
      json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "An editorial session is required.",
          },
        },
        401,
      ),
    );
    const user = userEvent.setup();
    render(<EditorialWorkspace />);

    expect(
      await screen.findByText(/This workspace is for pre-authorized use only/),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact us." })).toHaveAttribute(
      "href",
      "/contact",
    );

    await user.click(
      screen.getByRole("button", { name: "Continue with Google" }),
    );

    expect(firebaseBrowserMocks.startGoogleSignIn).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: "Redirecting to Google…" }),
    ).toBeDisabled();
  });

  it("supports the complete keyboard draft-authoring journey", async () => {
    const user = userEvent.setup();
    const fetchMock = sessionAndWorkspaceFetch();
    globalThis.fetch = fetchMock;
    const { container } = render(<EditorialWorkspace />);

    const newArticle = await screen.findByRole("button", {
      name: "New article",
    });
    expect(
      screen.getByRole("heading", { name: "No articles yet" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Create a draft" }),
    ).not.toBeInTheDocument();
    newArticle.focus();
    await user.keyboard("{Enter}");

    const title = screen.getByLabelText("Title");
    expect(title).toHaveFocus();
    await user.type(title, "A keyboard-authored article");
    await user.tab();
    expect(screen.getByLabelText("URL slug")).toHaveValue(
      "a-keyboard-authored-article",
    );
    await user.type(screen.getByLabelText("Category"), "Engineering");
    const author = screen.getByLabelText("Author");
    expect(author).toHaveValue("team:natalie");
    expect(
      screen.getByRole("option", { name: "Select an author" }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("option", { name: /Natalie Thompson.*no profile/ }),
    ).not.toBeInTheDocument();
    await user.selectOptions(author, "team:william");
    await user.type(
      screen.getByLabelText("Excerpt"),
      "A complete excerpt written entirely with accessible browser controls.",
    );
    const articleBody = screen.getByLabelText("Article body in Markdown");
    await user.click(articleBody);
    await user.paste("## A useful heading\n\nA safe article body.");

    const preview = screen.getByRole("button", { name: "Preview" });
    expect(preview).toBeDisabled();
    expect(screen.getByText("Save the draft to preview.")).toBeInTheDocument();

    const save = screen.getByRole("button", { name: "Save draft" });
    save.focus();
    await user.keyboard("{Enter}");

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Draft saved as revision 1.",
    );
    const post = fetchMock.mock.calls.find(
      ([input, init]) =>
        String(input) === "/api/admin/articles" && init?.method === "POST",
    );
    expect(post).toBeTruthy();
    const saved = JSON.parse(String(post?.[1]?.body)) as { article: Article };
    expect(saved.article.author).toEqual({
      id: "team:william",
      name: "William Thompson",
    });
    expect(preview).toBeEnabled();
    expect(
      screen.getByText("Preview opens the saved draft without publishing."),
    ).toBeInTheDocument();
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    await user.click(preview);
    expect(open).toHaveBeenCalledWith(
      "/api/admin/preview?slug=a-keyboard-authored-article",
      "_blank",
      "noopener,noreferrer",
    );
    const publish = screen.getByRole("button", { name: "Publish" });
    expect(publish).toBeEnabled();
    await user.click(publish);
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Published revision 2. Public caches were refreshed.",
    );
    const update = fetchMock.mock.calls.find(
      ([input, init]) =>
        String(input).includes("/api/admin/articles/") &&
        init?.method === "PUT",
    );
    const published = JSON.parse(String(update?.[1]?.body)) as {
      article: Article;
      idempotencyKey: string;
    };
    expect(published.article).toMatchObject({
      publishedAt: expect.any(String),
      state: "published",
    });
    expect(published.idempotencyKey).toMatch(/^publish:/);
    expect(screen.queryByText(/#28/)).not.toBeInTheDocument();

    const accessibility = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(accessibility.violations).toEqual([]);
  });

  it("keeps article-body scrolling inside the editor", async () => {
    const user = userEvent.setup();
    render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );

    const articleBody = screen.getByLabelText("Article body in Markdown");
    const editorShell = articleBody.closest("[data-markdown-editor]");
    const editorScroller = editorShell?.querySelector(".cm-scroller");

    expect(articleBody).toHaveAttribute("contenteditable", "true");
    expect(editorShell).toHaveAttribute("data-lenis-prevent");
    expect(editorShell).toHaveClass("overscroll-contain");
    expect(editorScroller).toHaveStyle({ overscrollBehavior: "contain" });
    expect(screen.getByLabelText("Excerpt")).not.toHaveAttribute(
      "data-lenis-prevent",
    );
  });

  it("highlights Markdown and reports live line-specific policy issues", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );

    const articleBody = screen.getByLabelText("Article body in Markdown");
    expect(
      screen.getByText("Write the article body in Markdown."),
    ).toBeVisible();
    expect(
      screen.queryByText(/Live checks flag raw HTML/),
    ).not.toBeInTheDocument();
    await user.click(articleBody);
    await user.paste("# Highlighted heading\n\n[unsafe](javascript:alert(1))");
    expect(articleBody).toHaveTextContent("javascript:alert(1)");

    expect(container.querySelector(".cm-gutters")).toBeInTheDocument();
    expect(container.querySelector(".cm-gutter-lint")).toBeInTheDocument();
    expect(articleBody.closest("[data-markdown-editor]")).toHaveAttribute(
      "data-syntax-highlighting",
      "markdown",
    );
    expect(await screen.findByText("1 Markdown issue found")).toBeVisible();
    expect(screen.getByText(/Line 3: The link URL.*is unsafe/)).toBeVisible();
    expect(articleBody).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps the writing canvas full width with compact actions and history below", async () => {
    const user = userEvent.setup();
    const { container } = render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );

    const form = container.querySelector("form");
    const history = screen.getByRole("complementary", {
      name: "Revision history",
    });
    const save = screen.getByRole("button", { name: "Save draft" });

    expect(form).not.toBeNull();
    expect(form?.parentElement).toHaveClass("space-y-8");
    expect(form?.parentElement).not.toHaveClass(
      "xl:grid-cols-[minmax(0,1fr)_22rem]",
    );
    expect(form?.compareDocumentPosition(history) ?? 0).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(history).not.toHaveClass("xl:sticky");
    expect(save).toHaveClass("shrink-0", "whitespace-nowrap", "px-4", "py-2");
    expect(save.parentElement).toHaveClass("flex-wrap", "items-center");
  });

  it("identifies invalid fields and preserves unsaved work", async () => {
    const user = userEvent.setup();
    render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );
    await user.type(screen.getByLabelText("Title"), "Preserved title");
    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Review the highlighted fields",
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Preserved title");
    expect(screen.getByLabelText("Excerpt")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Excerpt")).toHaveFocus();
  });

  it("flags a legacy free-text author until a registered profile is selected", async () => {
    const legacy = articleFixture({
      author: { id: "editor:legacy", name: "ShruggieTech" },
    });
    globalThis.fetch = sessionAndWorkspaceFetch([legacy]);
    const user = userEvent.setup();
    render(<EditorialWorkspace />);

    await user.click(
      await screen.findByRole("button", { name: /Edit An example article/ }),
    );

    const author = screen.getByLabelText("Author");
    expect(author).toHaveValue("");
    expect(
      screen.getByText(/“ShruggieTech” has no registered author profile/),
    ).toBeInTheDocument();

    await user.selectOptions(author, "team:josiah");
    expect(author).toHaveValue("team:josiah");
    expect(
      screen.getByText(/Controls the byline, Written by card/),
    ).toBeInTheDocument();
  });

  it("reuses library images and only reveals upload fields on request", async () => {
    const reusableAsset: EditorialAsset = {
      schemaVersion: 1,
      id: "asset:previously-uploaded",
      articleId: "article:another-post",
      originalFileName: "shared-feature.png",
      contentType: "image/png",
      sizeBytes: 128,
      width: 1200,
      height: 630,
      altText: "A shared green abstract illustration",
      checksumSha256: "b".repeat(64),
      storagePath:
        "articles/article:another-post/asset:previously-uploaded.png",
      deliveryUrl: "https://shruggie.tech/media/asset:previously-uploaded.png",
      createdAt: "2026-09-04T12:00:00.000Z",
      createdBy: "editor:natalie",
    };
    globalThis.fetch = sessionAndWorkspaceFetch([], [], [reusableAsset]);
    const user = userEvent.setup();
    render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );

    const featured = screen.getByRole("group", { name: "Featured image" });
    expect(within(featured).getByText("No image selected")).toBeVisible();
    expect(screen.queryByLabelText("Image file")).not.toBeInTheDocument();

    const choose = within(featured).getByRole("button", {
      name: "Choose image",
    });
    await user.click(choose);

    const dialog = await screen.findByRole("dialog", {
      name: "Choose featured image",
    });
    expect(within(dialog).getByText("shared-feature.png")).toBeVisible();
    expect(
      within(dialog).queryByLabelText("Image file"),
    ).not.toBeInTheDocument();
    await user.click(
      within(dialog).getByRole("button", { name: "Choose shared-feature.png" }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "shared-feature.png selected as the featured image",
    );
    expect(within(featured).getByText("shared-feature.png")).toBeVisible();
    expect(within(featured).getByLabelText("Contextual alt text")).toHaveValue(
      reusableAsset.altText,
    );
    await waitFor(() => expect(choose).toHaveFocus());

    await user.click(
      within(featured).getByRole("button", { name: "Replace image" }),
    );
    await user.click(screen.getByRole("button", { name: "Upload new" }));
    expect(screen.getByLabelText("Image file")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Upload and use" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choose an image",
    );

    const file = new File([new Uint8Array([137, 80, 78, 71])], "feature.png", {
      type: "image/png",
    });
    await user.upload(screen.getByLabelText("Image file"), file);
    await user.type(
      screen.getByLabelText("Alt text (leave blank if decorative)"),
      "A green terminal window showing a successful build",
    );
    await user.click(screen.getByRole("button", { name: "Upload and use" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "feature.png uploaded and selected as the featured image",
    );
    expect(within(featured).getByText("feature.png")).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      within(featured).getByRole("button", { name: "Remove image" }),
    );
    expect(within(featured).getByText("No image selected")).toBeVisible();
  });

  it("uploads decorative and informative images to either slot without losing draft data", async () => {
    const user = userEvent.setup();
    const fetchMock = sessionAndWorkspaceFetch();
    globalThis.fetch = fetchMock;
    render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );
    await user.type(screen.getByLabelText("Title"), "Preserved draft title");

    const featured = screen.getByRole("group", { name: "Featured image" });
    await user.click(
      within(featured).getByRole("button", { name: "Choose image" }),
    );
    let dialog = screen.getByRole("dialog", {
      name: "Choose featured image",
    });
    await user.click(
      within(dialog).getAllByRole("button", { name: "Upload new" })[0],
    );
    await user.upload(
      screen.getByLabelText("Image file"),
      new File([new Uint8Array([137, 80, 78, 71])], "decorative.png", {
        type: "image/png",
      }),
    );
    await user.type(
      screen.getByLabelText("Alt text (leave blank if decorative)"),
      "   ",
    );
    await user.click(screen.getByRole("button", { name: "Upload and use" }));

    expect(within(featured).getByText("decorative.png")).toBeVisible();
    expect(within(featured).getByLabelText("Contextual alt text")).toHaveValue(
      "",
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Preserved draft title");

    const social = screen.getByRole("group", { name: "Social image" });
    await user.click(
      within(social).getByRole("button", { name: "Choose image" }),
    );
    dialog = screen.getByRole("dialog", { name: "Choose social image" });
    await user.click(
      within(dialog).getByRole("button", { name: "Upload new" }),
    );
    await user.upload(
      screen.getByLabelText("Image file"),
      new File([new Uint8Array([137, 80, 78, 71])], "social.png", {
        type: "image/png",
      }),
    );
    await user.type(
      screen.getByLabelText("Alt text (leave blank if decorative)"),
      "A green social preview card",
    );
    await user.click(screen.getByRole("button", { name: "Upload and use" }));

    expect(within(social).getByText("social.png")).toBeVisible();
    expect(within(social).getByLabelText("Contextual alt text")).toHaveValue(
      "A green social preview card",
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Preserved draft title");

    const uploads = fetchMock.mock.calls.filter(
      ([input, init]) =>
        String(input) === "/api/admin/assets" && init?.method === "POST",
    );
    expect(uploads).toHaveLength(2);
    expect((uploads[0]?.[1]?.body as FormData).get("altText")).toBe("");
    expect((uploads[1]?.[1]?.body as FormData).get("altText")).toBe(
      "A green social preview card",
    );
  });

  it("loads a selected prior revision into the unsaved restore draft", async () => {
    const first = articleFixture();
    const second = nextRevision(first, { title: "Current second revision" });
    globalThis.fetch = sessionAndWorkspaceFetch([second], [second, first]);
    const user = userEvent.setup();
    render(<EditorialWorkspace />);

    await user.click(
      await screen.findByRole("button", {
        name: /Edit Current second revision/,
      }),
    );
    await user.click(await screen.findByLabelText(/Revision 1/));
    await user.click(screen.getByRole("button", { name: "Load into draft" }));

    expect(screen.getByLabelText("Title")).toHaveValue(first.title);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Revision 1 was loaded into the unsaved draft",
    );
    await user.click(screen.getByRole("button", { name: "Restore revision" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Revision 1 restored as revision 3.",
    );
    const restoreCall = vi
      .mocked(globalThis.fetch)
      .mock.calls.find(
        ([input, init]) =>
          String(input).includes("/api/admin/articles/") &&
          init?.method === "PUT",
      );
    const restore = JSON.parse(String(restoreCall?.[1]?.body)) as {
      article: Article;
      restoreFromRevision: number;
    };
    expect(restore.restoreFromRevision).toBe(1);
    expect(restore.article.title).toBe(first.title);
  });

  it("publishes updates and can unpublish without changing the original publication date", async () => {
    const publishedAt = "2026-09-06T12:00:00.000Z";
    const published = articleFixture({ state: "published", publishedAt });
    globalThis.fetch = sessionAndWorkspaceFetch([published], [published]);
    const user = userEvent.setup();
    render(<EditorialWorkspace />);

    await user.click(
      await screen.findByRole("button", { name: /Edit An example article/ }),
    );
    const title = screen.getByLabelText("Title");
    await user.clear(title);
    await user.type(title, "A corrected published article");
    await user.click(screen.getByRole("button", { name: "Publish update" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Published update saved as revision 2.",
    );
    const updateCalls = vi
      .mocked(globalThis.fetch)
      .mock.calls.filter(
        ([input, init]) =>
          String(input).includes("/api/admin/articles/") &&
          init?.method === "PUT",
      );
    const update = JSON.parse(String(updateCalls[0]?.[1]?.body)) as {
      article: Article;
    };
    expect(update.article).toMatchObject({
      publishedAt,
      state: "published",
      title: "A corrected published article",
    });

    await user.click(screen.getByRole("button", { name: "Unpublish" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Unpublished as revision 3. Public caches were refreshed.",
    );
    const unpublish = JSON.parse(
      String(
        vi
          .mocked(globalThis.fetch)
          .mock.calls.filter(
            ([input, init]) =>
              String(input).includes("/api/admin/articles/") &&
              init?.method === "PUT",
          )[1]?.[1]?.body,
      ),
    ) as { article: Article };
    expect(unpublish.article).toMatchObject({
      publishedAt: null,
      state: "draft",
    });
  });

  it("reuses the exact mutation after an ambiguous publication failure", async () => {
    const draft = articleFixture();
    let attempts = 0;
    const fetchMock = sessionAndWorkspaceFetch([draft], [draft]);
    globalThis.fetch = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        if (
          String(input).includes("/api/admin/articles/") &&
          init?.method === "PUT"
        ) {
          attempts += 1;
          if (attempts === 1) {
            return json(
              {
                error: {
                  code: "PUBLICATION_CONVERGENCE_FAILED",
                  message:
                    "The article was saved, but public caches need a retry.",
                  retryable: true,
                },
              },
              503,
            );
          }
        }
        return fetchMock(input, init);
      },
    );
    const user = userEvent.setup();
    render(<EditorialWorkspace />);

    await user.click(
      await screen.findByRole("button", { name: /Edit An example article/ }),
    );
    const publish = screen.getByRole("button", { name: "Publish" });
    await user.click(publish);
    expect(await screen.findByRole("status")).toHaveTextContent(
      "public caches need a retry",
    );
    await user.click(publish);
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Published revision 2",
    );

    const requests = vi
      .mocked(globalThis.fetch)
      .mock.calls.filter(
        ([input, init]) =>
          String(input).includes("/api/admin/articles/") &&
          init?.method === "PUT",
      )
      .map(([, init]) => String(init?.body));
    expect(requests).toHaveLength(2);
    expect(requests[1]).toBe(requests[0]);
  });

  it("surfaces stale conflicts without overwriting local content", async () => {
    const current = articleFixture();
    const latest = nextRevision(current, { title: "Changed elsewhere" });
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";
        if (url === "/api/admin/session")
          return json({
            editor: {
              author: { id: "team:natalie", name: "Natalie Thompson" },
              id: "editor:natalie",
              role: "editor",
            },
          });
        if (url === "/api/admin/articles?limit=100")
          return json({ articles: [current] });
        if (url === "/api/admin/assets") return json({ assets: [] });
        if (url.includes("/revisions"))
          return json({ revisions: [latest, current] });
        if (url.includes("/api/admin/articles/") && method === "PUT") {
          return json(
            {
              error: {
                code: "REVISION_CONFLICT",
                message: "A newer revision exists.",
              },
            },
            409,
          );
        }
        throw new Error(`Unexpected request: ${method} ${url}`);
      },
    );
    globalThis.fetch = fetchMock;
    const user = userEvent.setup();
    render(<EditorialWorkspace />);

    await user.click(
      await screen.findByRole("button", { name: /Edit An example article/ }),
    );
    const title = screen.getByLabelText("Title");
    await user.clear(title);
    await user.type(title, "My local unsaved version");
    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "newer revision exists",
    );
    expect(title).toHaveValue("My local unsaved version");
  });

  it("keeps work mounted when a session expires", async () => {
    const current = articleFixture();
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";
        if (url === "/api/admin/session")
          return json({
            editor: {
              author: { id: "team:natalie", name: "Natalie Thompson" },
              id: "editor:natalie",
              role: "editor",
            },
          });
        if (url === "/api/admin/articles?limit=100")
          return json({ articles: [current] });
        if (url === "/api/admin/assets") return json({ assets: [] });
        if (url.includes("/revisions")) return json({ revisions: [current] });
        if (url.includes("/api/admin/articles/") && method === "PUT") {
          return json(
            { error: { code: "INVALID_SESSION", message: "Session expired." } },
            401,
          );
        }
        throw new Error(`Unexpected request: ${method} ${url}`);
      },
    );
    globalThis.fetch = fetchMock;
    const user = userEvent.setup();
    render(<EditorialWorkspace />);

    await user.click(
      await screen.findByRole("button", { name: /Edit An example article/ }),
    );
    const title = screen.getByLabelText("Title");
    await user.clear(title);
    await user.type(title, "Still here after reauthentication");
    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(
      await screen.findByRole("dialog", { name: "Session expired" }),
    ).toBeInTheDocument();
    expect(title).toHaveValue("Still here after reauthentication");
  });

  it("recovers an unsaved draft after same-tab authentication navigation", async () => {
    const user = userEvent.setup();
    const firstRender = render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );
    await user.type(
      screen.getByLabelText("Title"),
      "Recovered after Google redirect",
    );

    await screen.findByText("Unsaved changes");
    firstRender.unmount();
    render(<EditorialWorkspace />);

    expect(await screen.findByLabelText("Title")).toHaveValue(
      "Recovered after Google redirect",
    );
  });
});
