import { describe, expect, it } from "vitest";
import {
  calculateWordMemoryAccuracy,
  calculateWordMemoryScore,
  createInitialState,
  isGameComplete,
  submitSelections,
  tickMemorizeClock,
  toggleWord,
  type WordMemoryState,
} from "./wordMemoryLogic";
import { DIFFICULTY_SETTINGS } from "./wordBank";

describe("createInitialState", () => {
  it("starts in the memorize phase with the difficulty's word counts", () => {
    const state = createInitialState("medium");
    expect(state.phase).toBe("memorize");
    expect(state.submitted).toBe(false);
    expect(state.round.targetWords).toHaveLength(DIFFICULTY_SETTINGS.medium.targetWordCount);
    expect(state.round.distractorWords).toHaveLength(DIFFICULTY_SETTINGS.medium.distractorCount);
    expect(state.secondsLeft).toBe(DIFFICULTY_SETTINGS.medium.memorizeSeconds);
  });
});

describe("tickMemorizeClock", () => {
  it("counts down and flips to select phase at zero", () => {
    let state = createInitialState("easy");
    const totalSeconds = state.secondsLeft;
    for (let i = 0; i < totalSeconds - 1; i += 1) {
      state = tickMemorizeClock(state);
      expect(state.phase).toBe("memorize");
    }
    state = tickMemorizeClock(state);
    expect(state.phase).toBe("select");
    expect(state.secondsLeft).toBe(0);
  });

  it("is a no-op once already in the select phase", () => {
    let state = createInitialState("easy");
    state = { ...state, phase: "select" };
    const ticked = tickMemorizeClock(state);
    expect(ticked).toEqual(state);
  });
});

describe("toggleWord / submitSelections", () => {
  function selectState(): WordMemoryState {
    return { ...createInitialState("easy"), phase: "select" };
  }

  it("ignores toggles during the memorize phase", () => {
    const state = createInitialState("easy"); // still "memorize"
    const targetId = state.round.selectableWords[0].id;
    const toggled = toggleWord(state, targetId);
    expect(toggled).toEqual(state);
  });

  it("toggles a word's selection on and off during select", () => {
    const state = selectState();
    const wordId = state.round.selectableWords[0].id;
    const selected = toggleWord(state, wordId);
    expect(selected.selectedIds).toContain(wordId);
    const deselected = toggleWord(selected, wordId);
    expect(deselected.selectedIds).not.toContain(wordId);
  });

  it("scores selecting every target word and nothing else as 100% accurate", () => {
    let state = selectState();
    for (const word of state.round.targetWords) {
      const item = state.round.selectableWords.find((w) => w.word === word);
      if (item) state = toggleWord(state, item.id);
    }
    state = submitSelections(state);
    expect(state.submitted).toBe(true);
    expect(state.correctSelections).toBe(state.round.targetWords.length);
    expect(state.falseSelections).toBe(0);
    expect(state.missedWords).toBe(0);
    expect(isGameComplete(state)).toBe(true);
    expect(calculateWordMemoryAccuracy(state)).toBe(100);
    expect(calculateWordMemoryScore(state)).toBe(state.round.targetWords.length * 10);
  });

  it("never returns negative score even with only false selections", () => {
    let state = selectState();
    const distractor = state.round.selectableWords.find((w) => !w.isTarget);
    if (distractor) state = toggleWord(state, distractor.id);
    state = submitSelections(state);
    expect(calculateWordMemoryScore(state)).toBeGreaterThanOrEqual(0);
    expect(calculateWordMemoryAccuracy(state)).toBeGreaterThanOrEqual(0);
  });

  it("locks further toggles and re-submission once submitted", () => {
    let state = selectState();
    state = submitSelections(state);
    const wordId = state.round.selectableWords[0].id;
    const afterToggle = toggleWord(state, wordId);
    expect(afterToggle).toEqual(state);
    const afterResubmit = submitSelections(state);
    expect(afterResubmit).toEqual(state);
  });
});
