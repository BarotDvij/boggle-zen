/**
 * Hot Words drill — flashcard mode.
 * Shows a word on a mini board fragment, user taps to reveal hint + rating.
 */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import { HOT_WORDS, type HotWord } from "@/training/drills/hotwords";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

export default function HotWordsScreen() {
  const { palette, spacing, radius } = useTheme();
  const router = useRouter();
  const [deck] = useState(() => shuffle(HOT_WORDS));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current: HotWord | undefined = deck[index];
  const total = deck.length;

  const next = useCallback(() => {
    if (index + 1 >= total) {
      router.back();
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }, [index, total]);

  if (!current) return null;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={[text.small, { color: palette.inkFaint }]}>Done</Text>
        </Pressable>
        <Text style={[text.small, { color: palette.inkFaint }]}>
          {index + 1} / {total}
        </Text>
      </View>

      {/* Card */}
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderRadius: radius.xl,
            padding: spacing.xxxl,
            margin: spacing.xl,
          },
        ]}
        onPress={() => setRevealed(true)}
      >
        <Text
          style={[text.hero, { color: palette.ink, textAlign: "center", letterSpacing: 4 }]}
        >
          {current.word}
        </Text>
        {revealed ? (
          <Text
            style={[
              text.body,
              {
                color: palette.inkSoft,
                textAlign: "center",
                marginTop: spacing.lg,
              },
            ]}
          >
            {current.hint}
          </Text>
        ) : (
          <Text
            style={[
              text.small,
              {
                color: palette.inkFaint,
                textAlign: "center",
                marginTop: spacing.lg,
              },
            ]}
          >
            Tap to reveal
          </Text>
        )}
      </Pressable>

      {/* Actions */}
      {revealed && (
        <View style={[styles.actions, { gap: spacing.md, paddingHorizontal: spacing.xl }]}>
          <Pressable
            style={[
              styles.actionBtn,
              {
                backgroundColor: palette.sageSoft,
                borderRadius: radius.pill,
                paddingVertical: spacing.md,
              },
            ]}
            onPress={next}
          >
            <Text style={[text.bodyMedium, { color: palette.sage }]}>
              Got it
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.actionBtn,
              {
                backgroundColor: palette.surface,
                borderRadius: radius.pill,
                paddingVertical: spacing.md,
              },
            ]}
            onPress={next}
          >
            <Text style={[text.bodyMedium, { color: palette.inkSoft }]}>
              Practice more
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
    flex: 1,
    margin: 20,
  },
  actions: { paddingBottom: 32 },
  actionBtn: { alignItems: "center" },
});
