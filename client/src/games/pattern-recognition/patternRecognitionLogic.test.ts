import { describe, expect, it } from "vitest";
import {
  calculatePatternAccuracy,
  calculatePatternScore,
  createInitialState,
  generateRound,
  isGameComplete,
  nextRound,
  selectOption,
  totalRoundsForDifficulty,
} from "./patternRecognitionLogic";

describe("totalRoundsForDifficulty", () => {
  it("increases with difficulty", () => {
    expect(totalRoundsForDifficulty("easy")).toBe(6);
    expect(totalRoundsForDifficulty("medium")).toBe(8);
    expect(totalRoundsForDifficulty("hard")).toBe(10);
  });
});

describe("generateRound", () => {
  it("produces options that include exactly one match for correctIndex", () => {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      const round = generateRound(difficulty);
      expect(round.correctIndex).toBeGreaterThanOrEqual(0);
      expect(round.correctIndex).toBeLessThan(round.options.length);
    }
  });

  it("gives easy rounds fewer options than hard rounds", () => {
    const easy = generateRound("easy");
    const hard = generateRound("hard");
    expect(easy.options.length).toBeLessThanOrEqual(hard.options.length);
  });

  it("never duplicates an option", () => {
    const round = generateRound("hard");
    const keys = round.options.map((o) => `${o.shape}-${o.color}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("selectOption", () => {
  it("marks a correct selection and moves to feedback phase", () => {
    let state = createInitialState("easy");
    const correctIndex = state.current.correctIndex;
    state = selectOption(state, correctIndex);

    expect(state.roundPhase).toBe("feedback");
    expect(state.correctCount).toBe(1);
    expect(state.incorrectCount).toBe(0);
  });

  it("marks an incorrect selection", () => {
    let state = createInitialState("easy");
    const wrongIndex = (state.current.correctIndex + 1) % state.current.options.length;
    state = selectOption(state, wrongIndex);

    expect(state.correctCount).toBe(0);
    expect(state.incorrectCount).toBe(1);
  });

  it("ignores a second selection once already answered", () => {
    let state = createInitialState("easy");
    state = selectOption(state, state.current.correctIndex);
    const afterFirst = state;
    state = selectOption(state, 0);
    expect(state).toBe(afterFirst);
  });
});

describe("nextRound / isGameComplete", () => {
  it("advances the round counter and generates a fresh round", () => {
    const state = createInitialState("easy");
    const next = nextRound(state, "easy");
    expect(next.round).toBe(state.round + 1);
    expect(next.roundPhase).toBe("answering");
  });

  it("completes once round exceeds totalRounds", () => {
    const state = createInitialState("easy");
    expect(isGameComplete(state)).toBe(false);
    expect(isGameComplete({ ...state, round: state.totalRounds + 1 })).toBe(true);
  });
});

describe("scoring", () => {
  it("rewards accuracy and scales with round count", () => {
    const base = createInitialState("hard");
    const good = { ...base, correctCount: 8, incorrectCount: 0 };
    const bad = { ...base, correctCount: 3, incorrectCount: 5 };
    expect(calculatePatternScore(good)).toBeGreaterThan(calculatePatternScore(bad));
  });

  it("accuracy handles zero attempts", () => {
    const base = createInitialState("easy");
    expect(calculatePatternAccuracy(base)).toBe(0);
  });
});
