/**
 * Tile — a single Boggle letter tile.
 * Shows selection state via animated background + scale spring.
 */
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";

interface TileProps {
  letter: string;
  selected: boolean;
  inPath: boolean;
  size: number;
}

export function Tile({ letter, selected, inPath, size }: TileProps) {
  const { palette, radius } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(
      selected ? 0.93 : inPath ? 0.97 : 1,
      { damping: 16, stiffness: 220, mass: 0.9 }
    );
  }, [selected, inPath]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg = selected
    ? palette.accent
    : inPath
    ? palette.accentSoft
    : palette.surface;
  const inkColor = selected ? "#FFFFFF" : palette.ink;

  return (
    <Animated.View
      style={[
        styles.tile,
        animStyle,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={[text.tile, { color: inkColor, textAlign: "center" }]}>
        {letter.toUpperCase()}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});
