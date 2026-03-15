"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface DeviceMockupProps {
  src?: string;
  alt: string;
  variant?: "browser" | "laptop" | "phone";
  className?: string;
  /** Placeholder text shown when src is not provided */
  placeholderLabel?: string;
}

function BrowserChrome() {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 bg-gray-900 rounded-t-xl"
      aria-hidden="true"
    >
      <div className="flex gap-1.5">
        <span className="size-3 rounded-full bg-[#FF5F57]" />
        <span className="size-3 rounded-full bg-[#FEBC2E]" />
        <span className="size-3 rounded-full bg-[#28C840]" />
      </div>
      <div className="mx-2 flex-1 rounded-md bg-gray-800 px-3 py-1">
        <div className="h-2.5 w-32 max-w-full rounded bg-gray-700" />
      </div>
    </div>
  );
}

function BrowserVariant({ src, alt, className, placeholderLabel }: Omit<DeviceMockupProps, "variant">) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-white/[0.06]", className)}>
      <BrowserChrome />
      <div className="relative aspect-video bg-gray-950">
        {src ? (
          <Image src={src} alt={alt} fill className="object-contain object-top" sizes="(min-width: 768px) 50vw, 90vw" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            {placeholderLabel && (
              <span className="font-display text-body-md font-semibold text-white/40">
                {placeholderLabel}
              </span>
            )}
            <span className="text-body-sm text-white/20">Screenshot coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

function LaptopVariant({ src, alt, className, placeholderLabel }: Omit<DeviceMockupProps, "variant">) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Screen */}
      <div className="w-full overflow-hidden rounded-t-xl border border-b-0 border-white/[0.06] bg-gray-800 p-2">
        <div className="overflow-hidden rounded-lg">
          <BrowserChrome />
          <div className="relative aspect-video bg-gray-950">
            {src ? (
              <Image src={src} alt={alt} fill className="object-contain object-top" sizes="(min-width: 768px) 50vw, 90vw" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                {placeholderLabel && (
                  <span className="font-display text-body-md font-semibold text-white/40">
                    {placeholderLabel}
                  </span>
                )}
                <span className="text-body-sm text-white/20">Screenshot coming soon</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Base */}
      <div
        className="h-3 w-[108%] max-w-full rounded-b-lg bg-gray-800 border border-t-0 border-white/[0.06]"
        aria-hidden="true"
      />
    </div>
  );
}

function PhoneVariant({ src, alt, className, placeholderLabel }: Omit<DeviceMockupProps, "variant">) {
  return (
    <div
      className={cn(
        "inline-flex flex-col overflow-hidden rounded-[2rem] border-2 border-white/[0.06] bg-gray-800 p-2",
        className,
      )}
    >
      {/* Notch */}
      <div className="mx-auto mb-2 h-5 w-24 rounded-b-xl bg-gray-900" aria-hidden="true" />
      {/* Screen */}
      <div className="relative aspect-[9/19.5] w-56 overflow-hidden rounded-xl bg-gray-950">
        {src ? (
          <Image src={src} alt={alt} fill className="object-contain object-top" sizes="50vw" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            {placeholderLabel && (
              <span className="font-display text-body-sm font-semibold text-white/40">
                {placeholderLabel}
              </span>
            )}
            <span className="text-body-xs text-white/20">Screenshot coming soon</span>
          </div>
        )}
      </div>
      {/* Home indicator */}
      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gray-700" aria-hidden="true" />
    </div>
  );
}

export function DeviceMockup({ variant = "browser", ...props }: DeviceMockupProps) {
  switch (variant) {
    case "laptop":
      return <LaptopVariant {...props} />;
    case "phone":
      return <PhoneVariant {...props} />;
    default:
      return <BrowserVariant {...props} />;
  }
}
