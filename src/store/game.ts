/**
 * Boggle Zen — active game state.
 * Holds the current board, found words, and round timing in memory.
 */
import { create } from "zustand";
import type { Board } from "@/game/board";
import { scoreWord } from "@/game/scoring";

export type GameStatus = "idle" | "playing" | "ended";

export interface FoundWord {
  word: string;
  path: number[];
  score: number;
  foundAt: number;
}

interface GameState {
  status: GameStatus;
  board: Board | null;
  startedAt: number | null;
  endsAt: number | null;
  durationSec: number;
  foundWords: FoundWord[];
  validSet: Set<string>;
  allSolutions: Map<string, number[][]> | null;
  begin: (
    board: Board,
    durationSec: number,
    validSet: Set<string>,
    allSolutions: Map<string, number[][]>
  ) => void;
  addFound: (word: string, path: number[]) => "added" | "duplicate" | "invalid";
  end: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: "idle",
  board: null,
  startedAt: null,
  endsAt: null,
  durationSec: 180,
  foundWords: [],
  validSet: new Set(),
  allSolutions: null,
  begin: (board, durationSec, validSet, allSolutions) => {
    const now = Date.now();
    set({
      status: "playing",
      board,
      startedAt: now,
      endsAt: now + durationSec * 1000,
      durationSec,
      foundWords: [],
      validSet,
      allSolutions,
    });
  },
  addFound: (word, path) => {
    const upper = word.toUpperCase();
    const state = get();
    if (!state.validSet.has(upper)) return "invalid";
    if (state.foundWords.some((w) => w.word === upper)) return "duplicate";
    set({
      foundWords: [
        ...state.foundWords,
        { word: upper, path, score: scoreWord(upper), foundAt: Date.now() },
      ],
    });
    return "added";
  },
  end: () => set({ status: "ended" }),
  reset: () =>
    set({
      status: "idle",
      board: null,
      startedAt: null,
      endsAt: null,
      foundWords: [],
      validSet: new Set(),
      allSolutions: null,
    }),
}));
