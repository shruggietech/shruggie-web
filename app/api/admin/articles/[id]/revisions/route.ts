import { editorialIdSchema } from "@/lib/editorial/domain";
import { createFirebaseEditorialBackend } from "@/lib/editorial/firebase-admin";
import {
  editorialErrorResponse,
  editorialJson,
  requireEditor,
} from "@/lib/editorial/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireEditor(request);
    const id = editorialIdSchema.parse((await context.params).id);
    const revisions =
      await createFirebaseEditorialBackend().articles.listRevisions(id);
    return editorialJson({ revisions });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
