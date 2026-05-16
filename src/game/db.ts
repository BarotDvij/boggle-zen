/**
 * SQLite persistence for game history.
 * Keeps a lightweight record of each completed game for the Reflect screen.
 */
import * as SQLite from "expo-sqlite";
import { useProgressStore } from "@/store/progress";

let db: SQLite.SQLiteDatabase | null = null;

export async function openDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("bogglezen.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      played_at INTEGER NOT NULL,
      board_size INTEGER NOT NULL,
      score INTEGER NOT NULL,
      words_found INTEGER NOT NULL,
      total_words INTEGER NOT NULL,
      best_word TEXT NOT NULL,
      duration_sec INTEGER NOT NULL
    );
  `);
  return db;
}

export interface GameRecord {
  id: number;
  playedAt: number;
  boardSize: number;
  score: number;
  wordsFound: number;
  totalWords: number;
  bestWord: string;
  durationSec: number;
}

export async function saveGame(record: Omit<GameRecord, "id">): Promise<void> {
  const database = await openDb();
  await database.runAsync(
    `INSERT INTO games (played_at, board_size, score, words_found, total_words, best_word, duration_sec)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      record.playedAt,
      record.boardSize,
      record.score,
      record.wordsFound,
      record.totalWords,
      record.bestWord,
      record.durationSec,
    ]
  );
}

export async function loadRecentGames(limit = 30): Promise<GameRecord[]> {
  const database = await openDb();
  const rows = await database.getAllAsync<{
    id: number;
    played_at: number;
    board_size: number;
    score: number;
    words_found: number;
    total_words: number;
    best_word: string;
    duration_sec: number;
  }>(`SELECT * FROM games ORDER BY played_at DESC LIMIT ?`, [limit]);

  return rows.map((r) => ({
    id: r.id,
    playedAt: r.played_at,
    boardSize: r.board_size,
    score: r.score,
    wordsFound: r.words_found,
    totalWords: r.total_words,
    bestWord: r.best_word,
    durationSec: r.duration_sec,
  }));
}

export async function loadStats(): Promise<{
  totalGames: number;
  bestScore: number;
  bestWord: string;
}> {
  const database = await openDb();
  const row = await database.getFirstAsync<{
    total_games: number;
    best_score: number;
  }>(`SELECT COUNT(*) as total_games, MAX(score) as best_score FROM games`);

  const wordRow = await database.getFirstAsync<{ best_word: string }>(
    `SELECT best_word FROM games ORDER BY LENGTH(best_word) DESC LIMIT 1`
  );

  const totalGames = row?.total_games ?? 0;
  const bestScore = row?.best_score ?? 0;
  const bestWord = wordRow?.best_word ?? "";

  // Sync with in-memory progress store
  useProgressStore.getState().hydrate({ completedGames: totalGames, bestScore, bestWord });

  return { totalGames, bestScore, bestWord };
}
