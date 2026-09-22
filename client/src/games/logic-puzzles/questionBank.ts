import type { Difficulty } from '../../../../shared/types/game';
import type {
  LogicPuzzleOption,
  LogicPuzzleQuestion,
  LogicPuzzleType,
} from '../../../../shared/types/logicPuzzle';

/**
 * All questions below are either hand-written (predefined "safe" content
 * banks) or produced by small deterministic algorithms (arithmetic /
 * pattern generators). Nothing here calls an external AI service, so
 * the game works fully offline once the app has loaded.
 */

export const QUESTION_COUNT_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 5,
  medium: 7,
  hard: 10,
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function toOptions(labels: string[]): LogicPuzzleOption[] {
  return shuffle(labels).map((label, index) => ({
    id: `opt-${index}-${label.replace(/\s+/g, '-').toLowerCase()}`,
    label,
  }));
}

function buildQuestion(
  type: LogicPuzzleType,
  prompt: string,
  correctLabel: string,
  distractors: string[]
): LogicPuzzleQuestion {
  const options = toOptions([correctLabel, ...distractors]);
  const correctOption = options.find((o) => o.label === correctLabel);
  if (!correctOption) {
    throw new Error('Internal error: correct option missing from generated options');
  }
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    prompt,
    options,
    correctOptionId: correctOption.id,
  };
}

// ---------------------------------------------------------------------------
// GAME TYPE 1: Odd one out
// ---------------------------------------------------------------------------

interface OddOneOutBankEntry {
  category: string;
  members: string[];
  /** For "hard": items that sound like they could belong but don't. */
  hardOutlierPool: string[];
}

const ODD_ONE_OUT_BANK: OddOneOutBankEntry[] = [
  { category: 'fruit', members: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes'], hardOutlierPool: ['Tomato', 'Potato'] },
  { category: 'animal', members: ['Dog', 'Cat', 'Horse', 'Cow', 'Sheep'], hardOutlierPool: ['Dolphin', 'Bat'] },
  { category: 'vehicle', members: ['Car', 'Bus', 'Bicycle', 'Train', 'Truck'], hardOutlierPool: ['Airplane', 'Boat'] },
  { category: 'furniture', members: ['Chair', 'Table', 'Sofa', 'Bed', 'Shelf'], hardOutlierPool: ['Rug', 'Lamp'] },
  { category: 'weather', members: ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Snowy'], hardOutlierPool: ['Humid', 'Foggy'] },
  { category: 'utensil', members: ['Spoon', 'Fork', 'Knife', 'Plate', 'Bowl'], hardOutlierPool: ['Napkin', 'Tray'] },
];

const EASY_OUTLIERS = ['Bicycle', 'Umbrella', 'Guitar', 'Pencil', 'Shoe', 'Clock', 'Balloon'];

function generateOddOneOut(difficulty: Difficulty): LogicPuzzleQuestion {
  const entry = pickRandom(ODD_ONE_OUT_BANK);
  const groupMembers = shuffle(entry.members).slice(0, 4);

  let outlier: string;
  if (difficulty === 'easy') {
    outlier = pickRandom(EASY_OUTLIERS.filter((w) => !groupMembers.includes(w)));
  } else if (difficulty === 'medium') {
    // Pick an item from a different, unrelated category in the bank.
    const otherEntries = ODD_ONE_OUT_BANK.filter((e) => e.category !== entry.category);
    outlier = pickRandom(pickRandom(otherEntries).members);
  } else {
    // Hard: a close, plausible-looking outlier from the same broad domain.
    outlier = pickRandom(entry.hardOutlierPool);
  }

  const allOptions = shuffle([...groupMembers, outlier]);
  return buildQuestion(
    'odd-one-out',
    'Which one of these does NOT belong with the others?',
    outlier,
    allOptions.filter((label) => label !== outlier)
  );
}

// ---------------------------------------------------------------------------
// GAME TYPE 2: Number sequences
// ---------------------------------------------------------------------------

function generateNumberSequence(difficulty: Difficulty): LogicPuzzleQuestion {
  const length = 4;
  let start: number;
  let step: number;
  let sequence: number[];
  let answer: number;
  let describeRule = '';

  if (difficulty === 'easy') {
    start = Math.floor(Math.random() * 10) + 1;
    step = Math.floor(Math.random() * 4) + 1; // +1..+4
    sequence = Array.from({ length }, (_, i) => start + i * step);
    answer = start + length * step;
  } else if (difficulty === 'medium') {
    start = Math.floor(Math.random() * 15) + 1;
    step = -(Math.floor(Math.random() * 5) + 2); // counting down
    sequence = Array.from({ length }, (_, i) => start + i * step);
    answer = start + length * step;
  } else {
    // Hard: alternating add/subtract or doubling pattern.
    const useDoubling = Math.random() < 0.5;
    if (useDoubling) {
      start = Math.floor(Math.random() * 4) + 2;
      sequence = Array.from({ length }, (_, i) => start * 2 ** i);
      answer = start * 2 ** length;
      describeRule = 'doubling';
    } else {
      start = Math.floor(Math.random() * 10) + 5;
      const stepUp = Math.floor(Math.random() * 3) + 2;
      const stepDown = Math.floor(Math.random() * 2) + 1;
      sequence = [start];
      let current = start;
      for (let i = 1; i < length; i += 1) {
        current = i % 2 === 1 ? current + stepUp : current - stepDown;
        sequence.push(current);
      }
      answer = length % 2 === 1 ? current - stepDown : current + stepUp;
    }
  }

  const distractorSet = new Set<number>();
  while (distractorSet.size < 3) {
    const offset = pickRandom([-3, -2, -1, 1, 2, 3]);
    const candidate = answer + offset;
    if (candidate !== answer) distractorSet.add(candidate);
  }

  return buildQuestion(
    'number-sequence',
    `What number comes next in this sequence: ${sequence.join(', ')}, ?`,
    String(answer),
    [...distractorSet].map(String)
  );
}

// ---------------------------------------------------------------------------
// GAME TYPE 3: Ordering
// ---------------------------------------------------------------------------

interface OrderingBankEntry {
  prompt: string;
  correctOrder: string[];
}

const ORDERING_BANK: OrderingBankEntry[] = [
  {
    prompt: 'Which order correctly lists the meals of the day, from morning to night?',
    correctOrder: ['Breakfast, Lunch, Dinner', 'Dinner, Breakfast, Lunch', 'Lunch, Dinner, Breakfast'],
  },
  {
    prompt: 'Which order correctly lists these from smallest to largest?',
    correctOrder: ['Small, Medium, Large', 'Large, Small, Medium', 'Medium, Large, Small'],
  },
  {
    prompt: 'Which order correctly lists the seasons, starting with Spring?',
    correctOrder: [
      'Spring, Summer, Autumn, Winter',
      'Winter, Spring, Summer, Autumn',
      'Autumn, Winter, Spring, Summer',
    ],
  },
  {
    prompt: 'Which order correctly lists these steps for making tea?',
    correctOrder: [
      'Boil water, Add tea leaves, Pour into cup',
      'Pour into cup, Boil water, Add tea leaves',
      'Add tea leaves, Pour into cup, Boil water',
    ],
  },
  {
    prompt: 'Which order correctly lists the days from Monday?',
    correctOrder: [
      'Monday, Tuesday, Wednesday',
      'Wednesday, Monday, Tuesday',
      'Tuesday, Wednesday, Monday',
    ],
  },
];

function generateOrdering(): LogicPuzzleQuestion {
  const entry = pickRandom(ORDERING_BANK);
  const [correct, ...wrongOrders] = entry.correctOrder;
  return buildQuestion('ordering', entry.prompt, correct, wrongOrders);
}

// ---------------------------------------------------------------------------
// GAME TYPE 4: Matching logic
// ---------------------------------------------------------------------------

interface MatchingBankEntry {
  prompt: string;
  word: string;
  correctMatch: string;
  distractors: string[];
}

const MATCHING_BANK: MatchingBankEntry[] = [
  { prompt: 'Which word means the same as "Happy"?', word: 'Happy', correctMatch: 'Glad', distractors: ['Sad', 'Angry', 'Tired'] },
  { prompt: 'Which word means the opposite of "Hot"?', word: 'Hot', correctMatch: 'Cold', distractors: ['Warm', 'Sunny', 'Bright'] },
  { prompt: 'Which word goes with "Salt"?', word: 'Salt', correctMatch: 'Pepper', distractors: ['Sugar', 'Rice', 'Flour'] },
  { prompt: 'Which word goes with "Cup"?', word: 'Cup', correctMatch: 'Saucer', distractors: ['Pillow', 'Ladder', 'Window'] },
  { prompt: 'Which word means the same as "Big"?', word: 'Big', correctMatch: 'Large', distractors: ['Small', 'Narrow', 'Short'] },
  { prompt: 'Which word means the opposite of "Fast"?', word: 'Fast', correctMatch: 'Slow', distractors: ['Quick', 'Sudden', 'Early'] },
];

function generateMatching(): LogicPuzzleQuestion {
  const entry = pickRandom(MATCHING_BANK);
  return buildQuestion('matching', entry.prompt, entry.correctMatch, entry.distractors);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const TYPES_BY_DIFFICULTY: Record<Difficulty, LogicPuzzleType[]> = {
  easy: ['odd-one-out', 'ordering', 'matching'],
  medium: ['odd-one-out', 'number-sequence', 'ordering', 'matching'],
  hard: ['odd-one-out', 'number-sequence', 'ordering', 'matching'],
};

function generateOneQuestion(difficulty: Difficulty): LogicPuzzleQuestion {
  const type = pickRandom(TYPES_BY_DIFFICULTY[difficulty]);
  switch (type) {
    case 'odd-one-out':
      return generateOddOneOut(difficulty);
    case 'number-sequence':
      return generateNumberSequence(difficulty);
    case 'ordering':
      return generateOrdering();
    case 'matching':
      return generateMatching();
    default: {
      const exhaustive: never = type;
      throw new Error(`Unhandled logic puzzle type: ${exhaustive}`);
    }
  }
}

/** Generates a full, deduplicated set of questions for one game session. */
export function generateQuestionSet(difficulty: Difficulty): LogicPuzzleQuestion[] {
  const count = QUESTION_COUNT_BY_DIFFICULTY[difficulty];
  const seenPrompts = new Set<string>();
  const questions: LogicPuzzleQuestion[] = [];
  let safety = 0;

  while (questions.length < count && safety < count * 20) {
    safety += 1;
    const question = generateOneQuestion(difficulty);
    const key = `${question.type}:${question.prompt}`;
    if (seenPrompts.has(key) && difficulty !== 'easy') {
      // Allow a little repetition on easy (small bank), avoid it otherwise.
      continue;
    }
    seenPrompts.add(key);
    questions.push(question);
  }

  return questions;
}
