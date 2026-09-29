import type { ExpoConfig, ConfigContext } from 'expo/config';

const BUNDLE_ID = 'com.boggle.zen';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Boggle Zen',
  slug: 'boggle-zen',
  scheme: 'bogglezen',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },
  android: {
    package: BUNDLE_ID,
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F4EFE6',
    },
    permissions: ['com.google.android.gms.permission.AD_ID'],
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-tracking-transparency',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        backgroundColor: '#F4EFE6',
        resizeMode: 'contain',
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: 'ca-app-pub-3940256099942544~3347511713',
        iosAppId: 'ca-app-pub-3940256099942544~1458002511',
        userTrackingUsageDescription:
          'This lets us show you fewer, more relevant ads. Tracking is never required to play.',
        // Standard AdMob SKAdNetwork identifier (kept minimal here; expand at submit time)
        skAdNetworkItems: ['cstr6suwn9.skadnetwork'],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '00000000-0000-0000-0000-000000000000',
    },
    revenuecat: {
      iosKey: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '',
      androidKey: process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '',
    },
  },
});
