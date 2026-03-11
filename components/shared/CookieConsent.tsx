/**
 * CookieConsent — Fixed banner at viewport bottom for cookie consent.
 *
 * Client component. Displays on first visit (no `consent` cookie).
 * "Accept" sets consent=granted, "Decline" sets consent=denied.
 * Both dismiss the banner and set a 1-year cookie.
 * GA4/GTM scripts are loaded conditionally based on consent (handled
 * in the root layout, not in this component).
 *
 * Spec reference: §6.11 (Privacy Policy — Section 3: Cookie Consent Banner)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";

function getConsentCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)consent=([^;]*)/);
  return match ? match[1] : null;
}

function setConsentCookie(value: "granted" | "denied") {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `consent=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if no consent cookie exists
    if (!getConsentCookie()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setConsentCookie("granted");
    setVisible(false);
  };

  const handleDecline = () => {
    setConsentCookie("denied");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg-primary/90 backdrop-blur-md"
    >
      <div className="container-content flex flex-col items-center gap-4 py-4 sm:flex-row sm:justify-between">
        <p className="text-body-sm text-text-secondary">
          This site uses cookies for analytics to help us improve your
          experience.{" "}
          <Link
            href="/privacy"
            className="text-accent underline hover:text-accent-hover"
          >
            Learn more
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export { CookieConsent };
