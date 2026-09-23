import { apiGet } from "./apiClient";
import type {
  OverallProgress,
  GameProgress,
  RecentSessionSummary,
  WeeklyActivityPoint,
  GameHistory,
} from "../types/progress";

/**
 * Thin wrappers around Module 4's progress endpoints. Every function
 * returns already-typed, parsed data (or throws) — components never touch
 * `fetch` directly.
 *
 * REQUIRED FROM MODULE 4 (see integration notes at the bottom of this
 * module's summary): these five endpoints must exist and match the shapes
 * in `shared/types/progress.ts`. Module 8 does not implement them.
 */

export async function fetchOverallProgress(): Promise<OverallProgress> {
  return apiGet<OverallProgress>("/api/progress/overview");
}

export async function fetchGameProgressList(): Promise<GameProgress[]> {
  return apiGet<GameProgress[]>("/api/progress/games");
}

export async function fetchRecentSessions(
  limit = 10,
): Promise<RecentSessionSummary[]> {
  return apiGet<RecentSessionSummary[]>(
    `/api/progress/sessions/recent?limit=${encodeURIComponent(String(limit))}`,
  );
}

export async function fetchWeeklyActivity(
  weeks = 8,
): Promise<WeeklyActivityPoint[]> {
  return apiGet<WeeklyActivityPoint[]>(
    `/api/progress/weekly-activity?weeks=${encodeURIComponent(String(weeks))}`,
  );
}

export async function fetchGameHistory(gameId: string): Promise<GameHistory> {
  return apiGet<GameHistory>(
    `/api/progress/games/${encodeURIComponent(gameId)}/history`,
  );
}
