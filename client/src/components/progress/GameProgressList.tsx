import type { GameProgress } from "../../types/progress";
import { GameProgressCard } from "./GameProgressCard";
import { ProgressEmptyState } from "./ProgressEmptyState";

interface GameProgressListProps {
  games: GameProgress[];
  selectedGameId: string | null;
  onSelectGame: (gameId: string) => void;
}

export function GameProgressList({
  games,
  selectedGameId,
  onSelectGame,
}: GameProgressListProps) {
  return (
    <section aria-labelledby="game-progress-heading">
      <h2
        id="game-progress-heading"
        className="text-2xl font-semibold text-slate-800"
      >
        Game-by-game progress
      </h2>
      <p className="mt-1 text-base text-slate-500">
        Select a game to see its detailed score and accuracy history below.
      </p>

      {games.length === 0 ? (
        <div className="mt-4">
          <ProgressEmptyState
            title="No games played yet"
            description="Once you complete a cognitive exercise, its progress will show up here."
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {games.map((game) => (
            <GameProgressCard
              key={game.gameId}
              game={game}
              isSelected={game.gameId === selectedGameId}
              onSelect={onSelectGame}
            />
          ))}
        </div>
      )}
    </section>
  );
}
