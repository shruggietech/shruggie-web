/**
 * Next.js production configuration.
 *
 * Spec references: §10.1 (Vercel Configuration), §9.2 (Asset Optimization)
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Firestore's REST transport relies on protobuf Long constructor metadata.
  // Keep the package out of Next's minified server bundle so integer fields
  // serialize correctly in Vercel functions.
  serverExternalPackages: ["@google-cloud/firestore"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shruggie.tech",
        pathname: "/avatars/**",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  rewrites: async () => [
    {
      source: "/__/auth/:path*",
      destination: "https://shruggie-web.firebaseapp.com/__/auth/:path*",
    },
  ],
  headers: async () => [
    {
      source: "/fonts/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
