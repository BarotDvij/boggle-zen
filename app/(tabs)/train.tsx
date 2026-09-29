import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme';
import { text } from '@/theme/typography';

type Drill = {
  id: string;
  title: string;
  body: string;
  href: string;
};

const DRILLS: Drill[] = [
  {
    id: 'hotwords',
    title: 'Hot words',
    body: 'Flashcards of short, high-value words. Build instant recognition.',
    href: '/train/hotwords',
  },
  {
    id: 'review',
    title: 'Solver review',
    body: 'Replay a past board with the optimal paths drawn slowly. Pause anywhere.',
    href: '/train/review',
  },
];

export default function TrainScreen() {
  const { palette, spacing } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xxl,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={[text.caption, { color: palette.inkFaint }]}>
            PRACTICE
          </Text>
          <Text
            style={[text.title, { color: palette.ink, marginTop: spacing.sm }]}
          >
            Small, gentle exercises
          </Text>
          <Text
            style={[
              text.body,
              {
                color: palette.inkSoft,
                marginTop: spacing.md,
                maxWidth: 320,
              },
            ]}
          >
            A few minutes a day quietly improves what you see on the board.
            Leave whenever you like.
          </Text>
        </View>

        <View style={{ height: spacing.xl }} />

        {DRILLS.map((drill) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            onPress={() => router.push(drill.href as never)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function DrillCard({
  drill,
  onPress,
}: {
  drill: Drill;
  onPress: () => void;
}) {
  const { palette, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.divider,
          padding: spacing.lg,
          marginBottom: spacing.md,
          borderRadius: radius.lg,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.cardTop}>
        <Text style={[text.subtitle, { color: palette.ink }]}>
          {drill.title}
        </Text>
      </View>
      <Text
        style={[
          text.body,
          { color: palette.inkSoft, marginTop: spacing.sm },
        ]}
      >
        {drill.body}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  card: { borderWidth: StyleSheet.hairlineWidth },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
