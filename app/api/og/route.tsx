/**
 * Dynamic OG image generation — Renders branded social cards at /api/og.
 *
 * Edge runtime. Accepts `title` and `author` query params.
 * Renders a 1200×630 card with dark background, the real ShruggieTech logo,
 * large title text, optional author line, and domain footer.
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

  const logoUrl = new URL("/images/logo-darkbg.png", request.nextUrl.origin);
  const logoResponse = await fetch(logoUrl);
  const logoBuffer = await logoResponse.arrayBuffer();
  const logoBase64 = `data:image/png;base64,${Buffer.from(logoBuffer).toString("base64")}`;

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
        {/* Brand logo */}
        <img
          src={logoBase64}
          height={48}
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
        {/* Page title */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        {/* Author (if provided) */}
        {author && (
          <div style={{ fontSize: 18, color: "#D1D3D4", marginTop: 24 }}>
            {author}
          </div>
        )}
        {/* Domain */}
        <div
          style={{
            fontSize: 14,
            color: "#D1D3D4",
            opacity: 0.4,
            marginTop: "auto",
            fontFamily: "monospace",
          }}
        >
          shruggie.tech
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
