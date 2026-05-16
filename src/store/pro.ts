/**
 * Boggle Zen — Pro entitlement store.
 * Source of truth for whether the user has the one-time "Boggle Zen Pro" unlock.
 * Backed by RevenueCat at runtime; cached locally for offline launches.
 */
import { create } from "zustand";

interface ProState {
  isPro: boolean;
  isHydrated: boolean;
  setPro: (v: boolean) => void;
  markHydrated: () => void;
}

export const useProStore = create<ProState>((set) => ({
  isPro: false,
  isHydrated: false,
  setPro: (v) => set({ isPro: v }),
  markHydrated: () => set({ isHydrated: true }),
}));

export function usePro(): boolean {
  return useProStore((s) => s.isPro);
}
