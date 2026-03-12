/**
 * Header — Site-wide fixed header with navigation.
 *
 * Fixed position, full-width, z-50. Translucent background with
 * backdrop-blur that progressively gains opacity as the user scrolls.
 * Contains logo/wordmark, nav links, theme toggle, CTA, and mobile hamburger.
 *
 * Spec reference: §5.1 (Header), §2.6 (Dark/Light Mode)
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import MobileNav from "@/components/layout/MobileNav";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

export default function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Track scroll position for progressive opacity
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Initialize theme state from DOM
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Theme toggle: set cookie + toggle class (§2.6)
  const toggleTheme = useCallback(() => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);

    const theme = newIsDark ? "dark" : "light";
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `theme=${theme}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }, [isDark]);

  // Progressive opacity: 0% at scroll 0, 80% at 100px
  // Disabled when prefers-reduced-motion is active
  const scrollProgress = prefersReducedMotion
    ? 0.8
    : Math.min(scrollY / 100, 1);
  const bgOpacity = scrollProgress * 0.8;

  return (
    <>
      <header
        role="banner"
        className={cn(
          "fixed top-0 right-0 left-0 z-50",
          "transition-[backdrop-filter] duration-200",
        )}
        style={{
          backgroundColor: `color-mix(in srgb, var(--bg-primary) ${Math.round(bgOpacity * 100)}%, transparent)`,
          backdropFilter: scrollProgress > 0 ? `blur(${Math.round(scrollProgress * 12)}px)` : "none",
          WebkitBackdropFilter: scrollProgress > 0 ? `blur(${Math.round(scrollProgress * 12)}px)` : "none",
        }}
      >
        <div className="container-content flex h-16 items-center justify-between">
          {/* Logo + Wordmark */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
            )}
          >
            <Image
              src={isDark ? "/images/logo-darkbg.png" : "/images/logo-lightbg.png"}
              alt="ShruggieTech logo"
              width={140}
              height={30}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative px-3 py-2 font-body text-body-sm font-medium uppercase tracking-wide text-text-secondary",
                  "transition-colors duration-200 hover:text-text-primary",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
                )}
              >
                {link.label}
                {/* Animated underline (§5.1: scaleX transition on ::after) */}
                <span
                  className={cn(
                    "absolute bottom-0 left-3 right-3 h-[2px] bg-accent",
                    "origin-left scale-x-0 transition-transform duration-200 ease-out",
                    "group-hover:scale-x-100",
                  )}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Right-side controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle (§2.6) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className={cn(
                "rounded-lg p-2 text-text-secondary transition-colors",
                "hover:text-text-primary",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
              )}
            >
              {isDark ? (
                <Sun size={20} aria-hidden="true" />
              ) : (
                <Moon size={20} aria-hidden="true" />
              )}
            </button>

            {/* CTA button — desktop only */}
            <Link href="/contact" className="hidden md:block">
              <Button variant="primary" size="sm">
                Get in Touch
              </Button>
            </Link>

            {/* Hamburger — mobile only (§5.1) */}
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-panel"
              className={cn(
                "rounded-lg p-2 text-text-secondary transition-colors md:hidden",
                "hover:text-text-primary",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
              )}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}

export { Header };
