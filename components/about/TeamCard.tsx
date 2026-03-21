"use client";

/**
 * TeamCard — Flip-card component for team member display.
 *
 * Front: photo, name, title, social icons, "About Me" button.
 * Back: full bio text, "Back" button.
 *
 * Uses CSS 3D transforms for the flip animation.
 */

import { useState } from "react";
import Image from "next/image";
import {
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Twitch,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Linkedin,
  Github,
  Facebook,
  Instagram,
  Twitch,
  Youtube,
};

export interface SocialLink {
  href: string;
  label: string;
  icon: string; // key into ICON_MAP
}

export interface TeamMemberData {
  name: string;
  title: string;
  description: string;
  image: string;
  socials: SocialLink[];
}

interface TeamCardProps {
  member: TeamMemberData;
}

export default function TeamCard({ member }: TeamCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-[1200px] h-[400px] md:h-[520px] group">
      <div
        className={`relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] ${
          flipped
            ? "[transform:rotateY(180deg)]"
            : "group-hover:[transform:rotateY(-5deg)_scale(1.02)] group-hover:shadow-lg"
        }`}
      >
        {/* ── Front Face ───────────────────────────────────────────── */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl border border-border dark:border-white/[0.06] bg-bg-elevated dark:bg-white/[0.03] dark:backdrop-blur-xl p-6 md:p-8 flex flex-col items-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors duration-300 group-hover:border-accent/40 dark:group-hover:border-brand-green-bright/20">
          <div className="aspect-square h-40 w-40 md:h-48 md:w-48 overflow-hidden flex-shrink-0">
            <Image
              src={member.image}
              alt={member.name}
              width={192}
              height={192}
              className="h-full w-full object-cover"
            />
          </div>

          <h3 className="mt-6 font-display text-display-sm font-bold text-text-primary">
            {member.name}
          </h3>
          <p className="mt-1 text-body-sm font-medium text-accent">
            {member.title}
          </p>

          {/* Social icons */}
          {member.socials.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              {member.socials.map((social) => {
                const IconComp = ICON_MAP[social.icon];
                if (!IconComp) return null;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${social.label}`}
                    className="text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <IconComp size={20} />
                  </a>
                );
              })}
            </div>
          )}

          <div
            className="mt-auto pt-2 md:pt-6 w-full flex-1 flex flex-col items-center justify-end cursor-pointer"
            onClick={() => setFlipped(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(true); } }}
            aria-label={`Learn more about ${member.name}`}
          >
            <span
              className="rounded-lg border border-accent/30 px-5 py-2 text-body-sm font-medium text-accent transition-all duration-200 hover:bg-accent/10 hover:border-accent/50"
            >
              About Me
            </span>
          </div>
        </div>

        {/* ── Back Face ────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl border border-border dark:border-white/[0.06] bg-bg-elevated dark:bg-white/[0.03] dark:backdrop-blur-xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer"
          onClick={() => setFlipped(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(false); } }}
          aria-label={`Flip back to ${member.name} front`}
        >
          <h3 className="font-display text-display-sm font-bold text-text-primary">
            {member.name}
          </h3>
          <p className="mt-4 text-body-md text-text-secondary leading-relaxed text-left">
            {member.description}
          </p>

          <div className="mt-auto pt-6">
            <button
              onClick={() => setFlipped(false)}
              className="rounded-lg border border-accent/30 px-5 py-2 text-body-sm font-medium text-accent transition-all duration-200 hover:bg-accent/10 hover:border-accent/50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
