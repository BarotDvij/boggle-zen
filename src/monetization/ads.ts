/**
 * Ad management.
 * One interstitial shown after every AD_FREQUENCY completed games.
 * Never shown: on first session, mid-game, on training screens, or if Pro.
 *
 * AD unit IDs: test IDs by default; swap for real ones in production.
 */
import { Platform } from "react-native";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { useProStore } from "@/store/pro";
import { useProgressStore } from "@/store/progress";

export const AD_FREQUENCY = 4;

const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: "ca-app-pub-REPLACE_ME/REPLACE_ME_IOS",
      android: "ca-app-pub-REPLACE_ME/REPLACE_ME_ANDROID",
    }) ?? TestIds.INTERSTITIAL;

let interstitial: InterstitialAd | null = null;
let isLoaded = false;

function createInterstitial(): void {
  interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isLoaded = true;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isLoaded = false;
    // Preload the next one
    preloadInterstitial();
  });

  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    isLoaded = false;
  });

  interstitial.load();
}

export function preloadInterstitial(): void {
  if (useProStore.getState().isPro) return;
  createInterstitial();
}

/**
 * Call after a game completes (with score > 0).
 * Shows the interstitial if the cadence dictates it.
 */
export async function maybeShowInterstitial(score: number): Promise<void> {
  if (useProStore.getState().isPro) return;
  if (score === 0) return; // skip after a blanked game

  const { completedGames } = useProgressStore.getState();
  // completedGames is already incremented by this point
  if (completedGames < AD_FREQUENCY) return; // grace period on first few games
  if (completedGames % AD_FREQUENCY !== 0) return;

  if (!interstitial || !isLoaded) return;

  return new Promise<void>((resolve) => {
    const unsub = interstitial!.addAdEventListener(AdEventType.CLOSED, () => {
      unsub();
      resolve();
    });
    interstitial!.show();
  });
}
