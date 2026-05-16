/**
 * Dictionary loader.
 * The TWL06 word list lives at assets/dict/twl06.txt (one uppercase word per line).
 * We load it once at app startup and build a Trie + word Set in a background task.
 */
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Trie } from "./trie";

let cachedTrie: Trie | null = null;

/**
 * Load and parse the dictionary. Caches after first call.
 * The result trie can be passed directly to solveBoard().
 */
export async function loadDictionary(): Promise<Trie> {
  if (cachedTrie) return cachedTrie;

  const assets = await Asset.loadAsync(
    require("../../assets/dict/twl06.txt")
  );
  const asset = assets[0];

  if (!asset?.localUri) {
    throw new Error("Dictionary asset failed to load");
  }

  const text = await FileSystem.readAsStringAsync(asset.localUri);
  const trie = new Trie();
  const lines = text.split("\n");
  for (const line of lines) {
    const word = line.trim().toUpperCase();
    if (word.length >= 3) {
      trie.insert(word);
    }
  }
  cachedTrie = trie;
  return trie;
}

export function resetDictionaryCache(): void {
  cachedTrie = null;
}
