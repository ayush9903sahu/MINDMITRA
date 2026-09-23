import type { GameOption } from "../../types/progress";

interface GameSelectorProps {
  games: GameOption[];
  selectedGameId: string | null;
  onChange: (gameId: string) => void;
}

export function GameSelector({
  games,
  selectedGameId,
  onChange,
}: GameSelectorProps) {
  return (
    <div className="flex flex-col gap-1 sm:max-w-xs">
      <label
        htmlFor="game-history-select"
        className="text-base font-medium text-slate-700"
      >
        Inspect a game's history
      </label>
      <select
        id="game-history-select"
        value={selectedGameId ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-lg text-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
      >
        <option value="" disabled>
          Choose a game…
        </option>
        {games.map((game) => (
          <option key={game.id} value={game.id}>
            {game.name}
          </option>
        ))}
      </select>
    </div>
  );
}
