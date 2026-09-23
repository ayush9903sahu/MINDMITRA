import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameProgressCard } from "../GameProgressCard";
import type { GameProgress } from "../../../types/progress";

const game: GameProgress = {
  gameId: "game-1",
  gameName: "Word Recall",
  bestScore: 950,
  latestScore: 820,
  averageScore: 740,
  averageAccuracy: 82.4,
  sessionsCount: 15,
  practiceTimeSeconds: 4200,
  currentDifficulty: "medium",
};

describe("GameProgressCard", () => {
  it("renders the game name and all metrics", () => {
    render(
      <GameProgressCard game={game} isSelected={false} onSelect={vi.fn()} />,
    );

    expect(screen.getByText("Word Recall")).toBeInTheDocument();
    expect(screen.getByText("950")).toBeInTheDocument();
    expect(screen.getByText("820")).toBeInTheDocument();
    expect(screen.getByText("740")).toBeInTheDocument();
    expect(screen.getByText("82%")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("calls onSelect with the gameId when the view-history button is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <GameProgressCard game={game} isSelected={false} onSelect={onSelect} />,
    );

    await user.click(screen.getByRole("button", { name: /view history/i }));
    expect(onSelect).toHaveBeenCalledWith("game-1");
  });

  it("reflects the selected state via aria-pressed and label", () => {
    render(
      <GameProgressCard game={game} isSelected={true} onSelect={vi.fn()} />,
    );
    const button = screen.getByRole("button", { name: /viewing history/i });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
