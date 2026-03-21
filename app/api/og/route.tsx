/**
 * Dynamic OG image generation — Renders branded social cards at /api/og.
 *
 * Edge runtime. Accepts `title`, `description`, and `author` query params.
 * Renders a 1200×630 card optimized for mobile thumbnail legibility with
 * large text, brand logo, and decorative green accent elements.
 *
 * Spec reference: §8.4 (Open Graph and Social Cards)
 */

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "ShruggieTech";
  const description = searchParams.get("description") ?? "";
  const author = searchParams.get("author") ?? "";

  // Load the logo from the public directory
  let logoBase64 = "";
  try {
    const logoUrl = new URL("/images/logo-darkbg.png", request.nextUrl.origin);
    const logoResponse = await fetch(logoUrl);
    const logoBuffer = await logoResponse.arrayBuffer();
    logoBase64 = `data:image/png;base64,${Buffer.from(logoBuffer).toString("base64")}`;
  } catch {
    // Fallback: render without logo if fetch fails
  }

  // Adaptive title sizing for mobile legibility
  const titleSize = title.length > 40 ? 56 : title.length > 24 ? 68 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000000",
          fontFamily: "sans-serif",
        }}
      >
        {/* ── Background layers ─────────────────────────────── */}

        {/* Primary glow: bottom-left green */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 90% 80% at 10% 100%, rgba(43,204,115,0.10) 0%, transparent 60%)",
          }}
        />

        {/* Secondary glow: top-right green */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 70% 60% at 95% 10%, rgba(0,171,33,0.06) 0%, transparent 55%)",
          }}
        />

        {/* ── Accent bars ───────────────────────────────────── */}

        {/* Top accent bar: full-width, 5px for visibility at small sizes */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            display: "flex",
            background:
              "linear-gradient(90deg, #2BCC73 0%, #00AB21 50%, rgba(43,204,115,0.2) 100%)",
          }}
        />

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5px",
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(43,204,115,0.2) 0%, #00AB21 50%, #2BCC73 100%)",
          }}
        />

        {/* Left accent bar: vertical, tall */}
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: 0,
            bottom: "5px",
            width: "5px",
            display: "flex",
            background:
              "linear-gradient(180deg, #2BCC73 0%, rgba(43,204,115,0.15) 40%, rgba(43,204,115,0.15) 60%, #2BCC73 100%)",
          }}
        />

        {/* ── Decorative geometric elements ─────────────────── */}

        {/* Large corner bracket: top-right */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "80px",
            height: "80px",
            borderTop: "3px solid rgba(43,204,115,0.20)",
            borderRight: "3px solid rgba(43,204,115,0.20)",
            display: "flex",
          }}
        />

        {/* Large corner bracket: bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "80px",
            height: "80px",
            borderBottom: "3px solid rgba(43,204,115,0.20)",
            borderRight: "3px solid rgba(43,204,115,0.20)",
            display: "flex",
          }}
        />

        {/* Dot cluster: top-right inside bracket */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.35,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "88px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.18,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "88px",
            right: "60px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.18,
            display: "flex",
          }}
        />

        {/* Dot cluster: bottom-right inside bracket */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "60px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.35,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "88px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.18,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "88px",
            right: "60px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.18,
            display: "flex",
          }}
        />

        {/* Horizontal scaffold line across bottom third */}
        <div
          style={{
            position: "absolute",
            bottom: "160px",
            left: "80px",
            right: "140px",
            height: "1px",
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(43,204,115,0.12) 0%, rgba(43,204,115,0.06) 60%, transparent 100%)",
          }}
        />

        {/* ── Main content ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "56px 140px 56px 48px",
            position: "relative",
            width: "100%",
          }}
        >
          {/* Logo: large for mobile visibility */}
          {logoBase64 ? (
            <img
              src={logoBase64}
              height={56}
              style={{
                objectFit: "contain",
                objectPosition: "left",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 20,
                color: "#2BCC73",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                fontWeight: 700,
              }}
            >
              SHRUGGIETECH
            </div>
          )}

          {/* Title: maximum size for mobile readability */}
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              color: "#FFFFFF",
              marginTop: 32,
              lineHeight: 1.1,
              maxWidth: 960,
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </div>

          {/* Description: large enough to read at thumbnail scale */}
          {description && (
            <div
              style={{
                fontSize: 36,
                color: "#D1D3D4",
                marginTop: 24,
                lineHeight: 1.35,
                maxWidth: 960,
              }}
            >
              {description.length > 80
                ? description.slice(0, 77) + "..."
                : description}
            </div>
          )}

          {/* Author line (blog posts without description) */}
          {author && !description && (
            <div
              style={{
                fontSize: 32,
                color: "#D1D3D4",
                marginTop: 20,
              }}
            >
              {author}
            </div>
          )}

          {/* Green divider: wider for visual weight */}
          <div
            style={{
              width: "160px",
              height: "4px",
              background:
                "linear-gradient(90deg, #2BCC73, rgba(43,204,115,0.3))",
              marginTop: 32,
              borderRadius: "2px",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
