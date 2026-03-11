/**
 * Dynamic OG image generation — Renders branded social cards at /api/og.
 *
 * Edge runtime. Accepts `title` and `author` query params.
 * Renders a 1200×630 card with dark background, green "SHRUGGIETECH" label,
 * large title text, and optional author line.
 *
 * Spec reference: §8.4 (Open Graph and Social Cards)
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "ShruggieTech";
  const author = searchParams.get("author") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "#2BCC73",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          SHRUGGIETECH
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            marginTop: 16,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        {author && (
          <div style={{ fontSize: 18, color: "#D1D3D4", marginTop: 24 }}>
            {author}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
