"use client";

import { useCallback, useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Returns true when the viewport width is below 768px (Tailwind `md` breakpoint).
 * Uses matchMedia for efficient detection. Returns false during SSR.
 */
export function useIsMobile(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    mediaQuery.addEventListener("change", onStoreChange);
    return () => mediaQuery.removeEventListener("change", onStoreChange);
  }, []);

  const getSnapshot = useCallback(
    () => window.matchMedia(MOBILE_QUERY).matches,
    [],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
