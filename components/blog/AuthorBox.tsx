/**
 * AuthorBox — Named-author byline box for the end of a blog post.
 *
 * Renders the post author's photo, name, role, bio, and social links, sourced
 * from the shared team registry (lib/team.ts). A named human author with a bio
 * and outbound social links is what Google's authorship guidance and AI
 * citation heuristics reward — and it backs up the site's "Published by
 * humans" claim. Returns null if the byline is not a known person.
 *
 * Spec reference: §7.3 (Blog Post Template), §8.2 (JSON-LD authorship)
 */

import Image from "next/image";
import Link from "next/link";
import {
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Twitch,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getAuthorByName } from "@/lib/team";

const ICON_MAP: Record<string, LucideIcon> = {
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Twitch,
  Youtube,
};

export default function AuthorBox({ authorName }: { authorName: string }) {
  const author = getAuthorByName(authorName);
  if (!author) return null;

  return (
    <aside className="not-prose mt-16 rounded-xl border border-border bg-bg-elevated p-6 md:p-8 dark:border-white/[0.06] dark:bg-white/[0.02]">
      <p className="mb-4 text-body-sm font-medium uppercase tracking-widest text-accent">
        Written by
      </p>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
          <Image
            src={author.image}
            alt={author.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-display-xs font-bold text-text-primary">
            {author.name}
          </h2>
          <p className="mt-0.5 text-body-sm font-medium text-accent">
            {author.title}
          </p>
          <p className="mt-3 text-body-md text-text-secondary">
            {author.description}
          </p>

          {author.socials.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              {author.socials.map((social) => {
                const Icon = ICON_MAP[social.icon];
                if (!Icon) return null;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${author.name} on ${social.label}`}
                    className="text-text-secondary transition-colors hover:text-accent"
                  >
                    <Icon size={20} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
