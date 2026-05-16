/**
 * Boggle Zen — progression / counters.
 * Tracks completed game count for the ad cadence and feeds the Reflect screen.
 * Backed by SQLite (see @/game/db) for persistence; this store is the live cache.
 */
import { create } from "zustand";

interface ProgressState {
  completedGames: number;
  bestScore: number;
  bestWord: string;
  lastSessionAt: number | null;
  hydrate: (snapshot: Partial<ProgressState>) => void;
  recordGame: (score: number, longestWord: string) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  completedGames: 0,
  bestScore: 0,
  bestWord: "",
  lastSessionAt: null,
  hydrate: (snapshot) => set(snapshot),
  recordGame: (score, longestWord) =>
    set((s) => ({
      completedGames: s.completedGames + 1,
      bestScore: Math.max(s.bestScore, score),
      bestWord: longestWord.length > s.bestWord.length ? longestWord : s.bestWord,
      lastSessionAt: Date.now(),
    })),
}));
