import { describe, expect, it } from "vitest";
import {
  allTargetsFound,
  calculateSelectiveAttentionAccuracy,
  calculateSelectiveAttentionScore,
  createInitialState,
  finalizeAttempt,
  selectCell,
  settingsForDifficulty,
} from "./selectiveAttentionLogic";

describe("settingsForDifficulty", () => {
  it("increases grid size and distractor variety with difficulty", () => {
    expect(settingsForDifficulty("easy").gridSize).toBe(5);
    expect(settingsForDifficulty("medium").gridSize).toBe(6);
    expect(settingsForDifficulty("hard").gridSize).toBe(7);
    expect(settingsForDifficulty("hard").distractorSymbolCount).toBeGreaterThan(
      settingsForDifficulty("easy").distractorSymbolCount
    );
  });
});

describe("createInitialState", () => {
  it("places exactly targetCount target cells", () => {
    const state = createInitialState("medium");
    const actualTargets = state.cells.filter((c) => c.isTarget).length;
    expect(actualTargets).toBe(state.targetCount);
  });

  it("fills the whole grid (gridSize squared cells)", () => {
    const state = createInitialState("hard");
    expect(state.cells).toHaveLength(7 * 7);
  });
});

describe("selectCell", () => {
  it("counts a target selection as correct", () => {
    let state = createInitialState("easy");
    const targetCell = state.cells.find((c) => c.isTarget)!;
    state = selectCell(state, targetCell.id);
    expect(state.correctSelections).toBe(1);
    expect(state.incorrectSelections).toBe(0);
    expect(state.cells.find((c) => c.id === targetCell.id)!.isSelected).toBe(true);
  });

  it("counts a non-target selection as incorrect", () => {
    let state = createInitialState("easy");
    const distractor = state.cells.find((c) => !c.isTarget)!;
    state = selectCell(state, distractor.id);
    expect(state.incorrectSelections).toBe(1);
    expect(state.correctSelections).toBe(0);
  });

  it("ignores re-selecting an already-selected cell", () => {
    let state = createInitialState("easy");
    const cell = state.cells[0];
    state = selectCell(state, cell.id);
    const afterFirst = state;
    state = selectCell(state, cell.id);
    expect(state).toBe(afterFirst);
  });
});

describe("allTargetsFound / finalizeAttempt", () => {
  it("is true once every target cell has been selected", () => {
    let state = createInitialState("easy");
    for (const cell of state.cells.filter((c) => c.isTarget)) {
      state = selectCell(state, cell.id);
    }
    expect(allTargetsFound(state)).toBe(true);
  });

  it("finalizeAttempt tallies missed targets and freezes state", () => {
    const state = createInitialState("easy");
    const finalized = finalizeAttempt(state);
    expect(finalized.finished).toBe(true);
    expect(finalized.missedTargets).toBe(state.targetCount); // none were found
  });
});

describe("scoring", () => {
  it("rewards a clean pass over a sloppy one", () => {
    const base = createInitialState("medium");
    const clean = { ...base, correctSelections: base.targetCount, incorrectSelections: 0, missedTargets: 0 };
    const sloppy = { ...base, correctSelections: 2, incorrectSelections: 6, missedTargets: 3 };
    expect(calculateSelectiveAttentionScore(clean)).toBeGreaterThan(
      calculateSelectiveAttentionScore(sloppy)
    );
  });

  it("accuracy is 0 with no attempts", () => {
    const state = createInitialState("easy");
    expect(calculateSelectiveAttentionAccuracy(state)).toBe(0);
  });
});
