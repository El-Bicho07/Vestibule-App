import React, { useState } from "react";
import { View, Text, Pressable, Platform, ActivityIndicator, Alert } from "react-native";
import { Shield, Check, ChevronRight, Sparkles } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useThemeStore } from "../store/useThemeStore";
import { useBlocklistStore } from "../store/useBlocklistStore";
import { getColors, radius } from "../constants/theme";
import {
  openIosFocus,
  openIosShortcuts,
  openAndroidUsageAccess,
  showLinkHelp,
} from "../utils/platformBlocking";

export const PlatformBlockingCard: React.FC = () => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const {
    iosFocusLinked,
    androidUsageAccessGranted,
    setIosFocusLinked,
    setAndroidUsageAccessGranted,
  } = useBlocklistStore();

  const [busy, setBusy] = useState(false);

  const linked = Platform.OS === "ios" ? iosFocusLinked : androidUsageAccessGranted;

  const handlePrimaryAction = async () => {
    setBusy(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (Platform.OS === "ios") {
        const res = await openIosFocus();
        if (res.ok) {
          Alert.alert(
            "Almost there",
            "Create a Focus named 'Vestibule' and select the apps you want silenced. When you return, tap 'I've set it up'.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "I've set it up",
                onPress: () => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setIosFocusLinked(true);
                },
              },
            ],
          );
        } else if (res.message) {
          Alert.alert("Couldn't open Settings", res.message);
        }
      } else if (Platform.OS === "android") {
        const res = await openAndroidUsageAccess();
        if (res.ok) {
          Alert.alert(
            "Almost there",
            "Find 'Vestibule' in the list and grant Usage Access. When you return, tap 'I've granted it'.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "I've granted it",
                onPress: () => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setAndroidUsageAccessGranted(true);
                },
              },
            ],
          );
        } else if (res.message) {
          Alert.alert("Couldn't open Settings", res.message);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const handleShortcutsAction = async () => {
    Haptics.selectionAsync();
    const res = await openIosShortcuts();
    if (!res.ok && res.message) {
      Alert.alert("Shortcuts", res.message);
    }
  };

  const handleUnlink = () => {
    Haptics.selectionAsync();
    Alert.alert(
      "Disconnect platform blocking?",
      "Vestibule will fall back to heuristic distraction counting.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => {
            if (Platform.OS === "ios") setIosFocusLinked(false);
            else setAndroidUsageAccessGranted(false);
          },
        },
      ],
    );
  };

  const subtitle =
    Platform.OS === "ios"
      ? linked
        ? "Vestibule will trigger your iOS Focus on session start."
        : "Wire a native iOS Focus to silence blocked apps at the OS level."
      : Platform.OS === "android"
        ? linked
          ? "Usage access granted. Distractions are verified, not inferred."
          : "Grant usage access so distraction counts become verified."
        : "Platform-level blocking is only available on iOS and Android.";

  if (Platform.OS === "web") {
    return null;
  }

  return (
    <View
      testID="platform-blocking-card"
      style={{
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: linked ? c.accent : c.border,
        backgroundColor: c.surface,
        padding: 18,
        marginBottom: 20,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: linked ? c.accent : c.border,
            backgroundColor: linked ? c.accent : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          {linked ? (
            <Check size={16} color={c.background} strokeWidth={2.4} />
          ) : (
            <Shield size={16} color={c.text} strokeWidth={1.6} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, letterSpacing: 1.3, textTransform: "uppercase", color: c.subtext, fontWeight: "600" }}>
            {Platform.OS === "ios" ? "iOS Focus" : "Usage Access"}
          </Text>
          <Text style={{ fontSize: 15, color: c.text, fontWeight: "600", marginTop: 2 }}>
            {linked ? "Connected" : "Not connected"}
          </Text>
        </View>
        <Pressable testID="platform-help-btn" onPress={showLinkHelp} hitSlop={8}>
          <Sparkles size={16} color={c.subtext} strokeWidth={1.6} />
        </Pressable>
      </View>

      <Text style={{ fontSize: 13, color: c.subtext, lineHeight: 19, marginBottom: 14 }}>
        {subtitle}
      </Text>

      {linked ? (
        <View style={{ flexDirection: "row", gap: 10 }}>
          {Platform.OS === "ios" && (
            <Pressable
              testID="open-shortcuts-btn"
              onPress={handleShortcutsAction}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: c.border,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ color: c.text, fontSize: 13, fontWeight: "600" }}>Open Shortcuts</Text>
              <ChevronRight size={14} color={c.subtext} style={{ marginLeft: 4 }} />
            </Pressable>
          )}
          <Pressable
            testID="platform-unlink-btn"
            onPress={handleUnlink}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: c.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: c.subtext, fontSize: 13, fontWeight: "600" }}>Disconnect</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          testID="platform-connect-btn"
          onPress={handlePrimaryAction}
          disabled={busy}
          style={{
            paddingVertical: 12,
            borderRadius: radius.md,
            backgroundColor: c.text,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? (
            <ActivityIndicator color={c.background} size="small" />
          ) : (
            <>
              <Text style={{ color: c.background, fontSize: 14, fontWeight: "600", marginRight: 6 }}>
                {Platform.OS === "ios" ? "Connect iOS Focus" : "Grant Usage Access"}
              </Text>
              <ChevronRight size={16} color={c.background} strokeWidth={2.2} />
            </>
          )}
        </Pressable>
      )}
    </View>
  );
};
