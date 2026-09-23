import { useCallback, useEffect } from "react";
import { useGameController } from "../engine/createGameController";
import {
  addDigit,
  beginInput,
  calculateSequenceRecallAccuracy,
  calculateSequenceRecallScore,
  clearInput,
  createInitialState,
  isGameComplete,
  isInputComplete,
  nextRound,
  submitAnswer,
  type SequenceRecallState,
} from "./sequenceRecallLogic";
import type { GameResult } from "../../../../shared/types/game";

export interface SequenceRecallResult extends GameResult {
  gameId: "sequence-recall";
}

export function useSequenceRecallGame() {
  const controller = useGameController<SequenceRecallState, SequenceRecallResult>({
    gameId: "sequence-recall",
    createInitialState,
    calculateScore: calculateSequenceRecallScore,
    buildResult: ({ state, difficulty, durationSeconds }) => ({
      gameId: "sequence-recall",
      difficulty,
      score: calculateSequenceRecallScore(state),
      accuracy: calculateSequenceRecallAccuracy(state),
      durationSeconds,
      completedAt: new Date().toISOString(),
      details: {
        correctRounds: state.correctRounds,
        incorrectRounds: state.incorrectRounds,
        longestSequence: state.sequence.length,
      },
    }),
  });

  const onSequenceFinishedShowing = useCallback(() => {
    controller.setState((prev) => beginInput(prev));
  }, [controller]);

  const onDigitTap = useCallback(
    (digit: number) => {
      controller.setState((prev) => addDigit(prev, digit));
    },
    [controller]
  );

  const onClear = useCallback(() => {
    controller.setState((prev) => clearInput(prev));
  }, [controller]);

  const onSubmit = useCallback(() => {
    controller.setState((prev) => (isInputComplete(prev) ? submitAnswer(prev) : prev));
  }, [controller]);

  const onContinue = useCallback(() => {
    controller.setState((prev) => nextRound(prev));
  }, [controller]);

  // Auto-finish once the configured number of rounds has been played.
  useEffect(() => {
    if (controller.phase === "playing" && controller.state && isGameComplete(controller.state)) {
      controller.finishGame();
    }
  }, [controller.phase, controller.state, controller]);

  return { controller, onSequenceFinishedShowing, onDigitTap, onClear, onSubmit, onContinue };
}
