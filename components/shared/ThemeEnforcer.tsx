/**
 * ThemeEnforcer — Client component that enforces dark mode on forced-dark routes.
 *
 * On SPA navigation (Next.js App Router soft navigations), the inline theme
 * script in <head> does not re-run. This component listens for pathname changes
 * and ensures the "dark" class is applied when navigating to a forced-dark route,
 * and restores the cookie-based preference when navigating away.
 *
 * Spec reference: ShruggieTech-Website-Redesign-Plan.md §2
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isDarkModeForced } from "@/lib/route-theme";

export default function ThemeEnforcer() {
  const pathname = usePathname();

  useEffect(() => {
    if (isDarkModeForced(pathname)) {
      document.documentElement.classList.add("dark");
    } else {
      // Restore cookie-based preference
      const cookie = document.cookie.match(/theme=(light|dark)/);
      const theme = cookie ? cookie[1] : null;
      if (theme) {
        document.documentElement.classList.toggle("dark", theme === "dark");
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    }
  }, [pathname]);

  return null;
}
