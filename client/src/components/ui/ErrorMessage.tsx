import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/** Inline error state — icon + text so meaning doesn't rely on color alone. */
export function ErrorMessage({ title = "Something went wrong", message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-2xl border-2 border-danger-500 bg-danger-50 p-6"
    >
      <div className="flex items-center gap-2 text-danger-700">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-base text-neutral-800">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
