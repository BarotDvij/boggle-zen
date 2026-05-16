/**
 * RevenueCat integration.
 * Initialises Purchases SDK and keeps the pro store in sync.
 * Call initRevenueCat() once in app/_layout.tsx.
 */
import Purchases, {
  LOG_LEVEL,
  type PurchasesOffering,
} from "react-native-purchases";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { useProStore } from "@/store/pro";

const RC_IOS_KEY: string =
  Constants.expoConfig?.extra?.revenuecat?.iosKey ?? "";
const RC_ANDROID_KEY: string =
  Constants.expoConfig?.extra?.revenuecat?.androidKey ?? "";

export const PRO_ENTITLEMENT = "pro";

export async function initRevenueCat(): Promise<void> {
  const apiKey = Platform.OS === "ios" ? RC_IOS_KEY : RC_ANDROID_KEY;
  if (!apiKey) {
    // Keys not yet configured — run in free mode silently.
    useProStore.getState().markHydrated();
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  Purchases.configure({ apiKey });

  try {
    const info = await Purchases.getCustomerInfo();
    const isPro =
      info.entitlements.active[PRO_ENTITLEMENT]?.isActive === true;
    useProStore.getState().setPro(isPro);
  } catch {
    // Offline or first launch — fail silently, default is free.
  } finally {
    useProStore.getState().markHydrated();
  }

  // Keep store updated when purchase state changes elsewhere.
  Purchases.addCustomerInfoUpdateListener((info) => {
    const isPro =
      info.entitlements.active[PRO_ENTITLEMENT]?.isActive === true;
    useProStore.getState().setPro(isPro);
  });
}

export async function fetchOffering(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch {
    return null;
  }
}

export async function purchasePro(): Promise<boolean> {
  try {
    const offering = await fetchOffering();
    const pkg = offering?.availablePackages[0];
    if (!pkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPro =
      customerInfo.entitlements.active[PRO_ENTITLEMENT]?.isActive === true;
    useProStore.getState().setPro(isPro);
    return isPro;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const info = await Purchases.restorePurchases();
    const isPro =
      info.entitlements.active[PRO_ENTITLEMENT]?.isActive === true;
    useProStore.getState().setPro(isPro);
    return isPro;
  } catch {
    return false;
  }
}
