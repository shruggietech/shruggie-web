import { createFirebaseEditorialBackend } from "@/lib/editorial/firebase-admin";
import {
  editorialErrorResponse,
  editorialJson,
  requireEditor,
} from "@/lib/editorial/http";
import { requireEditorialRole } from "@/lib/editorial/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const principal = await requireEditor(request);
    requireEditorialRole(principal, "admin");
    const events =
      await createFirebaseEditorialBackend().articles.exportAudit();
    return editorialJson({ events });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
