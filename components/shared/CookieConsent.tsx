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

import { useSyncExternalStore } from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";

const CONSENT_CHANGE_EVENT = "shruggie:consent-change";

function getConsentCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)consent=([^;]*)/);
  return match ? match[1] : null;
}

function setConsentCookie(value: "granted" | "denied") {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `consent=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentCookie,
    () => undefined,
  );

  // The server snapshot stays hidden to avoid a hydration mismatch. On the
  // client, a missing cookie is represented by null and shows the banner.
  if (consent !== null) return null;

  const handleAccept = () => {
    setConsentCookie("granted");
  };

  const handleDecline = () => {
    setConsentCookie("denied");
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
