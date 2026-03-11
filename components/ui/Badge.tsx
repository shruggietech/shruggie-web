/**
 * Badge — Small inline label for tags and status indicators.
 *
 * Renders as a <span> with rounded-full styling, translucent green
 * background, accent text color, and compact padding.
 *
 * Spec reference: §2.4 (Component Primitives)
 */

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-green-bright-20 px-3 py-1 text-body-xs font-medium text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps };
