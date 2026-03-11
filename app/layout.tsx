/**
 * Root layout — Wraps the entire application.
 *
 * Loads self-hosted fonts via next/font/local, injects FOUC-free theme script,
 * renders SkipLink + Header + main content area + Footer.
 * Wraps children in LenisProvider for smooth scrolling.
 *
 * Spec references: §2.2 (Typography/Font Loading), §2.6 (Dark/Light Mode),
 *   §5.1 (Header), §5.2 (Footer), §3.2 (Skip Link), §1.5 (Favicon/Manifest),
 *   §8.1 (Metadata Strategy)
 */

import type { Metadata } from "next";
import localFont from "next/font/local";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getThemeScript } from "@/lib/theme";
import LenisProvider from "@/components/layout/LenisProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/ui/SkipLink";

import "./globals.css";

// ── Font Loading (spec §2.2) ───────────────────────────────────────────────

const spaceGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/SpaceGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/SpaceGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display-var",
  display: "swap",
  preload: true,
});

const geist = localFont({
  src: [
    {
      path: "../public/fonts/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-body-var",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-mono-var",
  display: "swap",
  preload: false,
});

// ── Metadata (spec §8.1, §1.5) ────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Modern Digital Systems, Software, and AI`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

// ── Root Layout ────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* FOUC-free theme initialization (spec §2.6) */}
        <script
          dangerouslySetInnerHTML={{ __html: getThemeScript() }}
        />
        {/* Theme color meta tags (spec §1.5) */}
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#FFFFFF"
          media="(prefers-color-scheme: light)"
        />
      </head>
      <body className="bg-bg-primary font-body text-text-primary antialiased">
        <LenisProvider>
          <SkipLink />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
