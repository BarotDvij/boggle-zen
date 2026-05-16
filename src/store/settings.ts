/**
 * Boggle Zen — settings store.
 * Persisted to expo-secure-store. Small and calm.
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

export type ThemePreference = "light" | "dark" | "system";
export type BoardSize = 4 | 5;
export type Dictionary = "twl06" | "sowpods";

export interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  themeOverride: ThemePreference;
  boardSize: BoardSize;
  dictionary: Dictionary;
  roundSeconds: number;
  setSound: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setTheme: (v: ThemePreference) => void;
  setBoardSize: (v: BoardSize) => void;
  setDictionary: (v: Dictionary) => void;
  setRoundSeconds: (v: number) => void;
}

const secureStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // best effort
    }
  },
  removeItem: async (name) => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // best effort
    }
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      hapticsEnabled: true,
      themeOverride: "system" as ThemePreference,
      boardSize: 4 as BoardSize,
      dictionary: "twl06" as Dictionary,
      roundSeconds: 180,
      setSound: (v) => set({ soundEnabled: v }),
      setHaptics: (v) => set({ hapticsEnabled: v }),
      setTheme: (v) => set({ themeOverride: v }),
      setBoardSize: (v) => set({ boardSize: v }),
      setDictionary: (v) => set({ dictionary: v }),
      setRoundSeconds: (v) => set({ roundSeconds: v }),
    }),
    {
      name: "bz_settings_v1",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
