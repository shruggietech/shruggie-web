import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { editorialErrorResponse, requireEditor } from "@/lib/editorial/http";
import { EDITOR_PREVIEW_COOKIE } from "@/lib/editorial/preview-session";
import { loadEditorialSecurityConfig } from "@/lib/editorial/security";

export async function GET(request: Request) {
  try {
    await requireEditor(request);

    const mode = await draftMode();
    mode.disable();

    const { canonicalOrigin } = loadEditorialSecurityConfig();
    const response = NextResponse.redirect(new URL("/admin", canonicalOrigin));
    response.cookies.set(EDITOR_PREVIEW_COOKIE, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "strict",
      secure: true,
    });
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Vary", "Cookie");
    return response;
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
