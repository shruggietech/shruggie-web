/**
 * Pagination — Previous/next navigation with page numbers.
 *
 * Generates links to /blog?page=N (or /blog for page 1).
 *
 * Spec reference: §6.7 (Blog)
 */

import Link from "next/link";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageHref(page: number): string {
  return page === 1 ? "/blog" : `/blog?page=${page}`;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="mt-12 flex justify-center">
        <span className="text-body-sm text-text-muted">Page 1 of 1</span>
      </div>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex justify-center">
      <ul className="flex items-center gap-2">
        {/* Previous */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={getPageHref(currentPage - 1)}
              className="rounded-lg border border-border px-3 py-2 text-body-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
              aria-label="Previous page"
            >
              &larr; Prev
            </Link>
          ) : (
            <span
              className="cursor-not-allowed rounded-lg border border-border/50 px-3 py-2 text-body-sm text-text-muted"
              aria-disabled="true"
            >
              &larr; Prev
            </span>
          )}
        </li>

        {/* Page numbers */}
        {pages.map((page) => (
          <li key={page}>
            {page === currentPage ? (
              <span
                className="rounded-lg bg-accent px-3 py-2 text-body-sm font-medium text-black"
                aria-current="page"
              >
                {page}
              </span>
            ) : (
              <Link
                href={getPageHref(page)}
                className={cn(
                  "rounded-lg border border-border px-3 py-2 text-body-sm text-text-secondary",
                  "transition-colors hover:border-accent hover:text-accent",
                )}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Next */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={getPageHref(currentPage + 1)}
              className="rounded-lg border border-border px-3 py-2 text-body-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
              aria-label="Next page"
            >
              Next &rarr;
            </Link>
          ) : (
            <span
              className="cursor-not-allowed rounded-lg border border-border/50 px-3 py-2 text-body-sm text-text-muted"
              aria-disabled="true"
            >
              Next &rarr;
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
