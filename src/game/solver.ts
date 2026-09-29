/**
 * Board solver — finds every valid word on a Boggle board.
 * Returns a Map of word → list of valid paths (each path is an array of indices).
 * Run this once after rolling the board; the result is stored in game state.
 */
import type { Board } from "./board";
import { adjacents } from "./board";
import type { Trie } from "./trie";

export function solveBoard(
  board: Board,
  trie: Trie
): Map<string, number[][]> {
  const { letters, size } = board;
  const solutions = new Map<string, number[][]>();
  const total = size * size;

  const dfs = (
    index: number,
    currentWord: string,
    visited: boolean[],
    path: number[]
  ) => {
    const letter = (letters[index] ?? "").toUpperCase();
    const word = currentWord + letter;

    const node = trie.find(word);
    if (!node) return;

    if (word.length >= 3 && node.isWord) {
      const existing = solutions.get(word);
      if (existing) {
        existing.push([...path, index]);
      } else {
        solutions.set(word, [[...path, index]]);
      }
    }

    visited[index] = true;
    const adj = adjacents(index, size);
    for (const next of adj) {
      if (!visited[next]) {
        dfs(next, word, visited, [...path, index]);
      }
    }
    visited[index] = false;
  };

  const visited = new Array<boolean>(total).fill(false);
  for (let i = 0; i < total; i++) {
    dfs(i, "", visited, []);
  }

  return solutions;
}

