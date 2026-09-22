/**
 * client/src/games/registry.ts
 *
 * Single lookup table for every playable game, so Module 1's
 * `/games` and `/games/:gameId` pages can render GameCards and the game
 * component itself without importing each game module directly.
 *
 * Usage in Module 1's route:
 *   import { gameRegistry } from "../games/registry";
 *   const entry = gameRegistry[gameId];
 *   if (!entry) return <NotFound />;
 *   const GameComponent = entry.component;
 *   return <GameComponent />;
 */

import type { ComponentType } from "react";
import type { GameId } from "../../../shared/types/game";
import { ALL_GAME_CONFIGS } from "../../../shared/constants/games";
import { MemoryMatchGame } from "./memory-match/MemoryMatchGame";
import { SequenceRecallGame } from "./sequence-recall/SequenceRecallGame";
import { PatternRecognitionGame } from "./pattern-recognition/PatternRecognitionGame";
import { SelectiveAttentionGame } from "./selective-attention/SelectiveAttentionGame";
import { WordMemoryGame } from "./word-memory/WordMemoryGame";
import { LogicPuzzlesGame } from "./logic-puzzles/LogicPuzzlesGame";

export interface GameRegistryEntry {
  config: (typeof ALL_GAME_CONFIGS)[number];
  component: ComponentType;
}

const componentById: Record<GameId, ComponentType> = {
  "memory-match": MemoryMatchGame,
  "sequence-recall": SequenceRecallGame,
  "pattern-recognition": PatternRecognitionGame,
  "selective-attention": SelectiveAttentionGame,
  "word-memory": WordMemoryGame,
  "logic-puzzles": LogicPuzzlesGame,
};

export const gameRegistry: Record<GameId, GameRegistryEntry> = Object.fromEntries(
  ALL_GAME_CONFIGS.map((config) => [
    config.id,
    { config, component: componentById[config.id] },
  ])
) as Record<GameId, GameRegistryEntry>;

export const availableGames: GameConfig[] = Object.values(gameRegistry).map((e) => e.config);
