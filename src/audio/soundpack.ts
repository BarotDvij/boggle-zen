/**
 * Sound pack — 6 cues.
 * Uses expo-audio (Expo SDK 52+). Sounds loaded lazily, volume at 40%.
 * All calls are no-ops when soundEnabled is false.
 */
import { createAudioPlayer } from "expo-audio";
import { useSettingsStore } from "@/store/settings";
import type { AudioPlayer } from "expo-audio";

const DEFAULT_VOLUME = 0.4;

const SOUND_FILES = {
  tile_tap: require("../../assets/sounds/tile_tap.mp3"),
  word_accept: require("../../assets/sounds/word_accept.mp3"),
  word_reject: require("../../assets/sounds/word_reject.mp3"),
  round_start: require("../../assets/sounds/round_start.mp3"),
  round_end: require("../../assets/sounds/round_end.mp3"),
  pro_unlock: require("../../assets/sounds/pro_unlock.mp3"),
};

type SoundName = keyof typeof SOUND_FILES;

const cache = new Map<SoundName, AudioPlayer>();

function getPlayer(name: SoundName): AudioPlayer {
  const cached = cache.get(name);
  if (cached) return cached;
  const player = createAudioPlayer(SOUND_FILES[name]);
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
