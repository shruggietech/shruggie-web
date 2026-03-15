"use client";

import { cn } from "@/lib/utils";

interface SectionProgressProps {
  total: number;
  current: number;
  className?: string;
  labels?: string[];
  onSelect?: (index: number) => void;
}

export function SectionProgress({ total, current, className, labels, onSelect }: SectionProgressProps) {
  return (
    <div
      className={cn("absolute left-4 top-1/2 -translate-y-1/2 z-10", className)}
      role="tablist"
      aria-label="Section navigation"
      aria-orientation="vertical"
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
            className="group relative z-10 flex items-center justify-center"
          >
            <button
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={labels?.[i] ?? `Section ${i + 1}`}
              onClick={() => onSelect?.(i)}
              className={cn(
                "block cursor-pointer rounded-full border transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-bright focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                i === current
                  ? "size-2.5 border-brand-green-bright bg-brand-green-bright"
                  : "size-2 border-white/20 bg-transparent hover:border-white/40",
              )}
            />
            {/* Tooltip */}
            {labels?.[i] && (
              <span className="pointer-events-none absolute left-5 whitespace-nowrap rounded bg-black/80 px-2.5 py-1 text-xs text-white/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                {labels[i]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
