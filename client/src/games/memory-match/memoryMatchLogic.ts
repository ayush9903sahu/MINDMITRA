/**
 * client/src/games/memory-match/memoryMatchLogic.ts
 * Pure, framework-free logic for the Memory Match game — kept separate from
 * the React component so it can be unit tested directly.
 */

import type { Difficulty } from "../../../../shared/types/game";

export interface MemoryCard {
  id: number;
  symbol: string;
  isMatched: boolean;
}

export interface MemoryMatchState {
  cards: MemoryCard[];
  flippedIds: number[]; // 0, 1, or 2 ids currently face-up (unmatched)
  moves: number;
  matchedPairs: number;
  totalPairs: number;
}

// A pool of simple, high-contrast symbols (emoji render consistently and are
// large/legible without needing an icon font).
const SYMBOL_POOL = [
  "🍎", "🚗", "🌙", "⭐", "🌸", "🐝", "🍀", "🎈",
  "🎵", "🐢", "☂️", "🍋", "🧩", "🌻", "🦋", "🔔",
  "🍇", "🐳", "🧸", "🌈",
];

const PAIRS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 6, // 3x4 grid, 12 cards
  medium: 10, // 4x5 grid, 20 cards
  hard: 15, // 5x6 grid, 30 cards
};

export function pairsForDifficulty(difficulty: Difficulty): number {
  return PAIRS_BY_DIFFICULTY[difficulty];
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createBoard(difficulty: Difficulty): MemoryCard[] {
  const pairCount = pairsForDifficulty(difficulty);
  const symbols = SYMBOL_POOL.slice(0, pairCount);
  const deck = shuffle([...symbols, ...symbols]);
  return deck.map((symbol, index) => ({
    id: index,
    symbol,
    isMatched: false,
  }));
}

export function createInitialState(difficulty: Difficulty): MemoryMatchState {
  const cards = createBoard(difficulty);
  return {
    cards,
    flippedIds: [],
    moves: 0,
    matchedPairs: 0,
    totalPairs: pairsForDifficulty(difficulty),
  };
}

/**
 * Flips a card. Pure function — returns the next state. Handles the three
 * cases: first flip, second flip (resolve match/mismatch), and flips that
 * should be ignored (already matched, already flipped, or two cards already
 * face up awaiting resolution).
 */
export function flipCard(state: MemoryMatchState, cardId: number): MemoryMatchState {
  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.isMatched || state.flippedIds.includes(cardId)) {
    return state;
  }
  if (state.flippedIds.length >= 2) {
    return state; // waiting for the previous pair to resolve
  }

  const flippedIds = [...state.flippedIds, cardId];

  if (flippedIds.length < 2) {
    return { ...state, flippedIds };
  }

  // Second card flipped — resolve the pair.
  const [firstId, secondId] = flippedIds;
  const first = state.cards.find((c) => c.id === firstId)!;
  const second = state.cards.find((c) => c.id === secondId)!;
  const isMatch = first.symbol === second.symbol;

  const cards = state.cards.map((c) =>
    isMatch && (c.id === firstId || c.id === secondId) ? { ...c, isMatched: true } : c
  );

  return {
    ...state,
    cards,
    flippedIds: isMatch ? [] : flippedIds,
    moves: state.moves + 1,
    matchedPairs: state.matchedPairs + (isMatch ? 1 : 0),
  };
}

/** Clears a mismatched pair back face-down. Called by the component after a short delay. */
export function resolveMismatch(state: MemoryMatchState): MemoryMatchState {
  if (state.flippedIds.length !== 2) return state;
  const [firstId, secondId] = state.flippedIds;
  const first = state.cards.find((c) => c.id === firstId);
  const second = state.cards.find((c) => c.id === secondId);
  if (first?.isMatched || second?.isMatched) return state;
  return { ...state, flippedIds: [] };
}

export function isBoardComplete(state: MemoryMatchState): boolean {
  return state.matchedPairs === state.totalPairs;
}

/**
 * Score rewards completion, fewer moves, and speed, scaled by difficulty.
 * Minimum possible moves for a perfect game is `totalPairs`.
 */
export function calculateMemoryMatchScore(
  state: MemoryMatchState,
  elapsedSeconds: number
): number {
  const difficultyMultiplier =
    state.totalPairs <= 6 ? 1 : state.totalPairs <= 10 ? 1.5 : 2;

  const perfectMoves = state.totalPairs;
  const movesPenalty = Math.max(0, state.moves - perfectMoves) * 8;
  const timePenalty = Math.min(300, elapsedSeconds) * 1.5;

  const base = state.matchedPairs * 100;
  const raw = base - movesPenalty - timePenalty;
  return Math.max(0, Math.round(raw * difficultyMultiplier));
}

export function calculateMemoryMatchAccuracy(state: MemoryMatchState): number {
  if (state.moves === 0) return 0;
  // Each move reveals a pair; a "correct" move is one that resulted in a match.
  // We approximate correct moves as matchedPairs (each successful match = 1 correct move).
  return Math.min(100, Math.round((state.matchedPairs / state.moves) * 100));
}
