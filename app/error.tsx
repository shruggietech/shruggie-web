/**
 * Global Error Boundary — app/error.tsx
 *
 * Client component that catches unhandled runtime errors. Displays a
 * user-friendly message with "Try Again" and "Go Home" actions.
 * Logs the error to console.error for diagnostics.
 *
 * Spec reference: §6.10.2 (Global Error Boundary)
 */

"use client";

import { useEffect } from "react";

import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="section-bg-cta flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-display-sm font-bold text-text-primary">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-md text-body-md text-text-secondary">
        An unexpected error occurred. Please try again, or return to the
        homepage if the problem persists.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="primary" onClick={() => reset()}>
          Try Again
        </Button>
        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
