import type { Difficulty } from './game';

export type SimilarityLevel = 'low' | 'medium' | 'high';

export interface WordMemoryDifficultySettings {
  /** How many words the player must try to remember. */
  targetWordCount: number;
  /** How many extra, non-target words are mixed in at selection time. */
  distractorCount: number;
  /** How visually/phonetically close the distractors are to the target words. */
  similarity: SimilarityLevel;
  /** How long the word list is shown before it disappears, in seconds. */
  memorizeSeconds: number;
}

export interface WordMemorySelectableWord {
  id: string;
  word: string;
  isTarget: boolean;
}

export interface WordMemorySessionMetadata {
  targetWords: string[];
  distractorWords: string[];
  selectedWords: string[];
  correctSelections: number;
  falseSelections: number;
  missedWords: number;
  /** Allows this to be passed as GameResult['metadata'] (Record<string, unknown>). */
  [key: string]: unknown;
}

export interface WordMemorySessionConfig {
  difficulty: Difficulty;
  settings: WordMemoryDifficultySettings;
}
