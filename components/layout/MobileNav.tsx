/**
 * MobileNav — Full-screen mobile navigation overlay.
 *
 * Slides in from the right. Uses primary background at full opacity.
 * Links in Space Grotesk Medium at 28px with 24px vertical spacing.
 * Focus is trapped within the overlay when open. Escape closes it.
 * Scroll is locked while open.
 *
 * Spec reference: §5.3 (Mobile Navigation)
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Get in Touch" },
] as const;

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus the close button when overlay opens
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap: keep Tab cycling within the overlay
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" || !overlayRef.current) return;

      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    },
    [],
  );

  return (
    <div
      ref={overlayRef}
      id="mobile-nav-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className={cn(
        "fixed inset-0 z-[60] bg-bg-primary transition-transform duration-250 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
      onKeyDown={handleKeyDown}
    >
      {/* Close button */}
      <div className="flex justify-end p-6">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-nav-panel"
          className={cn(
            "rounded-lg p-2 text-text-primary transition-colors",
            "hover:text-accent",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
          )}
        >
          <X size={28} aria-hidden="true" />
        </button>
      </div>

      {/* Navigation links */}
      <nav aria-label="Mobile navigation links" className="mt-8 px-8">
        <ul className="flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={cn(
                  "block font-display text-[28px] font-medium text-text-primary",
                  "transition-colors duration-200",
                  "hover:text-accent",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export { MobileNav };
