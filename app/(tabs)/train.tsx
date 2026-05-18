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
import { usePro } from '@/store/pro';

type Drill = {
  id: string;
  title: string;
  body: string;
  free: boolean;
  href: string | null;
};

const DRILLS: Drill[] = [
  {
    id: 'hotwords',
    title: 'Hot words',
    body: 'Flashcards of short, high-value words. Build instant recognition.',
    free: true,
    href: '/train/hotwords',
  },
  {
    id: 'prefix',
    title: 'Prefix sprints',
    body: 'Sixty calm seconds finding words starting with QU, ST, PR, UN, RE.',
    free: false,
    href: null,
  },
  {
    id: 'suffix',
    title: 'Suffix sprints',
    body: 'The same exercise for -ING, -ER, -ED, -IEST. Tiny wins, big habits.',
    free: false,
    href: null,
  },
  {
    id: 'pattern',
    title: 'Pattern spotting',
    body: 'One tile is highlighted. Find every valid word that touches it.',
    free: false,
    href: null,
  },
  {
    id: 'review',
    title: 'Solver review',
    body: 'Replay a past board with the optimal paths drawn slowly. Pause anywhere.',
    free: true,
    href: '/train/review',
  },
];

export default function TrainScreen() {
  const { palette, spacing } = useTheme();
  const router = useRouter();
  const isPro = usePro();

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
          <Text style={[text.caption, styles.eyebrow, { color: palette.inkFaint }]}>
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
            isPro={isPro}
            onPress={() => {
              if (!drill.free && !isPro) {
                router.push('/paywall');
                return;
              }
              if (drill.href) {
                router.push(drill.href as never);
              }
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function DrillCard({
  drill,
  isPro,
  onPress,
}: {
  drill: Drill;
  isPro: boolean;
  onPress: () => void;
}) {
  const { palette, spacing, radius } = useTheme();
  const locked = !drill.free && !isPro;

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
        {locked && (
          <Text
            style={[text.caption, styles.eyebrow, { color: palette.accent }]}
          >
            PRO
          </Text>
        )}
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
  eyebrow: { textTransform: 'uppercase' },
});
