/**
 * Reflect screen — quiet personal stats. No leaderboards, no streaks.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import { loadRecentGames, loadStats, type GameRecord } from "@/game/db";
import { useProgressStore } from "@/store/progress";

export default function ReflectScreen() {
  const { palette, spacing, radius } = useTheme();
  const progress = useProgressStore();
  const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      await loadStats();
      const games = await loadRecentGames(20);
      setRecentGames(games);
      setLoaded(true);
    })();
  }, []);

  const statCardStyle = {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flex: 1,
    margin: spacing.xs,
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[text.title, { color: palette.ink, marginBottom: spacing.xl }]}
        >
          Reflect
        </Text>

        <View style={styles.statRow}>
          <View style={statCardStyle}>
            <Text style={[text.numeric, { color: palette.accent }]}>
              {progress.completedGames}
            </Text>
            <Text style={[text.small, { color: palette.inkFaint, marginTop: 4 }]}>
              Games played
            </Text>
          </View>
          <View style={statCardStyle}>
            <Text style={[text.numeric, { color: palette.accent }]}>
              {progress.bestScore}
            </Text>
            <Text style={[text.small, { color: palette.inkFaint, marginTop: 4 }]}>
              Best score
            </Text>
          </View>
        </View>

        {progress.bestWord.length > 0 && (
          <View
            style={{
              ...statCardStyle,
              margin: spacing.xs,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[text.small, { color: palette.inkFaint }]}>
              Longest word
            </Text>
            <Text style={[text.subtitle, { color: palette.ink }]}>
              {progress.bestWord.toLowerCase()}
            </Text>
          </View>
        )}

        {loaded && recentGames.length > 0 && (
          <>
            <Text
              style={[
                text.caption,
                {
                  color: palette.inkFaint,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  marginTop: spacing.xl,
                  marginBottom: spacing.md,
                },
              ]}
            >
              Recent games
            </Text>
            {recentGames.map((g) => (
              <View
                key={g.id}
                style={{
                  backgroundColor: palette.surface,
                  borderRadius: radius.md,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={[text.small, { color: palette.ink }]}>
                    {new Date(g.playedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    {"  "}
                    <Text style={{ color: palette.inkFaint }}>
                      {g.boardSize}×{g.boardSize}
                    </Text>
                  </Text>
                  {g.bestWord.length > 0 && (
                    <Text
                      style={[text.small, { color: palette.inkFaint, marginTop: 2 }]}
                    >
                      best: {g.bestWord.toLowerCase()}
                    </Text>
                  )}
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[text.numeric, { color: palette.accent }]}>
                    {g.score}
                  </Text>
                  <Text style={[text.small, { color: palette.inkFaint }]}>
                    {g.wordsFound}/{g.totalWords}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {loaded && recentGames.length === 0 && (
          <Text
            style={[
              text.body,
              {
                color: palette.inkFaint,
                marginTop: spacing.xl,
                textAlign: "center",
              },
            ]}
          >
            Play a game to start reflecting.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  statRow: { flexDirection: "row" },
});
