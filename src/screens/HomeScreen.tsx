import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Pressable,
  Modal,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import * as Animatable from "react-native-animatable";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { StreakBadge } from "../components/StreakBadge";
import { useSessionStore } from "../store/useSessionStore";
import { useBlocklistStore } from "../store/useBlocklistStore";
import { useStatsStore } from "../store/useStatsStore";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";
import { DURATION_CHIPS, DEFAULT_LABEL } from "../constants/config";
import { formatDuration, formatRelative } from "../utils/time";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme, toggle } = useThemeStore();
  const c = getColors(theme);

  const { configureSession, startSession } = useSessionStore();
  const { apps } = useBlocklistStore();
  const { streak, sessions, longestStreak } = useStatsStore();

  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [strict, setStrict] = useState(false);

  const blockedCount = useMemo(() => apps.filter((a) => a.blocked).length, [apps]);
  const lastSession = sessions[0];

  const handleChip = (minutes: number) => {
    Haptics.selectionAsync();
    setSelectedDuration(minutes);
    setCustomMode(false);
  };

  const handleCustom = () => {
    Haptics.selectionAsync();
    setCustomMode(true);
  };

  const openSheet = () => {
    const duration = customMode ? Math.max(1, parseInt(customValue || "0", 10)) : selectedDuration;
    if (customMode && (!duration || duration < 1)) {
      return;
    }
    setSelectedDuration(duration);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSheetOpen(true);
  };

  const enterVestibule = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    configureSession({
      duration: selectedDuration * 60,
      label: label.trim() || DEFAULT_LABEL,
      strictMode: strict,
    });
    startSession();
    setSheetOpen(false);
    navigation.navigate("Session");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: c.subtext,
              fontWeight: "600",
            }}
          >
            Vestibule
          </Text>
          <Pressable
            testID="theme-toggle-btn"
            onPress={() => {
              Haptics.selectionAsync();
              toggle();
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: c.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 14 }}>{theme === "light" ? "☾" : "☀"}</Text>
          </Pressable>
        </View>

        {/* Tagline */}
        <Animatable.View animation="fadeInUp" duration={600}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "300",
              color: c.text,
              letterSpacing: -0.8,
              lineHeight: 40,
              marginBottom: 8,
            }}
          >
            Step inside.{"\n"}
            <Text style={{ color: c.subtext }}>Leave the noise behind.</Text>
          </Text>
        </Animatable.View>

        {/* Streak / last session */}
        <Animatable.View animation="fadeInUp" delay={150} duration={600} style={{ marginTop: 32 }}>
          <Card padding={20}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <StreakBadge streak={streak} testID="streak-badge" />
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: c.subtext, marginBottom: 4 }}>
                  Best
                </Text>
                <Text style={{ fontSize: 24, fontWeight: "300", color: c.text, fontFamily: "Courier" }}>
                  {longestStreak}
                </Text>
              </View>
            </View>
            {lastSession && (
              <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: c.border }}>
                <Text style={{ fontSize: 12, color: c.subtext, marginBottom: 2 }}>Last session</Text>
                <Text style={{ fontSize: 15, color: c.text }}>
                  {formatDuration(Math.round(lastSession.actualDuration / 60))} · {lastSession.label}
                  <Text style={{ color: c.subtext }}>  ·  {formatRelative(lastSession.startTime)}</Text>
                </Text>
              </View>
            )}
          </Card>
        </Animatable.View>

        {/* Duration chips */}
        <Animatable.View animation="fadeInUp" delay={300} duration={600} style={{ marginTop: 32 }}>
          <Text
            style={{
              fontSize: 12,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: c.subtext,
              marginBottom: 14,
              fontWeight: "600",
            }}
          >
            Duration
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {DURATION_CHIPS.map((m) => (
              <Pressable
                key={m}
                testID={`duration-chip-${m}`}
                onPress={() => handleChip(m)}
                style={{
                  paddingHorizontal: 22,
                  paddingVertical: 14,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: !customMode && selectedDuration === m ? c.text : c.border,
                  backgroundColor: !customMode && selectedDuration === m ? c.text : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: !customMode && selectedDuration === m ? c.background : c.text,
                  }}
                >
                  {m}m
                </Text>
              </Pressable>
            ))}
            <Pressable
              testID="duration-chip-custom"
              onPress={handleCustom}
              style={{
                paddingHorizontal: 22,
                paddingVertical: 14,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: customMode ? c.text : c.border,
                backgroundColor: customMode ? c.text : "transparent",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: customMode ? c.background : c.text,
                }}
              >
                Custom
              </Text>
            </Pressable>
          </View>
          {customMode && (
            <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}>
              <TextInput
                testID="custom-duration-input"
                value={customValue}
                onChangeText={(v) => setCustomValue(v.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                placeholder="Minutes"
                placeholderTextColor={c.subtext}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: radius.md,
                  padding: 14,
                  fontSize: 16,
                  color: c.text,
                  backgroundColor: c.surface,
                }}
              />
              <Text style={{ marginLeft: 12, color: c.subtext, fontSize: 14 }}>min</Text>
            </View>
          )}
        </Animatable.View>

        {/* Blocked summary + CTA */}
        <Animatable.View animation="fadeInUp" delay={450} duration={600} style={{ marginTop: 32 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent, marginRight: 10 }} />
            <Text style={{ fontSize: 14, color: c.subtext }}>
              <Text style={{ color: c.text, fontWeight: "600" }}>{blockedCount}</Text> apps blocked at the door
            </Text>
          </View>

          <Button
            testID="enter-vestibule-btn"
            label="Enter Vestibule"
            onPress={openSheet}
            size="lg"
            haptic="medium"
          />
        </Animatable.View>
      </ScrollView>

      {/* Bottom sheet */}
      <Modal visible={sheetOpen} transparent animationType="fade" onRequestClose={() => setSheetOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setSheetOpen(false)} />
          <Animatable.View
            animation="slideInUp"
            duration={300}
            style={{
              backgroundColor: c.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 40,
              borderTopWidth: 1,
              borderColor: c.border,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: c.border }} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "600", color: c.text, marginBottom: 6, letterSpacing: -0.3 }}>
              Configure the room
            </Text>
            <Text style={{ fontSize: 14, color: c.subtext, marginBottom: 24 }}>
              {selectedDuration} minutes · {blockedCount} apps at the door
            </Text>

            <Text style={{ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: c.subtext, marginBottom: 8 }}>
              Label
            </Text>
            <TextInput
              testID="session-label-input"
              value={label}
              onChangeText={setLabel}
              placeholder={DEFAULT_LABEL}
              placeholderTextColor={c.subtext}
              style={{
                borderWidth: 1,
                borderColor: c.border,
                borderRadius: radius.md,
                padding: 14,
                fontSize: 16,
                color: c.text,
                backgroundColor: c.background,
                marginBottom: 20,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 16,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: c.border,
                marginBottom: 24,
              }}
            >
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", color: c.text, marginBottom: 2 }}>Strict mode</Text>
                <Text style={{ fontSize: 13, color: c.subtext }}>Requires a math problem to leave early.</Text>
              </View>
              <Switch
                testID="strict-mode-switch"
                value={strict}
                onValueChange={(v) => {
                  Haptics.selectionAsync();
                  setStrict(v);
                }}
                trackColor={{ false: c.border, true: c.accent }}
                thumbColor={c.surface}
              />
            </View>

            <Button
              testID="confirm-enter-btn"
              label={`Enter for ${selectedDuration}m`}
              onPress={enterVestibule}
              size="lg"
              haptic="heavy"
            />
          </Animatable.View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
