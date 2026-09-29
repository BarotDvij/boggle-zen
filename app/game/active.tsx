/**
 * Active game screen.
 *
 * Rolls the board, builds the solver index, runs a 3-minute round, accepts
 * drag/tap selections, validates against the precomputed solution set, and
 * navigates to the calm review screen when time elapses.
 *
 * Nothing here shouts. The timer is a breathing ring. The score doesn't
 * dance. Rejected words simply fade.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Board } from '@/components/Board';
import { Timer } from '@/components/Timer';
import { WordTray } from '@/components/WordTray';
import { FoundList } from '@/components/FoundList';
import { rollBoard } from '@/game/board';
import { loadDictionary } from '@/game/dictionary';
import { solveBoard } from '@/game/solver';
import { totalScore } from '@/game/scoring';
import { saveGame } from '@/game/db';
import { useGameStore, type WordResult } from '@/store/game';
import { useSettingsStore } from '@/store/settings';
import { useProgressStore } from '@/store/progress';
import { hapticSuccess } from '@/audio/haptics';
import { playSound } from '@/audio/soundpack';
import { maybeShowInterstitial } from '@/monetization/ads';
import { useTheme } from '@/theme';
import { text } from '@/theme/typography';

const ROUND_SECONDS = 180;

export default function ActiveGame() {
  const { palette, spacing } = useTheme();
  const router = useRouter();
  const boardSize = useSettingsStore((s) => s.boardSize);

  const game = useGameStore();
  const recordGame = useProgressStore((s) => s.recordGame);

  const [loading, setLoading] = useState(true);
  const [remaining, setRemaining] = useState(ROUND_SECONDS);
  const [lastResult, setLastResult] = useState<WordResult | null>(null);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ended = useRef(false);

  // Roll + solve a fresh board on mount.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const board = rollBoard(boardSize);
      // If dictionary fails we still let them play with no validation —
      // calmer than throwing a scary error.
      const solutions = await loadDictionary()
        .then((trie) => solveBoard(board, trie))
        .catch(() => new Map<string, number[][]>());
      if (cancelled) return;
      game.begin(board, ROUND_SECONDS, solutions);
      playSound('round_start');
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      if (resultTimer.current) clearTimeout(resultTimer.current);
      game.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick the timer once per second.
  useEffect(() => {
    if (loading || ended.current) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          endRound();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const flashResult = useCallback((result: WordResult) => {
    setLastResult(result);
    if (resultTimer.current) clearTimeout(resultTimer.current);
    resultTimer.current = setTimeout(() => setLastResult(null), 900);
  }, []);

  const handleWordAttempt = useCallback(
    (word: string, path: number[]) => {
      const status = game.addFound(word, path);
      if (status === 'added') {
        hapticSuccess();
        playSound('word_accept');
      } else {
        playSound('word_reject');
      }
      flashResult(status);
    },
    [flashResult, game]
  );

  const endRound = useCallback(async () => {
    if (ended.current) return;
    ended.current = true;

    const state = useGameStore.getState();
    const score = totalScore(state.foundWords.map((w) => w.word));
    const longest = state.foundWords.reduce(
      (best, fw) => (fw.word.length > best.length ? fw.word : best),
      ''
    );

    playSound('round_end');
    recordGame(score, longest);

    // Persist quietly. Non-fatal if it fails.
    try {
      await saveGame({
        playedAt: Date.now(),
        boardSize: state.board?.size ?? boardSize,
        score,
        wordsFound: state.foundWords.length,
        totalWords: state.allSolutions?.size ?? 0,
        bestWord: longest,
        durationSec: state.durationSec,
      });
    } catch {
      // ignore
    }

    // Tasteful interstitial. Only every 4th game, never if Pro, never if 0.
    try {
      await maybeShowInterstitial(score);
    } catch {
      // ignore
    }

    router.replace('/game/review');
  }, [boardSize, recordGame, router]);

  const board = game.board;

  if (loading || !board) {
    return (
      <SafeAreaView
        style={[styles.root, { backgroundColor: palette.background }]}
      >
        <View style={styles.center}>
          <Text
            style={[
              text.body,
              { color: palette.inkSoft, textAlign: 'center' },
            ]}
          >
            Rolling the dice…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const score = totalScore(game.foundWords.map((w) => w.word));

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <Pressable
          hitSlop={10}
          onPress={() => {
            // Soft quit — confirm by simply ending the round.
            endRound();
          }}
        >
          <Text style={[text.small, { color: palette.inkFaint }]}>End round</Text>
        </Pressable>
        <Timer totalSeconds={game.durationSec} remainingSeconds={remaining} />
        <Text style={[text.numeric, { color: palette.ink }]}>
          {score}
        </Text>
      </View>

      <View style={styles.middle}>
        <WordTray lastResult={lastResult} />
        <View style={{ height: spacing.lg }} />
        <Board
          letters={board.letters}
          size={board.size}
          onWordAttempt={handleWordAttempt}
        />
      </View>

      <View style={[styles.footer, { paddingBottom: spacing.lg }]}>
        <FoundList words={game.foundWords} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  middle: { flex: 1, justifyContent: 'center' },
  footer: { paddingTop: 12 },
});
