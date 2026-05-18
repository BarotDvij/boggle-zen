/**
 * Paywall — a single, calm, honest screen.
 *
 * One product. One button. No urgency.
 *
 * Copy guidelines:
 * - Talk like a person, not a marketer.
 * - Never use "limited time," "save now," countdown timers, or scary language.
 * - Mention what's included plainly; let the reader decide.
 */

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/theme';
import { text } from '@/theme/typography';
import {
  fetchOffering,
  purchasePro,
  restorePurchases,
} from '@/monetization/revenuecat';
import { playSound } from '@/audio/soundpack';

const INCLUDED = [
  'Removes all ads. Forever.',
  'Every practice drill — prefix and suffix sprints, pattern spotting.',
  'Unlimited Solver Review — rewatch any past board.',
  'Daily curated board, hand-picked for clarity.',
  'Future themes and quiet touches.',
];

export default function Paywall() {
  const router = useRouter();
  const { palette, spacing, radius } = useTheme();
  const [priceLabel, setPriceLabel] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffering()
      .then((offering) => {
        const pkg = offering?.availablePackages[0];
        const label = pkg?.product.priceString ?? null;
        setPriceLabel(label);
      })
      .catch(() => undefined);
  }, []);

  const handlePurchase = async () => {
    setPurchasing(true);
    setError(null);
    try {
      const ok = await purchasePro();
      if (ok) {
        playSound('pro_unlock');
        router.back();
      } else {
        setError('Purchase did not complete. No charge was made.');
      }
    } catch {
      setError('Something went wrong. No charge was made.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    setError(null);
    try {
      const ok = await restorePurchases();
      if (ok) {
        playSound('pro_unlock');
        router.back();
      } else {
        setError('No previous purchase found on this account.');
      }
    } catch {
      setError('Restore did not complete. Please try again later.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xl,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="close" size={22} color={palette.inkSoft} />
          </Pressable>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Text
            style={[text.caption, styles.eyebrow, { color: palette.inkFaint }]}
          >
            BOGGLE ZEN
          </Text>
          <Text
            style={[text.hero, { color: palette.ink, marginTop: spacing.sm }]}
          >
            Pro
          </Text>
          <Text
            style={[
              text.body,
              {
                color: palette.inkSoft,
                marginTop: spacing.md,
                maxWidth: 360,
              },
            ]}
          >
            A small one-time purchase that supports a small studio. Pay once.
            Keep it forever. No subscription, no renewals, no surprises.
          </Text>
        </View>

        <View
          style={[
            styles.includedCard,
            {
              backgroundColor: palette.surface,
              borderColor: palette.divider,
              borderRadius: radius.lg,
              padding: spacing.lg,
              marginTop: spacing.xl,
            },
          ]}
        >
          {INCLUDED.map((line) => (
            <View
              key={line}
              style={[styles.includedRow, { paddingVertical: spacing.xs }]}
            >
              <Ionicons
                name="leaf-outline"
                size={16}
                color={palette.sage}
                style={{ marginTop: 3 }}
              />
              <Text
                style={[
                  text.body,
                  {
                    color: palette.ink,
                    marginLeft: spacing.md,
                    flex: 1,
                  },
                ]}
              >
                {line}
              </Text>
            </View>
          ))}
        </View>

        {error && (
          <Text
            style={[
              text.small,
              {
                color: palette.warn,
                marginTop: spacing.md,
                textAlign: 'center',
              },
            ]}
          >
            {error}
          </Text>
        )}

        <View style={{ marginTop: spacing.xl }}>
          <Pressable
            onPress={handlePurchase}
            disabled={purchasing}
            style={({ pressed }) => [
              {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: palette.sage,
                borderRadius: radius.pill,
                paddingVertical: spacing.md + 2,
                opacity: pressed || purchasing ? 0.9 : 1,
              },
            ]}
          >
            {purchasing ? (
              <ActivityIndicator color={palette.surface} />
            ) : (
              <Text style={[text.bodyMedium, { color: palette.surface }]}>
                {priceLabel ? `Unlock for ${priceLabel}` : 'Unlock Boggle Zen Pro'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleRestore}
            disabled={restoring}
            style={{
              paddingVertical: spacing.md,
              alignItems: 'center',
              marginTop: spacing.xs,
            }}
          >
            <Text style={[text.small, { color: palette.inkSoft }]}>
              {restoring ? 'Checking…' : 'Restore a previous purchase'}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: spacing.xl }} />
        <Text
          style={[
            text.small,
            {
              color: palette.inkFaint,
              textAlign: 'center',
              lineHeight: 18,
            },
          ]}
        >
          Payment will be charged to your App Store or Google Play account.
          One-time purchase. Restore anytime.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  includedCard: { borderWidth: StyleSheet.hairlineWidth },
  includedRow: { flexDirection: 'row', alignItems: 'flex-start' },
  eyebrow: { textTransform: 'uppercase' },
});
