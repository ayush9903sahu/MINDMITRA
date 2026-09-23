import { describe, expect, it } from 'vitest';
import { DIFFICULTY_SETTINGS, generateWordMemoryRound } from './wordBank';
import type { Difficulty } from '../../../../shared/types/game';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

describe('generateWordMemoryRound', () => {
  it.each(DIFFICULTIES)('produces the configured number of target words for %s', (difficulty) => {
    const round = generateWordMemoryRound(difficulty);
    expect(round.targetWords).toHaveLength(DIFFICULTY_SETTINGS[difficulty].targetWordCount);
  });

  it.each(DIFFICULTIES)('produces the configured number of distractor words for %s', (difficulty) => {
    const round = generateWordMemoryRound(difficulty);
    expect(round.distractorWords).toHaveLength(DIFFICULTY_SETTINGS[difficulty].distractorCount);
  });

  it.each(DIFFICULTIES)('selectable words = targets + distractors, with no overlap, for %s', (difficulty) => {
    const round = generateWordMemoryRound(difficulty);
    const settings = DIFFICULTY_SETTINGS[difficulty];
    expect(round.selectableWords).toHaveLength(
      settings.targetWordCount + settings.distractorCount
    );

    const targetSet = new Set(round.targetWords);
    const distractorSet = new Set(round.distractorWords);
    const overlap = [...targetSet].filter((w) => distractorSet.has(w));
    expect(overlap).toHaveLength(0);
  });

  it.each(DIFFICULTIES)('every selectable word is flagged as target/distractor consistently for %s', (difficulty) => {
    const round = generateWordMemoryRound(difficulty);
    const targetSet = new Set(round.targetWords);
    for (const item of round.selectableWords) {
      expect(item.isTarget).toBe(targetSet.has(item.word));
    }
  });

  it('hard difficulty is not slower/easier than easy (more targets and distractors)', () => {
    const easy = DIFFICULTY_SETTINGS.easy;
    const hard = DIFFICULTY_SETTINGS.hard;
    expect(hard.targetWordCount).toBeGreaterThanOrEqual(easy.targetWordCount);
    expect(hard.distractorCount).toBeGreaterThan(easy.distractorCount);
  });
});
