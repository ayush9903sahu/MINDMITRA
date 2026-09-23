import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiGet } from "../apiClient";
import {
  fetchOverallProgress,
  fetchGameProgressList,
  fetchRecentSessions,
  fetchWeeklyActivity,
  fetchGameHistory,
} from "../progressService";

vi.mock("../apiClient", () => ({
  apiGet: vi.fn(),
}));

const mockedApiGet = vi.mocked(apiGet);

describe("progressService", () => {
  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it("fetchOverallProgress calls the overview endpoint", async () => {
    mockedApiGet.mockResolvedValue({
      gamesPlayed: 3,
      totalSessions: 10,
      totalPracticeTimeSeconds: 600,
      lastActivityAt: "2026-09-20T10:00:00.000Z",
    });

    const result = await fetchOverallProgress();

    expect(mockedApiGet).toHaveBeenCalledWith("/api/progress/overview");
    expect(result.totalSessions).toBe(10);
  });

  it("fetchGameProgressList calls the per-game endpoint", async () => {
    mockedApiGet.mockResolvedValue([]);
    await fetchGameProgressList();
    expect(mockedApiGet).toHaveBeenCalledWith("/api/progress/games");
  });

  it("fetchRecentSessions passes the limit as a query param", async () => {
    mockedApiGet.mockResolvedValue([]);
    await fetchRecentSessions(5);
    expect(mockedApiGet).toHaveBeenCalledWith(
      "/api/progress/sessions/recent?limit=5",
    );
  });

  it("fetchRecentSessions defaults the limit to 10", async () => {
    mockedApiGet.mockResolvedValue([]);
    await fetchRecentSessions();
    expect(mockedApiGet).toHaveBeenCalledWith(
      "/api/progress/sessions/recent?limit=10",
    );
  });

  it("fetchWeeklyActivity passes the weeks as a query param", async () => {
    mockedApiGet.mockResolvedValue([]);
    await fetchWeeklyActivity(4);
    expect(mockedApiGet).toHaveBeenCalledWith(
      "/api/progress/weekly-activity?weeks=4",
    );
  });

  it("fetchGameHistory encodes the gameId into the path", async () => {
    mockedApiGet.mockResolvedValue({
      gameId: "abc/123",
      gameName: "Memory Match",
      scoreHistory: [],
      accuracyHistory: [],
    });
    await fetchGameHistory("abc/123");
    expect(mockedApiGet).toHaveBeenCalledWith(
      "/api/progress/games/abc%2F123/history",
    );
  });
});
