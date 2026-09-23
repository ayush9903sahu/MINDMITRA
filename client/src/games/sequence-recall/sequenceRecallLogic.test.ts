import { describe, expect, it } from "vitest";
import {
  addDigit,
  beginInput,
  calculateSequenceRecallAccuracy,
  calculateSequenceRecallScore,
  clearInput,
  createInitialState,
  generateSequence,
  isGameComplete,
  isInputComplete,
  isSequenceCorrect,
  nextRound,
  settingsForDifficulty,
  submitAnswer,
} from "./sequenceRecallLogic";

describe("settingsForDifficulty", () => {
  it("increases starting length and round count with difficulty", () => {
    expect(settingsForDifficulty("easy").startingLength).toBe(3);
    expect(settingsForDifficulty("medium").startingLength).toBe(4);
    expect(settingsForDifficulty("hard").startingLength).toBe(5);
  });
});

describe("generateSequence", () => {
  it("generates the requested length with digits 1-9", () => {
    const seq = generateSequence(8);
    expect(seq).toHaveLength(8);
    for (const digit of seq) {
      expect(digit).toBeGreaterThanOrEqual(1);
      expect(digit).toBeLessThanOrEqual(9);
    }
  });
});

describe("input flow", () => {
  it("collects digits only during the input phase, up to the sequence length", () => {
    let state = createInitialState("easy"); // starts in "showing"
    state = addDigit(state, 5); // ignored — still showing
    expect(state.userInput).toEqual([]);

    state = beginInput(state);
    for (const digit of state.sequence) {
      state = addDigit(state, digit);
    }
    expect(state.userInput).toEqual(state.sequence);

    // extra taps beyond sequence length are ignored
    state = addDigit(state, 1);
    expect(state.userInput).toHaveLength(state.sequence.length);
  });

  it("clearInput resets the answer during input phase only", () => {
    let state = beginInput(createInitialState("easy"));
    state = addDigit(state, state.sequence[0]);
    state = clearInput(state);
    expect(state.userInput).toEqual([]);
  });
});

describe("isSequenceCorrect / submitAnswer", () => {
  it("recognizes a fully correct answer", () => {
    let state = beginInput(createInitialState("easy"));
    for (const digit of state.sequence) state = addDigit(state, digit);
    expect(isSequenceCorrect(state)).toBe(true);

    state = submitAnswer(state);
    expect(state.recallPhase).toBe("feedback");
    expect(state.lastRoundCorrect).toBe(true);
    expect(state.correctRounds).toBe(1);
    expect(state.incorrectRounds).toBe(0);
  });

  it("recognizes an incorrect answer", () => {
    let state = beginInput(createInitialState("easy"));
    const wrong = state.sequence.map((d) => (d % 9) + 1); // shift every digit
    for (const digit of wrong) state = addDigit(state, digit);

    state = submitAnswer(state);
    expect(state.lastRoundCorrect).toBe(false);
    expect(state.incorrectRounds).toBe(1);
    expect(state.correctRounds).toBe(0);
  });

  it("isInputComplete is only true once every slot is filled", () => {
    let state = beginInput(createInitialState("easy"));
    expect(isInputComplete(state)).toBe(false);
    for (const digit of state.sequence) state = addDigit(state, digit);
    expect(isInputComplete(state)).toBe(true);
  });
});

describe("nextRound", () => {
  it("increments the round and grows the sequence by one", () => {
    const state = createInitialState("easy");
    const next = nextRound(state);
    expect(next.round).toBe(state.round + 1);
    expect(next.sequence).toHaveLength(state.sequence.length + 1);
    expect(next.recallPhase).toBe("showing");
  });
});

describe("isGameComplete", () => {
  it("is true once round exceeds totalRounds", () => {
    const state = createInitialState("easy");
    expect(isGameComplete(state)).toBe(false);
    expect(isGameComplete({ ...state, round: state.totalRounds + 1 })).toBe(true);
  });
});

describe("scoring", () => {
  it("rewards more correct rounds and penalizes incorrect ones", () => {
    const base = createInitialState("easy");
    const good = { ...base, correctRounds: 5, incorrectRounds: 0 };
    const bad = { ...base, correctRounds: 2, incorrectRounds: 3 };
    expect(calculateSequenceRecallScore(good)).toBeGreaterThan(
      calculateSequenceRecallScore(bad)
    );
  });

  it("accuracy is 0 with no attempts and 100 with all-correct attempts", () => {
    const base = createInitialState("easy");
    expect(calculateSequenceRecallAccuracy(base)).toBe(0);
    expect(
      calculateSequenceRecallAccuracy({ ...base, correctRounds: 4, incorrectRounds: 0 })
    ).toBe(100);
  });
});
