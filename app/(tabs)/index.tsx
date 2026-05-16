/**
 * Play screen — the home. Clean board preview + start button.
 */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import { spring } from "@/theme/motion";
import { rollBoard, type Board } from "@/game/board";
import { loadDictionary } from "@/game/dictionary";
import { solveBoard, buildValidSet } from "@/game/solver";
import { useGameStore } from "@/store/game";
import { useSettingsStore } from "@/store/settings";
import { Tile } from "@/components/Tile";

export default function PlayScreen() {
  const { palette, spacing, radius } = useTheme();
  const router = useRouter();
  const [previewBoard, setPreviewBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(false);
  const boardSize = useSettingsStore((s) => s.boardSize);
  const durationSec = useSettingsStore((s) => s.roundSeconds);
  const gameStore = useGameStore();
  const btnScale = useSharedValue(1);

  useEffect(() => {
    setPreviewBoard(rollBoard(boardSize));
  }, [boardSize]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleStart = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    btnScale.value = withSpring(0.95, spring.responsive);
    try {
      const board = rollBoard(boardSize);
      const trie = await loadDictionary();
      const solutions = solveBoard(board, trie);
      const validSet = buildValidSet(solutions);
      gameStore.begin(board, durationSec, validSet, solutions);
      setPreviewBoard(board);
      router.push("/game/active");
    } finally {
      setLoading(false);
      btnScale.value = withSpring(1, spring.gentle);
    }
  }, [loading, boardSize, durationSec, gameStore, router]);

  const size = boardSize;
  const tileSize = 44;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      <View style={styles.header}>
        <Text style={[text.hero, { color: palette.ink }]}>Boggle Zen</Text>
        <Text style={[text.small, { color: palette.inkFaint, marginTop: 4 }]}>
          {boardSize}×{boardSize} · {Math.floor(durationSec / 60)} min
        </Text>
      </View>

      {previewBoard && (
        <View style={styles.preview} pointerEvents="none">
          {Array.from({ length: size }).map((_, row) => (
            <View key={row} style={[styles.row, { gap: 6 }]}>
              {Array.from({ length: size }).map((_, col) => {
                const index = row * size + col;
                return (
                  <Tile
                    key={col}
                    letter={previewBoard.letters[index] ?? ""}
                    selected={false}
                    inPath={false}
                    size={tileSize}
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}

      <Animated.View style={[styles.btnWrapper, btnStyle]}>
        <Pressable
          style={[
            styles.startBtn,
            {
              backgroundColor: palette.accent,
              borderRadius: radius.pill,
              paddingHorizontal: spacing.xxxl,
              paddingVertical: spacing.lg,
            },
          ]}
          onPress={handleStart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[
                text.bodyMedium,
                { color: "#fff", letterSpacing: 1, textTransform: "uppercase" },
              ]}
            >
              New Game
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "space-around" },
  header: { alignItems: "center" },
  preview: { gap: 6 },
  row: { flexDirection: "row" },
  btnWrapper: { alignItems: "center" },
  startBtn: { alignItems: "center", justifyContent: "center" },
});
