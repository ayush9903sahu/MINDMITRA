import { GameShell } from "../engine/GameShell";
import { useMemoryMatchGame } from "./useMemoryMatchGame";
import { memoryMatchConfig } from "../../../../shared/constants/games";

export { memoryMatchConfig };

const GRID_COLUMNS: Record<number, string> = {
  6: "grid-cols-3",
  10: "grid-cols-4",
  15: "grid-cols-5",
};

export function MemoryMatchGame() {
  const { controller, onCardClick } = useMemoryMatchGame();

  return (
    <GameShell
      config={memoryMatchConfig}
      instructions={
        <p>
          Tap a card to flip it over. Tap a second card to see if it matches. Matching pairs
          stay face up. Try to find every pair using as few tries as you can.
        </p>
      }
      controller={controller}
      renderResultDetails={(result) => (
        <p>
          {result.details?.moves} moves · {result.details?.matchedPairs} of{" "}
          {result.details?.totalPairs} pairs found
        </p>
      )}
      renderPlayArea={() => {
        const state = controller.state;
        if (!state) return null;
        const columnsClass = GRID_COLUMNS[state.totalPairs] ?? "grid-cols-4";

        return (
          <div>
            <p className="text-lg text-slate-700 mb-4" aria-live="polite">
              Moves: {state.moves} · Pairs found: {state.matchedPairs} of {state.totalPairs}
            </p>
            <div className={`grid ${columnsClass} gap-3`}>
              {state.cards.map((card) => {
                const isFaceUp = card.isMatched || state.flippedIds.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    className={[
                      "aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center",
                      "border-2 transition-colors",
                      "focus-visible:outline focus-visible:outline-3 focus-visible:outline-blue-700",
                      isFaceUp
                        ? "bg-white border-slate-300"
                        : "bg-blue-700 border-blue-800 hover:bg-blue-800",
                      card.isMatched ? "opacity-60" : "",
                    ].join(" ")}
                    onClick={() => onCardClick(card.id)}
                    disabled={card.isMatched}
                    aria-label={
                      isFaceUp
                        ? `Card showing ${card.symbol}${card.isMatched ? ", matched" : ""}`
                        : "Face-down card"
                    }
                  >
                    {isFaceUp ? (
                      <span aria-hidden="true">{card.symbol}</span>
                    ) : (
                      <span className="sr-only">Face down</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
