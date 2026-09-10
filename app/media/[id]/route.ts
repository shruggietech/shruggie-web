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
    const id = editorialIdSchema.parse((await context.params).id);
    const backend = createFirebaseEditorialBackend();
    const asset = await backend.assets.getById(id);
    if (!asset) {
      return editorialJson(
        { error: { code: "NOT_FOUND", message: "Image not found." } },
        { status: 404 },
      );
    }

    const article = await backend.articles.getById(asset.articleId, "all");
    const published = article?.state === "published";
    if (!published) await requireEditor(request);

    const etag = `"sha256-${asset.checksumSha256}"`;
    if (request.headers.get("if-none-match") === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          "Cache-Control": published
            ? "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
            : "private, no-store, max-age=0",
          ETag: etag,
        },
      });
    }

    const content = await backend.assets.read(id);
    if (!content) {
      return editorialJson(
        { error: { code: "NOT_FOUND", message: "Image not found." } },
        { status: 404 },
      );
    }

    const body = Uint8Array.from(content.bytes).buffer;
    return new Response(body, {
      headers: {
        "Cache-Control": published
          ? "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
          : "private, no-store, max-age=0",
        "Content-Length": String(content.bytes.byteLength),
        "Content-Type": asset.contentType,
        ETag: etag,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return editorialErrorResponse(error);
  }
}
