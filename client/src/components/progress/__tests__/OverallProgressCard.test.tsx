import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OverallProgressCard } from "../OverallProgressCard";
import type { OverallProgress } from "../../../types/progress";

const baseProgress: OverallProgress = {
  gamesPlayed: 4,
  totalSessions: 22,
  totalPracticeTimeSeconds: 3900,
  lastActivityAt: "2026-09-21T15:30:00.000Z",
};

describe("OverallProgressCard", () => {
  it("renders all four overall metrics", () => {
    render(<OverallProgressCard progress={baseProgress} />);

    expect(screen.getByText("Games played")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    expect(screen.getByText("Total sessions")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();

    expect(screen.getByText("Total practice time")).toBeInTheDocument();
    expect(screen.getByText("Recent activity")).toBeInTheDocument();
  });

  it("shows a friendly message when there is no activity yet", () => {
    render(
      <OverallProgressCard
        progress={{ ...baseProgress, lastActivityAt: null }}
      />,
    );
    expect(screen.getByText("No sessions yet")).toBeInTheDocument();
  });

  it("reveals a metric explanation when its help toggle is activated", async () => {
    const user = userEvent.setup();
    render(<OverallProgressCard progress={baseProgress} />);

    const toggle = screen.getByRole("button", {
      name: /what does games played mean/i,
    });
    await user.click(toggle);

    expect(
      screen.getByText(/how many different cognitive exercises/i),
    ).toBeInTheDocument();
  });
});
