/**
 * Boggle Zen — motion tokens.
 * All movement should feel like a breath: slow, soft, no harsh edges.
 */
import { Easing } from "react-native-reanimated";

export const spring = {
  gentle: {
    damping: 18,
    stiffness: 140,
    mass: 1,
  },
  soft: {
    damping: 22,
    stiffness: 90,
    mass: 1,
  },
  responsive: {
    damping: 16,
    stiffness: 220,
    mass: 0.9,
  },
} as const;

export const duration = {
  instant: 80,
  quick: 120,
  base: 200,
  slow: 320,
  breath: 4500,
} as const;

export const easing = {
  inOut: Easing.bezier(0.4, 0, 0.2, 1),
  out: Easing.bezier(0.25, 0.1, 0.25, 1),
  exhale: Easing.bezier(0.45, 0, 0.55, 1),
} as const;
