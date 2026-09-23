import { Circle, Diamond, Heart, Square, Star, Triangle } from "lucide-react";
import { GameShell } from "../engine/GameShell";
import { Button } from "../../components/ui/Button";
import { useSelectiveAttentionGame } from "./useSelectiveAttentionGame";
import type { AttentionSymbol } from "./selectiveAttentionLogic";
import { allTargetsFound } from "./selectiveAttentionLogic";
import { selectiveAttentionConfig } from "../../../../shared/constants/games";

export { selectiveAttentionConfig };

const SYMBOL_ICONS: Record<AttentionSymbol, typeof Circle> = {
  star: Star,
  circle: Circle,
  triangle: Triangle,
  square: Square,
  diamond: Diamond,
  heart: Heart,
};

function SymbolIcon({ symbol, size = 28 }: { symbol: AttentionSymbol; size?: number }) {
  const Icon = SYMBOL_ICONS[symbol];
  return <Icon width={size} height={size} aria-hidden="true" strokeWidth={2} />;
}

export function SelectiveAttentionGame() {
  const { controller, onCellClick, onFinish } = useSelectiveAttentionGame();

  return (
    <GameShell
      config={selectiveAttentionConfig}
      instructions={
        <p>
          A grid of symbols will appear. One symbol is the target — find and tap every one you
          can see among the other shapes. There is no time limit, so take the time you need. Tap
          "I'm done" once you believe you've found them all.
        </p>
      }
      controller={controller}
      renderResultDetails={(result) => (
        <p>
          {result.details?.correct} found · {result.details?.missed} missed ·{" "}
          {result.details?.incorrect} incorrect taps
        </p>
      )}
      renderPlayArea={() => {
        const state = controller.state;
        if (!state) return null;
        const gridSize = Math.round(Math.sqrt(state.cells.length));
        const foundCount = state.cells.filter((c) => c.isTarget && c.isSelected).length;

        return (
          <div>
            <div className="flex items-center gap-3 mb-4 text-lg text-slate-800">
              <span>Find every</span>
              <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                <SymbolIcon symbol={state.target} size={24} /> {state.target}
              </span>
            </div>
            <p className="text-base text-slate-600 mb-4" aria-live="polite">
              Found {foundCount} of {state.targetCount}
            </p>

            <div
              className="grid gap-2 mb-6"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              role="grid"
              aria-label={`Grid of symbols, find every ${state.target}`}
            >
              {state.cells.map((cell) => (
                <button
                  key={cell.id}
                  type="button"
                  role="gridcell"
                  className={[
                    "aspect-square rounded-lg border-2 flex items-center justify-center",
                    "focus-visible:outline focus-visible:outline-3 focus-visible:outline-blue-700",
                    cell.isSelected
                      ? cell.isTarget
                        ? "bg-green-100 border-green-600 text-green-800"
                        : "bg-red-50 border-red-400 text-red-700"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => onCellClick(cell.id)}
                  aria-label={`${cell.symbol}${cell.isSelected ? ", selected" : ""}`}
                  aria-pressed={cell.isSelected}
                >
                  <SymbolIcon symbol={cell.symbol} />
                </button>
              ))}
            </div>

            {!allTargetsFound(state) && (
              <Button size="lg" onClick={onFinish}>
                I'm done
              </Button>
            )}
          </div>
        );
      }}
    />
  );
}
