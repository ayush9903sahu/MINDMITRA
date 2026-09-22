export interface ProgressBarProps {
  /** 0-100 */
  value: number;
  label: string;
  showPercentage?: boolean;
}

/** Accessible progress bar — exposes value via ARIA, never relies on color alone. */
export function ProgressBar({ value, label, showPercentage = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-neutral-900">{label}</span>
        {showPercentage && <span className="text-base text-neutral-600">{Math.round(clamped)}%</span>}
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-4 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-[width]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
