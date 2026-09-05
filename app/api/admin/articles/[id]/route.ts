import { z } from "zod";

import { articleSchemaV1, editorialIdSchema } from "@/lib/editorial/domain";
import { EditorialValidationError } from "@/lib/editorial/errors";
import { createFirebaseEditorialBackend } from "@/lib/editorial/firebase-admin";
import {
  editorialErrorResponse,
  editorialJson,
  readStrictJson,
  requireEditor,
} from "@/lib/editorial/http";
import {
  assertCanonicalMutationOrigin,
  loadEditorialSecurityConfig,
  mutationContextFor,
} from "@/lib/editorial/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateRequestSchema = z
  .object({
    article: articleSchemaV1,
    expectedRevision: z.number().int().positive(),
    idempotencyKey: z.string(),
  })
  .strict();

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireEditor(request);
    const id = editorialIdSchema.parse((await context.params).id);
    const article = await createFirebaseEditorialBackend().articles.getById(
      id,
      "all",
    );
    if (!article) {
      return editorialJson(
        { error: { code: "NOT_FOUND", message: "Article not found." } },
        { status: 404 },
      );
    }
    return editorialJson({ article });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const config = loadEditorialSecurityConfig();
    assertCanonicalMutationOrigin(
      request.headers.get("origin"),
      config.canonicalOrigin,
    );
    const principal = await requireEditor(request);
    const id = editorialIdSchema.parse((await context.params).id);
    const body = updateRequestSchema.parse(await readStrictJson(request));
    if (body.article.id !== id) {
      throw new EditorialValidationError(
        "The route and article IDs must match.",
      );
    }
    const article = await createFirebaseEditorialBackend().articles.update({
      ...body,
      mutation: mutationContextFor(
        principal,
        request.headers.get("x-request-id"),
      ),
    });
    return editorialJson({ article });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
