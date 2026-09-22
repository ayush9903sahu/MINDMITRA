import { AlertTriangle } from "lucide-react";

interface ProgressErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ProgressErrorState({
  message,
  onRetry,
}: ProgressErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center"
    >
      <AlertTriangle
        className="h-8 w-8 text-red-600"
        aria-hidden="true"
      />
      <p className="text-lg font-medium text-red-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-6 py-3 text-lg font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
        >
          Try again
        </button>
      )}
    </div>
  );
}
