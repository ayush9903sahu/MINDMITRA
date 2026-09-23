import { Circle, Diamond, Square, Star, Triangle } from "lucide-react";
import { GameShell } from "../engine/GameShell";
import { Button } from "../../components/ui/Button";
import { usePatternRecognitionGame } from "./usePatternRecognitionGame";
import type { PatternItem, PatternShape, PatternColor } from "./patternRecognitionLogic";
import { patternRecognitionConfig } from "../../../../shared/constants/games";

export { patternRecognitionConfig };

const SHAPE_ICONS: Record<PatternShape, typeof Circle> = {
  circle: Circle,
  triangle: Triangle,
  square: Square,
  star: Star,
  diamond: Diamond,
};

const COLOR_CLASSES: Record<PatternColor, string> = {
  blue: "text-blue-700",
  green: "text-green-700",
  orange: "text-orange-600",
  purple: "text-purple-700",
};

function PatternIcon({ item, size = 40 }: { item: PatternItem; size?: number }) {
  const Icon = SHAPE_ICONS[item.shape];
  return (
    <Icon
      width={size}
      height={size}
      className={COLOR_CLASSES[item.color]}
      strokeWidth={2}
      aria-hidden="true"
      fill="currentColor"
      fillOpacity={0.15}
    />
  );
}

function describeItem(item: PatternItem): string {
  return `${item.color} ${item.shape}`;
}

export function PatternRecognitionGame() {
  const { controller, onSelect, onContinue } = usePatternRecognitionGame();

  return (
    <GameShell
      config={patternRecognitionConfig}
      instructions={
        <p>
          Look at the pattern of shapes. One shape is missing at the end, shown as a question
          mark. Choose the option that continues the pattern correctly.
        </p>
      }
      controller={controller}
      renderResultDetails={(result) => (
        <p>
          {result.details?.correct} correct · {result.details?.incorrect} incorrect out of{" "}
          {result.details?.rounds} rounds
        </p>
      )}
      renderPlayArea={() => {
        const state = controller.state;
        if (!state) return null;
        const { sequence, options, correctIndex } = state.current;
        const answered = state.roundPhase === "feedback";

        return (
          <div>
            <p className="text-lg text-slate-700 mb-4" aria-live="polite">
              Round {state.round} of {state.totalRounds}
            </p>

            <div
              className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl"
              role="list"
              aria-label="Pattern sequence"
            >
              {sequence.map((item, i) => (
                <div key={i} role="listitem" aria-label={describeItem(item)}>
                  <PatternIcon item={item} />
                </div>
              ))}
              <div
                className="w-10 h-10 flex items-center justify-center text-2xl font-bold text-slate-500 border-2 border-dashed border-slate-400 rounded-lg"
                aria-label="What comes next?"
              >
                ?
              </div>
            </div>

            <p className="text-lg font-medium text-slate-800 mb-3">What comes next?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {options.map((option, index) => {
                const isSelected = state.selectedOptionIndex === index;
                const isCorrectOption = index === correctIndex;
                let stateClasses = "bg-white border-slate-300 hover:bg-slate-50";
                if (answered && isCorrectOption) {
                  stateClasses = "bg-green-50 border-green-600";
                } else if (answered && isSelected && !isCorrectOption) {
                  stateClasses = "bg-red-50 border-red-600";
                }
                return (
                  <button
                    key={index}
                    type="button"
                    className={`aspect-square rounded-xl border-2 flex items-center justify-center focus-visible:outline focus-visible:outline-3 focus-visible:outline-blue-700 ${stateClasses}`}
                    onClick={() => onSelect(index)}
                    disabled={answered}
                    aria-label={describeItem(option)}
                  >
                    <PatternIcon item={option} size={36} />
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="text-center" role="status" aria-live="polite">
                <p
                  className={`text-xl font-semibold mb-4 ${
                    state.selectedOptionIndex === correctIndex ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {state.selectedOptionIndex === correctIndex
                    ? "Correct!"
                    : `Not quite — the answer was a ${describeItem(options[correctIndex])}.`}
                </p>
                <Button size="lg" onClick={onContinue}>
                  {state.round >= state.totalRounds ? "See results" : "Next pattern"}
                </Button>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
