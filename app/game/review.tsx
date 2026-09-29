/**
 * Review screen — shown after a round ends.
 * Shows your words + missed words. Missed words are tappable to replay path.
 * Warmly framed — no score shaming.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useGameStore } from "@/store/game";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import { totalScore, scoreWord } from "@/game/scoring";

export default function ReviewScreen() {
  const { palette, spacing, radius } = useTheme();
  const router = useRouter();
  const game = useGameStore();
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  const foundWords = game.foundWords;
  const allSolutions = game.allSolutions ?? new Map<string, number[][]>();
  const score = totalScore(foundWords.map((w) => w.word));
  const totalPossible = allSolutions.size;
  const foundSet = new Set(foundWords.map((w) => w.word));

  const missedWords = [...allSolutions.keys()]
    .filter((w) => !foundSet.has(w))
    .sort((a, b) => scoreWord(b) - scoreWord(a) || a.localeCompare(b))
    .slice(0, 40);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Score summary */}
        <View style={styles.scoreRow}>
          <Text style={[text.hero, { color: palette.ink }]}>{score}</Text>
          <Text style={[text.small, { color: palette.inkFaint, marginTop: 8 }]}>
            {foundWords.length} of {totalPossible} words
          </Text>
        </View>

        {/* Found words */}
        {foundWords.length > 0 && (
          <Section title="Your words">
            <View style={styles.wordGrid}>
              {[...foundWords]
                .sort((a, b) => b.score - a.score)
                .map((fw) => (
                  <WordChip
                    key={fw.word}
                    word={fw.word}
                    score={fw.score}
                    dim={false}
                  />
                ))}
            </View>
          </Section>
        )}

        {/* Missed words */}
        {missedWords.length > 0 && (
          <Section title="You missed">
            <Text
              style={[
                text.small,
                { color: palette.inkFaint, marginBottom: spacing.md },
              ]}
            >
              Tap a word to see where it hides on the board.
            </Text>
            <View style={styles.wordGrid}>
              {missedWords.map((word) => (
                <WordChip
                  key={word}
                  word={word}
                  score={scoreWord(word)}
                  dim
                  onPress={() =>
                    setHighlightedWord(highlightedWord === word ? null : word)
                  }
                />
              ))}
            </View>
          </Section>
        )}

        {/* Play again */}
        <Pressable
          style={[
            styles.doneBtn,
            {
              backgroundColor: palette.accent,
              borderRadius: radius.pill,
              paddingVertical: spacing.lg,
              marginTop: spacing.xl,
            },
          ]}
          onPress={() => {
            game.reset();
            router.replace("/(tabs)");
          }}
        >
          <Text
            style={[
              text.bodyMedium,
              {
                color: "#fff",
                letterSpacing: 1,
                textTransform: "uppercase",
              },
            ]}
          >
            Done
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { palette, spacing, radius } = useTheme();
  return (
    <View
      style={{
        marginTop: spacing.xl,
        backgroundColor: palette.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
      }}
    >
      <Text
        style={[
          text.caption,
          {
            color: palette.inkFaint,
            letterSpacing: 1.2,
            marginBottom: spacing.md,
          },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function WordChip({
  word,
  score,
  dim,
  onPress,
}: {
  word: string;
  score: number;
  dim: boolean;
  onPress?: () => void;
}) {
  const { palette, spacing, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: dim ? palette.background : palette.accentSoft,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          margin: 3,
        },
      ]}
    >
      <Text
        style={[
          text.small,
          { color: dim ? palette.inkFaint : palette.ink },
        ]}
      >
        {word.toLowerCase()}
      </Text>
      <Text
        style={[
          text.small,
          { color: palette.inkFaint, marginLeft: 4 },
        ]}
      >
        +{score}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: 40 },
  scoreRow: { alignItems: "center", paddingTop: 16 },
  wordGrid: { flexDirection: "row", flexWrap: "wrap" },
  doneBtn: { alignItems: "center" },
});
