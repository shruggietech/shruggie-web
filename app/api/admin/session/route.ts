import { z } from "zod";

import {
  editorialErrorResponse,
  editorialJson,
  readStrictJson,
  requireEditor,
} from "@/lib/editorial/http";
import { getFirebaseEditorialAuth } from "@/lib/editorial/firebase-admin";
import {
  assertCanonicalMutationOrigin,
  clearEditorSessionCookie,
  createEditorSessionCookie,
  EDITOR_SESSION_MAX_AGE_MS,
  loadEditorialSecurityConfig,
  revokeEditorSessions,
  serializeEditorSessionCookie,
  verifyEditorIdToken,
  verifyEditorSession,
} from "@/lib/editorial/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sessionRequestSchema = z
  .object({ idToken: z.string().trim().min(1).max(16_384) })
  .strict();

export async function GET(request: Request) {
  try {
    const principal = await requireEditor(request);
    return editorialJson({
      editor: { id: principal.id, role: principal.role },
    });
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
    const body = sessionRequestSchema.parse(await readStrictJson(request));
    const auth = getFirebaseEditorialAuth();
    const principal = await verifyEditorIdToken(body.idToken, auth, config);
    const sessionCookie = await createEditorSessionCookie(body.idToken, auth);
    return editorialJson(
      { editor: { id: principal.id, role: principal.role } },
      {
        headers: {
          "Set-Cookie": serializeEditorSessionCookie(
            sessionCookie,
            EDITOR_SESSION_MAX_AGE_MS / 1000,
          ),
        },
      },
    );
  } catch (error) {
    return editorialErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  let clearLocalSession = false;
  try {
    const config = loadEditorialSecurityConfig();
    assertCanonicalMutationOrigin(
      request.headers.get("origin"),
      config.canonicalOrigin,
    );
    const auth = getFirebaseEditorialAuth();
    const principal = await verifyEditorSession(
      request.headers.get("cookie"),
      auth,
      config,
    );
    clearLocalSession = true;
    await revokeEditorSessions(principal.uid, auth);
    return editorialJson(
      { signedOut: true },
      { headers: { "Set-Cookie": clearEditorSessionCookie() } },
    );
  } catch (error) {
    const response = editorialErrorResponse(error);
    if (clearLocalSession) {
      response.headers.set("Set-Cookie", clearEditorSessionCookie());
    }
    return response;
  }
}
