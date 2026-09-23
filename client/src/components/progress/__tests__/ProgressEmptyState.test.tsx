import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressEmptyState } from "../ProgressEmptyState";

describe("ProgressEmptyState", () => {
  it("renders the given title and description", () => {
    render(
      <ProgressEmptyState
        title="No activity yet"
        description="Play a game to see your progress."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "No activity yet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Play a game to see your progress."),
    ).toBeInTheDocument();
  });

  it("renders an optional action when provided", () => {
    render(
      <ProgressEmptyState
        title="No activity yet"
        description="Play a game to see your progress."
        action={<button type="button">Go to games</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Go to games" }),
    ).toBeInTheDocument();
  });
});
