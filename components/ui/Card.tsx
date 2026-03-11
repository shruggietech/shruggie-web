/**
 * Card — Surface container with subtle depth.
 *
 * Thin border, soft shadow, optional hover treatment that transitions
 * the border to accent color with a green-tinted shadow.
 *
 * Spec reference: §2.4 (Component Primitives)
 */

import { type HTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-bg-elevated",
          "p-6 md:p-8",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
          hover && [
            "transition-all duration-300 ease-out",
            "hover:border-accent/40 hover:shadow-[0_4px_12px_rgba(43,204,115,0.06)]",
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
export default Card;
