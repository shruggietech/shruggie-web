import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { EditorialError, EditorialValidationError } from "./errors";
import { getFirebaseEditorialAuth } from "./firebase-admin";
import {
  assertEditorSessionCookiePresent,
  EditorialSecurityError,
  loadEditorialSecurityConfig,
  verifyEditorSession,
  type EditorPrincipal,
} from "./security";

const noStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
};

export async function requireEditor(
  request: Request,
): Promise<EditorPrincipal> {
  assertEditorSessionCookiePresent(request.headers.get("cookie"));
  return verifyEditorSession(
    request.headers.get("cookie"),
    getFirebaseEditorialAuth(),
    loadEditorialSecurityConfig(),
  );
}

export async function readStrictJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    throw new EditorialValidationError("The request body must be valid JSON.", {
      cause: error instanceof Error ? error.name : "unknown",
    });
  }
}

export function editorialJson(
  body: unknown,
  init: ResponseInit = {},
): NextResponse {
  return NextResponse.json(body, {
    ...init,
    headers: { ...noStoreHeaders, ...init.headers },
  });
}

export function editorialErrorResponse(error: unknown): NextResponse {
  if (error instanceof EditorialSecurityError) {
    return editorialJson(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }
  if (error instanceof ZodError) {
    return editorialJson(
      {
        error: {
          code: "VALIDATION_FAILED",
          message: "The request payload is invalid.",
          issues: error.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
          })),
        },
      },
      { status: 400 },
    );
  }
  if (error instanceof EditorialError) {
    const status =
      error.code === "CONTENT_TIMEOUT"
        ? 504
        : error.code === "CONTENT_UNAVAILABLE"
          ? 503
          : error.code === "NOT_FOUND"
            ? 404
            : [
                  "ASSET_COLLISION",
                  "INVALID_STATE_TRANSITION",
                  "REVISION_CONFLICT",
                  "SLUG_COLLISION",
                ].includes(error.code)
              ? 409
              : 400;
    return editorialJson(
      { error: { code: error.code, message: error.message } },
      { status },
    );
  }
  console.error("Unhandled editorial route error", error);
  return editorialJson(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "The editorial request could not be completed.",
      },
    },
    { status: 500 },
  );
}
