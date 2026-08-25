/**
 * ServiceFAQ — Accessible FAQ disclosure list for service detail pages.
 *
 * Uses native <details>/<summary> so it works without JavaScript and is
 * keyboard- and screen-reader-friendly by default. The same `faqs` data is
 * emitted as FAQPage JSON-LD on the detail page, keeping the visible content
 * and the machine-readable markup in sync.
 *
 * Spec reference: §6.2 (Services), §8.2 (JSON-LD)
 */

import { Plus } from "lucide-react";

import type { ServiceFaq } from "@/lib/services";

interface ServiceFAQProps {
  faqs: ServiceFaq[];
}

export default function ServiceFAQ({ faqs }: ServiceFAQProps) {
  if (faqs.length === 0) return null;

  return (
    <ul className="mt-8 space-y-4">
      {faqs.map((faq) => (
        <li key={faq.question}>
          <details className="group rounded-xl border border-border bg-bg-elevated transition-colors duration-300 open:border-accent/40 open:bg-accent/[0.04] dark:border-white/[0.06] dark:bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <h3 className="flex-1 font-display text-body-lg font-bold text-text-primary">
                {faq.question}
              </h3>
              <Plus
                size={20}
                aria-hidden="true"
                className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
              />
            </summary>
            <div className="px-5 pb-5 pt-0">
              <p className="text-body-md text-text-secondary">{faq.answer}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
