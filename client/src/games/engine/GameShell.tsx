/**
 * client/src/games/engine/GameShell.tsx
 *
 * The single reusable "frame" every game renders inside. Owns:
 *  - instructions screen (with a "View instructions again" affordance)
 *  - difficulty selection
 *  - in-progress header (title, pause/restart, elapsed time)
 *  - completion screen + result submission to Module 4
 *
 * Individual games are responsible ONLY for `renderPlayArea`, i.e. the
 * actual board/sequence/grid, and for supplying a `GameController` from
 * their own hook (useMemoryMatchGame, useSequenceRecallGame, etc).
 *
 * Required from Module 1 (shared UI): Button, Card, DifficultySelector,
 * LoadingSpinner, ErrorMessage. Paths below assume
 * client/src/components/ui/<Component>.tsx — update the imports if Module 1
 * placed them elsewhere.
 */

import { useState, type ReactNode } from "react";
import { Pause, Play, RotateCcw, Info } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DifficultySelector } from "../../components/ui/DifficultySelector";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import type {
  Difficulty,
  GameConfig,
  GameController,
  GameResult,
} from "../../../../shared/types/game";
import { submitGameResult, GameResultSubmissionError } from "../../services/gameResultService";

interface GameShellProps<TResult extends GameResult> {
  config: GameConfig;
  /** Plain-language instructions; keep this short and concrete (per accessibility rules). */
  instructions: ReactNode;
  controller: GameController<TResult>;
  /** Renders the game's own board/sequence/grid while phase is "playing" or "paused". */
  renderPlayArea: (controller: GameController<TResult>) => ReactNode;
  /** Optional extra rows on the results screen, e.g. "Moves: 12". */
  renderResultDetails?: (result: TResult) => ReactNode;
}

export function GameShell<TResult extends GameResult>({
  config,
  instructions,
  controller,
  renderPlayArea,
  renderResultDetails,
}: GameShellProps<TResult>) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { phase, difficulty, elapsedMs } = controller;

  async function handleSubmit(result: TResult) {
    setSubmitState("submitting");
    setSubmitError(null);
    try {
      await submitGameResult(result);
      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setSubmitError(
        err instanceof GameResultSubmissionError
          ? err.message
          : "Something went wrong saving your result."
      );
    }
  }

  function handleRestart() {
    setSubmitState("idle");
    setSubmitError(null);
    controller.restart();
    setShowInstructions(true);
  }

  const elapsedLabel = formatElapsed(elapsedMs);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{config.name}</h1>
          <p className="text-lg text-slate-600 mt-1">{config.description}</p>
        </div>
        {phase === "playing" || phase === "paused" ? (
          <div className="text-xl font-medium text-slate-700 tabular-nums" aria-live="polite">
            {elapsedLabel}
          </div>
        ) : null}
      </header>

      {phase === "instructions" && showInstructions && (
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-7 h-7 text-blue-600 shrink-0" aria-hidden="true" />
            <div className="text-lg leading-relaxed text-slate-800">{instructions}</div>
          </div>
          <div className="mt-6">
            <Button size="lg" onClick={controller.beginDifficultySelection}>
              Continue
            </Button>
          </div>
        </Card>
      )}

      {phase === "difficulty-select" && (
        <Card className="p-6">
          <h2 className="text-2xl font-medium text-slate-900 mb-4">Choose a difficulty</h2>
          <DifficultySelector
            options={config.supportsDifficulty}
            onSelect={(d: Difficulty) => controller.startGame(d)}
          />
        </Card>
      )}

      {(phase === "playing" || phase === "paused") && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-slate-700 capitalize">
              {difficulty} difficulty
            </span>
            <div className="flex gap-2">
              {phase === "playing" ? (
                <Button
                  variant="secondary"
                  size="md"
                  aria-label="Pause game"
                  onClick={controller.pauseGame}
                >
                  <Pause className="w-5 h-5" aria-hidden="true" />
                  Pause
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  aria-label="Resume game"
                  onClick={controller.resumeGame}
                >
                  <Play className="w-5 h-5" aria-hidden="true" />
                  Resume
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                aria-label="Restart game"
                onClick={handleRestart}
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                Restart
              </Button>
            </div>
          </div>

          {phase === "paused" ? (
            <div className="py-16 text-center text-xl text-slate-600">
              Game paused. Press Resume to continue.
            </div>
          ) : (
            renderPlayArea(controller)
          )}
        </Card>
      )}

      {phase === "completed" && (
        <ResultsScreen
          controller={controller}
          submitState={submitState}
          submitError={submitError}
          onSubmit={handleSubmit}
          onRestart={handleRestart}
          renderResultDetails={renderResultDetails}
        />
      )}

      {phase !== "instructions" && (
        <div className="mt-4">
          <button
            type="button"
            className="text-base text-blue-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
            onClick={() => setShowInstructions(true)}
          >
            View instructions again
          </button>
          {showInstructions && phase !== "instructions" && (
            <Card className="p-6 mt-3">
              <div className="text-lg leading-relaxed text-slate-800">{instructions}</div>
              <div className="mt-4">
                <Button size="md" onClick={() => setShowInstructions(false)}>
                  Close
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsScreen<TResult extends GameResult>({
  controller,
  submitState,
  submitError,
  onSubmit,
  onRestart,
  renderResultDetails,
}: {
  controller: GameController<TResult>;
  submitState: "idle" | "submitting" | "success" | "error";
  submitError: string | null;
  onSubmit: (result: TResult) => void;
  onRestart: () => void;
  renderResultDetails?: (result: TResult) => ReactNode;
}) {
  const result = controller.getResult();

  // Auto-submit once, when the results screen first appears with a result.
  useAutoSubmitOnce(result, submitState, onSubmit);

  if (!result) {
    return (
      <Card className="p-6">
        <p className="text-lg text-slate-700">Calculating your results…</p>
      </Card>
    );
  }

  return (
    <Card className="p-6" role="status" aria-live="polite">
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">Well done!</h2>
      <dl className="grid grid-cols-2 gap-4 text-lg mb-4">
        <div>
          <dt className="text-slate-500">Score</dt>
          <dd className="text-2xl font-semibold text-slate-900">{result.score}</dd>
        </div>
        {result.accuracy !== undefined && (
          <div>
            <dt className="text-slate-500">Accuracy</dt>
            <dd className="text-2xl font-semibold text-slate-900">
              {Math.round(result.accuracy)}%
            </dd>
          </div>
        )}
        <div>
          <dt className="text-slate-500">Time</dt>
          <dd className="text-2xl font-semibold text-slate-900">
            {formatElapsed(result.durationSeconds * 1000)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Difficulty</dt>
          <dd className="text-2xl font-semibold text-slate-900 capitalize">
            {result.difficulty}
          </dd>
        </div>
      </dl>

      {renderResultDetails && (
        <div className="mb-4 text-base text-slate-700">{renderResultDetails(result)}</div>
      )}

      {submitState === "submitting" && (
        <div className="flex items-center gap-2 text-slate-600 mb-4">
          <LoadingSpinner size="sm" />
          <span>Saving your result…</span>
        </div>
      )}
      {submitState === "success" && (
        <p className="text-green-700 font-medium mb-4">Your result has been saved.</p>
      )}
      {submitState === "error" && submitError && (
        <div className="mb-4">
          <ErrorMessage message={submitError} />
          <Button className="mt-2" onClick={() => onSubmit(result)}>
            Try saving again
          </Button>
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <Button size="lg" onClick={onRestart}>
          Play again
        </Button>
      </div>
    </Card>
  );
}

function useAutoSubmitOnce<TResult extends GameResult>(
  result: TResult | null,
  submitState: "idle" | "submitting" | "success" | "error",
  onSubmit: (result: TResult) => void
) {
  // Uses a ref so we only fire once per completed game, even though this
  // component re-renders as submitState changes.
  const firedRef = useRefBoolean();
  if (result && submitState === "idle" && !firedRef.current) {
    firedRef.current = true;
    // fire after paint, outside of render
    queueMicrotask(() => onSubmit(result));
  }
}

function useRefBoolean() {
  const ref = { current: false };
  const [box] = useState(() => ref);
  return box;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
