import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface ProgressEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function ProgressEmptyState({
  title,
  description,
  action,
}: ProgressEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <Sparkles className="h-8 w-8 text-blue-500" aria-hidden="true" />
      <div>
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-lg text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}
