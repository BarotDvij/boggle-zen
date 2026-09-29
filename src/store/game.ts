/**
 * Boggle Zen — active game state.
 * Holds the current board and found words in memory.
 */
import { create } from "zustand";
import type { Board } from "@/game/board";
import { scoreWord } from "@/game/scoring";

export type WordResult = "added" | "duplicate" | "invalid";

export interface FoundWord {
  word: string;
  path: number[];
  score: number;
  foundAt: number;
}

interface GameState {
  board: Board | null;
  durationSec: number;
  foundWords: FoundWord[];
  allSolutions: Map<string, number[][]> | null;
  begin: (
    board: Board,
    durationSec: number,
    allSolutions: Map<string, number[][]>
  ) => void;
  addFound: (word: string, path: number[]) => WordResult;
  reset: () => void;
}

const initial = {
  board: null,
  durationSec: 180,
  foundWords: [],
  allSolutions: null,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initial,
  begin: (board, durationSec, allSolutions) =>
    set({ board, durationSec, foundWords: [], allSolutions }),
  addFound: (word, path) => {
    const upper = word.toUpperCase();
    const state = get();
    if (!state.allSolutions?.has(upper)) return "invalid";
    if (state.foundWords.some((w) => w.word === upper)) return "duplicate";
    set({
      foundWords: [
        ...state.foundWords,
        { word: upper, path, score: scoreWord(upper), foundAt: Date.now() },
      ],
    });
    return "added";
  },
  reset: () => set(initial),
}));
