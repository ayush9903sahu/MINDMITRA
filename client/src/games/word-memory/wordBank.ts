import type { Difficulty } from '../../../../shared/types/game';
import type {
  SimilarityLevel,
  WordMemoryDifficultySettings,
  WordMemorySelectableWord,
} from '../../../../shared/types/wordMemory';

export const DIFFICULTY_SETTINGS: Record<Difficulty, WordMemoryDifficultySettings> = {
  easy: { targetWordCount: 5, distractorCount: 5, similarity: 'low', memorizeSeconds: 20 },
  medium: { targetWordCount: 8, distractorCount: 8, similarity: 'medium', memorizeSeconds: 25 },
  hard: { targetWordCount: 10, distractorCount: 12, similarity: 'high', memorizeSeconds: 20 },
};

/**
 * Common, everyday words (no obscure vocabulary), grouped into small
 * "families" of visually/phonetically similar words. This lets us pick
 * harder distractors (same family as a target) or easier distractors
 * (unrelated common word) without any external service.
 */
const WORD_FAMILIES: string[][] = [
  ['Chair', 'Chairs', 'Char', 'Charm'],
  ['House', 'Horse', 'Hose', 'Home'],
  ['Bread', 'Break', 'Breed', 'Bead'],
  ['Table', 'Tablet', 'Stable', 'Cable'],
  ['River', 'Ribbon', 'Rider', 'Rivet'],
  ['Garden', 'Guard', 'Harden', 'Garland'],
  ['Window', 'Widow', 'Wind', 'Wander'],
  ['Kitten', 'Kitchen', 'Mitten', 'Kite'],
  ['Basket', 'Bracket', 'Blanket', 'Basked'],
  ['Pencil', 'Pen', 'Pencils', 'Pensive'],
];

/** Common, everyday standalone words used for low-similarity distractors. */
const NEUTRAL_COMMON_WORDS = [
  'Apple', 'Cloud', 'Music', 'Forest', 'Bottle', 'Candle', 'Mirror', 'Pillow',
  'Ladder', 'Ocean', 'Blanket', 'Coffee', 'Garden', 'Butter', 'Whistle', 'Anchor',
  'Feather', 'Lantern', 'Marble', 'Ribbon', 'Shadow', 'Thunder', 'Velvet', 'Whisper',
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickTargetWords(count: number): string[] {
  const pool = shuffle(NEUTRAL_COMMON_WORDS);
  return pool.slice(0, count);
}

function pickDistractors(
  targetWords: string[],
  count: number,
  similarity: SimilarityLevel
): string[] {
  const used = new Set(targetWords);
  const distractors: string[] = [];

  if (similarity === 'high') {
    // Prefer words from the same family as a target word, when available.
    const shuffledFamilies = shuffle(WORD_FAMILIES);
    for (const family of shuffledFamilies) {
      if (distractors.length >= count) break;
      const familyMatch = family.find((w) => used.has(w));
      if (familyMatch) {
        const candidate = shuffle(family.filter((w) => w !== familyMatch && !used.has(w)))[0];
        if (candidate && !distractors.includes(candidate)) {
          distractors.push(candidate);
          used.add(candidate);
        }
      }
    }
  } else if (similarity === 'medium') {
    // Mix: about half family-based, half neutral common words.
    const shuffledFamilies = shuffle(WORD_FAMILIES);
    for (const family of shuffledFamilies) {
      if (distractors.length >= Math.ceil(count / 2)) break;
      const candidate = shuffle(family.filter((w) => !used.has(w)))[0];
      if (candidate && !distractors.includes(candidate)) {
        distractors.push(candidate);
        used.add(candidate);
      }
    }
  }

  // Fill any remaining slots with neutral common words not already used.
  const neutralPool = shuffle(NEUTRAL_COMMON_WORDS.filter((w) => !used.has(w)));
  for (const word of neutralPool) {
    if (distractors.length >= count) break;
    distractors.push(word);
    used.add(word);
  }

  return distractors.slice(0, count);
}

export interface WordMemoryRoundData {
  targetWords: string[];
  distractorWords: string[];
  selectableWords: WordMemorySelectableWord[];
}

/** Builds one round: the words to memorize, and the full shuffled selection set. */
export function generateWordMemoryRound(difficulty: Difficulty): WordMemoryRoundData {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const targetWords = pickTargetWords(settings.targetWordCount);
  const distractorWords = pickDistractors(targetWords, settings.distractorCount, settings.similarity);

  const selectableWords: WordMemorySelectableWord[] = shuffle([
    ...targetWords.map((word) => ({ id: `t-${word}`, word, isTarget: true })),
    ...distractorWords.map((word) => ({ id: `d-${word}`, word, isTarget: false })),
  ]);

  return { targetWords, distractorWords, selectableWords };
}
