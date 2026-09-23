<<<<<<< HEAD
// Shared game types — consumed by client (games module) and server (game/session routes)
// Owned by Module 1 (Foundation). Other modules must import from here rather than
// redefining these shapes.

export type Difficulty = "easy" | "medium" | "hard";

export type GameCategory =
  | "memory"
  | "attention"
  | "problem-solving"
  | "language"
  | "processing-speed";

/** Static metadata describing a game, independent of any user's play history. */
export interface GameConfig {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  icon: string; // lucide-react icon name
  supportedDifficulties: Difficulty[];
}

/** Runtime state while a game is being played. Individual games extend this. */
export interface GameState {
  status: "idle" | "playing" | "paused" | "completed";
  difficulty: Difficulty;
  startedAt: string | null; // ISO timestamp
}

/** Result payload produced when a game session ends. */
export interface GameResult {
  gameId: string;
  difficulty: Difficulty;
  score: number;
  accuracy: number | null; // 0-100, null if not applicable to the game
  durationSeconds: number;
  completedAt: string; // ISO timestamp
}

/** Summary info used by GameCard — a game combined with the user's history for it. */
export interface GameSummary {
  game: GameConfig;
  bestScore: number | null;
  lastPlayedAt: string | null; // ISO timestamp
  completed: boolean;
=======
/**
 * shared/types/game.ts
 *
 * Types shared between client and server for the BrainCare game system.
 * These are consumed by:
 *  - Module 4 (game data / progress backend) — GameSessionInput matches its
 *    POST /api/games/:gameId/sessions payload.
 *  - Module 5/6 (game engine + individual games) — GameConfig, GameState,
 *    GameResult, GameController.
 */

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

/** Canonical game identifiers. Must match the `Game.id`/slug seeded by Module 4. */
export type GameId =
  | "memory-match"
  | "sequence-recall"
  | "pattern-recognition"
  | "selective-attention"
  | "word-memory"
  | "logic-puzzles";

/** Static, non-changing configuration for a game (used to render GameCard, instructions, etc). */
export interface GameConfig {
  id: GameId;
  name: string;
  description: string;
  category: "memory" | "attention" | "logic" | "reasoning";
  supportsDifficulty: Difficulty[];
}

/** Lifecycle phase managed by the game engine / GameShell. */
export type GamePhase =
  | "instructions"
  | "difficulty-select"
  | "playing"
  | "paused"
  | "completed";

/** Generic in-progress game state. Individual games extend this with their own fields. */
export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty | null;
  startedAt: number | null;
  elapsedMs: number;
}

/**
 * The result produced by a completed game session, before it is sent to the
 * server. This is the shape every game's `getResult()` must return.
 */
export interface GameResult {
  gameId: GameId;
  difficulty: Difficulty;
  score: number;
  /** 0-100, omit (undefined) if accuracy is not meaningful for this game */
  accuracy?: number;
  /** duration of the play session, in seconds */
  durationSeconds: number;
  completedAt: string; // ISO timestamp
  /**
   * Free-form, game-specific stats for the results screen (moves, sequence
   * length, word lists, answer records, etc). Client-side only — never sent
   * to Module 4's session endpoint (see GameSessionInput below).
   */
  details?: Record<string, unknown>;
}

/**
 * Payload shape sent to Module 4's POST /api/games/:gameId/sessions.
 * (score/accuracy/duration/difficulty/gameId/timestamp, per the master data contract)
 */
export interface GameSessionInput {
  gameId: GameId;
  difficulty: Difficulty;
  score: number;
  accuracy?: number;
  duration: number; // seconds — matches Module 4's `duration` field name
  completedAt: string;
}

/**
 * The consistent per-game controller interface required by the master prompt:
 * startGame / restartGame / pauseGame / finishGame / calculateScore / getResult.
 * Every game's `use<Game>Game()` hook returns an object implementing this.
 */
export interface GameController<TResult extends GameResult = GameResult> {
  phase: GamePhase;
  difficulty: Difficulty | null;
  /** milliseconds elapsed since startGame(), updated while playing/paused */
  elapsedMs: number;
  /** Game-specific state for rendering the play area. */
  state: unknown;
  /**
   * Advances from the instructions screen to difficulty selection.
   * (UI-flow addition alongside the six core lifecycle methods below.)
   */
  beginDifficultySelection: () => void;
  startGame: (difficulty: Difficulty) => void;
  restartGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  /** Marks the game as finished; does NOT submit to the server. */
  finishGame: () => void;
  /** Pure calculation from current internal stats to a numeric score. */
  calculateScore: () => number;
  /** Returns the finished result, or null if the game has not completed. */
  getResult: () => TResult | null;
>>>>>>> 7b85fef4434da6bffc46c17cafcccb1c687613ef
}
