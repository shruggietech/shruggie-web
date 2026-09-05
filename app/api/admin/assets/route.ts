import { z } from "zod";

import { editorialIdSchema, MAX_ASSET_BYTES } from "@/lib/editorial/domain";
import { EditorialValidationError } from "@/lib/editorial/errors";
import { createFirebaseEditorialBackend } from "@/lib/editorial/firebase-admin";
import {
  editorialErrorResponse,
  editorialJson,
  requireEditor,
} from "@/lib/editorial/http";
import {
  assertCanonicalMutationOrigin,
  loadEditorialSecurityConfig,
} from "@/lib/editorial/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const assetFieldsSchema = z
  .object({
    altText: z.string().trim().min(5).max(300),
    articleId: editorialIdSchema,
    id: editorialIdSchema,
  })
  .strict();

const allowedFormFields = new Set(["altText", "articleId", "file", "id"]);

export async function GET(request: Request) {
  try {
    await requireEditor(request);
    const assets = await createFirebaseEditorialBackend().assets.exportAll();
    return editorialJson({ assets });
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
    const form = await request.formData();
    for (const key of form.keys()) {
      if (!allowedFormFields.has(key) || form.getAll(key).length !== 1) {
        throw new EditorialValidationError(
          "The asset upload contains unknown or duplicate fields.",
        );
      }
    }
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new EditorialValidationError("An image file is required.");
    }
    if (file.size > MAX_ASSET_BYTES) {
      throw new EditorialValidationError(
        `Image files must not exceed ${MAX_ASSET_BYTES} bytes.`,
      );
    }
    const fields = assetFieldsSchema.parse({
      altText: form.get("altText"),
      articleId: form.get("articleId"),
      id: form.get("id"),
    });
    const asset = await createFirebaseEditorialBackend().assets.put({
      ...fields,
      bytes: new Uint8Array(await file.arrayBuffer()),
      contentType: file.type,
      createdAt: new Date().toISOString(),
      createdBy: principal.id,
      fileName: file.name,
    });
    return editorialJson({ asset }, { status: 201 });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
