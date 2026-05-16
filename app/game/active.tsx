/**
 * Active game screen — board + timer + word tray + found list.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useGameStore } from "@/store/game";
import { useProgressStore } from "@/store/progress";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import { Board } from "@/components/Board";
import { Timer } from "@/components/Timer";
import { WordTray } from "@/components/WordTray";
import { FoundList } from "@/components/FoundList";
import { playSound } from "@/audio/soundpack";
import { hapticSuccess } from "@/audio/haptics";
import { saveGame } from "@/game/db";
import { totalScore } from "@/game/scoring";
import { maybeShowInterstitial } from "@/monetization/ads";

export default function ActiveGameScreen() {
  const { palette, spacing } = useTheme();
  const router = useRouter();
  const game = useGameStore();
  const progress = useProgressStore();
  const [remaining, setRemaining] = useState<number>(0);
  const [lastResult, setLastResult] = useState<
    "added" | "duplicate" | "invalid" | null
  >(null);
  const [currentWord, setCurrentWord] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedRef = useRef(false);

  const durationSec = game.durationSec;
  const board = game.board;
  const status = game.status;

  useEffect(() => {
    if (status !== "playing" || !game.endsAt) return;
    const tick = () => {
      const rem = Math.max(0, Math.ceil((game.endsAt! - Date.now()) / 1000));
      setRemaining(rem);
      if (rem === 0 && !endedRef.current) {
        endedRef.current = true;
        void finishGame();
      }
    };
    tick();
    timerRef.current = setInterval(tick, 500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const finishGame = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    game.end();
    playSound("round_end");

    const words = game.foundWords;
    const score = totalScore(words.map((w) => w.word));
    const bestWord = words.reduce(
      (best, w) => (w.word.length > best.length ? w.word : best),
      ""
    );

    progress.recordGame(score, bestWord);

    await saveGame({
      playedAt: Date.now(),
      boardSize: board?.size ?? 4,
      score,
      wordsFound: words.length,
      totalWords: game.allSolutions?.size ?? 0,
      bestWord,
      durationSec,
    });

    await maybeShowInterstitial(score);
    router.replace("/game/review");
  }, [game, board, durationSec, progress, router]);

  const handleWordAttempt = useCallback(
    (word: string, path: number[]) => {
      const result = game.addFound(word.toUpperCase(), path);
      setLastResult(result);
      setCurrentWord("");
      if (result === "added") {
        hapticSuccess();
        playSound("word_accept");
      } else {
        playSound("word_reject");
      }
      setTimeout(() => setLastResult(null), 1200);
    },
    [game]
  );

  const handleQuit = () => {
    Alert.alert("End game?", "Your progress will be saved.", [
      { text: "Keep playing", style: "cancel" },
      {
        text: "End",
        style: "destructive",
        onPress: () => {
          endedRef.current = true;
          void finishGame();
        },
      },
    ]);
  };

  if (!board) return null;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
        <Pressable onPress={handleQuit}>
          <Text style={[text.small, { color: palette.inkFaint }]}>End</Text>
        </Pressable>
        <Timer
          totalSeconds={durationSec}
          remainingSeconds={remaining}
          size={64}
        />
        <Text style={[text.numeric, { color: palette.ink }]}>
          {totalScore(game.foundWords.map((w) => w.word))}
        </Text>
      </View>

      <WordTray currentWord={currentWord} lastResult={lastResult} />

      <Board
        letters={board.letters}
        size={board.size}
        onWordAttempt={handleWordAttempt}
        disabled={status !== "playing"}
      />

      <FoundList words={game.foundWords} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "space-around" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
