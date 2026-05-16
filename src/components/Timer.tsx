/**
 * Timer — a breathing ring that shows remaining time.
 * Uses @shopify/react-native-skia for the arc; Reanimated for the breath effect.
 */
import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
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
  const sweepAngle = progress * 360;

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

  const trackPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addOval({
      x: STROKE,
      y: STROKE,
      width: size - STROKE * 2,
      height: size - STROKE * 2,
    });
    return p;
  }, [size]);

  const arcPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(
      { x: STROKE, y: STROKE, width: size - STROKE * 2, height: size - STROKE * 2 },
      -90,
      sweepAngle
    );
    return p;
  }, [sweepAngle, size]);

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animStyle]}>
      <Canvas style={{ width: size, height: size, position: "absolute" }}>
        <Path
          path={trackPath}
          color={trackColor}
          style="stroke"
          strokeWidth={STROKE}
          strokeCap="round"
        />
        <Path
          path={arcPath}
          color={arcColor}
          style="stroke"
          strokeWidth={STROKE}
          strokeCap="round"
        />
      </Canvas>
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
