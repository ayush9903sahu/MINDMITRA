import type { GameHistory, GameOption } from "../../types/progress";
import { GameSelector } from "./GameSelector";
import { ScoreHistoryChart } from "./ScoreHistoryChart";
import { AccuracyHistoryChart } from "./AccuracyHistoryChart";
import { ProgressLoadingState } from "./ProgressLoadingState";
import { ProgressErrorState } from "./ProgressErrorState";
import { ProgressEmptyState } from "./ProgressEmptyState";

interface GameDetailPanelProps {
  games: GameOption[];
  selectedGameId: string | null;
  onSelectGame: (gameId: string) => void;
  history: GameHistory | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function GameDetailPanel({
  games,
  selectedGameId,
  onSelectGame,
  history,
  isLoading,
  error,
  onRetry,
}: GameDetailPanelProps) {
  return (
    <section
      aria-labelledby="game-detail-heading"
      className="rounded-xl border border-slate-200 bg-white p-6"
    >
      <h2
        id="game-detail-heading"
        className="text-2xl font-semibold text-slate-800"
      >
        Score and accuracy history
      </h2>
      <p className="mt-1 text-base text-slate-500">
        Choose a game to see how your game score and accuracy have changed
        over your recent sessions.
      </p>

      <div className="mt-4">
        <GameSelector
          games={games}
          selectedGameId={selectedGameId}
          onChange={onSelectGame}
        />
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {!selectedGameId && (
          <ProgressEmptyState
            title="No game selected"
            description="Choose a game above to view its score and accuracy history."
          />
        )}

        {selectedGameId && isLoading && <ProgressLoadingState label="Loading game history…" />}

        {selectedGameId && !isLoading && error && (
          <ProgressErrorState message={error} onRetry={onRetry} />
        )}

        {selectedGameId && !isLoading && !error && history && (
          <>
            <ScoreHistoryChart
              gameName={history.gameName}
              history={history.scoreHistory}
            />
            <AccuracyHistoryChart
              gameName={history.gameName}
              history={history.accuracyHistory}
            />
          </>
        )}
      </div>
    </section>
  );
}
