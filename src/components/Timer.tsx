import React, { useEffect, useRef } from "react";
import { Text, View, Animated, Easing } from "react-native";
import { useThemeStore } from "../store/useThemeStore";
import { getColors } from "../constants/theme";
import { formatTime } from "../utils/time";

interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  testID?: string;
}

export const Timer: React.FC<TimerProps> = ({ remainingSeconds, totalSeconds, testID }) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);

  const progress = 1 - Math.max(0, Math.min(1, remainingSeconds / totalSeconds));
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={{ alignItems: "center", width: "100%" }} testID={testID}>
      <Text
        style={{
          fontSize: 84,
          fontWeight: "200",
          fontVariant: ["tabular-nums"],
          color: c.text,
          letterSpacing: -3,
          fontFamily: "Courier",
        }}
      >
        {formatTime(remainingSeconds)}
      </Text>

      <View
        style={{
          marginTop: 32,
          width: "80%",
          height: 2,
          backgroundColor: c.border,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            width: widthInterpolated,
            backgroundColor: c.accent,
          }}
        />
      </View>
    </View>
  );
};
