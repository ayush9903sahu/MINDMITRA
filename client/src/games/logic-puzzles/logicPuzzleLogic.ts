/**
 * client/src/games/logic-puzzles/logicPuzzleLogic.ts
 *
 * Pure logic for the Logic Puzzles game: a fixed set of single-answer
 * questions, answered one at a time with immediate feedback. Question
 * generation lives in `questionBank.ts` (unchanged from the original
 * module); this file owns the phase/score/accuracy state so it can plug
 * into the shared `useGameController` engine.
 */

import type { Difficulty } from "../../../../shared/types/game";
import { generateQuestionSet } from "./questionBank";
import type { LogicPuzzleAnswerRecord, LogicPuzzleQuestion } from "../../../../shared/types/logicPuzzle";

export type LogicPuzzlePhase = "question" | "feedback";

export interface LogicPuzzleState {
  questions: LogicPuzzleQuestion[];
  currentIndex: number;
  answers: LogicPuzzleAnswerRecord[];
  selectedOptionId: string | null;
  phase: LogicPuzzlePhase;
  /** True once the last question's answer has been recorded. */
  submitted: boolean;
}

export function createInitialState(difficulty: Difficulty): LogicPuzzleState {
  return {
    questions: generateQuestionSet(difficulty),
    currentIndex: 0,
    answers: [],
    selectedOptionId: null,
    phase: "question",
    submitted: false,
  };
}

export function currentQuestion(state: LogicPuzzleState): LogicPuzzleQuestion | undefined {
  return state.questions[state.currentIndex];
}

/** Player picks an option; locks in the choice and shows correct/incorrect feedback. */
export function selectOption(state: LogicPuzzleState, optionId: string): LogicPuzzleState {
  if (state.phase !== "question" || state.submitted) return state;
  return { ...state, selectedOptionId: optionId, phase: "feedback" };
}

export function isSelectionCorrect(state: LogicPuzzleState): boolean {
  const question = currentQuestion(state);
  return !!question && state.selectedOptionId === question.correctOptionId;
}

/** Advances past the feedback screen: records the answer, then moves to the next question. */
export function continueToNext(state: LogicPuzzleState): LogicPuzzleState {
  const question = currentQuestion(state);
  if (!question || state.phase !== "feedback") return state;

  const record: LogicPuzzleAnswerRecord = {
    questionId: question.id,
    selectedOptionId: state.selectedOptionId,
    correct: isSelectionCorrect(state),
  };
  const answers = [...state.answers, record];
  const isLastQuestion = state.currentIndex === state.questions.length - 1;

  return {
    ...state,
    answers,
    selectedOptionId: null,
    phase: "question",
    currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
    submitted: isLastQuestion,
  };
}

export function isGameComplete(state: LogicPuzzleState): boolean {
  return state.submitted;
}

export function calculateLogicPuzzlesScore(state: LogicPuzzleState): number {
  const correctAnswers = state.answers.filter((answer) => answer.correct).length;
  return correctAnswers * 10;
}

export function calculateLogicPuzzlesAccuracy(state: LogicPuzzleState): number {
  if (state.answers.length === 0) return 0;
  const correctAnswers = state.answers.filter((answer) => answer.correct).length;
  return Math.round((correctAnswers / state.answers.length) * 100);
}
