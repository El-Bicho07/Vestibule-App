import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Animatable from "react-native-animatable";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useSessionStore } from "../store/useSessionStore";
import { useThemeStore } from "../store/useThemeStore";
import { getColors } from "../constants/theme";
import { SHORT_RESET_MINUTES } from "../constants/config";
import { formatTime } from "../utils/time";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const AbandonScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const { elapsedOnAbandon, duration, label, resetSession, configureSession, startSession } =
    useSessionStore();

  const goHome = () => {
    resetSession();
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] }));
  };

  const restart = () => {
    configureSession({ duration, label, strictMode: useSessionStore.getState().strictMode });
    startSession();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Tabs" }, { name: "Session" }],
      }),
    );
  };

  const startReset = () => {
    configureSession({ duration: SHORT_RESET_MINUTES * 60, label: "Reset", strictMode: false });
    startSession();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Tabs" }, { name: "Session" }],
      }),
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} testID="abandon-screen">
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "space-between", paddingBottom: 28 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Animatable.Text
            animation="fadeInUp"
            duration={500}
            style={{
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: c.danger,
              fontWeight: "600",
              marginBottom: 14,
            }}
          >
            Left early
          </Animatable.Text>

          <Animatable.Text
            animation="fadeInUp"
            delay={100}
            duration={500}
            style={{
              fontSize: 34,
              fontWeight: "300",
              color: c.text,
              letterSpacing: -0.8,
              lineHeight: 42,
              marginBottom: 12,
            }}
          >
            Session left early.
          </Animatable.Text>

          <Text style={{ fontSize: 16, color: c.subtext, lineHeight: 24, marginBottom: 28 }}>
            The door is always open.
          </Text>

          <Animatable.View animation="fadeInUp" delay={250} duration={500}>
            <Card padding={20}>
              <Text style={{ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: c.subtext, marginBottom: 8, fontWeight: "600" }}>
                Time elapsed
              </Text>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: "300",
                  color: c.text,
                  fontFamily: "Courier",
                  letterSpacing: -1,
                }}
                testID="abandon-elapsed"
              >
                {formatTime(elapsedOnAbandon)}
              </Text>
              <Text style={{ fontSize: 13, color: c.subtext, marginTop: 6 }}>
                of {Math.round(duration / 60)} minutes intended
              </Text>
            </Card>
          </Animatable.View>
        </View>

        <View>
          <Button
            testID="start-reset-btn"
            label={`Start ${SHORT_RESET_MINUTES}m Reset`}
            onPress={startReset}
            size="lg"
            haptic="medium"
          />
          <View style={{ height: 10 }} />
          <Button testID="restart-btn" label="Restart" onPress={restart} variant="secondary" />
          <View style={{ height: 10 }} />
          <Button testID="go-home-btn" label="Go Home" onPress={goHome} variant="ghost" />
        </View>
      </View>
    </SafeAreaView>
  );
};
