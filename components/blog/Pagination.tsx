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
  // Nothing to paginate — suppress the control entirely rather than showing
  // a "Page 1 of 1" label, which reads as noise on a single-page list.
  if (totalPages <= 1) {
    return null;
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
              className="border-border text-body-sm text-text-secondary hover:border-accent hover:text-accent rounded-lg border px-3 py-2 transition-colors"
              aria-label="Previous page"
            >
              &larr; Prev
            </Link>
          ) : (
            <span
              className="border-border/50 text-body-sm text-text-muted cursor-not-allowed rounded-lg border px-3 py-2"
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
                className="bg-accent text-body-sm rounded-lg px-3 py-2 font-medium text-white dark:text-black"
                aria-current="page"
              >
                {page}
              </span>
            ) : (
              <Link
                href={getPageHref(page)}
                className={cn(
                  "border-border text-body-sm text-text-secondary rounded-lg border px-3 py-2",
                  "hover:border-accent hover:text-accent transition-colors",
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
              className="border-border text-body-sm text-text-secondary hover:border-accent hover:text-accent rounded-lg border px-3 py-2 transition-colors"
              aria-label="Next page"
            >
              Next &rarr;
            </Link>
          ) : (
            <span
              className="border-border/50 text-body-sm text-text-muted cursor-not-allowed rounded-lg border px-3 py-2"
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
