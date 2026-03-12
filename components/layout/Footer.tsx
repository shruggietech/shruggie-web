/**
 * Footer — Site-wide footer with four-column layout.
 *
 * Server component. Four columns on desktop, stacked on mobile.
 * Column 1: logo + tagline. Column 2: page links. Column 3: product links.
 * Column 4: GitHub link. Bottom bar: copyright, location, privacy link.
 *
 * Spec reference: §5.2 (Footer)
 */

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";

const PAGE_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const PRODUCT_LINKS = [
  { href: "/products#shruggie-indexer", label: "shruggie-indexer" },
  { href: "/products#metadexer", label: "metadexer" },
  { href: "/products#rustif", label: "rustif" },
] as const;

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-bg-secondary">
      {/* Main footer grid */}
      <div className="container-content py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright"
            >
              <Image
                src="/images/logo-darkbg.png"
                alt="ShruggieTech logo"
                width={140}
                height={30}
                className="h-12 w-auto hidden dark:block"
              />
              <Image
                src="/images/logo-lightbg.png"
                alt="ShruggieTech logo"
                width={140}
                height={30}
                className="h-12 w-auto block dark:hidden"
              />
            </Link>
            <p className="mt-4 max-w-[240px] text-body-sm text-text-secondary">
              Modern digital systems, software, and AI-driven experiences.
            </p>
          </div>

          {/* Column 2: Page links */}
          <div>
            <h3 className="mb-4 font-display text-body-sm font-medium uppercase tracking-wider text-text-muted">
              Pages
            </h3>
            <ul className="flex flex-col gap-3">
              {PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product links */}
          <div>
            <h3 className="mb-4 font-display text-body-sm font-medium uppercase tracking-wider text-text-muted">
              Products
            </h3>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm font-mono text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="mb-4 font-display text-body-sm font-medium uppercase tracking-wider text-text-muted">
              Connect
            </h3>
            <a
              href="https://github.com/shruggietech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body-sm text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright"
            >
              <Github size={18} aria-hidden="true" />
              github.com/shruggietech
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-content flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-body-xs text-text-muted inline-flex items-center gap-1">
            &copy; Copyright Shruggie, LLC {new Date().getFullYear()} Made in
            the USA{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 30"
              width="20"
              height="10"
              aria-label="US flag"
              role="img"
              className="inline-block align-middle"
            >
              {/* Stripes */}
              <rect width="60" height="30" fill="#B22234" />
              <rect y="2.31" width="60" height="2.31" fill="#fff" />
              <rect y="6.92" width="60" height="2.31" fill="#fff" />
              <rect y="11.54" width="60" height="2.31" fill="#fff" />
              <rect y="16.15" width="60" height="2.31" fill="#fff" />
              <rect y="20.77" width="60" height="2.31" fill="#fff" />
              <rect y="25.38" width="60" height="2.31" fill="#fff" />
              {/* Canton */}
              <rect width="24" height="16.15" fill="#3C3B6E" />
            </svg>
          </p>
          <Link
            href="/privacy"
            className="text-body-xs text-text-muted transition-colors duration-200 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
