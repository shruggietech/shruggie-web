import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { articleSlugSchema } from "@/lib/editorial/domain";
import { ArticleNotFoundError } from "@/lib/editorial/errors";
import { createFirebaseEditorialBackend } from "@/lib/editorial/firebase-admin";
import { editorialErrorResponse, requireEditor } from "@/lib/editorial/http";
import { loadEditorialSecurityConfig } from "@/lib/editorial/security";

export async function GET(request: Request) {
  try {
    await requireEditor(request);

    const slug = articleSlugSchema.parse(
      new URL(request.url).searchParams.get("slug"),
    );
    const article = await createFirebaseEditorialBackend().articles.getBySlug(
      slug,
      "all",
    );
    if (!article) throw new ArticleNotFoundError(slug);

    const mode = await draftMode();
    mode.enable();

    const { canonicalOrigin } = loadEditorialSecurityConfig();
    const response = NextResponse.redirect(
      new URL(`/blog/${article.slug}?preview=1`, canonicalOrigin),
    );
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Vary", "Cookie");
    return response;
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
