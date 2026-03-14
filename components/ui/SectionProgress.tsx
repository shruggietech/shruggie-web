"use client";

import { cn } from "@/lib/utils";

interface SectionProgressProps {
  total: number;
  current: number;
  className?: string;
}

export function SectionProgress({ total, current, className }: SectionProgressProps) {
  return (
    <div
      className={cn("absolute left-4 top-1/2 -translate-y-1/2 z-10", className)}
      role="progressbar"
      aria-label={`Section ${current + 1} of ${total}`}
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <div className="relative flex h-[120px] w-[2px] flex-col items-center justify-between">
        {/* Background track */}
        <div className="absolute inset-0 rounded-full bg-white/10" />

        {/* Filled segment */}
        <div
          className="absolute top-0 left-0 w-full rounded-full bg-brand-green-bright transition-all duration-300 ease-out"
          style={{
            height: total > 1 ? `${(current / (total - 1)) * 100}%` : "0%",
          }}
        />

        {/* Dots */}
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="relative z-10 flex items-center justify-center"
          >
            <span
              className={cn(
                "block rounded-full border transition-all duration-300 ease-out",
                i === current
                  ? "size-2.5 border-brand-green-bright bg-brand-green-bright"
                  : "size-2 border-white/20 bg-transparent",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
