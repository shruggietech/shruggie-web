import {
  ARTICLE_SCHEMA_VERSION,
  type Article,
} from "../../lib/editorial/domain";
import type { EditorialMutationContext } from "../../lib/editorial/audit";

export function mutationContext(
  requestId = "request:editorial-test-0001",
): EditorialMutationContext {
  return {
    actorId: "editor:natalie",
    requestId,
    role: "editor",
  };
}

export function articleFixture(overrides: Partial<Article> = {}): Article {
  const base: Article = {
    schemaVersion: ARTICLE_SCHEMA_VERSION,
    id: "article:example",
    slug: "example-article",
    title: "An example article",
    excerpt: "A sufficiently descriptive excerpt for an example article.",
    author: { id: "editor:natalie", name: "Natalie Thompson" },
    category: "Engineering",
    body: {
      format: "markdown",
      source:
        "## A safe heading\n\nThis is **safe** Markdown with a [link](https://example.com).",
    },
    state: "draft",
    createdAt: "2026-09-05T12:00:00.000Z",
    modifiedAt: "2026-09-05T12:00:00.000Z",
    publishedAt: null,
    featuredImage: null,
    ogImage: null,
    revision: {
      number: 1,
      previousNumber: null,
      updatedAt: "2026-09-05T12:00:00.000Z",
      updatedBy: "editor:natalie",
    },
  };

  return { ...base, ...overrides };
}

export function nextRevision(
  current: Article,
  overrides: Partial<Article> = {},
): Article {
  const modifiedAt = "2026-09-05T13:00:00.000Z";
  return {
    ...current,
    ...overrides,
    modifiedAt: overrides.modifiedAt ?? modifiedAt,
    revision: overrides.revision ?? {
      number: current.revision.number + 1,
      previousNumber: current.revision.number,
      updatedAt: overrides.modifiedAt ?? modifiedAt,
      updatedBy: "editor:natalie",
    },
  };
}
