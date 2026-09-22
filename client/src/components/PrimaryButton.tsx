import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

/**
 * Large, high-contrast button used across the app.
 * Reuse this rather than styling raw <button> elements in new modules.
 */
export function PrimaryButton({ isLoading, children, disabled, ...rest }: PrimaryButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className="w-full rounded-lg bg-brand-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Please wait…" : children}
    </button>
  );
}
