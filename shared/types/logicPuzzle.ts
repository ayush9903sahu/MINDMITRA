import type { Difficulty } from './game';

export type LogicPuzzleType =
  | 'odd-one-out'
  | 'number-sequence'
  | 'ordering'
  | 'matching';

export interface LogicPuzzleOption {
  id: string;
  label: string;
}

/**
 * A single logic-puzzle question. All four puzzle types resolve to the
 * same "pick one correct option" shape so the UI, keyboard handling and
 * accessibility behaviour stay identical regardless of puzzle type —
 * this avoids drag-and-drop or free-text input, which are harder for
 * older users and screen-reader users.
 */
export interface LogicPuzzleQuestion {
  id: string;
  type: LogicPuzzleType;
  /** Plain-language instruction shown above the options, e.g. "Which one does not belong?" */
  prompt: string;
  options: LogicPuzzleOption[];
  correctOptionId: string;
}

export interface LogicPuzzleSessionConfig {
  difficulty: Difficulty;
  questionCount: number;
}

export interface LogicPuzzleAnswerRecord {
  questionId: string;
  selectedOptionId: string | null;
  correct: boolean;
}

export interface LogicPuzzleSessionMetadata {
  questionsAttempted: number;
  correctAnswers: number;
  answers: LogicPuzzleAnswerRecord[];
  /** Allows this to be passed as GameResult['metadata'] (Record<string, unknown>). */
  [key: string]: unknown;
}
