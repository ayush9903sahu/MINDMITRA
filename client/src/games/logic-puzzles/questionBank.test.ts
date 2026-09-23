import { describe, expect, it } from 'vitest';
import { generateQuestionSet, QUESTION_COUNT_BY_DIFFICULTY } from './questionBank';
import type { Difficulty } from '../../../../shared/types/game';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

describe('generateQuestionSet', () => {
  it.each(DIFFICULTIES)('generates the expected number of questions for %s', (difficulty) => {
    const questions = generateQuestionSet(difficulty);
    expect(questions).toHaveLength(QUESTION_COUNT_BY_DIFFICULTY[difficulty]);
  });

  it.each(DIFFICULTIES)('every question has a correct option present in its options for %s', (difficulty) => {
    const questions = generateQuestionSet(difficulty);
    for (const question of questions) {
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      expect(correctOption).toBeDefined();
    }
  });

  it.each(DIFFICULTIES)('every question has at least 3 options for %s', (difficulty) => {
    const questions = generateQuestionSet(difficulty);
    for (const question of questions) {
      expect(question.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it.each(DIFFICULTIES)('every question has exactly one correct option among its options for %s', (difficulty) => {
    const questions = generateQuestionSet(difficulty);
    for (const question of questions) {
      const matches = question.options.filter((o) => o.id === question.correctOptionId);
      expect(matches).toHaveLength(1);
    }
  });

  it('does not rely on any network call (runs fully synchronously offline)', () => {
    // generateQuestionSet returns a plain array, not a Promise — this
    // guards against a future regression that makes generation async
    // (e.g. by calling an external API).
    const result = generateQuestionSet('medium');
    expect(Array.isArray(result)).toBe(true);
  });
});
