/**
 * Official Boggle dice distributions.
 * 4x4: classic 16-die set (Hasbro).
 * 5x5: Big Boggle 25-die set.
 * Each string = the 6 faces of one die; roll = pick one face randomly.
 */

export const DICE_4x4 = [
  "AAEEGN",
  "ELRTTY",
  "AOOTTW",
  "ABBJOO",
  "EHRTVW",
  "CIMOTU",
  "DISTTY",
  "EIOSST",
  "DELRVY",
  "ACHOPS",
  "HIMNQU",
  "EEINSU",
  "EEGHNW",
  "AFFKPS",
  "HLNNRZ",
  "DEILRX",
] as const;

export const DICE_5x5 = [
  "AAAFRS",
  "AAEEEE",
  "AAFIRS",
  "ADENNN",
  "AEEEEM",
  "AEEGMU",
  "AEGMNN",
  "AFIRSY",
  "BJKQXZ",
  "CCNSTW",
  "CEIILT",
  "CEILPT",
  "CEIPST",
  "DDLNOR",
  "DHHLOR",
  "DHHNOT",
  "DHLNOR",
  "EIIITT",
  "EMOTTT",
  "ENSSSU",
  "FIPRSY",
  "GORRVW",
  "HIPRRY",
  "NOOTUW",
  "OOOTTU",
] as const;

/**
 * Roll one die — pick a random face character.
 * "QU" is treated as a special two-letter face for the Q die.
 */
export function rollFace(die: string): string {
  const face = die[Math.floor(Math.random() * die.length)] ?? "A";
  return face === "Q" ? "Qu" : face;
}
