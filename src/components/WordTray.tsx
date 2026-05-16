/**
 * WordTray — display of the word currently being formed or last result.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";

interface WordTrayProps {
  currentWord: string;
  lastResult?: "added" | "duplicate" | "invalid" | null;
}

export function WordTray({ currentWord, lastResult }: WordTrayProps) {
  const { palette, radius, spacing } = useTheme();

  const color =
    lastResult === "added"
      ? palette.success
      : lastResult === "duplicate" || lastResult === "invalid"
      ? palette.inkFaint
      : palette.ink;

  const label =
    currentWord.length > 0
      ? currentWord.toUpperCase()
      : lastResult === "added"
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
