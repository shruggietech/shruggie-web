import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import type { ServiceProof } from "@/lib/services";
import BrandPortfolioVisual from "@/components/shared/BrandPortfolioVisual";

interface ServiceProofCardProps {
  proof: ServiceProof;
}

function ProofCardContent({ proof }: ServiceProofCardProps) {
  return (
    <>
      <div className="border-border bg-bg-secondary relative aspect-[16/9] overflow-hidden border-b dark:border-white/[0.06]">
        {proof.image ? (
          <Image
            src={proof.image.src}
            alt={proof.image.alt}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          />
        ) : proof.kind === "Portfolio" ? (
          <BrandPortfolioVisual />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(43,204,115,0.18),transparent_60%)] px-6 text-center">
            <span className="text-body-sm text-accent font-mono tracking-[0.18em] uppercase">
              {proof.kind}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-body-xs text-accent font-mono tracking-[0.14em] uppercase">
          {proof.kind}
        </p>
        <h3 className="font-display text-display-xs text-text-primary group-hover:text-accent mt-2 font-bold transition-colors">
          {proof.name}
        </h3>
        <p className="text-body-sm text-text-secondary mt-3 leading-relaxed">
          {proof.summary}
        </p>
        <span className="font-display text-body-sm text-accent mt-5 inline-flex items-center gap-2 font-medium">
          {proof.linkLabel}
          {proof.external ? (
            <ExternalLink size={16} aria-hidden="true" />
          ) : (
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
          {proof.external && (
            <span className="sr-only"> (opens in a new tab)</span>
          )}
        </span>
      </div>
    </>
  );
}

export default function ServiceProofCard({ proof }: ServiceProofCardProps) {
  const className =
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated transition-colors duration-300 hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus dark:border-white/[0.06] dark:bg-white/[0.02]";

  if (proof.external) {
    return (
      <a
        href={proof.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <ProofCardContent proof={proof} />
      </a>
    );
  }

  return (
    <Link href={proof.href} className={className}>
      <ProofCardContent proof={proof} />
    </Link>
  );
}
