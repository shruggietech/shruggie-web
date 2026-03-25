/**
 * TableOfContents — Sidebar navigation with anchor links and active tracking.
 *
 * Renders a sticky sidebar (desktop) or collapsible disclosure (mobile)
 * with IntersectionObserver-based active heading highlighting.
 *
 * Spec reference: §7.3 (Blog Post Template)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/utils";

interface TableOfContentsProps {
  headings: TocItem[];
  className?: string;
  /** Render as a collapsible details/summary element (mobile). */
  collapsible?: boolean;
}

export default function TableOfContents({
  headings,
  className,
  collapsible = false,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const headingsRef = useRef(headings);
  headingsRef.current = headings;

  useEffect(() => {
    const elements = headingsRef.current
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    elements.forEach((el) => observer.observe(el));

    // When the user scrolls to the bottom of the page, activate the last
    // heading even if it never crossed the observer threshold (short section).
    const lastId = headingsRef.current[headingsRef.current.length - 1]?.id;
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 30;
      if (atBottom && lastId) {
        setActiveId(lastId);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const links = (
    <ul className="space-y-1 border-l border-border">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className={cn(
              "-ml-px block border-l-2 py-1 pl-4 text-body-sm transition-colors",
              activeId === h.id
                ? "border-accent text-accent font-medium"
                : "border-transparent text-text-secondary hover:text-accent hover:border-accent/50",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (collapsible) {
    return (
      <details
        className={cn(
          "group rounded-lg border border-border p-4",
          className,
        )}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-body-sm font-medium text-accent [&::-webkit-details-marker]:hidden">
          <svg
            className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          On this page
        </summary>
        <div className="mt-3 max-h-[40vh] overflow-y-auto">{links}</div>
      </details>
    );
  }

  return (
    <nav aria-label="Table of contents" className={className}>
      <p className="mb-3 font-display text-body-sm font-medium uppercase tracking-widest text-accent">
        On this page
      </p>
      {links}
    </nav>
  );
}
