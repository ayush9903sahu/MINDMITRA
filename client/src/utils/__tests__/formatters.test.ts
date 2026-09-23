import { describe, it, expect } from "vitest";
import {
  formatDuration,
  formatAccuracy,
  formatDifficulty,
  describeScoreChange,
  describeAccuracyChange,
} from "../formatters";

describe("formatDuration", () => {
  it("formats sub-minute durations", () => {
    expect(formatDuration(30)).toBe("Less than 1 min");
  });

  it("formats minutes only", () => {
    expect(formatDuration(5 * 60)).toBe("5 min");
  });

  it("formats hours and minutes", () => {
    expect(formatDuration(65 * 60)).toBe("1 hr 5 min");
  });

  it("formats whole hours", () => {
    expect(formatDuration(120 * 60)).toBe("2 hr");
  });

  it("handles negative/invalid input safely", () => {
    expect(formatDuration(-5)).toBe("0 min");
    expect(formatDuration(NaN)).toBe("0 min");
  });
});

describe("formatAccuracy", () => {
  it("formats a numeric accuracy", () => {
    expect(formatAccuracy(87.6)).toBe("88%");
  });

  it("returns a placeholder for null", () => {
    expect(formatAccuracy(null)).toBe("Not tracked");
  });
});

describe("formatDifficulty", () => {
  it("capitalizes the difficulty label", () => {
    expect(formatDifficulty("easy")).toBe("Easy");
    expect(formatDifficulty("hard")).toBe("Hard");
  });
});

describe("describeScoreChange — medical positioning compliance", () => {
  it("never mentions memory, cognitive ability, or medical improvement", () => {
    const message = describeScoreChange(100, 120);
    expect(message.toLowerCase()).not.toContain("memory");
    expect(message.toLowerCase()).not.toContain("cognitive ability");
    expect(message.toLowerCase()).not.toContain("improved");
  });

  it("always frames the change as a game score, not a medical measurement", () => {
    expect(describeScoreChange(100, 120)).toContain("game score");
    expect(describeScoreChange(100, 80)).toContain("game score");
  });

  it("reports an increase correctly", () => {
    expect(describeScoreChange(100, 120)).toBe(
      "Your game score has increased by 20% since your previous session.",
    );
  });

  it("reports a decrease correctly", () => {
    expect(describeScoreChange(100, 80)).toBe(
      "Your game score has decreased by 20% since your previous session.",
    );
  });

  it("handles no meaningful change", () => {
    expect(describeScoreChange(100, 100)).toBe(
      "Your game score has stayed about the same.",
    );
  });

  it("handles a zero baseline without dividing by zero", () => {
    expect(describeScoreChange(0, 50)).toBe(
      "Not enough history yet to compare game scores.",
    );
  });
});

describe("describeAccuracyChange — medical positioning compliance", () => {
  it("frames the change as game accuracy, not a cognitive measurement", () => {
    const message = describeAccuracyChange(50, 75);
    expect(message).toContain("game accuracy");
    expect(message.toLowerCase()).not.toContain("cognitive");
  });

  it("handles missing accuracy data gracefully", () => {
    expect(describeAccuracyChange(null, 80)).toBe(
      "Accuracy is not tracked for this game.",
    );
  });
});
