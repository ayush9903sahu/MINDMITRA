import { Gamepad2, ListChecks, Clock, Activity } from "lucide-react";
import type { OverallProgress } from "../../types/progress";
import { formatDuration, formatDateTime } from "../../utils/formatters";
import { MetricExplainer } from "./MetricExplainer";

interface OverallProgressCardProps {
  progress: OverallProgress;
}

interface StatItem {
  icon: typeof Gamepad2;
  label: string;
  explanation: string;
  value: string;
}

export function OverallProgressCard({ progress }: OverallProgressCardProps) {
  const stats: StatItem[] = [
    {
      icon: Gamepad2,
      label: "Games played",
      explanation:
        "How many different cognitive exercises you've tried at least once.",
      value: String(progress.gamesPlayed),
    },
    {
      icon: ListChecks,
      label: "Total sessions",
      explanation: "How many exercise sessions you've completed in total.",
      value: String(progress.totalSessions),
    },
    {
      icon: Clock,
      label: "Total practice time",
      explanation: "The combined time you've spent on all exercises.",
      value: formatDuration(progress.totalPracticeTimeSeconds),
    },
    {
      icon: Activity,
      label: "Recent activity",
      explanation: "The date and time of your most recent completed session.",
      value: progress.lastActivityAt
        ? formatDateTime(progress.lastActivityAt)
        : "No sessions yet",
    },
  ];

  return (
    <section
      aria-labelledby="overall-progress-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2
        id="overall-progress-heading"
        className="text-2xl font-semibold text-slate-800"
      >
        Overall progress
      </h2>
      <p className="mt-1 text-base text-slate-500">
        A summary of your activity across all cognitive exercises.
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, explanation, value }) => (
          <div
            key={label}
            className="flex flex-col gap-2 rounded-lg bg-slate-50 p-4"
          >
            <div className="flex items-center gap-2 text-blue-600">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <dt>
              <MetricExplainer label={label} explanation={explanation} />
            </dt>
            <dd className="text-2xl font-bold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
