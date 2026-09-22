import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label and responds to clicks", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Start game</Button>);

    const button = screen.getByRole("button", { name: "Start game" });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disables interaction while loading", () => {
    render(<Button isLoading>Saving</Button>);
    expect(screen.getByRole("button", { name: "Saving" })).toBeDisabled();
  });
});
