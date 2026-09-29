/**
 * Boggle Zen — palette tokens.
 * Warm, muted, designed to feel calm at any time of day.
 */
export type ColorScheme = "light" | "dark";

export const lightPalette = {
  background: "#F4EFE6",
  surface: "#FBF7F0",
  surfaceRaised: "#FFFFFF",
  ink: "#2B2A28",
  inkSoft: "#5C564E",
  inkFaint: "#9E9689",
  divider: "#E6DFD2",
  sage: "#8AA290",
  sageSoft: "#C7D3C8",
  accent: "#C97B5C",
  accentSoft: "#E9C9B8",
  warn: "#B36A3F",
  success: "#6E8A78",
  shadow: "rgba(43, 42, 40, 0.10)",
  scrim: "rgba(43, 42, 40, 0.45)",
};

export type Palette = typeof lightPalette;

export const darkPalette: Palette = {
  background: "#1B1D22",
  surface: "#23262C",
  surfaceRaised: "#2C3037",
  ink: "#E8E2D3",
  inkSoft: "#B5AD9C",
  inkFaint: "#7E776A",
  divider: "#33373E",
  sage: "#6E8A78",
  sageSoft: "#3A4A41",
  accent: "#D4A574",
  accentSoft: "#5A4733",
  warn: "#D6996A",
  success: "#8FAE94",
  shadow: "rgba(0, 0, 0, 0.4)",
  scrim: "rgba(0, 0, 0, 0.55)",
};

export function paletteFor(scheme: ColorScheme): Palette {
  return scheme === "dark" ? darkPalette : lightPalette;
}
