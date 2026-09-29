/**
 * WordTray — shows the result of the last word attempt.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import type { WordResult } from "@/store/game";

export function WordTray({ lastResult }: { lastResult: WordResult | null }) {
  const { palette, radius, spacing } = useTheme();

  const color =
    lastResult === "added"
      ? palette.success
      : lastResult === "duplicate" || lastResult === "invalid"
      ? palette.inkFaint
      : palette.ink;

  const label =
    lastResult === "added"
      ? "Nice!"
      : lastResult === "duplicate"
      ? "Already found"
      : lastResult === "invalid"
      ? "Not a word"
      : "Swipe to spell";

  return (
    <View
      style={[
        styles.tray,
        {
          backgroundColor: palette.surface,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          minWidth: 140,
        },
      ]}
    >
      <Text
        style={[text.subtitle, { color, textAlign: "center" }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    alignSelf: "center",
    alignItems: "center",
  },
});
