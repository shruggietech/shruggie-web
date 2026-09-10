import { z } from "zod";

import { articleSchemaV1, editorialIdSchema } from "@/lib/editorial/domain";
import {
  EditorialValidationError,
  PublicationConvergenceError,
} from "@/lib/editorial/errors";
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
import {
  publicationAffectsPublicRoutes,
  revalidateArticlePublication,
} from "@/lib/editorial/publication-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateRequestSchema = z
  .object({
    article: articleSchemaV1,
    expectedRevision: z.number().int().positive(),
    idempotencyKey: z.string(),
    restoreFromRevision: z.number().int().positive().optional(),
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
    const repository = createFirebaseEditorialBackend().articles;
    const previous =
      (await repository.getRevision(id, body.expectedRevision)) ??
      (await repository.getById(id, "all"));
    const article = await repository.update({
      ...body,
      mutation: mutationContextFor(
        principal,
        request.headers.get("x-request-id"),
      ),
    });
    if (previous && publicationAffectsPublicRoutes(previous, article)) {
      try {
        revalidateArticlePublication(previous, article);
      } catch (error) {
        throw new PublicationConvergenceError(article.id, error);
      }
    }
    return editorialJson({ article, publicationConverged: true });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
