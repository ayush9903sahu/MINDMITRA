import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

/** Labeled text input. Label is always visible (never placeholder-only). */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helpId = helpText ? `${inputId}-help` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-base font-medium text-neutral-900">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={[helpId, errorId].filter(Boolean).join(" ") || undefined}
          className={`min-h-touch rounded-xl border-2 px-4 text-base
            ${error ? "border-danger-500" : "border-neutral-300"}
            focus:outline-none disabled:bg-neutral-100 ${className}`}
          {...props}
        />
        {helpText && (
          <p id={helpId} className="text-sm text-neutral-600">
            {helpText}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-sm font-medium text-danger-700">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
