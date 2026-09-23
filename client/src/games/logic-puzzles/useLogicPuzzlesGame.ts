import { useCallback, useEffect } from "react";
import { useGameController } from "../engine/createGameController";
import {
  calculateLogicPuzzlesAccuracy,
  calculateLogicPuzzlesScore,
  continueToNext,
  createInitialState,
  isGameComplete,
  selectOption,
  type LogicPuzzleState,
} from "./logicPuzzleLogic";
import type { GameResult } from "../../../../shared/types/game";
import type { LogicPuzzleSessionMetadata } from "../../../../shared/types/logicPuzzle";

export interface LogicPuzzlesResult extends GameResult {
  gameId: "logic-puzzles";
}

export function useLogicPuzzlesGame() {
  const controller = useGameController<LogicPuzzleState, LogicPuzzlesResult>({
    gameId: "logic-puzzles",
    createInitialState,
    calculateScore: calculateLogicPuzzlesScore,
    buildResult: ({ state, difficulty, durationSeconds }) => {
      const metadata: LogicPuzzleSessionMetadata = {
        questionsAttempted: state.answers.length,
        correctAnswers: state.answers.filter((answer) => answer.correct).length,
        answers: state.answers,
      };
      return {
        gameId: "logic-puzzles",
        difficulty,
        score: calculateLogicPuzzlesScore(state),
        accuracy: calculateLogicPuzzlesAccuracy(state),
        durationSeconds,
        completedAt: new Date().toISOString(),
        details: metadata,
      };
    },
  });

  const onSelectOption = useCallback(
    (optionId: string) => {
      controller.setState((prev) => selectOption(prev, optionId));
    },
    [controller]
  );

  const onContinue = useCallback(() => {
    controller.setState((prev) => continueToNext(prev));
  }, [controller]);

  // Auto-finish once the final question has been answered and recorded.
  useEffect(() => {
    if (controller.phase === "playing" && controller.state && isGameComplete(controller.state)) {
      controller.finishGame();
    }
  }, [controller.phase, controller.state, controller]);

  return { controller, onSelectOption, onContinue };
}
