/**
 * client/src/games/word-memory/wordMemoryLogic.ts
 *
 * Pure logic for Word Memory: show a short word list to memorize, then ask
 * the player to pick those words out of a larger set. Word generation
 * itself lives in `wordBank.ts` (unchanged from the original module); this
 * file owns the game's phase/score/accuracy state so it can plug into the
 * shared `useGameController` engine the same way the other five games do.
 */

import type { Difficulty } from "../../../../shared/types/game";
import { DIFFICULTY_SETTINGS, generateWordMemoryRound, type WordMemoryRoundData } from "./wordBank";

export type WordMemoryPhase = "memorize" | "select";

export interface WordMemoryState {
  phase: WordMemoryPhase;
  round: WordMemoryRoundData;
  secondsLeft: number;
  selectedIds: string[];
  correctSelections: number;
  falseSelections: number;
  missedWords: number;
  /** True once the player has submitted their selections for this round. */
  submitted: boolean;
}

export function createInitialState(difficulty: Difficulty): WordMemoryState {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  return {
    phase: "memorize",
    round: generateWordMemoryRound(difficulty),
    secondsLeft: settings.memorizeSeconds,
    selectedIds: [],
    correctSelections: 0,
    falseSelections: 0,
    missedWords: 0,
    submitted: false,
  };
}

/** Called once per second while `phase === "memorize"`; flips to "select" at zero. */
export function tickMemorizeClock(state: WordMemoryState): WordMemoryState {
  if (state.phase !== "memorize") return state;
  if (state.secondsLeft <= 1) {
    return { ...state, phase: "select", secondsLeft: 0 };
  }
  return { ...state, secondsLeft: state.secondsLeft - 1 };
}

export function toggleWord(state: WordMemoryState, id: string): WordMemoryState {
  if (state.phase !== "select" || state.submitted) return state;
  const isSelected = state.selectedIds.includes(id);
  return {
    ...state,
    selectedIds: isSelected
      ? state.selectedIds.filter((existing) => existing !== id)
      : [...state.selectedIds, id],
  };
}

export function submitSelections(state: WordMemoryState): WordMemoryState {
  if (state.phase !== "select" || state.submitted) return state;

  const selectedWords = state.round.selectableWords.filter((word) =>
    state.selectedIds.includes(word.id)
  );
  const correctSelections = selectedWords.filter((word) => word.isTarget).length;
  const falseSelections = selectedWords.filter((word) => !word.isTarget).length;
  const missedWords = state.round.targetWords.length - correctSelections;

  return { ...state, correctSelections, falseSelections, missedWords, submitted: true };
}

export function isGameComplete(state: WordMemoryState): boolean {
  return state.submitted;
}

export function calculateWordMemoryScore(state: WordMemoryState): number {
  return Math.max(0, state.correctSelections * 10 - state.falseSelections * 5);
}

export function calculateWordMemoryAccuracy(state: WordMemoryState): number {
  if (state.round.targetWords.length === 0) return 0;
  const raw =
    ((state.correctSelections - state.falseSelections) / state.round.targetWords.length) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}
