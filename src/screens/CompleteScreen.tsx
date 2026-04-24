import React, { useEffect, useMemo } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Animatable from "react-native-animatable";
import * as Haptics from "expo-haptics";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useSessionStore } from "../store/useSessionStore";
import { useStatsStore } from "../store/useStatsStore";
import { useThemeStore } from "../store/useThemeStore";
import { getColors } from "../constants/theme";
import { STREAK_MILESTONES } from "../constants/config";
import { formatDuration } from "../utils/time";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const CompleteScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const { duration, label, distractionsBlocked, resetSession, startSession } = useSessionStore();
  const { streak } = useStatsStore();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const milestone = useMemo(
    () => STREAK_MILESTONES.slice().reverse().find((m) => streak === m) ?? null,
    [streak],
  );

  const goHome = () => {
    resetSession();
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] }));
  };

  const enterAgain = () => {
    startSession();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Tabs" }, { name: "Session" }],
      }),
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} testID="complete-screen">
      <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "space-between", paddingBottom: 28 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Animatable.Text
            animation="fadeInUp"
            duration={500}
            style={{
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: c.accent,
              fontWeight: "600",
              marginBottom: 14,
            }}
          >
            Complete
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
              marginBottom: 32,
            }}
          >
            You've stepped{"\n"}back out.
          </Animatable.Text>

          <Animatable.View animation="fadeInUp" delay={250} duration={500}>
            <Card padding={20}>
              <Row label="Duration" value={formatDuration(Math.round(duration / 60))} c={c} />
              <Divider c={c} />
              <Row label="Label" value={label} c={c} />
              <Divider c={c} />
              <Row
                label="Distractions turned away"
                value={String(distractionsBlocked)}
                c={c}
                testID="complete-distractions"
              />
              <Divider c={c} />
              <Row label="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} c={c} />
            </Card>
          </Animatable.View>

          {milestone && (
            <Animatable.View
              animation="zoomIn"
              delay={600}
              duration={600}
              style={{
                marginTop: 20,
                alignSelf: "flex-start",
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: c.accent,
                borderRadius: 99,
              }}
            >
              <Text style={{ color: c.background, fontWeight: "600", fontSize: 13, letterSpacing: 0.5 }}>
                ◆ {milestone}-day milestone earned
              </Text>
            </Animatable.View>
          )}
        </View>

        <View>
          <Button testID="enter-again-btn" label="Enter Again" onPress={enterAgain} size="lg" haptic="medium" />
          <View style={{ height: 10 }} />
          <Button testID="go-home-btn" label="Go Home" onPress={goHome} variant="secondary" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const Row: React.FC<{ label: string; value: string; c: ReturnType<typeof getColors>; testID?: string }> = ({
  label,
  value,
  c,
  testID,
}) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 }}>
    <Text style={{ fontSize: 13, color: c.subtext, letterSpacing: 0.3 }}>{label}</Text>
    <Text style={{ fontSize: 15, color: c.text, fontWeight: "600" }} testID={testID}>
      {value}
    </Text>
  </View>
);

const Divider: React.FC<{ c: ReturnType<typeof getColors> }> = ({ c }) => (
  <View style={{ height: 1, backgroundColor: c.border }} />
);
