import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { editorialErrorResponse, requireEditor } from "@/lib/editorial/http";
import { loadEditorialSecurityConfig } from "@/lib/editorial/security";

export async function GET(request: Request) {
  try {
    await requireEditor(request);

    const mode = await draftMode();
    mode.disable();

    const { canonicalOrigin } = loadEditorialSecurityConfig();
    const response = NextResponse.redirect(new URL("/admin", canonicalOrigin));
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Vary", "Cookie");
    return response;
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
