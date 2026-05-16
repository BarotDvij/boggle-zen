/**
 * Boggle Zen — theme hook + spacing/radius tokens.
 */
import { useColorScheme } from "react-native";
import { useSettingsStore } from "@/store/settings";
import { paletteFor, type ColorScheme, type Palette } from "./palette";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export interface Theme {
  scheme: ColorScheme;
  palette: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
}

export function useTheme(): Theme {
  const systemScheme = useColorScheme() ?? "light";
  const override = useSettingsStore((s) => s.themeOverride);
  const scheme: ColorScheme =
    override === "system" ? (systemScheme as ColorScheme) : override;
  return {
    scheme,
    palette: paletteFor(scheme),
    spacing,
    radius,
  };
}

export * from "./palette";
export * from "./typography";
export * from "./motion";
