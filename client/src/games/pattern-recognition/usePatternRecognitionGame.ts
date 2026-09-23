import { useCallback, useEffect } from "react";
import { useGameController } from "../engine/createGameController";
import {
  calculatePatternAccuracy,
  calculatePatternScore,
  createInitialState,
  isGameComplete,
  nextRound,
  selectOption,
  type PatternRecognitionState,
} from "./patternRecognitionLogic";
import type { GameResult } from "../../../../shared/types/game";

export interface PatternRecognitionResult extends GameResult {
  gameId: "pattern-recognition";
}

export function usePatternRecognitionGame() {
  const controller = useGameController<PatternRecognitionState, PatternRecognitionResult>({
    gameId: "pattern-recognition",
    createInitialState,
    calculateScore: calculatePatternScore,
    buildResult: ({ state, difficulty, durationSeconds }) => ({
      gameId: "pattern-recognition",
      difficulty,
      score: calculatePatternScore(state),
      accuracy: calculatePatternAccuracy(state),
      durationSeconds,
      completedAt: new Date().toISOString(),
      details: {
        correct: state.correctCount,
        incorrect: state.incorrectCount,
        rounds: state.totalRounds,
      },
    }),
  });

  const onSelect = useCallback(
    (optionIndex: number) => {
      controller.setState((prev) => selectOption(prev, optionIndex));
    },
    [controller]
  );

  const onContinue = useCallback(() => {
    if (!controller.difficulty) return;
    const difficulty = controller.difficulty;
    controller.setState((prev) => nextRound(prev, difficulty));
  }, [controller]);

  useEffect(() => {
    if (controller.phase === "playing" && controller.state && isGameComplete(controller.state)) {
      controller.finishGame();
    }
  }, [controller.phase, controller.state, controller]);

  return { controller, onSelect, onContinue };
}
