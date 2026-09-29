import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { text } from '@/theme/typography';
import { useSettingsStore } from '@/store/settings';

export default function PlayHome() {
  const router = useRouter();
  const { palette, spacing, radius } = useTheme();
  const boardSize = useSettingsStore((s) => s.boardSize);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      <View
        style={[
          styles.container,
          { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl },
        ]}
      >
        <Animated.View entering={FadeIn.duration(600)}>
          <Text style={[text.caption, { color: palette.inkFaint }]}>
            A QUIET ROUND OF
          </Text>
          <Text
            style={[
              text.hero,
              { color: palette.ink, marginTop: spacing.sm },
            ]}
          >
            Boggle Zen
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
            Three minutes. One board. Find words at your own pace.
          </Text>
        </Animated.View>

        <View style={styles.spacer} />

        <View style={[styles.sizeRow, { gap: spacing.md, marginBottom: spacing.lg }]}>
          <SizeChip
            label="Classic · 4×4"
            active={boardSize === 4}
            onPress={() => useSettingsStore.setState({ boardSize: 4 })}
          />
          <SizeChip
            label="Big · 5×5"
            active={boardSize === 5}
            onPress={() => useSettingsStore.setState({ boardSize: 5 })}
          />
        </View>

        <View style={{ paddingBottom: spacing.xxl }}>
          <Pressable
            onPress={() => router.push('/game/active')}
            style={({ pressed }) => [
              styles.primary,
              {
                backgroundColor: palette.sage,
                borderRadius: radius.pill,
                paddingVertical: spacing.md + 2,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={[text.bodyMedium, { color: palette.surface }]}>
              Begin
            </Text>
          </Pressable>
          <Text
            style={[
              text.small,
              {
                color: palette.inkFaint,
                marginTop: spacing.md,
                textAlign: 'center',
              },
            ]}
          >
            You can stop anytime. Nothing to chase.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SizeChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { palette, spacing, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.md,
          borderRadius: radius.pill,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: active ? 'transparent' : palette.divider,
          backgroundColor: active ? palette.sage : palette.surface,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text
        style={[
          text.bodyMedium,
          { color: active ? palette.surface : palette.ink },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  spacer: { flex: 1 },
  sizeRow: { flexDirection: 'row' },
  primary: { alignItems: 'center', justifyContent: 'center' },
});
