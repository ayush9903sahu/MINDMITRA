import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
  label?: string;
}

/** Centered loading indicator with an announced status for screen readers. */
export function LoadingSpinner({ label = "Loading…" }: LoadingSpinnerProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="h-10 w-10 animate-spin text-brand-600" aria-hidden="true" />
      <span className="text-base text-neutral-600">{label}</span>
    </div>
  );
}
