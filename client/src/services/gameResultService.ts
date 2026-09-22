/**
 * client/src/services/gameResultService.ts
 *
 * Bridges the game engine (Module 5/6) to Module 4's game-session API.
 * This is the ONLY place in the games module that talks to the network.
 *
 * Required interface from Module 4:
 *   POST /api/games/:gameId/sessions
 *   body: { difficulty, score, accuracy?, duration, completedAt }
 *   -> 201 { id, userId, gameId, difficulty, score, accuracy, duration, completedAt }
 *
 * Requires the authenticated session (Module 2's HTTP-only cookie) to already
 * be present; this service does not attach tokens manually.
 */

import type { GameResult, GameSessionInput } from "../../../shared/types/game";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class GameResultSubmissionError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "GameResultSubmissionError";
  }
}

/**
 * submitGameResult(result)
 * Sends a completed game's result to the backend. Throws
 * GameResultSubmissionError on any non-2xx response or network failure so
 * callers (GameShell) can show a retry affordance.
 */
export async function submitGameResult(
  result: GameResult
): Promise<{ id: string }> {
  const payload: GameSessionInput = {
    gameId: result.gameId,
    difficulty: result.difficulty,
    score: result.score,
    accuracy: result.accuracy,
    duration: result.durationSeconds,
    completedAt: result.completedAt,
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/games/${result.gameId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new GameResultSubmissionError(
      "Could not reach the server. Check your connection and try again."
    );
  }

  if (!response.ok) {
    let message = "Your result could not be saved. Please try again.";
    try {
      const body = await response.json();
      if (typeof body?.message === "string") message = body.message;
    } catch {
      // ignore — use default message
    }
    throw new GameResultSubmissionError(message, response.status);
  }

  return response.json();
}
