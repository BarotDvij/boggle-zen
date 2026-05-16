/**
 * Sound pack — 6 cues.
 * Uses expo-audio (Expo SDK 52+). Sounds loaded lazily, volume at 40%.
 * All calls are no-ops when soundEnabled is false.
 */
import { createAudioPlayer } from "expo-audio";
import { useSettingsStore } from "@/store/settings";
import type { AudioPlayer } from "expo-audio";

const DEFAULT_VOLUME = 0.4;

type SoundName =
  | "tile_tap"
  | "word_accept"
  | "word_reject"
  | "round_start"
  | "round_end"
  | "pro_unlock";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const SOUND_FILES: Record<SoundName, number> = {
  tile_tap: require("../../assets/sounds/tile_tap.mp3") as number,
  word_accept: require("../../assets/sounds/word_accept.mp3") as number,
  word_reject: require("../../assets/sounds/word_reject.mp3") as number,
  round_start: require("../../assets/sounds/round_start.mp3") as number,
  round_end: require("../../assets/sounds/round_end.mp3") as number,
  pro_unlock: require("../../assets/sounds/pro_unlock.mp3") as number,
};

const cache = new Map<SoundName, AudioPlayer>();

function getPlayer(name: SoundName): AudioPlayer {
  const cached = cache.get(name);
  if (cached) return cached;
  const player = createAudioPlayer({ uri: SOUND_FILES[name] as unknown as string });
  player.volume = DEFAULT_VOLUME;
  cache.set(name, player);
  return player;
}

export function playSound(name: SoundName): void {
  if (!useSettingsStore.getState().soundEnabled) return;
  try {
    const player = getPlayer(name);
    player.seekTo(0);
    player.play();
  } catch {
    // audio not critical
  }
}

export function unloadAllSounds(): void {
  for (const player of cache.values()) {
    try {
      player.remove();
    } catch {
      // ignore
    }
  }
  cache.clear();
}
