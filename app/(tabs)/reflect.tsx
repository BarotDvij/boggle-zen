import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/theme';
import { text } from '@/theme/typography';
import { loadRecentGames, type GameRecord } from '@/game/db';
import { useProgressStore } from '@/store/progress';

export default function ReflectScreen() {
  const { palette, spacing } = useTheme();
  const completedGames = useProgressStore((s) => s.completedGames);
  const bestScore = useProgressStore((s) => s.bestScore);
  const bestWord = useProgressStore((s) => s.bestWord);
  const [recent, setRecent] = useState<GameRecord[]>([]);

  useEffect(() => {
    loadRecentGames(7)
      .then(setRecent)
      .catch(() => undefined);
  }, [completedGames]);

  const weeklyWords = recent.reduce((sum, r) => sum + r.wordsFound, 0);

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
            REFLECT
          </Text>
          <Text
            style={[text.title, { color: palette.ink, marginTop: spacing.sm }]}
          >
            Your quiet history
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
            A soft record of what you found, with no scoreboard, no ranks, no
            comparisons. Just patterns you might want to notice.
          </Text>
        </View>

        <View style={{ height: spacing.xl }} />

        <Tile
          title="Words this week"
          value={weeklyWords > 0 ? weeklyWords.toString() : '—'}
          caption={
            weeklyWords > 0
              ? `across ${recent.length} round${recent.length === 1 ? '' : 's'}`
              : 'Play a round to begin'
          }
        />
        <Tile
          title="Best find"
          value={bestWord ? bestWord.toLowerCase() : '—'}
          caption="Your longest word so far"
        />
        <Tile
          title="Best score"
          value={bestScore > 0 ? bestScore.toString() : '—'}
          caption="A quiet personal record"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Tile({
  title,
  value,
  caption,
}: {
  title: string;
  value: string;
  caption: string;
}) {
  const { palette, spacing, radius } = useTheme();
  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: palette.surface,
          borderColor: palette.divider,
          borderRadius: radius.lg,
          padding: spacing.lg,
          marginBottom: spacing.md,
        },
      ]}
    >
      <Text style={[text.caption, styles.eyebrow, { color: palette.inkFaint }]}>
        {title.toUpperCase()}
      </Text>
      <Text
        style={[text.hero, { color: palette.ink, marginTop: spacing.sm }]}
      >
        {value}
      </Text>
      <Text
        style={[
          text.small,
          { color: palette.inkSoft, marginTop: spacing.xs },
        ]}
      >
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tile: { borderWidth: StyleSheet.hairlineWidth },
  eyebrow: { textTransform: 'uppercase' },
});
