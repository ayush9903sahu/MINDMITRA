import { describe, expect, it } from "vitest";
import {
  calculateLogicPuzzlesAccuracy,
  calculateLogicPuzzlesScore,
  continueToNext,
  createInitialState,
  currentQuestion,
  isGameComplete,
  isSelectionCorrect,
  selectOption,
} from "./logicPuzzleLogic";
import { QUESTION_COUNT_BY_DIFFICULTY } from "./questionBank";

describe("createInitialState", () => {
  it("generates the right number of questions for the difficulty", () => {
    const state = createInitialState("hard");
    expect(state.questions).toHaveLength(QUESTION_COUNT_BY_DIFFICULTY.hard);
    expect(state.phase).toBe("question");
    expect(state.submitted).toBe(false);
    expect(state.currentIndex).toBe(0);
  });
});

describe("selectOption / continueToNext", () => {
  it("moves to feedback on selection, then records the answer and advances on continue", () => {
    let state = createInitialState("easy");
    const question = currentQuestion(state)!;

    state = selectOption(state, question.correctOptionId);
    expect(state.phase).toBe("feedback");
    expect(isSelectionCorrect(state)).toBe(true);

    state = continueToNext(state);
    expect(state.answers).toHaveLength(1);
    expect(state.answers[0].correct).toBe(true);
    expect(state.phase).toBe("question");
    expect(state.currentIndex).toBe(1);
    expect(state.submitted).toBe(false);
  });

  it("ignores option selection once already in feedback", () => {
    let state = createInitialState("easy");
    const question = currentQuestion(state)!;
    state = selectOption(state, question.correctOptionId);
    const secondOptionId = question.options.find((o) => o.id !== question.correctOptionId)?.id;
    const again = secondOptionId ? selectOption(state, secondOptionId) : state;
    expect(again).toEqual(state);
  });

  it("marks the game complete after the last question is answered", () => {
    let state = createInitialState("easy");
    const total = state.questions.length;
    for (let i = 0; i < total; i += 1) {
      const question = currentQuestion(state)!;
      state = selectOption(state, question.correctOptionId);
      state = continueToNext(state);
    }
    expect(state.answers).toHaveLength(total);
    expect(isGameComplete(state)).toBe(true);
    expect(calculateLogicPuzzlesAccuracy(state)).toBe(100);
    expect(calculateLogicPuzzlesScore(state)).toBe(total * 10);
  });

  it("scores zero for an all-incorrect run", () => {
    let state = createInitialState("easy");
    const total = state.questions.length;
    for (let i = 0; i < total; i += 1) {
      const question = currentQuestion(state)!;
      const wrongOption = question.options.find((o) => o.id !== question.correctOptionId);
      state = selectOption(state, wrongOption ? wrongOption.id : question.correctOptionId);
      state = continueToNext(state);
    }
    if (state.answers.every((a) => !a.correct)) {
      expect(calculateLogicPuzzlesScore(state)).toBe(0);
      expect(calculateLogicPuzzlesAccuracy(state)).toBe(0);
    }
  });
});

describe("calculateLogicPuzzlesAccuracy", () => {
  it("returns 0 when no questions have been answered yet", () => {
    const state = createInitialState("easy");
    expect(calculateLogicPuzzlesAccuracy(state)).toBe(0);
  });
});
