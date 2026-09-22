import { useCallback, useEffect, useRef } from "react";
import { useGameController } from "../engine/createGameController";
import {
  calculateMemoryMatchAccuracy,
  calculateMemoryMatchScore,
  createInitialState,
  flipCard,
  isBoardComplete,
  resolveMismatch,
  type MemoryMatchState,
} from "./memoryMatchLogic";
import type { GameResult } from "../../../../shared/types/game";

export interface MemoryMatchResult extends GameResult {
  gameId: "memory-match";
}

export function useMemoryMatchGame() {
  const controller = useGameController<MemoryMatchState, MemoryMatchResult>({
    gameId: "memory-match",
    createInitialState,
    calculateScore: (state) => calculateMemoryMatchScore(state, 0),
    buildResult: ({ state, difficulty, durationSeconds }) => ({
      gameId: "memory-match",
      difficulty,
      score: calculateMemoryMatchScore(state, durationSeconds),
      accuracy: calculateMemoryMatchAccuracy(state),
      durationSeconds,
      completedAt: new Date().toISOString(),
      details: {
        moves: state.moves,
        matchedPairs: state.matchedPairs,
        totalPairs: state.totalPairs,
      },
    }),
  });

  const mismatchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCardClick = useCallback(
    (cardId: number) => {
      if (controller.phase !== "playing" || !controller.state) return;
      const next = flipCard(controller.state, cardId);
      controller.setState(next);

      if (next.flippedIds.length === 2) {
        const [a, b] = next.flippedIds;
        const stillMismatched = a !== undefined && b !== undefined;
        if (stillMismatched) {
          if (mismatchTimeout.current) clearTimeout(mismatchTimeout.current);
          mismatchTimeout.current = setTimeout(() => {
            controller.setState((prev) => resolveMismatch(prev));
          }, 900);
        }
      }
    },
    [controller]
  );

  // Auto-finish once every pair is matched.
  useEffect(() => {
    if (controller.phase === "playing" && controller.state && isBoardComplete(controller.state)) {
      controller.finishGame();
    }
  }, [controller.phase, controller.state, controller]);

  useEffect(() => {
    return () => {
      if (mismatchTimeout.current) clearTimeout(mismatchTimeout.current);
    };
  }, []);

  return { controller, onCardClick };
}
