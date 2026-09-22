/**
 * Computes a whole-number age in years from a date of birth, accounting for
 * whether the birthday has occurred yet this year. This is the single source
 * of truth for "age" across the app — age is never persisted, only derived.
 */
export function computeAge(dateOfBirth: Date, referenceDate: Date = new Date()): number {
  let age = referenceDate.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = referenceDate.getMonth() - dateOfBirth.getMonth();
  const dayDiff = referenceDate.getDate() - dateOfBirth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}
