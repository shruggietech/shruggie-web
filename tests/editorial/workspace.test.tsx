// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import EditorialWorkspace from "../../components/editorial/EditorialWorkspace";
import type { Article } from "../../lib/editorial/domain";
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
) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    if (url === "/api/admin/session" && method === "GET") {
      return json({ editor: { id: "editor:natalie", role: "admin" } });
    }
    if (url === "/api/admin/articles?limit=100") {
      return json({ articles: initialArticles });
    }
    if (url === "/api/admin/assets" && method === "GET")
      return json({ assets: [] });
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
    throw new Error(`Unexpected request: ${method} ${url}`);
  });
}

beforeEach(() => {
  sessionStorage.clear();
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
    await user.type(screen.getByLabelText("Author name"), "Natalie Thompson");
    await user.type(
      screen.getByLabelText("Excerpt"),
      "A complete excerpt written entirely with accessible browser controls.",
    );
    await user.type(
      screen.getByLabelText("Article body in Markdown"),
      "## A useful heading{Enter}{Enter}A safe article body.",
    );

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
    expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled();
    expect(screen.getByText("Publishing requires review.")).toBeInTheDocument();
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
    expect(articleBody).toHaveAttribute("data-lenis-prevent");
    expect(articleBody).toHaveClass("overscroll-contain");
    expect(screen.getByLabelText("Excerpt")).not.toHaveAttribute(
      "data-lenis-prevent",
    );
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

  it("enforces upload fields and selects the uploaded asset", async () => {
    const user = userEvent.setup();
    render(<EditorialWorkspace />);
    await user.click(
      await screen.findByRole("button", { name: "New article" }),
    );

    await user.click(screen.getByRole("button", { name: "Upload image" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choose an image",
    );

    const file = new File([new Uint8Array([137, 80, 78, 71])], "feature.png", {
      type: "image/png",
    });
    await user.upload(screen.getByLabelText("Image file"), file);
    await user.type(
      screen.getByLabelText("Descriptive alt text"),
      "A green terminal window showing a successful build",
    );
    await user.click(screen.getByRole("button", { name: "Upload image" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Image uploaded and selected",
    );
    expect(screen.getByLabelText("Select featured image")).toHaveValue(
      "asset:00000000-0000-4000-8000-000000000027",
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
  });

  it("surfaces stale conflicts without overwriting local content", async () => {
    const current = articleFixture();
    const latest = nextRevision(current, { title: "Changed elsewhere" });
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";
        if (url === "/api/admin/session")
          return json({ editor: { id: "editor:natalie", role: "editor" } });
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
          return json({ editor: { id: "editor:natalie", role: "editor" } });
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
