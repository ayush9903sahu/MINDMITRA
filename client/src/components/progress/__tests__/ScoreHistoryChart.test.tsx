import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreHistoryChart } from "../ScoreHistoryChart";
import type { ScoreHistoryPoint } from "../../../types/progress";

const history: ScoreHistoryPoint[] = [
  {
    sessionId: "s1",
    completedAt: "2026-09-10T10:00:00.000Z",
    score: 500,
    difficulty: "easy",
  },
  {
    sessionId: "s2",
    completedAt: "2026-09-17T10:00:00.000Z",
    score: 650,
    difficulty: "medium",
  },
];

describe("ScoreHistoryChart", () => {
  it("shows an empty state when there is no history", () => {
    render(<ScoreHistoryChart gameName="Memory Match" history={[]} />);
    expect(screen.getByText("Not enough sessions yet")).toBeInTheDocument();
  });

  it("renders the game name in the heading", () => {
    render(<ScoreHistoryChart gameName="Memory Match" history={history} />);
    expect(
      screen.getByText("Score history — Memory Match"),
    ).toBeInTheDocument();
  });

  it("uses compliant, non-medical wording for score change", () => {
    render(<ScoreHistoryChart gameName="Memory Match" history={history} />);
    const summary = screen.getByText(/your game score has increased by/i);
    expect(summary).toBeInTheDocument();
    expect(summary.textContent?.toLowerCase()).not.toContain("memory has");
  });
});
