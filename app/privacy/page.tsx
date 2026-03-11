/**
 * Privacy Policy page.
 *
 * Static content page with hardcoded policy text using narrow container
 * layout and Tailwind typography prose class. Policy changes require
 * deliberate review — this is intentionally not MDX.
 *
 * Spec reference: §6.11 (Privacy Policy)
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ShruggieTech privacy policy. Learn how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | ShruggieTech",
    description:
      "ShruggieTech privacy policy. Learn how we collect, use, and protect your information.",
    url: "/privacy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-[var(--section-gap)]">
      <div className="container-narrow">
        {/* Hero */}
        <h1 className="font-display text-display-lg font-bold text-text-primary">
          Privacy Policy
        </h1>
        <p className="mt-2 text-body-sm text-text-muted">
          Effective: March 10, 2026
        </p>

        {/* Policy Content */}
        <div className="prose prose-invert mt-12 max-w-none dark:prose-invert">
          {/* Information We Collect */}
          <h2>Information We Collect</h2>
          <p>
            ShruggieTech (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) collects information in two ways:
          </p>
          <ol>
            <li>
              <strong>Information you voluntarily provide</strong> via the
              contact form on our website, including your name, email address,
              company name (optional), message, and referral source (optional).
            </li>
            <li>
              <strong>Usage data collected automatically</strong> via Google
              Analytics 4 and Google Tag Manager, including pages visited, time
              on site, device type, browser, and approximate geographic location
              derived from your IP address.
            </li>
          </ol>
          <p>
            No account registration, login, or payment information is collected
            through this website.
          </p>

          {/* How We Use Your Information */}
          <h2>How We Use Your Information</h2>
          <p>
            Contact form submissions are used solely to respond to your
            inquiries. Analytics data is used to understand site traffic patterns
            and improve the user experience. ShruggieTech does not sell, rent, or
            share personal information with third parties for marketing purposes.
          </p>

          {/* Third-Party Services */}
          <h2>Third-Party Services</h2>
          <p>This site uses the following third-party services:</p>
          <ul>
            <li>
              <strong>Google Analytics 4</strong> — for traffic measurement and
              site analytics. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Google Tag Manager</strong> — for managing analytics and
              tracking scripts.
            </li>
            <li>
              <strong>Formspree</strong> — for processing contact form
              submissions. See{" "}
              <a
                href="https://formspree.io/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Formspree&apos;s Privacy Policy
              </a>
              .
            </li>
          </ul>
          <p>
            These services may set cookies or collect data as described in their
            respective privacy policies.
          </p>

          {/* Cookies */}
          <h2>Cookies</h2>
          <p>This site uses the following cookies:</p>
          <ul>
            <li>
              <strong>Theme preference cookie</strong> (
              <code>theme</code>) — persists your dark/light mode selection
              across visits.
            </li>
            <li>
              <strong>Consent cookie</strong> (
              <code>consent</code>) — records whether you have accepted or
              declined analytics cookies.
            </li>
            <li>
              <strong>Google Analytics 4 cookies</strong> — used for traffic
              measurement. These cookies are only set if you accept analytics
              cookies via the consent banner.
            </li>
          </ul>
          <p>
            You can disable cookies via your browser settings. Doing so will not
            affect core site functionality but will reset your theme preference
            on each visit.
          </p>

          {/* Data Retention */}
          <h2>Data Retention</h2>
          <p>
            Contact form submissions are retained in Formspree until manually
            deleted. Analytics data retention follows the configured Google
            Analytics 4 property settings.
          </p>

          {/* Your Rights */}
          <h2>Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data by contacting ShruggieTech at the address listed on
            our{" "}
            <Link href="/contact" className="text-accent hover:text-accent-hover">
              Contact page
            </Link>
            .
          </p>

          {/* Changes to This Policy */}
          <h2>Changes to This Policy</h2>
          <p>
            ShruggieTech may update this policy periodically. Changes will be
            reflected by updating the effective date at the top of this page.
          </p>

          {/* Contact */}
          <h2>Contact</h2>
          <p>
            Questions about this policy can be directed to ShruggieTech at the
            address listed on our{" "}
            <Link href="/contact" className="text-accent hover:text-accent-hover">
              Contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
