/**
 * Practice screen — warm, never gamified drill selection.
 */
import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { usePro } from "@/store/pro";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";

interface DrillRow {
  id: string;
  title: string;
  description: string;
  proOnly: boolean;
  route?: string;
}

const DRILLS: DrillRow[] = [
  {
    id: "hotwords",
    title: "Hot Words",
    description: "Flashcards for high-value short words: QI, ZA, XU, AE…",
    proOnly: false,
    route: "/train/hotwords",
  },
  {
    id: "prefix",
    title: "Prefix Sprint",
    description: "60 seconds to find every word starting with QU, ST, UN…",
    proOnly: true,
  },
  {
    id: "suffix",
    title: "Suffix Sprint",
    description: "60 seconds to find every word ending in -ING, -ER, -ED…",
    proOnly: true,
  },
  {
    id: "pattern",
    title: "Pattern Spotting",
    description: "A tile is highlighted — find every word that touches it.",
    proOnly: true,
  },
  {
    id: "review",
    title: "Solver Review",
    description:
      "Watch optimal paths animate on a past board. The best way to improve.",
    proOnly: false,
    route: "/train/review",
  },
];

export default function TrainScreen() {
  const { palette, spacing, radius } = useTheme();
  const isPro = usePro();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[text.title, { color: palette.ink, marginBottom: 4 }]}>
          Practice
        </Text>
        <Text
          style={[
            text.small,
            { color: palette.inkFaint, marginBottom: spacing.xl },
          ]}
        >
          Short, focused sessions to help you find more words in real games.
        </Text>

        {DRILLS.map((drill) => {
          const locked = drill.proOnly && !isPro;
          return (
            <Pressable
              key={drill.id}
              style={[
                styles.card,
                {
                  backgroundColor: palette.surface,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                  opacity: locked ? 0.6 : 1,
                },
              ]}
              onPress={() => {
                if (locked) {
                  router.push("/paywall");
                } else if (drill.route) {
                  router.push(drill.route as Parameters<typeof router.push>[0]);
                }
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={[text.bodyMedium, { color: palette.ink }]}>
                  {drill.title}
                </Text>
                {locked && (
                  <View
                    style={[
                      styles.proBadge,
                      {
                        backgroundColor: palette.accentSoft,
                        borderRadius: radius.pill,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        text.caption,
                        { color: palette.accent, letterSpacing: 0.8 },
                      ]}
                    >
                      PRO
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[text.small, { color: palette.inkFaint, marginTop: 4 }]}
              >
                {drill.description}
              </Text>
            </Pressable>
          );
        })}

        {!isPro && (
          <Pressable
            onPress={() => router.push("/paywall")}
            style={[
              styles.proPrompt,
              {
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: palette.accentSoft,
                padding: spacing.lg,
                marginTop: spacing.md,
              },
            ]}
          >
            <Text style={[text.bodyMedium, { color: palette.accent }]}>
              Unlock all drills →
            </Text>
            <Text
              style={[text.small, { color: palette.inkFaint, marginTop: 4 }]}
            >
              One-time purchase. No subscription.
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: {},
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  proBadge: {},
  proPrompt: {},
});
