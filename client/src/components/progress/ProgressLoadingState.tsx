import { Loader2 } from "lucide-react";

interface ProgressLoadingStateProps {
  label?: string;
}

export function ProgressLoadingState({
  label = "Loading your progress…",
}: ProgressLoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-10 text-center"
    >
      <Loader2
        className="h-8 w-8 animate-spin text-blue-600"
        aria-hidden="true"
      />
      <p className="text-lg text-slate-700">{label}</p>
    </div>
  );
}
