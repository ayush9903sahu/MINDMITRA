import { GameShell } from "../engine/GameShell";
import { Button } from "../../components/ui/Button";
import { useWordMemoryGame } from "./useWordMemoryGame";
import { wordMemoryConfig } from "../../../../shared/constants/games";

export { wordMemoryConfig };

const INSTRUCTIONS = (
  <div>
    <p className="mb-3">
      A short list of words will appear on the screen. Try to remember as many of them as you
      can.
    </p>
    <p className="mb-3">
      After the list disappears, you will see a larger set of words. Select every word you
      remember from the original list. Some words in the larger set were not shown before — try
      not to pick those.
    </p>
    <p>Take as much time as you need when selecting words.</p>
  </div>
);

export function WordMemoryGame() {
  const { controller, onToggleWord, onSubmit } = useWordMemoryGame();

  return (
    <GameShell
      config={wordMemoryConfig}
      instructions={INSTRUCTIONS}
      controller={controller}
      renderResultDetails={(result) => (
        <p>
          {result.details && typeof result.details.correctSelections === "number"
            ? `${result.details.correctSelections} remembered correctly`
            : null}
          {result.details && typeof result.details.falseSelections === "number"
            ? ` · ${result.details.falseSelections} incorrect picks`
            : null}
          {result.details && typeof result.details.missedWords === "number"
            ? ` · ${result.details.missedWords} missed`
            : null}
        </p>
      )}
      renderPlayArea={() => {
        const state = controller.state;
        if (!state) return null;

        if (state.phase === "memorize") {
          return (
            <div>
              <p className="mb-4 text-lg text-slate-700" aria-live="polite">
                Memorize these words. They will disappear in {state.secondsLeft} second
                {state.secondsLeft === 1 ? "" : "s"}.
              </p>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {state.round.targetWords.map((word) => (
                  <li
                    key={word}
                    className="rounded-xl border-2 border-slate-300 bg-white px-4 py-6 text-center
                               text-2xl font-semibold text-slate-900 shadow-sm"
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <div>
            <p className="mb-6 text-lg text-slate-700">
              Select every word you remember from the list. Take your time.
            </p>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {state.round.selectableWords.map((item) => {
                const isSelected = state.selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={state.submitted}
                    onClick={() => onToggleWord(item.id)}
                    className={`rounded-xl border-2 px-4 py-6 text-center text-xl font-semibold shadow-sm
                                transition-colors focus-visible:outline focus-visible:outline-4
                                focus-visible:outline-blue-500 disabled:cursor-default ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-100 text-blue-900"
                                    : "border-slate-300 bg-white text-slate-800 hover:border-blue-500 hover:bg-blue-50"
                                }`}
                  >
                    {item.word}
                    {isSelected && <span className="sr-only"> (selected)</span>}
                  </button>
                );
              })}
            </div>
            <Button size="lg" onClick={onSubmit} disabled={state.submitted}>
              Submit Answers
            </Button>
          </div>
        );
      }}
    />
  );
}

export default WordMemoryGame;
