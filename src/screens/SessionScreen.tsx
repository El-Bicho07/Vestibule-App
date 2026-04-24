import React, { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, AppState, AppStateStatus } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import * as Animatable from "react-native-animatable";
import { Timer } from "../components/Timer";
import { Button } from "../components/Button";
import { FrictionModal } from "../components/FrictionModal";
import { useSessionStore } from "../store/useSessionStore";
import { useStatsStore } from "../store/useStatsStore";
import { useThemeStore } from "../store/useThemeStore";
import { getColors } from "../constants/theme";
import { QUOTES } from "../constants/quotes";
import { QUOTE_ROTATION_MS } from "../constants/config";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const SessionScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useThemeStore();
  const c = getColors(theme);

  const {
    duration,
    label,
    startTime,
    strictMode,
    distractionsBlocked,
    tickDistraction,
    completeSession,
    abandonSession,
  } = useSessionStore();
  const { addSession } = useStatsStore();

  const [remaining, setRemaining] = useState(duration);
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [frictionVisible, setFrictionVisible] = useState(false);
  const backgroundedAt = useRef<number | null>(null);
  const finishedRef = useRef(false);

  // Countdown
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const left = duration - elapsed;
      if (left <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        setRemaining(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        completeSession();
        addSession({
          id: `${Date.now()}`,
          startTime,
          duration,
          actualDuration: duration,
          label,
          status: "complete",
          distractionsBlocked: useSessionStore.getState().distractionsBlocked,
          strictMode,
        });
        clearInterval(interval);
        navigation.replace("Complete");
      } else {
        setRemaining(Math.max(0, left));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [startTime, duration, completeSession, addSession, navigation, label, strictMode]);

  // Rotate quotes
  useEffect(() => {
    const t = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, QUOTE_ROTATION_MS);
    return () => clearInterval(t);
  }, []);

  // Count "distractions turned away" when app goes to background and returns
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "background" || next === "inactive") {
        backgroundedAt.current = Date.now();
      } else if (next === "active" && backgroundedAt.current) {
        const away = Date.now() - backgroundedAt.current;
        if (away > 2000) {
          tickDistraction();
          Haptics.selectionAsync();
        }
        backgroundedAt.current = null;
      }
    });
    return () => sub.remove();
  }, [tickDistraction]);

  const handleLeavePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFrictionVisible(true);
  };

  const handleConfirmLeave = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    abandonSession(elapsed);
    addSession({
      id: `${Date.now()}`,
      startTime: startTime ?? Date.now(),
      duration,
      actualDuration: elapsed,
      label,
      status: "abandoned",
      distractionsBlocked: useSessionStore.getState().distractionsBlocked,
      strictMode,
    });
    setFrictionVisible(false);
    navigation.replace("Abandon");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} testID="session-screen">
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: c.border,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: c.accent,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: c.subtext,
                fontWeight: "600",
              }}
            >
              You're inside the Vestibule
            </Text>
          </View>
        </View>

        {/* Timer center */}
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Animatable.View animation="fadeIn" duration={500}>
            <Timer remainingSeconds={remaining} totalSeconds={duration} testID="session-timer" />
          </Animatable.View>
          <Text
            style={{
              fontSize: 16,
              color: c.text,
              marginTop: 24,
              fontWeight: "500",
            }}
            testID="session-label"
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 12,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: c.subtext,
              marginTop: 4,
            }}
          >
            {strictMode ? "Strict mode" : "Standard"}
          </Text>
        </View>

        {/* Distraction counter */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 13, color: c.subtext }}>
            <Text style={{ color: c.text, fontWeight: "600" }} testID="distraction-count">
              {distractionsBlocked}
            </Text>{" "}
            distraction{distractionsBlocked === 1 ? "" : "s"} turned away
          </Text>
        </View>

        {/* Rotating quote */}
        <Animatable.View
          key={quoteIndex}
          animation="fadeIn"
          duration={800}
          style={{
            paddingHorizontal: 12,
            marginBottom: 24,
            minHeight: 50,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: c.subtext,
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: 22,
            }}
            testID="rotating-quote"
          >
            “{QUOTES[quoteIndex]}”
          </Text>
        </Animatable.View>

        <Button
          testID="leave-vestibule-btn"
          label="Leave Vestibule"
          onPress={handleLeavePress}
          variant="secondary"
          haptic="light"
        />
      </View>

      <FrictionModal
        visible={frictionVisible}
        strictMode={strictMode}
        onStay={() => {
          Haptics.selectionAsync();
          setFrictionVisible(false);
        }}
        onLeave={handleConfirmLeave}
        onDismiss={() => setFrictionVisible(false)}
      />
    </SafeAreaView>
  );
};
