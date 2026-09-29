/**
 * Timer — a breathing ring that shows remaining time.
 * Uses react-native-svg for the arc; Reanimated for the breath effect.
 */
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/theme";
import { text } from "@/theme/typography";

interface TimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  size?: number;
}

const STROKE = 4;

export function Timer({ totalSeconds, remainingSeconds, size = 72 }: TimerProps) {
  const { palette } = useTheme();
  const breath = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const r = size / 2 - STROKE;
  const circumference = 2 * Math.PI * r;

  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(breath.value, [0, 1], [1, 1.04]);
    return { transform: [{ scale }] };
  });

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeLabel = `${mins}:${secs.toString().padStart(2, "0")}`;

  const isLow = remainingSeconds <= 30 && remainingSeconds > 0;

  const trackColor = palette.divider;
  const arcColor = isLow ? palette.warn : palette.sage;

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animStyle]}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={arcColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text
        style={[
          text.small,
          {
            color: isLow ? palette.warn : palette.inkSoft,
            position: "absolute",
          },
        ]}
      >
        {timeLabel}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
