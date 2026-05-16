/**
 * Classic Boggle scoring (standard Hasbro rules).
 * Words under 3 letters don't count.
 */
export function scoreWord(word: string): number {
  const len = word.replace("QU", "Q").length; // treat Qu as one letter
  if (len < 3) return 0;
  if (len <= 4) return 1;
  if (len === 5) return 2;
  if (len === 6) return 3;
  if (len === 7) return 5;
  return 11;
}

export function totalScore(words: string[]): number {
  return words.reduce((sum, w) => sum + scoreWord(w), 0);
}
