/**
 * shared/constants/games.ts
 *
 * Single source of truth for every game's static configuration
 * (id, name, description, category, supported difficulties).
 *
 * INTEGRATION NOTE (resolved during module merge): Module 5/6 originally
 * defined each game's `GameConfig` inline inside its own `<Game>.tsx` file,
 * while Module 7 assumed a shared `shared/constants/games.ts` already
 * existed and asked for its two new configs to be merged into it. This file
 * is that single registry. Every game's `<Game>.tsx` now imports its config
 * from here instead of declaring its own copy, so the id/name/description
 * used by the Games list, the game page, and Module 4's seed data can never
 * drift apart.
 *
 * Module 4 (game data backend) should seed its `Game` table from
 * `ALL_GAME_CONFIGS` below rather than hand-writing seed rows, so the
 * database stays in sync with the client automatically.
 */

import type { GameConfig } from "../types/game";

export const memoryMatchConfig: GameConfig = {
  id: "memory-match",
  name: "Memory Match",
  description: "Find every matching pair of cards.",
  category: "memory",
  supportsDifficulty: ["easy", "medium", "hard"],
};

export const sequenceRecallConfig: GameConfig = {
  id: "sequence-recall",
  name: "Sequence Recall",
  description: "Watch the sequence of numbers, then repeat it back in order.",
  category: "memory",
  supportsDifficulty: ["easy", "medium", "hard"],
};

export const patternRecognitionConfig: GameConfig = {
  id: "pattern-recognition",
  name: "Pattern Recognition",
  description: "Work out what comes next in the pattern.",
  category: "logic",
  supportsDifficulty: ["easy", "medium", "hard"],
};

export const selectiveAttentionConfig: GameConfig = {
  id: "selective-attention",
  name: "Selective Attention",
  description: "Find every occurrence of the target symbol in the grid.",
  category: "attention",
  supportsDifficulty: ["easy", "medium", "hard"],
};

export const wordMemoryConfig: GameConfig = {
  id: "word-memory",
  name: "Word Memory",
  description: "Memorize a short list of words, then pick them out from a larger set.",
  category: "memory",
  supportsDifficulty: ["easy", "medium", "hard"],
};

export const logicPuzzlesConfig: GameConfig = {
  id: "logic-puzzles",
  name: "Simple Logic Puzzles",
  description:
    "Short reasoning puzzles: odd one out, number sequences, ordering, and matching.",
  category: "reasoning",
  supportsDifficulty: ["easy", "medium", "hard"],
};

/** Every game's config, in the canonical play order used across the app. */
export const ALL_GAME_CONFIGS: GameConfig[] = [
  memoryMatchConfig,
  sequenceRecallConfig,
  patternRecognitionConfig,
  selectiveAttentionConfig,
  wordMemoryConfig,
  logicPuzzlesConfig,
];
