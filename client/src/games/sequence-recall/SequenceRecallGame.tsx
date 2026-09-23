import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { GameShell } from "../engine/GameShell";
import { Button } from "../../components/ui/Button";
import { useSequenceRecallGame } from "./useSequenceRecallGame";
import { sequenceRecallConfig } from "../../../../shared/constants/games";

export { sequenceRecallConfig };

const DISPLAY_MS_PER_DIGIT = 900;

export function SequenceRecallGame() {
  const { controller, onSequenceFinishedShowing, onDigitTap, onClear, onSubmit, onContinue } =
    useSequenceRecallGame();

  return (
    <GameShell
      config={sequenceRecallConfig}
      instructions={
        <p>
          Watch the numbers appear one at a time. Once they stop, tap the numbers back in the
          same order you saw them. The sequence gets one number longer each round. You can
          replay the sequence display at any time using the button on screen.
        </p>
      }
      controller={controller}
      renderResultDetails={(result) => (
        <p>
          {result.details?.correctRounds} correct · {result.details?.incorrectRounds} missed ·
          longest sequence {result.details?.longestSequence}
        </p>
      )}
      renderPlayArea={() => {
        const state = controller.state;
        if (!state) return null;
        return (
          <SequencePlayArea
            key={state.round}
            sequence={state.sequence}
            userInput={state.userInput}
            recallPhase={state.recallPhase}
            round={state.round}
            totalRounds={state.totalRounds}
            lastRoundCorrect={state.lastRoundCorrect}
            onSequenceFinishedShowing={onSequenceFinishedShowing}
            onDigitTap={onDigitTap}
            onClear={onClear}
            onSubmit={onSubmit}
            onContinue={onContinue}
          />
        );
      }}
    />
  );
}

interface PlayAreaProps {
  sequence: number[];
  userInput: number[];
  recallPhase: "showing" | "input" | "feedback";
  round: number;
  totalRounds: number;
  lastRoundCorrect: boolean | null;
  onSequenceFinishedShowing: () => void;
  onDigitTap: (digit: number) => void;
  onClear: () => void;
  onSubmit: () => void;
  onContinue: () => void;
}

function SequencePlayArea({
  sequence,
  userInput,
  recallPhase,
  round,
  totalRounds,
  lastRoundCorrect,
  onSequenceFinishedShowing,
  onDigitTap,
  onClear,
  onSubmit,
  onContinue,
}: PlayAreaProps) {
  const [displayIndex, setDisplayIndex] = useState(-1);

  function playSequence() {
    setDisplayIndex(-1);
    sequence.forEach((_, i) => {
      setTimeout(() => setDisplayIndex(i), i * DISPLAY_MS_PER_DIGIT);
    });
    setTimeout(() => {
      setDisplayIndex(-1);
      onSequenceFinishedShowing();
    }, sequence.length * DISPLAY_MS_PER_DIGIT + 400);
  }

  // Play automatically at the start of every round.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    playSequence();
  }, []);

  return (
    <div>
      <p className="text-lg text-slate-700 mb-4" aria-live="polite">
        Round {round} of {totalRounds}
      </p>

      {recallPhase === "showing" && (
        <div className="py-16 flex flex-col items-center gap-4">
          <div
            className="w-32 h-32 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-6xl font-bold"
            aria-live="assertive"
          >
            {displayIndex >= 0 ? sequence[displayIndex] : ""}
          </div>
          <p className="text-lg text-slate-600">Watch closely…</p>
        </div>
      )}

      {recallPhase === "input" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2" aria-live="polite" aria-label="Your answer so far">
              {sequence.map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg border-2 border-slate-400 flex items-center justify-center text-2xl font-semibold text-slate-900"
                >
                  {userInput[i] ?? ""}
                </div>
              ))}
            </div>
            <Button variant="secondary" size="md" onClick={playSequence}>
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              Replay
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-xs">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((digit) => (
              <button
                key={digit}
                type="button"
                className="aspect-square rounded-xl text-2xl font-semibold bg-white border-2 border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-blue-700"
                onClick={() => onDigitTap(digit)}
                disabled={userInput.length >= sequence.length}
                aria-label={`Number ${digit}`}
              >
                {digit}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="secondary" size="md" onClick={onClear}>
              Clear
            </Button>
            <Button
              size="md"
              onClick={onSubmit}
              disabled={userInput.length !== sequence.length}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {recallPhase === "feedback" && (
        <div className="py-10 text-center" role="status" aria-live="polite">
          <p
            className={`text-2xl font-semibold mb-2 ${
              lastRoundCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            {lastRoundCorrect ? "Correct!" : "Not quite."}
          </p>
          <p className="text-lg text-slate-600 mb-6">
            The sequence was: {sequence.join(" → ")}
          </p>
          <Button size="lg" onClick={onContinue}>
            {round >= totalRounds ? "See results" : "Next round"}
          </Button>
        </div>
      )}
    </div>
  );
}
