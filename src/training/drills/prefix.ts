/**
 * Prefix sprint targets — common high-yield prefixes for Boggle.
 */
export const PREFIXES = [
  "QU", "UN", "RE", "ST", "PR", "TR", "DE", "DIS",
  "EX", "OUT", "OVER", "UNDER", "IN", "EN", "COM",
  "CON", "PRE", "MIS", "NON", "FOR",
] as const;

export type Prefix = typeof PREFIXES[number];

export function pickRandomPrefix(): Prefix {
  return PREFIXES[Math.floor(Math.random() * PREFIXES.length)] ?? "RE";
}
