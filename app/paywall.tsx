/**
 * Paywall — one screen, one product, plain language.
 * No timers, no fake scarcity, no dark patterns.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { usePro } from "@/store/pro";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import {
  purchasePro,
  restorePurchases,
  fetchOffering,
} from "@/monetization/revenuecat";
import { playSound } from "@/audio/soundpack";

const FEATURES = [
  "All five training drills, always",
  "Unlimited Solver Review on past boards",
  "Daily curated board — a new challenge every morning",
  "Custom colour themes",
  "No ads, ever",
];

export default function PaywallScreen() {
  const { palette, spacing, radius } = useTheme();
  const router = useRouter();
  const isPro = usePro();
  const [priceLabel, setPriceLabel] = useState("$4.99");
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (isPro) {
      router.back();
      return;
    }
    void fetchOffering().then((offering) => {
      const pkg = offering?.availablePackages[0];
      if (pkg) {
        setPriceLabel(pkg.product.priceString);
      }
    });
  }, [isPro]);

  const handlePurchase = async () => {
    setLoading(true);
    const success = await purchasePro();
    setLoading(false);
    if (success) {
      playSound("pro_unlock");
      router.back();
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    await restorePurchases();
    setRestoring(false);
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ alignSelf: "flex-end", padding: spacing.sm }}
        >
          <Text style={[text.small, { color: palette.inkFaint }]}>
            Not now
          </Text>
        </Pressable>

        <View style={styles.header}>
          <Text
            style={[text.hero, { color: palette.ink, textAlign: "center" }]}
          >
            Boggle Zen Pro
          </Text>
          <Text
            style={[
              text.body,
              {
                color: palette.inkSoft,
                textAlign: "center",
                marginTop: spacing.md,
                lineHeight: 24,
              },
            ]}
          >
            Support a small studio and unlock everything — once, forever.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: palette.surface,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginTop: spacing.xl,
            gap: spacing.md,
          }}
        >
          {FEATURES.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Text
                style={[
                  text.body,
                  { color: palette.sage, marginRight: spacing.sm },
                ]}
              >
                ✦
              </Text>
              <Text style={[text.body, { color: palette.ink, flex: 1 }]}>
                {f}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[
            styles.cta,
            {
              backgroundColor: palette.accent,
              borderRadius: radius.pill,
              paddingVertical: spacing.lg,
              marginTop: spacing.xl,
            },
          ]}
          onPress={() => void handlePurchase()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[text.bodyMedium, { color: "#fff", letterSpacing: 0.5 }]}
            >
              Unlock for {priceLabel}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={{ marginTop: spacing.lg, alignItems: "center" }}
          onPress={() => void handleRestore()}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator color={palette.inkFaint} size="small" />
          ) : (
            <Text style={[text.small, { color: palette.inkFaint }]}>
              Restore previous purchase
            </Text>
          )}
        </Pressable>

        <Text
          style={[
            text.small,
            {
              color: palette.inkFaint,
              textAlign: "center",
              marginTop: spacing.lg,
              lineHeight: 18,
            },
          ]}
        >
          One-time purchase. No recurring charges. Restores across all your
          devices.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", marginTop: 8 },
  featureRow: { flexDirection: "row", alignItems: "flex-start" },
  cta: { alignItems: "center" },
});
