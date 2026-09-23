import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Trophy } from "lucide-react";
import { GameSummary } from "@/types";
import { gameDetailPath } from "../../constants";
import { DynamicIcon } from "./DynamicIcon";
import { Card } from "./Card";

export interface GameCardProps {
  summary: GameSummary;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function formatLastPlayed(iso: string | null): string {
  if (!iso) return "Not played yet";
  const date = new Date(iso);
  return `Last played ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

/**
 * Reusable card for displaying a game with its metadata and the current
 * user's history for it. Consumed by the Games module (list page) and
 * Dashboard module (recently played). Only reads from GameSummary — never
 * fetches data itself.
 */
export function GameCard({ summary }: GameCardProps) {
  const { game, bestScore, lastPlayedAt, completed } = summary;

  return (
    <Link
      to={gameDetailPath(game.id)}
      className="block rounded-2xl focus:outline-none"
      aria-label={`Play ${game.name}`}
    >
      <Card className="flex h-full flex-col gap-4 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-50 p-3 text-brand-600">
              <DynamicIcon name={game.icon} className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">{game.name}</h3>
              <span className="text-sm text-neutral-500">
                {DIFFICULTY_LABELS[game.category] ?? game.category}
              </span>
            </div>
          </div>
          {completed && (
            <span className="flex items-center gap-1 text-success-700" title="Completed">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Completed</span>
            </span>
          )}
        </div>

        <p className="text-base text-neutral-700">{game.description}</p>

        <div className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-3 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            {bestScore !== null ? `Best: ${bestScore}` : "No score yet"}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {formatLastPlayed(lastPlayedAt)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
