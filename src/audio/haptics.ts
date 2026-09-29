/**
 * Haptics helper.
 * Light on tile selection, soft success on valid word, nothing on rejects.
 */
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@/store/settings";

function ifEnabled(): boolean {
  return useSettingsStore.getState().hapticsEnabled;
}

export function hapticTile(): void {
  if (!ifEnabled()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function hapticSuccess(): void {
  if (!ifEnabled()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {}
  );
}
