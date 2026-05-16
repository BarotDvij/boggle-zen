import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, text } from '@/theme';

export default function TabsLayout() {
  const { palette } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.divider,
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: palette.sage,
        tabBarInactiveTintColor: palette.inkFaint,
        tabBarLabelStyle: {
          fontFamily: text.caption.fontFamily,
          fontSize: 10,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reflect"
        options={{
          title: 'Reflect',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
