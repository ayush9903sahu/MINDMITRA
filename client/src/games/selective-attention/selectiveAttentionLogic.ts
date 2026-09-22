/**
 * client/src/games/selective-attention/selectiveAttentionLogic.ts
 * Pure logic for Selective Attention: a grid of symbols is shown, the player
 * must tap every occurrence of the target symbol among distractors.
 * Per the accessibility rules, this game is NOT primarily time-pressured —
 * there is no countdown; duration is only recorded for the results screen.
 */

import type { Difficulty } from "../../../../shared/types/game";

export type AttentionSymbol = "star" | "circle" | "triangle" | "square" | "diamond" | "heart";

export interface GridCell {
  id: number;
  symbol: AttentionSymbol;
  isTarget: boolean;
  isSelected: boolean;
}

export interface SelectiveAttentionState {
  target: AttentionSymbol;
  cells: GridCell[];
  targetCount: number;
  correctSelections: number;
  incorrectSelections: number;
  missedTargets: number;
  finished: boolean;
}

const ALL_SYMBOLS: AttentionSymbol[] = ["star", "circle", "triangle", "square", "diamond", "heart"];

interface DifficultySettings {
  gridSize: number; // total cells = gridSize * gridSize
  targetRatio: number; // fraction of cells that are the target symbol
  distractorSymbolCount: number; // how many different non-target symbols appear (similarity)
}

const SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { gridSize: 5, targetRatio: 0.24, distractorSymbolCount: 2 },
  medium: { gridSize: 6, targetRatio: 0.18, distractorSymbolCount: 3 },
  hard: { gridSize: 7, targetRatio: 0.14, distractorSymbolCount: 4 },
};

export function settingsForDifficulty(difficulty: Difficulty): DifficultySettings {
  return SETTINGS[difficulty];
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createInitialState(difficulty: Difficulty): SelectiveAttentionState {
  const settings = settingsForDifficulty(difficulty);
  const totalCells = settings.gridSize * settings.gridSize;

  const target: AttentionSymbol = ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
  const distractorPool = shuffle(ALL_SYMBOLS.filter((s) => s !== target)).slice(
    0,
    settings.distractorSymbolCount
  );

  const targetCount = Math.max(3, Math.round(totalCells * settings.targetRatio));

  const symbols: AttentionSymbol[] = [];
  for (let i = 0; i < targetCount; i++) symbols.push(target);
  for (let i = symbols.length; i < totalCells; i++) {
    symbols.push(distractorPool[i % distractorPool.length]);
  }

  const shuffled = shuffle(symbols);

  const cells: GridCell[] = shuffled.map((symbol, id) => ({
    id,
    symbol,
    isTarget: symbol === target,
    isSelected: false,
  }));

  return {
    target,
    cells,
    targetCount,
    correctSelections: 0,
    incorrectSelections: 0,
    missedTargets: 0,
    finished: false,
  };
}

/** Toggling a cell. Selecting a target cell marks it found; selecting a
 * non-target cell counts as an incorrect selection but the cell stays
 * selectable (so the player can see their own misses), per accessibility
 * guidance of clear, non-punitive feedback. */
export function selectCell(
  state: SelectiveAttentionState,
  cellId: number
): SelectiveAttentionState {
  if (state.finished) return state;
  const cell = state.cells.find((c) => c.id === cellId);
  if (!cell || cell.isSelected) return state;

  const cells = state.cells.map((c) => (c.id === cellId ? { ...c, isSelected: true } : c));

  return {
    ...state,
    cells,
    correctSelections: state.correctSelections + (cell.isTarget ? 1 : 0),
    incorrectSelections: state.incorrectSelections + (cell.isTarget ? 0 : 1),
  };
}

export function allTargetsFound(state: SelectiveAttentionState): boolean {
  return state.cells.filter((c) => c.isTarget && c.isSelected).length >= state.targetCount;
}

/** Called when the player chooses to finish (or all targets are found); tallies missed targets. */
export function finalizeAttempt(state: SelectiveAttentionState): SelectiveAttentionState {
  const missedTargets = state.cells.filter((c) => c.isTarget && !c.isSelected).length;
  return { ...state, missedTargets, finished: true };
}

export function calculateSelectiveAttentionScore(state: SelectiveAttentionState): number {
  const base = state.correctSelections * 40;
  const missedPenalty = state.missedTargets * 20;
  const wrongPenalty = state.incorrectSelections * 10;
  const gridBonus = state.cells.length >= 49 ? 1.4 : state.cells.length >= 36 ? 1.2 : 1;
  return Math.max(0, Math.round((base - missedPenalty - wrongPenalty) * gridBonus));
}

export function calculateSelectiveAttentionAccuracy(state: SelectiveAttentionState): number {
  const totalAttempts = state.correctSelections + state.incorrectSelections + state.missedTargets;
  if (totalAttempts === 0) return 0;
  return Math.round((state.correctSelections / totalAttempts) * 100);
}
