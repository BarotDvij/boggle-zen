import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/theme';
import { text } from '@/theme/typography';
import { useSettingsStore, type ThemePreference } from '@/store/settings';
import { usePro } from '@/store/pro';
import { restorePurchases } from '@/monetization/revenuecat';

export default function SettingsScreen() {
  const router = useRouter();
  const { palette, spacing } = useTheme();
  const settings = useSettingsStore();
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
          <Text style={[text.caption, { color: palette.inkFaint }]}>
            SETTINGS
          </Text>
          <Text
            style={[text.title, { color: palette.ink, marginTop: spacing.sm }]}
          >
            The small dials
          </Text>
        </View>

        <View style={{ height: spacing.xl }} />

        <Section title="Feel">
          <Toggle
            label="Sound"
            value={settings.soundEnabled}
            onChange={(v) => useSettingsStore.setState({ soundEnabled: v })}
          />
          <Toggle
            label="Haptics"
            value={settings.hapticsEnabled}
            onChange={(v) => useSettingsStore.setState({ hapticsEnabled: v })}
          />
        </Section>

        <Section title="Appearance">
          <Segmented<ThemePreference>
            value={settings.themeOverride}
            onChange={(v) => useSettingsStore.setState({ themeOverride: v })}
            options={[
              { id: 'light', label: 'Light' },
              { id: 'system', label: 'System' },
              { id: 'dark', label: 'Dark' },
            ]}
          />
        </Section>

        <Section title={isPro ? 'Thank you' : 'Support the studio'}>
          <Text
            style={[
              text.body,
              { color: palette.inkSoft, marginBottom: spacing.md },
            ]}
          >
            {isPro
              ? 'You have Boggle Zen Pro. Every practice tool is open to you, and ads stay away.'
              : 'One small purchase removes ads, unlocks unlimited Solver Review, and keeps me independent.'}
          </Text>
          {!isPro && (
            <PrimaryButton
              label="Boggle Zen Pro"
              onPress={() => router.push('/paywall')}
            />
          )}
          <Pressable
            onPress={() => {
              restorePurchases().catch(() => undefined);
            }}
            style={{ paddingVertical: spacing.sm, alignSelf: 'flex-start' }}
          >
            <Text style={[text.small, { color: palette.inkSoft }]}>
              Restore purchases
            </Text>
          </Pressable>
        </Section>

        <View style={{ height: spacing.xxl }} />
        <Text style={[text.small, { color: palette.inkFaint, textAlign: 'center' }]}>
          Made with care.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { palette, spacing, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.sage,
          borderRadius: radius.pill,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          alignSelf: 'flex-start',
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={[text.bodyMedium, { color: palette.surface }]}>
        {label}
      </Text>
    </Pressable>
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
    <View style={{ marginBottom: spacing.xl }}>
      <Text style={[text.caption, { color: palette.inkFaint }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionBody,
          {
            backgroundColor: palette.surface,
            borderColor: palette.divider,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginTop: spacing.sm,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { palette, spacing } = useTheme();
  return (
    <View style={[styles.toggleRow, { paddingVertical: spacing.sm }]}>
      <Text style={[text.bodyMedium, { color: palette.ink }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: palette.sage, false: palette.divider }}
        thumbColor={palette.surfaceRaised}
        ios_backgroundColor={palette.divider}
      />
    </View>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  const { palette, spacing, radius } = useTheme();
  return (
    <View style={[styles.segmented, { gap: spacing.sm }]}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            style={[
              styles.segment,
              {
                flex: 1,
                paddingVertical: spacing.sm + 2,
                borderRadius: radius.pill,
                backgroundColor: active ? palette.sage : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                text.bodyMedium,
                {
                  color: active ? palette.surface : palette.inkSoft,
                  textAlign: 'center',
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  sectionBody: { borderWidth: StyleSheet.hairlineWidth },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmented: { flexDirection: 'row' },
  segment: { alignItems: 'center' },
});
