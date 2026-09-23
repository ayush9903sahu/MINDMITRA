import { describe, expect, it } from "vitest";
import {
  calculateMemoryMatchAccuracy,
  calculateMemoryMatchScore,
  createBoard,
  createInitialState,
  flipCard,
  isBoardComplete,
  pairsForDifficulty,
  resolveMismatch,
} from "./memoryMatchLogic";

describe("pairsForDifficulty", () => {
  it("increases pair count with difficulty", () => {
    expect(pairsForDifficulty("easy")).toBe(6);
    expect(pairsForDifficulty("medium")).toBe(10);
    expect(pairsForDifficulty("hard")).toBe(15);
  });
});

describe("createBoard", () => {
  it("creates a board with exactly two of every symbol", () => {
    const board = createBoard("easy");
    expect(board).toHaveLength(12);
    const counts = new Map<string, number>();
    for (const card of board) {
      counts.set(card.symbol, (counts.get(card.symbol) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count).toBe(2);
    }
  });

  it("gives every card a unique id", () => {
    const board = createBoard("medium");
    const ids = new Set(board.map((c) => c.id));
    expect(ids.size).toBe(board.length);
  });
});

describe("flipCard", () => {
  it("flips a single card without resolving anything", () => {
    const state = createInitialState("easy");
    const next = flipCard(state, state.cards[0].id);
    expect(next.flippedIds).toEqual([state.cards[0].id]);
    expect(next.moves).toBe(0);
  });

  it("matches two cards with the same symbol and increments moves + matchedPairs", () => {
    let state = createInitialState("easy");
    const [first] = state.cards;
    const partner = state.cards.find((c) => c.symbol === first.symbol && c.id !== first.id)!;

    state = flipCard(state, first.id);
    state = flipCard(state, partner.id);

    expect(state.moves).toBe(1);
    expect(state.matchedPairs).toBe(1);
    expect(state.flippedIds).toEqual([]);
    expect(state.cards.find((c) => c.id === first.id)!.isMatched).toBe(true);
    expect(state.cards.find((c) => c.id === partner.id)!.isMatched).toBe(true);
  });

  it("keeps a mismatched pair flipped (until resolveMismatch is called) and counts the move", () => {
    let state = createInitialState("easy");
    const first = state.cards[0];
    const nonMatch = state.cards.find((c) => c.symbol !== first.symbol)!;

    state = flipCard(state, first.id);
    state = flipCard(state, nonMatch.id);

    expect(state.moves).toBe(1);
    expect(state.matchedPairs).toBe(0);
    expect(state.flippedIds.sort()).toEqual([first.id, nonMatch.id].sort());
  });

  it("ignores clicks on an already-matched card", () => {
    let state = createInitialState("easy");
    const first = state.cards[0];
    const partner = state.cards.find((c) => c.symbol === first.symbol && c.id !== first.id)!;
    state = flipCard(state, first.id);
    state = flipCard(state, partner.id);

    const next = flipCard(state, first.id);
    expect(next).toBe(state); // unchanged reference — no-op
  });

  it("ignores a third flip while two cards are already face up", () => {
    let state = createInitialState("easy");
    const first = state.cards[0];
    const nonMatch = state.cards.find((c) => c.symbol !== first.symbol)!;
    const third = state.cards.find(
      (c) => c.id !== first.id && c.id !== nonMatch.id
    )!;

    state = flipCard(state, first.id);
    state = flipCard(state, nonMatch.id);
    const next = flipCard(state, third.id);

    expect(next).toBe(state);
  });
});

describe("resolveMismatch", () => {
  it("clears flippedIds when the pair did not match", () => {
    let state = createInitialState("easy");
    const first = state.cards[0];
    const nonMatch = state.cards.find((c) => c.symbol !== first.symbol)!;
    state = flipCard(state, first.id);
    state = flipCard(state, nonMatch.id);

    const resolved = resolveMismatch(state);
    expect(resolved.flippedIds).toEqual([]);
  });
});

describe("isBoardComplete", () => {
  it("is true once matchedPairs equals totalPairs", () => {
    const state = createInitialState("easy");
    expect(isBoardComplete(state)).toBe(false);
    expect(isBoardComplete({ ...state, matchedPairs: state.totalPairs })).toBe(true);
  });
});

describe("calculateMemoryMatchScore", () => {
  it("scores a perfect game higher than a sloppy one", () => {
    const state = createInitialState("easy");
    const perfect = { ...state, matchedPairs: 6, moves: 6 };
    const sloppy = { ...state, matchedPairs: 6, moves: 20 };

    expect(calculateMemoryMatchScore(perfect, 30)).toBeGreaterThan(
      calculateMemoryMatchScore(sloppy, 30)
    );
  });

  it("never returns a negative score", () => {
    const state = createInitialState("easy");
    const bad = { ...state, matchedPairs: 1, moves: 500 };
    expect(calculateMemoryMatchScore(bad, 10000)).toBeGreaterThanOrEqual(0);
  });
});

describe("calculateMemoryMatchAccuracy", () => {
  it("is 0 when no moves have been made", () => {
    const state = createInitialState("easy");
    expect(calculateMemoryMatchAccuracy(state)).toBe(0);
  });

  it("is 100 when every move resulted in a match", () => {
    const state = createInitialState("easy");
    expect(
      calculateMemoryMatchAccuracy({ ...state, moves: 6, matchedPairs: 6 })
    ).toBe(100);
  });
});
