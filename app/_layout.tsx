/**
 * Root layout — loads fonts, initialises RevenueCat, consent, and ads.
 */
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from "@expo-google-fonts/fraunces";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initRevenueCat } from "@/monetization/revenuecat";
import { requestConsent } from "@/monetization/consent";
import { preloadInterstitial } from "@/monetization/ads";
import { loadStats } from "@/game/db";
import { loadDictionary } from "@/game/dictionary";
import { useTheme } from "@/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { scheme } = useTheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    const init = async () => {
      try {
        // These run in parallel — none are critical to app launch.
        await Promise.allSettled([
          initRevenueCat(),
          requestConsent().then(() => preloadInterstitial()),
          loadStats(),
          loadDictionary(),
        ]);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    init();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="game/active"
          options={{ presentation: "fullScreenModal", animation: "fade" }}
        />
        <Stack.Screen
          name="paywall"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
