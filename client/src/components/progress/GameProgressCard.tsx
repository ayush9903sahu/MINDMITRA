import type { GameProgress } from "../../types/progress";
import {
  formatDuration,
  formatAccuracy,
  formatDifficulty,
} from "../../utils/formatters";
import { MetricExplainer } from "./MetricExplainer";

interface GameProgressCardProps {
  game: GameProgress;
  isSelected: boolean;
  onSelect: (gameId: string) => void;
}

const METRIC_EXPLANATIONS: Record<string, string> = {
  "Best score": "The highest game score you've reached in this exercise.",
  "Latest score": "Your score from the most recent session of this exercise.",
  "Average score": "The average of your scores across all sessions.",
  Accuracy: "How many responses were correct, on average, where this exercise tracks it.",
  Sessions: "How many times you've completed this exercise.",
  "Practice time": "Total time spent on this exercise.",
  "Current difficulty": "The difficulty level of your most recent session.",
};

export function GameProgressCard({
  game,
  isSelected,
  onSelect,
}: GameProgressCardProps) {
  const metrics: Array<{ label: string; value: string }> = [
    { label: "Best score", value: String(game.bestScore) },
    { label: "Latest score", value: String(game.latestScore) },
    { label: "Average score", value: String(Math.round(game.averageScore)) },
    { label: "Accuracy", value: formatAccuracy(game.averageAccuracy) },
    { label: "Sessions", value: String(game.sessionsCount) },
    { label: "Practice time", value: formatDuration(game.practiceTimeSeconds) },
    {
      label: "Current difficulty",
      value: formatDifficulty(game.currentDifficulty),
    },
  ];

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-800">
          {game.gameName}
        </h3>
        <button
          type="button"
          onClick={() => onSelect(game.gameId)}
          aria-pressed={isSelected}
          className="rounded-lg border border-blue-600 px-4 py-2 text-base font-semibold text-blue-700 hover:bg-blue-600 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        >
          {isSelected ? "Viewing history" : "View history"}
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value }) => (
          <div key={label}>
            <dt>
              <MetricExplainer
                label={label}
                explanation={METRIC_EXPLANATIONS[label] ?? ""}
              />
            </dt>
            <dd className="text-lg font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
