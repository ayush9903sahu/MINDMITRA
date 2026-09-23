import { CheckCircle2, XCircle } from "lucide-react";
import { GameShell } from "../engine/GameShell";
import { Button } from "../../components/ui/Button";
import { useLogicPuzzlesGame } from "./useLogicPuzzlesGame";
import { currentQuestion, isSelectionCorrect } from "./logicPuzzleLogic";
import { logicPuzzlesConfig } from "../../../../shared/constants/games";

export { logicPuzzlesConfig };

const INSTRUCTIONS = (
  <div>
    <p className="mb-3">
      You will see a short series of puzzles. Each puzzle has one correct answer. Types of
      puzzles include:
    </p>
    <ul className="mb-3 list-disc space-y-1 pl-6">
      <li>Finding the item that does not belong</li>
      <li>Finding the next number in a sequence</li>
      <li>Choosing the correctly ordered list</li>
      <li>Matching two related words</li>
    </ul>
    <p>
      Read each question, then select your answer. There is no time limit — take as long as you
      like on each question.
    </p>
  </div>
);

export function LogicPuzzlesGame() {
  const { controller, onSelectOption, onContinue } = useLogicPuzzlesGame();

  return (
    <GameShell
      config={logicPuzzlesConfig}
      instructions={INSTRUCTIONS}
      controller={controller}
      renderResultDetails={(result) => (
        <p>
          {result.details && typeof result.details.correctAnswers === "number"
            ? `${result.details.correctAnswers} of ${result.details.questionsAttempted} correct`
            : null}
        </p>
      )}
      renderPlayArea={() => {
        const state = controller.state;
        if (!state) return null;

        const question = currentQuestion(state);
        if (!question) return null;

        const feedback = state.phase === "feedback" ? (isSelectionCorrect(state) ? "correct" : "incorrect") : null;
        const isLastQuestion = state.currentIndex === state.questions.length - 1;

        return (
          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">
              Question {state.currentIndex + 1} of {state.questions.length}
            </p>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">{question.prompt}</h2>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {question.options.map((option) => {
                const isSelected = option.id === state.selectedOptionId;
                const isCorrectOption = option.id === question.correctOptionId;

                let stateClasses =
                  "border-slate-300 bg-white hover:border-blue-600 hover:bg-blue-50";
                if (feedback && isSelected && feedback === "correct") {
                  stateClasses = "border-green-600 bg-green-50";
                } else if (feedback && isSelected && feedback === "incorrect") {
                  stateClasses = "border-red-600 bg-red-50";
                } else if (feedback && isCorrectOption) {
                  stateClasses = "border-green-600 bg-green-50";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => onSelectOption(option.id)}
                    className={`flex items-center justify-between rounded-xl border-2 px-6 py-5 text-left
                                text-lg font-medium text-slate-800 shadow-sm transition-colors
                                focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-500
                                disabled:cursor-default ${stateClasses}`}
                  >
                    <span>{option.label}</span>
                    {feedback && isCorrectOption && (
                      <CheckCircle2 className="h-6 w-6 text-green-700" aria-hidden="true" />
                    )}
                    {feedback === "incorrect" && isSelected && !isCorrectOption && (
                      <XCircle className="h-6 w-6 text-red-700" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div aria-live="polite">
                <p
                  className={`mb-4 text-lg font-semibold ${
                    feedback === "correct" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {feedback === "correct"
                    ? "Correct!"
                    : "Not quite — the correct answer is highlighted."}
                </p>
                <Button size="lg" onClick={onContinue}>
                  {isLastQuestion ? "See Results" : "Next Question"}
                </Button>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

export default LogicPuzzlesGame;
