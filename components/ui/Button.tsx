/**
 * Button — Primary UI primitive.
 *
 * Two variants (primary, secondary) and two sizes (default, sm).
 * Primary uses bg-cta with brightness hover effects.
 * Secondary uses bordered transparent treatment.
 * Both require visible focus rings using brand green (#2BCC73).
 *
 * Spec reference: §2.4 (Component Primitives), §3.2 (Accessibility)
 */

import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "sm";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "default", className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-display font-medium",
          "rounded-lg transition-all duration-200 ease-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-bright",
          // Size
          size === "default" && "px-6 py-3 text-body-md",
          size === "sm" && "px-4 py-2 text-body-sm",
          // Variant
          variant === "primary" && [
            "bg-cta text-white",
            "hover:brightness-110 active:brightness-95",
            "shadow-sm hover:shadow-md",
          ],
          variant === "secondary" && [
            "border border-border text-text-primary",
            "hover:border-accent hover:text-accent",
            "bg-transparent",
          ],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
export default Button;
