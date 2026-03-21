/**
 * Dynamic OG image generation — Renders branded social cards at /api/og.
 *
 * Edge runtime. Accepts `title`, `description`, and `author` query params.
 * Renders a 1200×630 card with textured dark background, brand logo,
 * green accent elements, and page-specific title text.
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
        {/* Background gradient for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 80% 70% at 20% 90%, rgba(43,204,115,0.07) 0%, transparent 70%), " +
              "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,171,33,0.04) 0%, transparent 60%)",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            display: "flex",
            background:
              "linear-gradient(90deg, #2BCC73 0%, #00AB21 60%, rgba(43,204,115,0.3) 100%)",
          }}
        />

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(43,204,115,0.3) 0%, #00AB21 40%, #2BCC73 100%)",
          }}
        />

        {/* Right-side decorative vertical stripe */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            bottom: "60px",
            width: "3px",
            display: "flex",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(43,204,115,0.15) 30%, rgba(43,204,115,0.15) 70%, transparent 100%)",
          }}
        />

        {/* Corner accent: top-right dot cluster */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "48px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.3,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: "72px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.15,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "72px",
            right: "48px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.15,
            display: "flex",
          }}
        />

        {/* Corner accent: bottom-left dot cluster */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "80px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.3,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "104px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.15,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "72px",
            left: "80px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "#2BCC73",
            opacity: 0.15,
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 100px 60px 80px",
            position: "relative",
            width: "100%",
          }}
        >
          {/* Logo */}
          {logoBase64 ? (
            <img
              src={logoBase64}
              height={44}
              style={{
                objectFit: "contain",
                objectPosition: "left",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: 14,
                color: "#2BCC73",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                fontWeight: 500,
              }}
            >
              SHRUGGIETECH
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 30 ? 42 : 54,
              fontWeight: 700,
              color: "#FFFFFF",
              marginTop: 28,
              lineHeight: 1.15,
              maxWidth: 900,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>

          {/* Description (if provided) */}
          {description && (
            <div
              style={{
                fontSize: 20,
                color: "#D1D3D4",
                marginTop: 16,
                lineHeight: 1.5,
                maxWidth: 800,
              }}
            >
              {description.length > 120
                ? description.slice(0, 117) + "..."
                : description}
            </div>
          )}

          {/* Author (if provided, e.g. blog posts) */}
          {author && !description && (
            <div
              style={{
                fontSize: 18,
                color: "#D1D3D4",
                marginTop: 16,
              }}
            >
              {author}
            </div>
          )}

          {/* Green divider */}
          <div
            style={{
              width: "120px",
              height: "2px",
              backgroundColor: "#2BCC73",
              marginTop: 28,
              opacity: 0.6,
              borderRadius: "1px",
              display: "flex",
            }}
          />

          {/* Domain footer */}
          <div
            style={{
              marginTop: "auto",
              fontSize: 14,
              color: "#D1D3D4",
              opacity: 0.35,
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            shruggie.tech
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
