import { computeAge } from "../utils/age";

describe("computeAge", () => {
  it("returns the correct age when the birthday has already passed this year", () => {
    expect(computeAge(new Date("1960-01-01"), new Date("2026-06-15"))).toBe(66);
  });

  it("returns the correct age when the birthday has not yet occurred this year", () => {
    expect(computeAge(new Date("1960-12-31"), new Date("2026-06-15"))).toBe(65);
  });

  it("returns the correct age exactly on the birthday", () => {
    expect(computeAge(new Date("1960-06-15"), new Date("2026-06-15"))).toBe(66);
  });

  it("returns 0 for a birth date earlier this year", () => {
    expect(computeAge(new Date("2026-01-01"), new Date("2026-06-15"))).toBe(0);
  });
});
