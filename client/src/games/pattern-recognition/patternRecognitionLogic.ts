/**
 * client/src/games/pattern-recognition/patternRecognitionLogic.ts
 * Pure logic for Pattern Recognition: show a sequence built from a simple
 * repeating or attribute-based rule, with the last item blank; the player
 * picks what comes next from a set of options.
 */

import type { Difficulty } from "../../../../shared/types/game";

export type PatternShape = "circle" | "triangle" | "square" | "star" | "diamond";
export type PatternColor = "blue" | "green" | "orange" | "purple";

export interface PatternItem {
  shape: PatternShape;
  color: PatternColor;
}

export interface PatternRound {
  sequence: PatternItem[]; // includes all visible items; last slot is the blank to fill
  options: PatternItem[]; // choices shown to the player, one of which is correct
  correctIndex: number; // index into `options`
}

export interface PatternRecognitionState {
  round: number;
  totalRounds: number;
  current: PatternRound;
  selectedOptionIndex: number | null;
  correctCount: number;
  incorrectCount: number;
  roundPhase: "answering" | "feedback";
}

const ROUNDS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 6,
  medium: 8,
  hard: 10,
};

const SHAPES: PatternShape[] = ["circle", "triangle", "square", "star", "diamond"];
const COLORS: PatternColor[] = ["blue", "green", "orange", "purple"];

export function totalRoundsForDifficulty(difficulty: Difficulty): number {
  return ROUNDS_BY_DIFFICULTY[difficulty];
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function itemsEqual(a: PatternItem, b: PatternItem): boolean {
  return a.shape === b.shape && a.color === b.color;
}

/**
 * Builds one round's sequence + answer options.
 *  - easy: simple ABAB shape repetition, fixed color.
 *  - medium: two attributes alternate independently (shape cycles length 2-3).
 *  - hard: shape AND color both vary on a rule, harder to hold in mind.
 */
export function generateRound(difficulty: Difficulty): PatternRound {
  const shapeCycleLength = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 3;
  const shapes = shuffleUnique(SHAPES, shapeCycleLength);
  const colorCycleLength = difficulty === "hard" ? 2 : 1;
  const colors = difficulty === "hard" ? shuffleUnique(COLORS, colorCycleLength) : [pick(COLORS)];

  const visibleLength = difficulty === "easy" ? 5 : difficulty === "medium" ? 6 : 7;

  const sequence: PatternItem[] = [];
  for (let i = 0; i < visibleLength; i++) {
    sequence.push({
      shape: shapes[i % shapes.length],
      color: colors[i % colors.length],
    });
  }

  const correctNext: PatternItem = {
    shape: shapes[visibleLength % shapes.length],
    color: colors[visibleLength % colors.length],
  };

  const distractors = buildDistractors(correctNext, difficulty);
  const options = shuffleArray([correctNext, ...distractors]);
  const correctIndex = options.findIndex((o) => itemsEqual(o, correctNext));

  return { sequence, options, correctIndex };
}

function shuffleUnique<T>(items: T[], count: number): T[] {
  return shuffleArray(items).slice(0, count);
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildDistractors(correct: PatternItem, difficulty: Difficulty): PatternItem[] {
  const distractorCount = difficulty === "easy" ? 2 : 3;
  const distractors: PatternItem[] = [];
  let attempts = 0;
  while (distractors.length < distractorCount && attempts < 50) {
    attempts++;
    const candidate: PatternItem = { shape: pick(SHAPES), color: pick(COLORS) };
    if (itemsEqual(candidate, correct)) continue;
    if (distractors.some((d) => itemsEqual(d, candidate))) continue;
    distractors.push(candidate);
  }
  return distractors;
}

export function createInitialState(difficulty: Difficulty): PatternRecognitionState {
  return {
    round: 1,
    totalRounds: totalRoundsForDifficulty(difficulty),
    current: generateRound(difficulty),
    selectedOptionIndex: null,
    correctCount: 0,
    incorrectCount: 0,
    roundPhase: "answering",
  };
}

export function selectOption(
  state: PatternRecognitionState,
  optionIndex: number
): PatternRecognitionState {
  if (state.roundPhase !== "answering") return state;
  const correct = optionIndex === state.current.correctIndex;
  return {
    ...state,
    selectedOptionIndex: optionIndex,
    roundPhase: "feedback",
    correctCount: state.correctCount + (correct ? 1 : 0),
    incorrectCount: state.incorrectCount + (correct ? 0 : 1),
  };
}

export function nextRound(
  state: PatternRecognitionState,
  difficulty: Difficulty
): PatternRecognitionState {
  return {
    ...state,
    round: state.round + 1,
    current: generateRound(difficulty),
    selectedOptionIndex: null,
    roundPhase: "answering",
  };
}

export function isGameComplete(state: PatternRecognitionState): boolean {
  return state.round > state.totalRounds;
}

export function calculatePatternScore(state: PatternRecognitionState): number {
  const base = state.correctCount * 60;
  const penalty = state.incorrectCount * 15;
  const difficultyBonus = state.totalRounds >= 10 ? 1.4 : state.totalRounds >= 8 ? 1.2 : 1;
  return Math.max(0, Math.round((base - penalty) * difficultyBonus));
}

export function calculatePatternAccuracy(state: PatternRecognitionState): number {
  const attempted = state.correctCount + state.incorrectCount;
  if (attempted === 0) return 0;
  return Math.round((state.correctCount / attempted) * 100);
}
