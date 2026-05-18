import type { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';

const BUNDLE_ID = IS_DEV ? 'com.boggle.zen.dev' : 'com.boggle.zen';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'Boggle Zen (Dev)' : 'Boggle Zen',
  slug: 'boggle-zen',
  scheme: 'bogglezen',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#F4EFE6',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSUserTrackingUsageDescription:
        'This lets us show you fewer, more relevant ads. Tracking is never required to play.',
      SKAdNetworkItems: [
        // Standard AdMob SKAdNetwork identifiers (kept minimal here; expand at submit time)
        { SKAdNetworkIdentifier: 'cstr6suwn9.skadnetwork' },
      ],
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
    'expo-font',
    'expo-secure-store',
    'expo-tracking-transparency',
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
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
    revenueCat: {
      iosKey: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '',
      androidKey: process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '',
    },
    admob: {
      iosInterstitial:
        process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL ??
        'ca-app-pub-3940256099942544/4411468910',
      androidInterstitial:
        process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL ??
        'ca-app-pub-3940256099942544/1033173712',
    },
  },
});
