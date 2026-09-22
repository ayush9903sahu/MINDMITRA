import { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

/** Shown when a list/page has no content yet (e.g. no games played). */
export function EmptyState({ title, description, icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 px-6 py-14 text-center">
      <div className="text-neutral-400" aria-hidden="true">
        {icon ?? <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
      {description && <p className="max-w-sm text-base text-neutral-600">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
