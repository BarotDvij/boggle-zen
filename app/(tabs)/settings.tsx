/**
 * Settings screen — simple toggles, no dark patterns.
 */
import React from "react";
import {
  View,
  Text,
  Switch,
  Pressable,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import {
  useSettingsStore,
  type ThemePreference,
  type BoardSize,
} from "@/store/settings";
import { usePro } from "@/store/pro";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";
import { restorePurchases } from "@/monetization/revenuecat";

export default function SettingsScreen() {
  const { palette, spacing, radius } = useTheme();
  const settings = useSettingsStore();
  const isPro = usePro();
  const router = useRouter();

  const rowStyle = {
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[text.title, { color: palette.ink, marginBottom: spacing.xl }]}
        >
          Settings
        </Text>

        <SectionLabel label="Sound & Feel" palette={palette} spacing={spacing} />
        <View style={rowStyle}>
          <Text style={[text.body, { color: palette.ink }]}>Sound effects</Text>
          <Switch
            value={settings.soundEnabled}
            onValueChange={settings.setSound}
            trackColor={{ true: palette.accent, false: palette.divider }}
            thumbColor="#fff"
          />
        </View>
        <View style={rowStyle}>
          <Text style={[text.body, { color: palette.ink }]}>Haptics</Text>
          <Switch
            value={settings.hapticsEnabled}
            onValueChange={settings.setHaptics}
            trackColor={{ true: palette.accent, false: palette.divider }}
            thumbColor="#fff"
          />
        </View>

        <SectionLabel label="Game" palette={palette} spacing={spacing} />
        <SegmentRow
          label="Board size"
          options={[{ label: "4×4", value: 4 }, { label: "5×5", value: 5 }]}
          selected={settings.boardSize}
          onSelect={(v) => settings.setBoardSize(v as BoardSize)}
          palette={palette}
          spacing={spacing}
          radius={radius}
          rowStyle={rowStyle}
        />
        <SegmentRow
          label="Round length"
          options={[
            { label: "2 min", value: 120 },
            { label: "3 min", value: 180 },
            { label: "4 min", value: 240 },
          ]}
          selected={settings.roundSeconds}
          onSelect={(v) => settings.setRoundSeconds(Number(v))}
          palette={palette}
          spacing={spacing}
          radius={radius}
          rowStyle={rowStyle}
        />

        <SectionLabel label="Appearance" palette={palette} spacing={spacing} />
        <SegmentRow
          label="Theme"
          options={[
            { label: "System", value: "system" },
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ]}
          selected={settings.themeOverride}
          onSelect={(v) => settings.setTheme(v as ThemePreference)}
          palette={palette}
          spacing={spacing}
          radius={radius}
          rowStyle={rowStyle}
        />

        <SectionLabel label="Boggle Zen Pro" palette={palette} spacing={spacing} />
        {isPro ? (
          <View style={rowStyle}>
            <Text style={[text.body, { color: palette.ink }]}>Pro unlocked</Text>
            <Text style={[text.small, { color: palette.sage }]}>✓</Text>
          </View>
        ) : (
          <>
            <Pressable
              style={[rowStyle, { backgroundColor: palette.accent }]}
              onPress={() => router.push("/paywall")}
            >
              <Text style={[text.bodyMedium, { color: "#fff" }]}>
                Unlock everything forever
              </Text>
              <Text style={[text.small, { color: "rgba(255,255,255,0.7)" }]}>
                $4.99
              </Text>
            </Pressable>
            <Pressable
              style={rowStyle}
              onPress={() => void restorePurchases()}
            >
              <Text style={[text.body, { color: palette.ink }]}>
                Restore purchase
              </Text>
            </Pressable>
          </>
        )}

        <SectionLabel label="Legal" palette={palette} spacing={spacing} />
        <Pressable
          style={rowStyle}
          onPress={() => void Linking.openURL("https://bogglezen.app/privacy")}
        >
          <Text style={[text.body, { color: palette.ink }]}>Privacy Policy</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({
  label,
  palette,
  spacing,
}: {
  label: string;
  palette: ReturnType<typeof useTheme>["palette"];
  spacing: ReturnType<typeof useTheme>["spacing"];
}) {
  return (
    <Text
      style={[
        text.caption,
        {
          color: palette.inkFaint,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          marginBottom: spacing.sm,
          marginTop: spacing.lg,
        },
      ]}
    >
      {label}
    </Text>
  );
}

function SegmentRow({
  label,
  options,
  selected,
  onSelect,
  palette,
  spacing,
  radius,
  rowStyle,
}: {
  label: string;
  options: { label: string; value: number | string }[];
  selected: number | string;
  onSelect: (v: number | string) => void;
  palette: ReturnType<typeof useTheme>["palette"];
  spacing: ReturnType<typeof useTheme>["spacing"];
  radius: ReturnType<typeof useTheme>["radius"];
  rowStyle: object;
}) {
  return (
    <View style={rowStyle}>
      <Text style={[text.body, { color: palette.ink }]}>{label}</Text>
      <View style={{ flexDirection: "row", gap: spacing.xs }}>
        {options.map((opt) => {
          const active = opt.value === selected;
          return (
            <Pressable
              key={String(opt.value)}
              onPress={() => onSelect(opt.value)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
                borderRadius: radius.pill,
                backgroundColor: active ? palette.accent : palette.divider,
              }}
            >
              <Text
                style={[
                  text.small,
                  { color: active ? "#fff" : palette.inkSoft },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
