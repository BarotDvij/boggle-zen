/**
 * Suffix sprint targets.
 */
export const SUFFIXES = [
  "ING", "ED", "ER", "EST", "IEST", "LY", "NESS",
  "TION", "MENT", "ABLE", "IBLE", "FUL", "LESS",
  "ISH", "WARD", "WISE",
] as const;

export type Suffix = typeof SUFFIXES[number];

export function pickRandomSuffix(): Suffix {
  return SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] ?? "ING";
}
