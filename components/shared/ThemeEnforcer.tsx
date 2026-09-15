/**
 * ThemeEnforcer — Client component that enforces dark mode on forced-dark routes.
 *
 * On SPA navigation (Next.js App Router soft navigations), the inline theme
 * script in <head> does not re-run. This component listens for pathname changes
 * and ensures the "dark" class is applied when navigating to a forced-dark route,
 * and restores the cookie-based preference only when navigating into `/blog`.
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
      // Blog is the only surface that honors the saved theme preference.
      const cookie = document.cookie.match(/theme=(light|dark)/);
      const theme = cookie ? cookie[1] : "dark";
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [pathname]);

  return null;
}
