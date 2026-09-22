/**
 * Trims whitespace and strips angle brackets / control characters from
 * free-text input (name, address lines, city, state, country, custom gender
 * label). This is defense in depth, not a substitute for output encoding:
 * React already escapes on render and Prisma parameterizes queries, but
 * profile text can end up in places outside React (emails, exports, PDFs)
 * where an unescaped "<script>" would be a real problem. Stripping `<` and
 * `>` here means that never happens, at the cost of disallowing those two
 * characters in address/name fields — an acceptable tradeoff for this data.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, "") // control characters
    .replace(/[<>]/g, "") // angle brackets
    .trim();
}

/** Applies sanitizeText to every string field of a shallow object, leaving non-strings untouched. */
export function sanitizeShallowObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === "string") {
      (result as Record<string, unknown>)[key] = sanitizeText(value);
    }
  }
  return result;
}
