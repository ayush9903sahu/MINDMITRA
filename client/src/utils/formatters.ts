/** Formats a duration given in seconds as a compact, readable string. */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0 min";

  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) return "Less than 1 min";
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

/** Formats an ISO timestamp as a friendly date, e.g. "Sep 20, 2026". */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Formats an ISO timestamp as a friendly date + time. */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Formats an accuracy value (0-100) or returns a placeholder if absent. */
export function formatAccuracy(accuracy: number | null): string {
  if (accuracy === null || Number.isNaN(accuracy)) return "Not tracked";
  return `${Math.round(accuracy)}%`;
}

export function formatDifficulty(difficulty: string): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * IMPORTANT — medical-positioning rule:
 * This app must never describe changes in game performance as changes in
 * a medical or cognitive ability (e.g. "Your memory has improved by 12%").
 * Always describe the metric being measured, e.g.
 * "Your game score has changed by 12%". This helper enforces that wording
 * so individual components can't accidentally phrase it as a medical claim.
 */
export function describeScoreChange(
  previousScore: number,
  latestScore: number,
): string {
  if (previousScore === 0) {
    return "Not enough history yet to compare game scores.";
  }

  const percentChange = ((latestScore - previousScore) / previousScore) * 100;
  const rounded = Math.round(Math.abs(percentChange));

  if (rounded === 0) {
    return "Your game score has stayed about the same.";
  }

  const direction = percentChange > 0 ? "increased" : "decreased";
  return `Your game score has ${direction} by ${rounded}% since your previous session.`;
}

/** Same idea, but for accuracy rather than score. */
export function describeAccuracyChange(
  previousAccuracy: number | null,
  latestAccuracy: number | null,
): string {
  if (previousAccuracy === null || latestAccuracy === null) {
    return "Accuracy is not tracked for this game.";
  }
  if (previousAccuracy === 0) {
    return "Not enough history yet to compare accuracy.";
  }

  const percentChange =
    ((latestAccuracy - previousAccuracy) / previousAccuracy) * 100;
  const rounded = Math.round(Math.abs(percentChange));

  if (rounded === 0) {
    return "Your game accuracy has stayed about the same.";
  }

  const direction = percentChange > 0 ? "increased" : "decreased";
  return `Your game accuracy has ${direction} by ${rounded}% since your previous session.`;
}
