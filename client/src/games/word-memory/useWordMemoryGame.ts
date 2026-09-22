import { useCallback, useEffect, useRef } from "react";
import { useGameController } from "../engine/createGameController";
import {
  calculateWordMemoryAccuracy,
  calculateWordMemoryScore,
  createInitialState,
  isGameComplete,
  submitSelections,
  tickMemorizeClock,
  toggleWord,
  type WordMemoryState,
} from "./wordMemoryLogic";
import type { GameResult } from "../../../../shared/types/game";
import type { WordMemorySessionMetadata } from "../../../../shared/types/wordMemory";

export interface WordMemoryResult extends GameResult {
  gameId: "word-memory";
}

export function useWordMemoryGame() {
  const controller = useGameController<WordMemoryState, WordMemoryResult>({
    gameId: "word-memory",
    createInitialState,
    calculateScore: calculateWordMemoryScore,
    buildResult: ({ state, difficulty, durationSeconds }) => {
      const metadata: WordMemorySessionMetadata = {
        targetWords: state.round.targetWords,
        distractorWords: state.round.distractorWords,
        selectedWords: state.round.selectableWords
          .filter((word) => state.selectedIds.includes(word.id))
          .map((word) => word.word),
        correctSelections: state.correctSelections,
        falseSelections: state.falseSelections,
        missedWords: state.missedWords,
      };
      return {
        gameId: "word-memory",
        difficulty,
        score: calculateWordMemoryScore(state),
        accuracy: calculateWordMemoryAccuracy(state),
        durationSeconds,
        completedAt: new Date().toISOString(),
        details: metadata,
      };
    },
  });

  // The memorize countdown ticks independently of the shell's elapsed-time
  // clock (which keeps running for scoring purposes throughout the round).
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const inMemorizePhase =
      controller.phase === "playing" && controller.state?.phase === "memorize";

    if (!inMemorizePhase) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      controller.setState((prev) => tickMemorizeClock(prev));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller.phase, controller.state?.phase]);

  const onToggleWord = useCallback(
    (id: string) => {
      controller.setState((prev) => toggleWord(prev, id));
    },
    [controller]
  );

  const onSubmit = useCallback(() => {
    controller.setState((prev) => submitSelections(prev));
  }, [controller]);

  // Auto-finish once the player has submitted their selections.
  useEffect(() => {
    if (controller.phase === "playing" && controller.state && isGameComplete(controller.state)) {
      controller.finishGame();
    }
  }, [controller.phase, controller.state, controller]);

  return { controller, onToggleWord, onSubmit };
}
