import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300",
  secondary:
    "bg-white text-neutral-900 border-2 border-neutral-300 hover:bg-neutral-100 disabled:text-neutral-400",
  danger: "bg-danger-500 text-white hover:bg-danger-700 disabled:bg-danger-50",
  ghost: "bg-transparent text-neutral-900 hover:bg-neutral-100 disabled:text-neutral-400",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "min-h-touch min-w-touch px-5 text-base",
  lg: "min-h-[3.5rem] min-w-touch px-7 text-lg",
};

/**
 * Base button used throughout BrainCare. Large touch target (min 48px),
 * visible focus ring (global CSS), and a loading state that keeps the
 * button's label present for screen readers instead of replacing it.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading = false, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium
          transition-colors disabled:cursor-not-allowed
          ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
