/**
 * Privacy consent flow.
 * - iOS: App Tracking Transparency (ATT) dialog.
 * - Android: Google UMP consent form (via react-native-google-mobile-ads).
 *
 * Call requestConsent() once before showing any ads.
 */
import { Platform } from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import MobileAds, {
  AdsConsent,
  AdsConsentStatus,
} from "react-native-google-mobile-ads";

let consentRequested = false;

export async function requestConsent(): Promise<void> {
  if (consentRequested) return;
  consentRequested = true;

  try {
    if (Platform.OS === "ios") {
      // Request ATT permission on iOS 14.5+.
      await requestTrackingPermissionsAsync();
    }

    // Google UMP consent (covers Android + any EU users on iOS).
    const consentInfo = await AdsConsent.requestInfoUpdate();
    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdsConsentStatus.REQUIRED
    ) {
      await AdsConsent.showForm();
    }

    await MobileAds().initialize();
  } catch {
    // Non-fatal: proceed without personalised ads.
    await MobileAds().initialize().catch(() => {});
  }
}
