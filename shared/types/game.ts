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
}
