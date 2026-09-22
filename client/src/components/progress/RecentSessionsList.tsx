import type { RecentSessionSummary } from "../../types/progress";
import {
  formatDateTime,
  formatDuration,
  formatAccuracy,
  formatDifficulty,
} from "../../utils/formatters";
import { ProgressEmptyState } from "./ProgressEmptyState";

interface RecentSessionsListProps {
  sessions: RecentSessionSummary[];
}

export function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  return (
    <section aria-labelledby="recent-sessions-heading">
      <h2
        id="recent-sessions-heading"
        className="text-2xl font-semibold text-slate-800"
      >
        Recent activity
      </h2>
      <p className="mt-1 text-base text-slate-500">
        Your most recently completed exercise sessions.
      </p>

      {sessions.length === 0 ? (
        <div className="mt-4">
          <ProgressEmptyState
            title="No recent sessions"
            description="Complete an exercise to see it listed here."
          />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  {session.gameName}
                </p>
                <p className="text-base text-slate-500">
                  {formatDateTime(session.completedAt)} ·{" "}
                  {formatDifficulty(session.difficulty)} difficulty
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-base text-slate-700">
                <span>
                  <span className="font-medium text-slate-500">Score:</span>{" "}
                  {session.score}
                </span>
                <span>
                  <span className="font-medium text-slate-500">
                    Accuracy:
                  </span>{" "}
                  {formatAccuracy(session.accuracy)}
                </span>
                <span>
                  <span className="font-medium text-slate-500">
                    Duration:
                  </span>{" "}
                  {formatDuration(session.duration)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
