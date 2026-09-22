/**
 * Shared progress-tracking types.
 *
 * These describe the AGGREGATE data the Progress Dashboard (Module 8) needs.
 * They are derived from, but distinct from, the raw persisted models
 * (User, Profile, Game, GameSession, GameScore, Progress, Reminder,
 * Achievement) that Module 4 (game/session API) reads from Postgres via
 * Prisma. Module 4 is responsible for computing these aggregates and
 * exposing them over HTTP; Module 8 only consumes them.
 *
 * Difficulty mirrors the Game Contract: every game supports exactly
 * 'easy' | 'medium' | 'hard'.
 */

export type Difficulty = "easy" | "medium" | "hard";

/** High-level, account-wide progress summary. */
export interface OverallProgress {
  /** Number of distinct games the user has played at least once. */
  gamesPlayed: number;
  /** Total number of completed GameSession records. */
  totalSessions: number;
  /** Total time spent playing, in seconds, across all sessions. */
  totalPracticeTimeSeconds: number;
  /** ISO 8601 timestamp of the most recent completed session, if any. */
  lastActivityAt: string | null;
}

/** Per-game rollup of a user's history with a single game. */
export interface GameProgress {
  gameId: string;
  gameName: string;
  /** Highest score ever recorded for this game. */
  bestScore: number;
  /** Score from the most recently completed session of this game. */
  latestScore: number;
  /** Mean score across all sessions of this game. */
  averageScore: number;
  /** Mean accuracy (0-100) across sessions where accuracy applies, or null. */
  averageAccuracy: number | null;
  /** Number of completed sessions for this game. */
  sessionsCount: number;
  /** Total time spent on this game, in seconds. */
  practiceTimeSeconds: number;
  /** The difficulty of the most recently completed session. */
  currentDifficulty: Difficulty;
}

/** A single completed session, as shown in the "recent activity" list. */
export interface RecentSessionSummary {
  id: string;
  gameId: string;
  gameName: string;
  difficulty: Difficulty;
  score: number;
  accuracy: number | null;
  /** Duration in seconds. */
  duration: number;
  /** ISO 8601 completion timestamp. */
  completedAt: string;
}

/** One point of activity for a given calendar week, for the activity chart. */
export interface WeeklyActivityPoint {
  /** ISO date (Monday) representing the start of the week. */
  weekStart: string;
  sessionsCount: number;
  /** Total practice time that week, in minutes (rounded). */
  practiceMinutes: number;
}

/** One point in a game's score-over-time history. */
export interface ScoreHistoryPoint {
  sessionId: string;
  completedAt: string;
  score: number;
  difficulty: Difficulty;
}

/** One point in a game's accuracy-over-time history. */
export interface AccuracyHistoryPoint {
  sessionId: string;
  completedAt: string;
  accuracy: number | null;
  difficulty: Difficulty;
}

/** Full history payload for a single game, used by the game detail panel. */
export interface GameHistory {
  gameId: string;
  gameName: string;
  scoreHistory: ScoreHistoryPoint[];
  accuracyHistory: AccuracyHistoryPoint[];
}
