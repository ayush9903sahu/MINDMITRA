import { useId, useState } from "react";
import { HelpCircle } from "lucide-react";

interface MetricExplainerProps {
  label: string;
  explanation: string;
}

/**
 * A metric label paired with a keyboard-accessible "what does this mean?"
 * toggle. Avoids relying on hover-only tooltips (inaccessible for
 * keyboard/touch users) and avoids color as the only signal.
 */
export function MetricExplainer({ label, explanation }: MetricExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const explanationId = useId();

  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="text-base font-medium text-slate-600">{label}</span>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls={explanationId}
          className="rounded-full p-0.5 text-slate-400 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">What does {label} mean?</span>
        </button>
      </div>
      {isOpen && (
        <p
          id={explanationId}
          className="mt-1 max-w-xs text-sm text-slate-500"
        >
          {explanation}
        </p>
      )}
    </div>
  );
}
