/**
 * PostCTA — End-of-article call to action for blog posts.
 *
 * Gives a high-intent reader who reached the bottom of a post a clear next
 * step instead of forcing manual navigation: a primary path to /contact and
 * a secondary path to /services. The shared blog post template renders it
 * automatically after the MDX body so authors never need to insert it.
 *
 * Wrapped in `not-prose` so the Tailwind Typography styles applied to post
 * bodies don't restyle the buttons.
 *
 * Spec reference: §7.3 (Blog Post Template)
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ShruggieCTA from "@/components/ui/ShruggieCTA";

export default function PostCTA() {
  return (
    <div className="not-prose mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
      <ShruggieCTA href="/contact">Start a conversation</ShruggieCTA>
      <Link
        href="/services"
        className="group inline-flex items-center gap-1.5 font-display text-body-md font-medium text-accent underline-offset-4 transition-colors hover:text-accent-hover"
      >
        Explore our services
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}

export { PostCTA };
