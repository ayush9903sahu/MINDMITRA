// Re-export the shared data-contract types so components only ever import
// from one place inside the client. Do not redefine these shapes here.
export type {
  Difficulty,
  OverallProgress,
  GameProgress,
  RecentSessionSummary,
  WeeklyActivityPoint,
  ScoreHistoryPoint,
  AccuracyHistoryPoint,
  GameHistory,
} from "../../../shared/types/progress";

/** Generic async-resource state used by the progress hooks. */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/** A minimal (id, name) pair used to populate the game selector. */
export interface GameOption {
  id: string;
  name: string;
}
