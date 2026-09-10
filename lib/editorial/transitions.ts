import type { Article, ArticleState } from "./domain";
import {
  EditorialValidationError,
  InvalidStateTransitionError,
  RevisionConflictError,
} from "./errors";

const allowedTransitions: Readonly<
  Record<ArticleState, ReadonlySet<ArticleState>>
> = {
  draft: new Set(["draft", "published", "archived"]),
  published: new Set(["draft", "published", "archived"]),
  archived: new Set(["archived", "draft"]),
};

export function assertArticleMutation(
  current: Article,
  next: Article,
  expectedRevision: number,
): void {
  if (current.revision.number !== expectedRevision) {
    throw new RevisionConflictError(
      current.id,
      expectedRevision,
      current.revision.number,
    );
  }

  if (current.id !== next.id) {
    throw new EditorialValidationError("An article ID cannot change.", {
      currentId: current.id,
      nextId: next.id,
    });
  }

  if (current.createdAt !== next.createdAt) {
    throw new EditorialValidationError(
      "createdAt cannot change after creation.",
    );
  }

  if (!allowedTransitions[current.state].has(next.state)) {
    throw new InvalidStateTransitionError(current.state, next.state);
  }

  if (next.revision.number !== current.revision.number + 1) {
    throw new EditorialValidationError(
      "A saved article must increment its revision by exactly one.",
      {
        currentRevision: current.revision.number,
        nextRevision: next.revision.number,
      },
    );
  }

  if (next.revision.previousNumber !== current.revision.number) {
    throw new EditorialValidationError(
      "The revision must reference the article revision it replaces.",
    );
  }

  if (Date.parse(next.modifiedAt) < Date.parse(current.modifiedAt)) {
    throw new EditorialValidationError("modifiedAt cannot move backwards.");
  }
}

export function assertArticleRestoresRevision(
  source: Article,
  current: Article,
  next: Article,
): void {
  if (
    source.id !== current.id ||
    source.revision.number >= current.revision.number
  ) {
    throw new EditorialValidationError(
      "A restore source must be an earlier revision of the same article.",
    );
  }

  const restorable = (article: Article) => ({
    author: article.author,
    body: article.body,
    category: article.category,
    excerpt: article.excerpt,
    featuredImage: article.featuredImage,
    ogImage: article.ogImage,
    slug: article.slug,
    title: article.title,
  });

  if (JSON.stringify(restorable(source)) !== JSON.stringify(restorable(next))) {
    throw new EditorialValidationError(
      "A restored article must match the selected immutable revision.",
      { restoreFromRevision: source.revision.number },
    );
  }
}
