/**
 * Divider — Horizontal rule component.
 *
 * Renders an <hr> with border-border color and vertical margin.
 * Accepts an optional className prop for override.
 *
 * Spec reference: §2.4 (Component Primitives)
 */

import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export default function Divider({ className }: DividerProps) {
  return <hr className={cn("my-8 border-border", className)} />;
}

export { Divider };
export type { DividerProps };
