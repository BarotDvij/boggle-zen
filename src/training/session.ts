/**
 * Training session driver.
 * A session is self-paced — no pressure. The user picks a drill and starts.
 * This module tracks which drills have been used today for the free tier gate.
 */
import * as SecureStore from "expo-secure-store";

const DAILY_REVIEW_KEY = "bz_daily_review_date";

export async function canUseSolverReviewToday(isPro: boolean): Promise<boolean> {
  if (isPro) return true;
  const stored = await SecureStore.getItemAsync(DAILY_REVIEW_KEY).catch(() => null);
  const today = new Date().toDateString();
  return stored !== today;
}

export async function markSolverReviewUsedToday(): Promise<void> {
  const today = new Date().toDateString();
  await SecureStore.setItemAsync(DAILY_REVIEW_KEY, today).catch(() => {});
}
