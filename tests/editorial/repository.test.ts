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
import { articleFixture, mutationContext, nextRevision } from "./fixtures";

describe("ArticleRepository contract", () => {
  it("reserves slugs and returns actionable collisions", async () => {
    const repository = new InMemoryArticleRepository();
    await repository.create({
      article: articleFixture(),
      idempotencyKey: "create-example-0001",
      mutation: mutationContext("request:create-example-0001"),
    });

    await expect(
      repository.create({
        article: articleFixture({ id: "article:other" }),
        idempotencyKey: "create-example-0002",
        mutation: mutationContext("request:create-example-0002"),
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
        mutation: mutationContext("request:update-example-0001"),
      }),
    ).rejects.toBeInstanceOf(RevisionConflictError);
    await expect(
      repository.update({
        article: published,
        expectedRevision: 1,
        idempotencyKey: "update-example-0002",
        mutation: mutationContext("request:update-example-0002"),
      }),
    ).rejects.toBeInstanceOf(InvalidStateTransitionError);
  });

  it("replays identical idempotent mutations and rejects key reuse", async () => {
    const repository = new InMemoryArticleRepository();
    const command = {
      article: articleFixture(),
      idempotencyKey: "create-example-0001",
      mutation: mutationContext("request:replay-example-0001"),
    };
    await expect(repository.create(command)).resolves.toEqual(command.article);
    await expect(
      repository.create({
        ...command,
        mutation: mutationContext("request:retried-example-0002"),
      }),
    ).resolves.toEqual(command.article);
    await expect(
      repository.create({
        ...command,
        article: articleFixture({ title: "Different request" }),
      }),
    ).rejects.toBeInstanceOf(EditorialValidationError);
    await expect(repository.exportAudit()).resolves.toHaveLength(1);
  });

  it("records attributable lifecycle audit events and rejects impersonation", async () => {
    const repository = new InMemoryArticleRepository();
    const draft = articleFixture();
    await repository.create({
      article: draft,
      idempotencyKey: "audit-create-example-0001",
      mutation: mutationContext("request:audit-create-0001"),
    });
    const published = nextRevision(draft, {
      state: "published",
      publishedAt: "2026-09-05T13:00:00.000Z",
    });
    await repository.update({
      article: published,
      expectedRevision: 1,
      idempotencyKey: "audit-publish-example-0001",
      mutation: mutationContext("request:audit-publish-0001"),
    });
    const unpublished = nextRevision(published, {
      modifiedAt: "2026-09-05T14:00:00.000Z",
      publishedAt: null,
      state: "draft",
    });
    await repository.update({
      article: unpublished,
      expectedRevision: 2,
      idempotencyKey: "audit-unpublish-example-0001",
      mutation: mutationContext("request:audit-unpublish-0001"),
    });
    const edited = nextRevision(unpublished, {
      modifiedAt: "2026-09-05T15:00:00.000Z",
      title: "An edited example article",
    });
    await repository.update({
      article: edited,
      expectedRevision: 3,
      idempotencyKey: "audit-edit-example-0001",
      mutation: mutationContext("request:audit-edit-0001"),
    });
    const archived = nextRevision(edited, {
      modifiedAt: "2026-09-05T16:00:00.000Z",
      state: "archived",
    });
    await repository.update({
      article: archived,
      expectedRevision: 4,
      idempotencyKey: "audit-archive-example-0001",
      mutation: mutationContext("request:audit-archive-0001"),
    });
    const restored = nextRevision(archived, {
      modifiedAt: "2026-09-05T17:00:00.000Z",
      state: "draft",
    });
    await repository.update({
      article: restored,
      expectedRevision: 5,
      idempotencyKey: "audit-restore-example-0001",
      mutation: mutationContext("request:audit-restore-0001"),
    });
    const events = await repository.exportAudit();
    expect(events.map((event) => event.action).sort()).toEqual([
      "archive",
      "create",
      "edit",
      "publish",
      "restore",
      "unpublish",
    ]);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorId: "editor:natalie",
          actorRole: "editor",
          articleId: draft.id,
        }),
      ]),
    );

    await expect(
      repository.update({
        article: nextRevision(restored, {
          modifiedAt: "2026-09-05T18:00:00.000Z",
        }),
        expectedRevision: 6,
        idempotencyKey: "audit-impersonation-0001",
        mutation: {
          actorId: "editor:someone-else",
          requestId: "request:audit-impersonation-0001",
          role: "admin",
        },
      }),
    ).rejects.toBeInstanceOf(EditorialValidationError);
    await expect(repository.getById(restored.id, "all")).resolves.toEqual(
      restored,
    );
    await expect(repository.exportAudit()).resolves.toHaveLength(6);
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
        mutation: mutationContext("request:invalid-key-0001"),
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
