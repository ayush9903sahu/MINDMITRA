import { Difficulty } from "@/types";

export interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  options?: Difficulty[];
}

const LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/**
 * Segmented control for choosing game difficulty. Implemented as a
 * radiogroup so screen readers announce the choice and current selection.
 */
export function DifficultySelector({
  value,
  onChange,
  options = ["easy", "medium", "hard"],
}: DifficultySelectorProps) {
  return (
    <div role="radiogroup" aria-label="Difficulty" className="flex gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={`min-h-touch flex-1 rounded-xl border-2 px-4 text-base font-medium transition-colors
              ${
                selected
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100"
              }`}
          >
            {LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
