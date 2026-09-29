/**
 * Boggle Zen — settings store.
 * Persisted to expo-secure-store. Small and calm.
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

export type ThemePreference = "light" | "dark" | "system";
export type BoardSize = 4 | 5;

export interface SettingsState {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  themeOverride: ThemePreference;
  boardSize: BoardSize;
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

/** Update settings with `useSettingsStore.setState({ ... })`. */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (): SettingsState => ({
      soundEnabled: true,
      hapticsEnabled: true,
      themeOverride: "system",
      boardSize: 4,
    }),
    {
      name: "bz_settings_v1",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
