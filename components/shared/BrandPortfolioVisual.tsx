import Image from "next/image";

import { cn } from "@/lib/utils";

interface BrandPortfolioVisualProps {
  className?: string;
}

/** Decorative brand-system composition shared by Services and Work. */
export default function BrandPortfolioVisual({
  className,
}: BrandPortfolioVisualProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#080d0b] text-white",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(43,204,115,0.2),transparent_42%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,28px_28px,28px_28px]" />
      <div className="border-accent/20 absolute -top-12 -right-12 h-36 w-36 rounded-full border" />
      <div className="border-accent/20 absolute -top-5 -right-5 h-20 w-20 rounded-full border" />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
          <span>ST / Brand system</span>
          <span>01—04</span>
        </div>

        <div className="grid grid-cols-[1.15fr_0.85fr] items-end gap-5">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-icon-only-green.png"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
              <div>
                <p className="font-display text-sm font-bold tracking-tight sm:text-base">
                  Brand Building
                </p>
                <p className="text-accent mt-1 font-mono text-[9px] tracking-[0.16em] uppercase">
                  Identity with a system
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-white/70" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/30" />
              <div className="h-1.5 w-3/5 rounded-full bg-white/15" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className="font-display text-4xl leading-none font-bold text-white/90 sm:text-5xl">
              Aa
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <span className="h-6 w-6 rounded-sm bg-[#2BCC73]" />
              <span className="h-6 w-6 rounded-sm bg-[#FF5300]" />
              <span className="h-6 w-6 rounded-sm bg-[#14B8A6]" />
              <span className="h-6 w-6 rounded-sm bg-[#F8F8F6]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[9px] tracking-[0.16em] text-white/45 uppercase">
          <span>Identity</span>
          <span>Typography</span>
          <span>Application</span>
        </div>
      </div>
    </div>
  );
}
