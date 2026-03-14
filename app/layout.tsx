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
import { generateOrganizationSchema } from "@/lib/schema";
import LenisProvider from "@/components/layout/LenisProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/ui/SkipLink";
import CookieConsent from "@/components/shared/CookieConsent";
import ThemeEnforcer from "@/components/shared/ThemeEnforcer";
import JsonLd from "@/components/shared/JsonLd";

import "./globals.css";

// ── Consent-gated analytics script (spec §6.11, §10.2) ────────────────────

/**
 * Returns an inline IIFE that reads the `consent` cookie before first paint.
 * If consent is "granted" AND the GA/GTM env vars are set, injects the
 * GA4 and GTM scripts. Otherwise, no tracking scripts are loaded.
 */
function getConsentGatedAnalyticsScript(): string {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "";

  return `(function(){try{var c=document.cookie.split(";").find(function(s){return s.trim().startsWith("consent=")});if(!c)return;var v=c.split("=")[1];if(v!=="granted")return;${
    gaId
      ? `var gs=document.createElement("script");gs.async=true;gs.src="https://www.googletagmanager.com/gtag/js?id=${gaId}";document.head.appendChild(gs);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${gaId}");`
      : "/* GA_MEASUREMENT_ID not configured */"
  }${
    gtmId
      ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","${gtmId}");`
      : "/* GTM_ID not configured */"
  }}catch(e){}})();`;
}

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
        {/* Consent-gated GA4/GTM loading (spec §6.11, §10.2) */}
        <script
          dangerouslySetInnerHTML={{
            __html: getConsentGatedAnalyticsScript(),
          }}
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
        {/* Organization JSON-LD on every page (spec §8.2) */}
        <JsonLd data={generateOrganizationSchema()} />
        <ThemeEnforcer />
        <LenisProvider>
          <SkipLink />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <CookieConsent />
        </LenisProvider>
      </body>
    </html>
  );
}
