/**
 * client/src/games/engine/createGameController.ts
 *
 * Combines useGameClock (phase + elapsed time, shared by all games) with a
 * single piece of game-specific state to produce a full GameController
 * matching the shared interface: startGame, restartGame, pauseGame,
 * finishGame, calculateScore, getResult (+ beginDifficultySelection,
 * resumeGame for the shell's pause/resume UI).
 *
 * Each game's own hook (e.g. useMemoryMatchGame) calls this once and then
 * layers game-specific actions (flipCard, submitGuess, ...) on top of the
 * returned `state`/`setState`.
 */

import { useCallback, useRef, useState } from "react";
import { useGameClock } from "./useGameEngine";
import type {
  Difficulty,
  GameController,
  GameId,
  GameResult,
} from "../../../../shared/types/game";

export interface GameControllerConfig<TState, TResult extends GameResult> {
  gameId: GameId;
  /** Builds fresh game-specific state at the start of a run (e.g. a shuffled board). */
  createInitialState: (difficulty: Difficulty) => TState;
  /** Pure function from the current state to a numeric score. */
  calculateScore: (state: TState) => number;
  /** Builds the final GameResult once the game has completed. */
  buildResult: (args: {
    state: TState;
    score: number;
    difficulty: Difficulty;
    durationSeconds: number;
  }) => TResult;
  /** Given the current state, should the game auto-complete (e.g. all pairs matched)? */
  isFinished?: (state: TState) => boolean;
}

export interface GameControllerWithState<TState, TResult extends GameResult>
  extends GameController<TResult> {
  state: TState;
  setState: (updater: TState | ((prev: TState) => TState)) => void;
}

export function useGameController<TState, TResult extends GameResult>(
  config: GameControllerConfig<TState, TResult>
): GameControllerWithState<TState, TResult> {
  const clock = useGameClock();
  const [state, setState] = useState<TState | null>(null);
  const resultRef = useRef<TResult | null>(null);

  const beginDifficultySelection = useCallback(() => {
    clock.chooseDifficulty();
  }, [clock]);

  const startGame = useCallback(
    (difficulty: Difficulty) => {
      resultRef.current = null;
      setState(config.createInitialState(difficulty));
      clock.start(difficulty);
    },
    [clock, config]
  );

  const restartGame = useCallback(() => {
    resultRef.current = null;
    setState(null);
    clock.restart();
  }, [clock]);

  const finishGame = useCallback(() => {
    clock.complete();
  }, [clock]);

  const calculateScore = useCallback(() => {
    if (state === null) return 0;
    return config.calculateScore(state);
  }, [state, config]);

  const getResult = useCallback((): TResult | null => {
    if (resultRef.current) return resultRef.current;
    if (state === null || clock.difficulty === null) return null;
    const score = config.calculateScore(state);
    const durationSeconds = Math.round(clock.elapsedMs / 1000);
    const result = config.buildResult({
      state,
      score,
      difficulty: clock.difficulty,
      durationSeconds,
    });
    resultRef.current = result;
    return result;
  }, [state, clock.difficulty, clock.elapsedMs, config]);

  return {
    phase: clock.phase,
    difficulty: clock.difficulty,
    elapsedMs: clock.elapsedMs,
    state: state as TState,
    setState: setState as (updater: TState | ((prev: TState) => TState)) => void,
    beginDifficultySelection,
    startGame,
    restartGame,
    pauseGame: clock.pause,
    resumeGame: clock.resume,
    finishGame,
    calculateScore,
    getResult,
  };
}
