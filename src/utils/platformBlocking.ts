import { Platform, Linking, Alert } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

// Honest integration for managed Expo:
// - iOS: deep-link into Focus / Shortcuts so the user can wire a Focus mode to
//   their blocklist. We cannot *enforce* blocking from inside a managed Expo app,
//   but we can hand users directly to the native controls.
// - Android: open the Usage Access settings so the user can grant the
//   PACKAGE_USAGE_STATS permission. Once granted, background transitions to
//   blocked apps can be attributed with high confidence.

export interface PlatformBlockingResult {
  ok: boolean;
  message?: string;
}

// iOS: Focus mode settings. Apple restricts direct deep-links to specific
// Settings panes; the most reliable URLs across versions:
const IOS_FOCUS_URL = "App-Prefs:com.apple.focus";
const IOS_SETTINGS_URL = "App-Prefs:"; // fallback: root Settings
const IOS_SHORTCUTS_URL = "shortcuts://";

export const openIosFocus = async (): Promise<PlatformBlockingResult> => {
  try {
    const canOpenFocus = await Linking.canOpenURL(IOS_FOCUS_URL);
    if (canOpenFocus) {
      await Linking.openURL(IOS_FOCUS_URL);
      return { ok: true };
    }
    const canOpenSettings = await Linking.canOpenURL(IOS_SETTINGS_URL);
    if (canOpenSettings) {
      await Linking.openURL(IOS_SETTINGS_URL);
      return { ok: true, message: "Opened Settings. Navigate to Focus." };
    }
    return { ok: false, message: "Settings could not be opened on this device." };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
};

export const openIosShortcuts = async (): Promise<PlatformBlockingResult> => {
  try {
    const can = await Linking.canOpenURL(IOS_SHORTCUTS_URL);
    if (!can) {
      return { ok: false, message: "Shortcuts app is not installed." };
    }
    await Linking.openURL(IOS_SHORTCUTS_URL);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
};

export const openAndroidUsageAccess = async (): Promise<PlatformBlockingResult> => {
  try {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.USAGE_ACCESS_SETTINGS,
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
};

export const openAndroidAppSettings = async (): Promise<PlatformBlockingResult> => {
  try {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
    );
    return { ok: true };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
};

export const platformLabel = (): string =>
  Platform.OS === "ios"
    ? "iOS Focus"
    : Platform.OS === "android"
      ? "Usage Access"
      : "Platform blocking";

export const showLinkHelp = () => {
  const msg =
    Platform.OS === "ios"
      ? "In iOS Settings → Focus, create a 'Vestibule' focus that silences the apps you block here. Then open the Shortcuts app and add a 'Turn On Focus' action to a Shortcut named 'Enter Vestibule' so it triggers automatically."
      : "Grant Usage Access to let Vestibule verify when blocked apps are opened during a session. Distraction counts become accurate instead of heuristic.";
  Alert.alert(platformLabel(), msg);
};
