import { describe, expect, it } from "vitest";

import {
  ContentTimeoutError,
  ContentUnavailableError,
  EditorialValidationError,
  InvalidStateTransitionError,
  RevisionConflictError,
  SlugCollisionError,
} from "../../lib/editorial/errors";
import { InMemoryArticleRepository } from "../../lib/editorial/memory-adapter";
import { articleFixture, nextRevision } from "./fixtures";

describe("ArticleRepository contract", () => {
  it("reserves slugs and returns actionable collisions", async () => {
    const repository = new InMemoryArticleRepository();
    await repository.create({
      article: articleFixture(),
      idempotencyKey: "create-example-0001",
    });

    await expect(
      repository.create({
        article: articleFixture({ id: "article:other" }),
        idempotencyKey: "create-example-0002",
      }),
    ).rejects.toMatchObject<Partial<SlugCollisionError>>({
      code: "SLUG_COLLISION",
      retryable: false,
    });
  });

  it("fails stale revisions and invalid archived-to-published transitions", async () => {
    const archived = articleFixture({ state: "archived" });
    const repository = new InMemoryArticleRepository([archived]);
    const published = nextRevision(archived, {
      state: "published",
      publishedAt: "2026-09-05T13:00:00.000Z",
    });

    await expect(
      repository.update({
        article: published,
        expectedRevision: 0,
        idempotencyKey: "update-example-0001",
      }),
    ).rejects.toBeInstanceOf(RevisionConflictError);
    await expect(
      repository.update({
        article: published,
        expectedRevision: 1,
        idempotencyKey: "update-example-0002",
      }),
    ).rejects.toBeInstanceOf(InvalidStateTransitionError);
  });

  it("replays identical idempotent mutations and rejects key reuse", async () => {
    const repository = new InMemoryArticleRepository();
    const command = {
      article: articleFixture(),
      idempotencyKey: "create-example-0001",
    };
    await expect(repository.create(command)).resolves.toEqual(command.article);
    await expect(repository.create(command)).resolves.toEqual(command.article);
    await expect(
      repository.create({
        ...command,
        article: articleFixture({ title: "Different request" }),
      }),
    ).rejects.toBeInstanceOf(EditorialValidationError);
  });

  it("keeps drafts out of published queries", async () => {
    const repository = new InMemoryArticleRepository([
      articleFixture(),
      articleFixture({
        id: "article:published",
        slug: "published-article",
        state: "published",
        publishedAt: "2026-09-05T12:00:00.000Z",
      }),
    ]);
    const published = await repository.list({ visibility: "published" });
    expect(published.map((article) => article.id)).toEqual([
      "article:published",
    ]);
  });

  it("rejects malformed idempotency keys and unsafe list limits", async () => {
    const repository = new InMemoryArticleRepository();
    await expect(
      repository.create({
        article: articleFixture(),
        idempotencyKey: "too-short",
      }),
    ).rejects.toBeInstanceOf(EditorialValidationError);
    await expect(
      repository.list({ limit: 101, visibility: "all" }),
    ).rejects.toBeInstanceOf(EditorialValidationError);
  });

  it("exposes typed timeout and unavailable behavior", async () => {
    const repository = new InMemoryArticleRepository();
    repository.setFailureMode("timeout");
    await expect(repository.list({ visibility: "all" })).rejects.toBeInstanceOf(
      ContentTimeoutError,
    );
    repository.setFailureMode("unavailable");
    await expect(repository.list({ visibility: "all" })).rejects.toBeInstanceOf(
      ContentUnavailableError,
    );
  });
});
