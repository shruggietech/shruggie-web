"use client";

import { useEffect } from "react";

import Button from "@/components/ui/Button";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog content unavailable:", error);
  }, [error]);

  return (
    <div className="section-bg-cta flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-display-sm text-text-primary font-bold">
        Blog content is temporarily unavailable.
      </h1>
      <p className="text-body-md text-text-secondary mt-4 max-w-md">
        Published content could not be loaded safely. Please try again in a
        moment.
      </p>
      <Button className="mt-8" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
