/**
 * RevenueCat integration.
 * Initialises Purchases SDK and keeps the pro store in sync.
 * Call initRevenueCat() once in app/_layout.tsx.
 */
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
} from "react-native-purchases";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { useProStore } from "@/store/pro";

const RC_IOS_KEY: string =
  Constants.expoConfig?.extra?.revenuecat?.iosKey ?? "";
const RC_ANDROID_KEY: string =
  Constants.expoConfig?.extra?.revenuecat?.androidKey ?? "";

const PRO_ENTITLEMENT = "pro";

function syncPro(info: CustomerInfo): boolean {
  const isPro = info.entitlements.active[PRO_ENTITLEMENT]?.isActive === true;
  useProStore.getState().setPro(isPro);
  return isPro;
}

export async function initRevenueCat(): Promise<void> {
  const apiKey = Platform.OS === "ios" ? RC_IOS_KEY : RC_ANDROID_KEY;
  // Keys not yet configured — run in free mode silently.
  if (!apiKey) return;

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  Purchases.configure({ apiKey });

  try {
    syncPro(await Purchases.getCustomerInfo());
  } catch {
    // Offline or first launch — fail silently, default is free.
  }

  // Keep store updated when purchase state changes elsewhere.
  Purchases.addCustomerInfoUpdateListener(syncPro);
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
    return syncPro(customerInfo);
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    return syncPro(await Purchases.restorePurchases());
  } catch {
    return false;
  }
}
