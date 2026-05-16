/**
 * Board — renders the grid of tiles and handles drag/tap selection.
 * Exposes onWordAttempt(word, path) to the parent game screen.
 */
import React, { useCallback, useRef, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Tile } from "./Tile";
import { adjacents } from "@/game/board";
import { hapticTile } from "@/audio/haptics";
import { playSound } from "@/audio/soundpack";
import { spacing } from "@/theme";

interface BoardProps {
  letters: string[];
  size: 4 | 5;
  onWordAttempt: (word: string, path: number[]) => void;
  disabled?: boolean;
}

export function Board({ letters, size, onWordAttempt, disabled }: BoardProps) {
  const { width } = useWindowDimensions();
  const [selectedPath, setSelectedPath] = useState<number[]>([]);
  const tileRefs = useRef<Map<number, { x: number; y: number; size: number }>>(
    new Map()
  );

  const gap = spacing.sm;
  const boardPadding = spacing.lg;
  const tileSize = Math.floor((width - boardPadding * 2 - gap * (size - 1)) / size);

  const getTileAtPoint = useCallback(
    (x: number, y: number): number | null => {
      for (const [index, rect] of tileRefs.current) {
        if (
          x >= rect.x &&
          x <= rect.x + rect.size &&
          y >= rect.y &&
          y <= rect.y + rect.size
        ) {
          return index;
        }
      }
      return null;
    },
    []
  );

  const addToPath = useCallback(
    (index: number, currentPath: number[]) => {
      if (currentPath.includes(index)) return currentPath;
      if (currentPath.length === 0) {
        hapticTile();
        playSound("tile_tap");
        return [index];
      }
      const last = currentPath[currentPath.length - 1] ?? 0;
      const adj = adjacents(last, size);
      if (!adj.includes(index)) return currentPath;
      hapticTile();
      playSound("tile_tap");
      return [...currentPath, index];
    },
    [size]
  );

  const commitWord = useCallback(
    (path: number[]) => {
      if (path.length >= 3) {
        const word = path.map((i) => letters[i]).join("");
        onWordAttempt(word, path);
      }
      setSelectedPath([]);
    },
    [letters, onWordAttempt]
  );

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((e) => {
      if (disabled) return;
      const idx = getTileAtPoint(e.x, e.y);
      if (idx !== null) {
        setSelectedPath([idx]);
        hapticTile();
        playSound("tile_tap");
      }
    })
    .onUpdate((e) => {
      if (disabled) return;
      setSelectedPath((prev) => {
        const idx = getTileAtPoint(e.x, e.y);
        if (idx === null) return prev;
        return addToPath(idx, prev);
      });
    })
    .onEnd(() => {
      if (disabled) return;
      setSelectedPath((prev) => {
        commitWord(prev);
        return [];
      });
    });

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd((e) => {
      if (disabled) return;
      const idx = getTileAtPoint(e.x, e.y);
      if (idx === null) return;
      setSelectedPath((prev) => {
        if (prev.length > 0 && prev.includes(idx)) {
          // Tap on last tile = submit
          commitWord(prev);
          return [];
        }
        return addToPath(idx, prev);
      });
    });

  const composed = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={composed}>
        <View
          style={[styles.grid, { gap }]}
          pointerEvents={disabled ? "none" : "auto"}
        >
          {Array.from({ length: size }).map((_, row) => (
            <View key={row} style={[styles.row, { gap }]}>
              {Array.from({ length: size }).map((_, col) => {
                const index = row * size + col;
                return (
                  <View
                    key={col}
                    onLayout={(e) => {
                      const { x, y } = e.nativeEvent.layout;
                      tileRefs.current.set(index, { x, y, size: tileSize });
                    }}
                  >
                    <Tile
                      letter={letters[index] ?? ""}
                      selected={
                        selectedPath[selectedPath.length - 1] === index
                      }
                      inPath={
                        selectedPath.includes(index) &&
                        selectedPath[selectedPath.length - 1] !== index
                      }
                      size={tileSize}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "column",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
});
