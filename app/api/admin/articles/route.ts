import { z } from "zod";

import {
  articleSchemaV1,
  articleStateSchema,
  editorialIdSchema,
} from "@/lib/editorial/domain";
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

const createRequestSchema = z
  .object({
    article: articleSchemaV1,
    idempotencyKey: z.string(),
  })
  .strict();

const listRequestSchema = z
  .object({
    afterId: editorialIdSchema.optional(),
    afterModifiedAt: z.string().datetime({ offset: true }).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    state: articleStateSchema,
  })
  .superRefine((value, context) => {
    if (Boolean(value.afterId) !== Boolean(value.afterModifiedAt)) {
      context.addIssue({
        code: "custom",
        message: "Both article page cursor values are required.",
        path: ["afterId"],
      });
    }
  });

export async function GET(request: Request) {
  try {
    await requireEditor(request);
    const url = new URL(request.url);
    const input = listRequestSchema.parse({
      afterId: url.searchParams.get("afterId") ?? undefined,
      afterModifiedAt: url.searchParams.get("afterModifiedAt") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
      state: url.searchParams.get("state") ?? undefined,
    });
    const repository = createFirebaseEditorialBackend().articles;
    const [page, counts] = await Promise.all([
      repository.listByState({
        after:
          input.afterId && input.afterModifiedAt
            ? { id: input.afterId, modifiedAt: input.afterModifiedAt }
            : undefined,
        limit: input.limit,
        state: input.state,
      }),
      repository.countByState(),
    ]);
    return editorialJson({ ...page, counts });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const config = loadEditorialSecurityConfig();
    assertCanonicalMutationOrigin(
      request.headers.get("origin"),
      config.canonicalOrigin,
    );
    const principal = await requireEditor(request);
    const body = createRequestSchema.parse(await readStrictJson(request));
    if (body.article.state !== "draft") {
      throw new EditorialValidationError(
        "Create the article as a draft before publishing it.",
      );
    }
    const article = await createFirebaseEditorialBackend().articles.create({
      ...body,
      mutation: mutationContextFor(
        principal,
        request.headers.get("x-request-id"),
      ),
    });
    return editorialJson({ article }, { status: 201 });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
