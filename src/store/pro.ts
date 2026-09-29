/**
 * Boggle Zen — Pro entitlement store.
 * Source of truth for whether the user has the one-time "Boggle Zen Pro" unlock.
 * Backed by RevenueCat at runtime; cached locally for offline launches.
 */
import { create } from "zustand";

interface ProState {
  isPro: boolean;
  setPro: (v: boolean) => void;
}

export const useProStore = create<ProState>((set) => ({
  isPro: false,
  setPro: (v) => set({ isPro: v }),
}));

export function usePro(): boolean {
  return useProStore((s) => s.isPro);
}
