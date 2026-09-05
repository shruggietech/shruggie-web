import { z } from "zod";

import { articleSchemaV1 } from "@/lib/editorial/domain";
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

export async function GET(request: Request) {
  try {
    await requireEditor(request);
    const url = new URL(request.url);
    const limitValue = url.searchParams.get("limit");
    const limit = limitValue === null ? undefined : Number(limitValue);
    const articles = await createFirebaseEditorialBackend().articles.list({
      limit,
      visibility: "all",
    });
    return editorialJson({ articles });
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
