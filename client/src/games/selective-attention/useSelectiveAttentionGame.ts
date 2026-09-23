import { useCallback, useEffect } from "react";
import { useGameController } from "../engine/createGameController";
import {
  allTargetsFound,
  calculateSelectiveAttentionAccuracy,
  calculateSelectiveAttentionScore,
  createInitialState,
  finalizeAttempt,
  selectCell,
  type SelectiveAttentionState,
} from "./selectiveAttentionLogic";
import type { GameResult } from "../../../../shared/types/game";

export interface SelectiveAttentionResult extends GameResult {
  gameId: "selective-attention";
}

export function useSelectiveAttentionGame() {
  const controller = useGameController<SelectiveAttentionState, SelectiveAttentionResult>({
    gameId: "selective-attention",
    createInitialState,
    calculateScore: calculateSelectiveAttentionScore,
    buildResult: ({ state, difficulty, durationSeconds }) => ({
      gameId: "selective-attention",
      difficulty,
      score: calculateSelectiveAttentionScore(state),
      accuracy: calculateSelectiveAttentionAccuracy(state),
      durationSeconds,
      completedAt: new Date().toISOString(),
      details: {
        correct: state.correctSelections,
        incorrect: state.incorrectSelections,
        missed: state.missedTargets,
        targetCount: state.targetCount,
      },
    }),
  });

  const onCellClick = useCallback(
    (cellId: number) => {
      if (controller.phase !== "playing" || !controller.state) return;
      controller.setState((prev) => selectCell(prev, cellId));
    },
    [controller]
  );

  const onFinish = useCallback(() => {
    controller.setState((prev) => finalizeAttempt(prev));
  }, [controller]);

  // Auto-finalize (tallying missed targets) once every target has been found.
  useEffect(() => {
    if (
      controller.phase === "playing" &&
      controller.state &&
      !controller.state.finished &&
      allTargetsFound(controller.state)
    ) {
      controller.setState((prev) => finalizeAttempt(prev));
    }
  }, [controller.phase, controller.state, controller]);

  // Once finalized, hand off to the shared clock's completed phase.
  useEffect(() => {
    if (controller.phase === "playing" && controller.state?.finished) {
      controller.finishGame();
    }
  }, [controller.phase, controller.state, controller]);

  return { controller, onCellClick, onFinish };
}
