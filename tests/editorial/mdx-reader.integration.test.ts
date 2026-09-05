import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { EditorialValidationError } from "../../lib/editorial/errors";
import { MdxArticleReader } from "../../lib/editorial/mdx-article-reader";

const temporaryDirectories: string[] = [];

async function temporaryPostsDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "shruggie-editorial-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("MdxArticleReader integration", () => {
  it("validates repository content through the canonical article contract", async () => {
    const reader = new MdxArticleReader();
    const articles = await reader.list({ visibility: "published" });
    expect(articles.length).toBeGreaterThan(0);
    expect(articles.every((article) => article.schemaVersion === 1)).toBe(true);
  });

  it("filters drafts and rejects executable repository content", async () => {
    const directory = await temporaryPostsDirectory();
    await writeFile(
      path.join(directory, "safe-draft.mdx"),
      '---\ntitle: "Safe draft"\ndate: "2026-09-05"\nauthor: "Natalie Thompson"\ncategory: "Engineering"\nexcerpt: "A safe draft article used for integration testing."\npublished: false\n---\n\n## Draft\n\nSafe content.\n',
    );
    await writeFile(
      path.join(directory, "unsafe-post.mdx"),
      '---\ntitle: "Unsafe post"\ndate: "2026-09-05"\nauthor: "Natalie Thompson"\ncategory: "Engineering"\nexcerpt: "An unsafe article used for integration testing."\npublished: true\n---\n\n<script>alert("no")</script>\n',
    );
    const reader = new MdxArticleReader(directory);

    await expect(
      reader.getBySlug("safe-draft", "published"),
    ).resolves.toBeNull();
    await expect(reader.getBySlug("safe-draft", "all")).resolves.toMatchObject({
      state: "draft",
    });
    await expect(reader.getBySlug("unsafe-post", "all")).rejects.toBeInstanceOf(
      EditorialValidationError,
    );
  });
});
