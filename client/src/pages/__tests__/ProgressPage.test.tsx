import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressPage from "../ProgressPage";
import { useOverallProgress } from "../../hooks/useOverallProgress";
import { useGameProgressList } from "../../hooks/useGameProgressList";
import { useRecentSessions } from "../../hooks/useRecentSessions";
import { useWeeklyActivity } from "../../hooks/useWeeklyActivity";
import { useGameHistory } from "../../hooks/useGameHistory";

vi.mock("../../hooks/useOverallProgress");
vi.mock("../../hooks/useGameProgressList");
vi.mock("../../hooks/useRecentSessions");
vi.mock("../../hooks/useWeeklyActivity");
vi.mock("../../hooks/useGameHistory");

const mockedUseOverallProgress = vi.mocked(useOverallProgress);
const mockedUseGameProgressList = vi.mocked(useGameProgressList);
const mockedUseRecentSessions = vi.mocked(useRecentSessions);
const mockedUseWeeklyActivity = vi.mocked(useWeeklyActivity);
const mockedUseGameHistory = vi.mocked(useGameHistory);

function mockAllLoading() {
  mockedUseOverallProgress.mockReturnValue({
    data: null,
    isLoading: true,
    error: null,
    reload: vi.fn(),
  });
  mockedUseGameProgressList.mockReturnValue({
    data: null,
    isLoading: true,
    error: null,
    reload: vi.fn(),
  });
  mockedUseRecentSessions.mockReturnValue({
    data: null,
    isLoading: true,
    error: null,
    reload: vi.fn(),
  });
  mockedUseWeeklyActivity.mockReturnValue({
    data: null,
    isLoading: true,
    error: null,
    reload: vi.fn(),
  });
  mockedUseGameHistory.mockReturnValue({
    data: null,
    isLoading: false,
    error: null,
    reload: vi.fn(),
  });
}

describe("ProgressPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("always shows the non-medical disclaimer", () => {
    mockAllLoading();
    render(<ProgressPage />);
    expect(
      screen.getByText(/not a medical device/i),
    ).toBeInTheDocument();
  });

  it("shows a loading state while data is loading", () => {
    mockAllLoading();
    render(<ProgressPage />);
    expect(
      screen.getByText("Loading your progress dashboard…"),
    ).toBeInTheDocument();
  });

  it("shows an error state when a request fails", () => {
    mockAllLoading();
    mockedUseOverallProgress.mockReturnValue({
      data: null,
      isLoading: false,
      error: "We couldn't load your overall progress. Please try again.",
      reload: vi.fn(),
    });
    mockedUseGameProgressList.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseRecentSessions.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseWeeklyActivity.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });

    render(<ProgressPage />);
    expect(
      screen.getByText("We couldn't load your overall progress. Please try again."),
    ).toBeInTheDocument();
  });

  it("shows a friendly empty state when the user has no sessions yet", () => {
    mockedUseOverallProgress.mockReturnValue({
      data: {
        gamesPlayed: 0,
        totalSessions: 0,
        totalPracticeTimeSeconds: 0,
        lastActivityAt: null,
      },
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseGameProgressList.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseRecentSessions.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseWeeklyActivity.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseGameHistory.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });

    render(<ProgressPage />);
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });

  it("renders the full dashboard when data is present", () => {
    mockedUseOverallProgress.mockReturnValue({
      data: {
        gamesPlayed: 2,
        totalSessions: 8,
        totalPracticeTimeSeconds: 1500,
        lastActivityAt: "2026-09-20T09:00:00.000Z",
      },
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseGameProgressList.mockReturnValue({
      data: [
        {
          gameId: "g1",
          gameName: "Pattern Match",
          bestScore: 500,
          latestScore: 400,
          averageScore: 420,
          averageAccuracy: 75,
          sessionsCount: 8,
          practiceTimeSeconds: 1500,
          currentDifficulty: "easy",
        },
      ],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseRecentSessions.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseWeeklyActivity.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseGameHistory.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });

    render(<ProgressPage />);
    expect(screen.getByText("Overall progress")).toBeInTheDocument();
    expect(screen.getByText("Pattern Match")).toBeInTheDocument();
    expect(screen.getByText("Game-by-game progress")).toBeInTheDocument();
  });
});
