/**
 * client/src/games/engine/useGameEngine.ts
 *
 * A small state machine shared by every game. Each individual game does NOT
 * use this hook directly for its gameplay state — instead it composes it:
 * call `useGameClock()` for phase/timing, and keep game-specific state
 * (board, sequence, selections, correct/incorrect counts) in the game's own
 * hook. This keeps phase transitions and elapsed-time tracking identical
 * across all games, per the GameShell contract.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Difficulty, GamePhase } from "../../../../shared/types/game";

export interface GameClock {
  phase: GamePhase;
  difficulty: Difficulty | null;
  elapsedMs: number;
  /** Move to the difficulty-select screen (called when leaving instructions). */
  chooseDifficulty: () => void;
  /** Begin play at the given difficulty. */
  start: (difficulty: Difficulty) => void;
  /** Return to the instructions screen with a clean slate. */
  restart: () => void;
  pause: () => void;
  resume: () => void;
  /** Freeze the clock and move to the completed phase. */
  complete: () => void;
}

/**
 * useGameClock manages ONLY phase + elapsed time. Score/accuracy/board state
 * stay in each game's own hook so this stays reusable and free of
 * game-specific logic.
 */
export function useGameClock(): GameClock {
  const [phase, setPhase] = useState<GamePhase>("instructions");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startedAtRef = useRef<number | null>(null);
  const pausedAccumRef = useRef(0); // ms accumulated before the current run
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (startedAtRef.current === null) return;
    setElapsedMs(pausedAccumRef.current + (Date.now() - startedAtRef.current));
  }, []);

  const chooseDifficulty = useCallback(() => {
    setPhase("difficulty-select");
  }, []);

  const start = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      pausedAccumRef.current = 0;
      startedAtRef.current = Date.now();
      setElapsedMs(0);
      setPhase("playing");
      clearTick();
      intervalRef.current = setInterval(tick, 250);
    },
    [clearTick, tick]
  );

  const pause = useCallback(() => {
    if (phase !== "playing" || startedAtRef.current === null) return;
    pausedAccumRef.current += Date.now() - startedAtRef.current;
    startedAtRef.current = null;
    clearTick();
    setPhase("paused");
  }, [phase, clearTick]);

  const resume = useCallback(() => {
    if (phase !== "paused") return;
    startedAtRef.current = Date.now();
    setPhase("playing");
    clearTick();
    intervalRef.current = setInterval(tick, 250);
  }, [phase, clearTick, tick]);

  const complete = useCallback(() => {
    if (startedAtRef.current !== null) {
      pausedAccumRef.current += Date.now() - startedAtRef.current;
      startedAtRef.current = null;
    }
    clearTick();
    setElapsedMs(pausedAccumRef.current);
    setPhase("completed");
  }, [clearTick]);

  const restart = useCallback(() => {
    clearTick();
    startedAtRef.current = null;
    pausedAccumRef.current = 0;
    setElapsedMs(0);
    setDifficulty(null);
    setPhase("instructions");
  }, [clearTick]);

  useEffect(() => clearTick, [clearTick]);

  return {
    phase,
    difficulty,
    elapsedMs,
    chooseDifficulty,
    start,
    restart,
    pause,
    resume,
    complete,
  };
}
