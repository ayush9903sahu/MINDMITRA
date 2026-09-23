/**
 * client/src/games/sequence-recall/sequenceRecallLogic.ts
 * Pure logic for Sequence Recall: show a sequence of digits, the player
 * reproduces it. Each round the sequence grows by one, up to a
 * difficulty-dependent starting length and round count.
 */

import type { Difficulty } from "../../../../shared/types/game";

export type RecallPhase = "showing" | "input" | "feedback";

export interface SequenceRecallState {
  round: number;
  totalRounds: number;
  startingLength: number;
  sequence: number[];
  userInput: number[];
  recallPhase: RecallPhase;
  correctRounds: number;
  incorrectRounds: number;
  lastRoundCorrect: boolean | null;
}

const SETTINGS: Record<Difficulty, { startingLength: number; totalRounds: number }> = {
  easy: { startingLength: 3, totalRounds: 5 },
  medium: { startingLength: 4, totalRounds: 6 },
  hard: { startingLength: 5, totalRounds: 7 },
};

export function settingsForDifficulty(difficulty: Difficulty) {
  return SETTINGS[difficulty];
}

export function generateSequence(length: number): number[] {
  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push(Math.floor(Math.random() * 9) + 1); // digits 1-9
  }
  return sequence;
}

export function createInitialState(difficulty: Difficulty): SequenceRecallState {
  const { startingLength, totalRounds } = settingsForDifficulty(difficulty);
  return {
    round: 1,
    totalRounds,
    startingLength,
    sequence: generateSequence(startingLength),
    userInput: [],
    recallPhase: "showing",
    correctRounds: 0,
    incorrectRounds: 0,
    lastRoundCorrect: null,
  };
}

/** Called once the sequence has finished displaying; moves to input phase. */
export function beginInput(state: SequenceRecallState): SequenceRecallState {
  return { ...state, recallPhase: "input", userInput: [] };
}

/** Player taps a digit during the input phase. */
export function addDigit(state: SequenceRecallState, digit: number): SequenceRecallState {
  if (state.recallPhase !== "input") return state;
  if (state.userInput.length >= state.sequence.length) return state;
  return { ...state, userInput: [...state.userInput, digit] };
}

export function clearInput(state: SequenceRecallState): SequenceRecallState {
  if (state.recallPhase !== "input") return state;
  return { ...state, userInput: [] };
}

export function isInputComplete(state: SequenceRecallState): boolean {
  return state.userInput.length === state.sequence.length;
}

export function isSequenceCorrect(state: SequenceRecallState): boolean {
  if (state.userInput.length !== state.sequence.length) return false;
  return state.userInput.every((digit, index) => digit === state.sequence[index]);
}

/** Resolves the current round's answer, moving to the feedback phase. */
export function submitAnswer(state: SequenceRecallState): SequenceRecallState {
  const correct = isSequenceCorrect(state);
  return {
    ...state,
    recallPhase: "feedback",
    lastRoundCorrect: correct,
    correctRounds: state.correctRounds + (correct ? 1 : 0),
    incorrectRounds: state.incorrectRounds + (correct ? 0 : 1),
  };
}

/** Advances to the next round, growing the sequence length by one. */
export function nextRound(state: SequenceRecallState): SequenceRecallState {
  const nextLength = state.sequence.length + 1;
  return {
    ...state,
    round: state.round + 1,
    sequence: generateSequence(nextLength),
    userInput: [],
    recallPhase: "showing",
    lastRoundCorrect: null,
  };
}

export function isGameComplete(state: SequenceRecallState): boolean {
  return state.round > state.totalRounds;
}

export function calculateSequenceRecallScore(state: SequenceRecallState): number {
  // Longer correctly-recalled sequences are worth more than short ones.
  const base = state.correctRounds * 50;
  const lengthBonus = state.correctRounds * (state.startingLength * 10);
  const penalty = state.incorrectRounds * 15;
  return Math.max(0, base + lengthBonus - penalty);
}

export function calculateSequenceRecallAccuracy(state: SequenceRecallState): number {
  const attempted = state.correctRounds + state.incorrectRounds;
  if (attempted === 0) return 0;
  return Math.round((state.correctRounds / attempted) * 100);
}
