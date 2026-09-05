import { describe, expect, it } from "vitest";

import { articleSchemaV1, parseArticle } from "../../lib/editorial/domain";
import { EditorialValidationError } from "../../lib/editorial/errors";
import { articleFixture } from "./fixtures";

describe("articleSchemaV1", () => {
  it("uses one schema for drafts and published articles", () => {
    expect(parseArticle(articleFixture()).state).toBe("draft");
    expect(
      parseArticle(
        articleFixture({
          state: "published",
          publishedAt: "2026-09-05T12:00:00.000Z",
        }),
      ).state,
    ).toBe("published");
  });

  it.each([
    ["raw script", "<script>alert('no')</script>"],
    ["JSX", "<Callout>unsafe</Callout>"],
    ["MDX expression", "Hello {process.env.SECRET}"],
    ["ES module", 'import Thing from "./thing"'],
    ["unsafe link", "[click](javascript:alert(1))"],
  ])("rejects %s content", (_label, source) => {
    expect(() =>
      parseArticle(articleFixture({ body: { format: "markdown", source } })),
    ).toThrow(EditorialValidationError);
  });

  it("allows braces and markup inside code spans and fenced code", () => {
    const article = articleFixture({
      body: {
        format: "markdown",
        source:
          "Use `<Thing />` literally.\n\n```ts\nconst value = { safe: true };\n```",
      },
    });
    expect(parseArticle(article).body.source).toContain("const value");
  });

  it("requires alt text for inline Markdown images", () => {
    const result = articleSchemaV1.safeParse(
      articleFixture({
        body: { format: "markdown", source: "![](/media/article-image)" },
      }),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("alt text");
    }
  });

  it("enforces publication and revision timestamp invariants", () => {
    expect(() =>
      parseArticle(articleFixture({ state: "published", publishedAt: null })),
    ).toThrow(EditorialValidationError);
    expect(() =>
      parseArticle(
        articleFixture({
          modifiedAt: "2026-09-05T13:00:00.000Z",
        }),
      ),
    ).toThrow(EditorialValidationError);
  });

  it("rejects unversioned and unknown article fields", () => {
    expect(() =>
      parseArticle({ ...articleFixture(), schemaVersion: 2 }),
    ).toThrow(EditorialValidationError);
    expect(() =>
      parseArticle({ ...articleFixture(), executable: true }),
    ).toThrow(EditorialValidationError);
  });
});
