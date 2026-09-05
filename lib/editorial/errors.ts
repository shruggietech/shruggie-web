export type EditorialErrorCode =
  | "ASSET_COLLISION"
  | "ASSET_VALIDATION"
  | "CONTENT_TIMEOUT"
  | "CONTENT_UNAVAILABLE"
  | "INVALID_STATE_TRANSITION"
  | "NOT_FOUND"
  | "REVISION_CONFLICT"
  | "SLUG_COLLISION"
  | "VALIDATION_FAILED";

export interface EditorialErrorOptions {
  cause?: unknown;
  details?: Readonly<Record<string, unknown>>;
  retryable?: boolean;
}

export class EditorialError extends Error {
  readonly code: EditorialErrorCode;
  readonly details: Readonly<Record<string, unknown>>;
  readonly retryable: boolean;

  constructor(
    code: EditorialErrorCode,
    message: string,
    options: EditorialErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = new.target.name;
    this.code = code;
    this.details = options.details ?? {};
    this.retryable = options.retryable ?? false;
  }
}

export class EditorialValidationError extends EditorialError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super("VALIDATION_FAILED", message, { details });
  }
}

export class AssetValidationError extends EditorialError {
  constructor(message: string, details?: Readonly<Record<string, unknown>>) {
    super("ASSET_VALIDATION", message, { details });
  }
}

export class ArticleNotFoundError extends EditorialError {
  constructor(identifier: string) {
    super("NOT_FOUND", `Article not found: ${identifier}`, {
      details: { identifier },
    });
  }
}

export class SlugCollisionError extends EditorialError {
  constructor(slug: string, existingArticleId: string) {
    super("SLUG_COLLISION", `The slug "${slug}" is already in use.`, {
      details: { existingArticleId, slug },
    });
  }
}

export class AssetCollisionError extends EditorialError {
  constructor(assetId: string) {
    super("ASSET_COLLISION", `The asset ID "${assetId}" is already in use.`, {
      details: { assetId },
    });
  }
}

export class RevisionConflictError extends EditorialError {
  constructor(articleId: string, expected: number, actual: number) {
    super(
      "REVISION_CONFLICT",
      `Article ${articleId} changed from revision ${expected} to ${actual}. Reload before saving.`,
      { details: { actual, articleId, expected } },
    );
  }
}

export class InvalidStateTransitionError extends EditorialError {
  constructor(from: string, to: string) {
    super(
      "INVALID_STATE_TRANSITION",
      `An article cannot transition directly from ${from} to ${to}.`,
      { details: { from, to } },
    );
  }
}

export class ContentUnavailableError extends EditorialError {
  constructor(operation: string, cause?: unknown) {
    super(
      "CONTENT_UNAVAILABLE",
      `Editorial storage is unavailable while attempting to ${operation}.`,
      { cause, details: { operation }, retryable: true },
    );
  }
}

export class ContentTimeoutError extends EditorialError {
  constructor(operation: string, timeoutMs: number, cause?: unknown) {
    super(
      "CONTENT_TIMEOUT",
      `Editorial storage timed out after ${timeoutMs}ms while attempting to ${operation}.`,
      { cause, details: { operation, timeoutMs }, retryable: true },
    );
  }
}
