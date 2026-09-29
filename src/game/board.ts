/**
 * Board generation — shuffle dice into a grid, roll each face.
 */
import { DICE_4x4, DICE_5x5, rollFace } from "./dice";

export interface Board {
  size: 4 | 5;
  letters: string[];
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

export function rollBoard(size: 4 | 5): Board {
  const letters = shuffle(size === 4 ? DICE_4x4 : DICE_5x5).map(rollFace);
  return { size, letters };
}

/**
 * Returns the grid indices that are adjacent (including diagonals) to index i.
 */
export function adjacents(index: number, size: number): number[] {
  const row = Math.floor(index / size);
  const col = index % size;
  const result: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        result.push(r * size + c);
      }
    }
  }
  return result;
}
