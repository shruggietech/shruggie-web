/**
 * 404 Not Found Page — app/not-found.tsx
 *
 * Custom 404 page with centered layout, navigation links, and
 * decorative shruggie emoticon. Uses the global layout (header/footer).
 *
 * Spec reference: §6.10.1 (404 Not Found)
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-bg-cta flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-display-xl font-bold text-accent">
        404
      </h1>
      <p className="mt-4 font-display text-display-sm font-bold text-text-primary">
        This page does not exist.
      </p>
      <p className="mt-4 max-w-md text-body-md text-text-secondary">
        You may have followed a broken link, or the page may have been moved.
        Here are some places to start instead.
      </p>
      <nav className="mt-8 flex gap-6" aria-label="Suggested pages">
        <Link href="/" className="text-accent hover:text-[#FF5300]">
          Homepage
        </Link>
        <Link href="/services" className="text-accent hover:text-[#FF5300]">
          Services
        </Link>
        <Link href="/contact" className="text-accent hover:text-[#FF5300]">
          Contact
        </Link>
      </nav>
      <span aria-hidden="true" className="mt-8 text-body-lg text-text-muted">
        ¯\_(ツ)_/¯
      </span>
    </div>
  );
}
