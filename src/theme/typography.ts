/**
 * Boggle Zen — typography tokens.
 * Fraunces (warm soft serif) for display; Inter for UI body.
 * Fonts loaded via expo-font in app/_layout.tsx.
 */

export const fonts = {
  display: "Fraunces_500Medium",
  displaySemi: "Fraunces_600SemiBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemi: "Inter_600SemiBold",
} as const;

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export const text = {
  hero: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  small: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
  },
  tile: {
    fontFamily: fonts.displaySemi,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0,
  },
  numeric: {
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0,
  },
} as const satisfies Record<string, TextStyle>;
