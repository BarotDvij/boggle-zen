/**
 * Solver Review — animates optimal word paths on a past board.
 * The single most effective training tool: you watch where you missed words.
 */
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { usePro } from "@/store/pro";
import { useGameStore } from "@/store/game";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import { Tile } from "@/components/Tile";
import { canUseSolverReviewToday, markSolverReviewUsedToday } from "@/training/session";
import { scoreWord } from "@/game/scoring";

const ANIMATE_INTERVAL_MS = 600;

export default function SolverReviewScreen() {
  const { palette, spacing, radius } = useTheme();
  const router = useRouter();
  const isPro = usePro();
  const game = useGameStore();

  const board = game.board;
  const allSolutions = game.allSolutions;

  const [canUse, setCanUse] = useState<boolean | null>(null);
  const wordList = useMemo(
    () =>
      [...(allSolutions?.keys() ?? [])].sort(
        (a, b) => scoreWord(b) - scoreWord(a)
      ),
    [allSolutions]
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [pathStep, setPathStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    canUseSolverReviewToday(isPro).then((ok: boolean) => {
      setCanUse(ok);
      if (ok) markSolverReviewUsedToday();
    });
  }, [isPro]);

  const currentWord = wordList[wordIndex];
  const currentPaths = currentWord
    ? allSolutions?.get(currentWord) ?? []
    : [];
  const currentPath = currentPaths[0] ?? [];
  const activeTiles = new Set(currentPath.slice(0, pathStep + 1));
  const selectedTile = currentPath[pathStep];

  const startAnimation = useCallback(() => {
    if (!currentPath.length) return;
    setPathStep(0);
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setPathStep((prev) => {
        if (prev + 1 >= currentPath.length) {
          setPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, ANIMATE_INTERVAL_MS);
  }, [currentPath]);

  useEffect(() => {
    if (currentWord) startAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [wordIndex]);

  const goNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWordIndex((i) => Math.min(i + 1, wordList.length - 1));
  };

  const goPrev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setWordIndex((i) => Math.max(i - 1, 0));
  };

  if (!board || !allSolutions) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
        <View style={styles.center}>
          <Text style={[text.body, { color: palette.inkFaint, textAlign: "center" }]}>
            Play a game first to use Solver Review.
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 24 }}>
            <Text style={[text.small, { color: palette.accent }]}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (canUse === false) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
        <View style={styles.center}>
          <Text style={[text.subtitle, { color: palette.ink, textAlign: "center" }]}>
            Daily Solver Review used
          </Text>
          <Text
            style={[
              text.body,
              {
                color: palette.inkFaint,
                textAlign: "center",
                marginTop: 12,
              },
            ]}
          >
            Come back tomorrow, or unlock Pro for unlimited access.
          </Text>
          <Pressable
            onPress={() => router.push("/paywall")}
            style={{
              marginTop: 24,
              backgroundColor: palette.accent,
              paddingHorizontal: 32,
              paddingVertical: 12,
              borderRadius: radius.pill,
            }}
          >
            <Text style={[text.bodyMedium, { color: "#fff" }]}>
              Unlock Pro
            </Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={[text.small, { color: palette.inkFaint }]}>
              Not now
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const size = board.size;
  const tileSize = 48;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[text.small, { color: palette.inkFaint }]}>Done</Text>
        </Pressable>
        <Text style={[text.small, { color: palette.inkFaint }]}>
          {wordIndex + 1} / {wordList.length}
        </Text>
      </View>

      {/* Word display */}
      <View style={styles.wordDisplay}>
        <Text style={[text.hero, { color: palette.ink, letterSpacing: 3 }]}>
          {currentWord?.toLowerCase()}
        </Text>
        <Text style={[text.small, { color: palette.inkFaint, marginTop: 4 }]}>
          +{scoreWord(currentWord ?? "")} pts
        </Text>
      </View>

      {/* Animated board */}
      <View style={styles.boardArea}>
        {Array.from({ length: size }).map((_, row) => (
          <View key={row} style={[styles.row, { gap: 6 }]}>
            {Array.from({ length: size }).map((_, col) => {
              const index = row * size + col;
              return (
                <Tile
                  key={col}
                  letter={board.letters[index] ?? ""}
                  selected={selectedTile === index}
                  inPath={activeTiles.has(index) && selectedTile !== index}
                  size={tileSize}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Navigation */}
      <View style={[styles.nav, { paddingHorizontal: spacing.xl, gap: spacing.md }]}>
        <Pressable
          onPress={goPrev}
          disabled={wordIndex === 0}
          style={[
            styles.navBtn,
            {
              backgroundColor: palette.surface,
              borderRadius: radius.pill,
              paddingVertical: spacing.md,
              opacity: wordIndex === 0 ? 0.3 : 1,
            },
          ]}
        >
          <Text style={[text.body, { color: palette.inkSoft }]}>← Prev</Text>
        </Pressable>
        <Pressable
          onPress={startAnimation}
          style={[
            styles.navBtn,
            {
              backgroundColor: palette.accentSoft,
              borderRadius: radius.pill,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <Text style={[text.body, { color: palette.accent }]}>Replay</Text>
        </Pressable>
        <Pressable
          onPress={goNext}
          disabled={wordIndex >= wordList.length - 1}
          style={[
            styles.navBtn,
            {
              backgroundColor: palette.surface,
              borderRadius: radius.pill,
              paddingVertical: spacing.md,
              opacity: wordIndex >= wordList.length - 1 ? 0.3 : 1,
            },
          ]}
        >
          <Text style={[text.body, { color: palette.inkSoft }]}>Next →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 8,
  },
  wordDisplay: { alignItems: "center", paddingVertical: 16 },
  boardArea: { alignSelf: "center", gap: 6 },
  row: { flexDirection: "row" },
  nav: { flexDirection: "row", paddingBottom: 32, marginTop: 24 },
  navBtn: { flex: 1, alignItems: "center" },
});
