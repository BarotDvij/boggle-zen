/**
 * FoundList — compact scrollable list of words found during the round.
 */
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import type { FoundWord } from "@/store/game";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";

interface FoundListProps {
  words: FoundWord[];
}

export function FoundList({ words }: FoundListProps) {
  const { palette, radius, spacing } = useTheme();

  if (words.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { gap: spacing.sm, paddingHorizontal: spacing.lg },
      ]}
    >
      {[...words].reverse().map((fw) => (
        <View
          key={`${fw.word}-${fw.foundAt}`}
          style={[
            styles.pill,
            {
              backgroundColor: palette.surface,
              borderRadius: radius.pill,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Text style={[text.small, { color: palette.ink }]}>
            {fw.word.toLowerCase()}
          </Text>
          <Text
            style={[text.small, { color: palette.inkFaint, marginLeft: 4 }]}
          >
            +{fw.score}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
  },
});
