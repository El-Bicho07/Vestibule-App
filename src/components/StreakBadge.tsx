import React from "react";
import { View, Text } from "react-native";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";
import { STREAK_MILESTONES } from "../constants/config";

interface StreakBadgeProps {
  streak: number;
  compact?: boolean;
  testID?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, compact, testID }) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);

  const milestone = STREAK_MILESTONES.slice()
    .reverse()
    .find((m) => streak >= m);

  const label = milestone ? `${milestone}-day milestone` : null;

  if (compact) {
    return (
      <View
        testID={testID}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: c.surface,
          borderRadius: radius.full,
          borderWidth: 1,
          borderColor: c.border,
        }}
      >
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: streak > 0 ? c.accent : c.subtext,
            marginRight: 8,
          }}
        />
        <Text style={{ color: c.text, fontSize: 13, fontWeight: "500" }}>
          {streak} {streak === 1 ? "day" : "days"}
        </Text>
      </View>
    );
  }

  return (
    <View testID={testID} style={{ alignItems: "flex-start" }}>
      <Text
        style={{
          fontSize: 12,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: c.subtext,
          marginBottom: 4,
        }}
      >
        Streak
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: "300",
            color: c.text,
            letterSpacing: -1.5,
            fontFamily: "Courier",
          }}
        >
          {streak}
        </Text>
        <Text style={{ fontSize: 16, color: c.subtext, marginLeft: 8 }}>
          {streak === 1 ? "day" : "days"} inside
        </Text>
      </View>
      {label && (
        <View
          style={{
            marginTop: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: c.accent,
            borderRadius: radius.full,
          }}
        >
          <Text style={{ color: c.background, fontSize: 11, fontWeight: "600", letterSpacing: 0.5 }}>
            {label}
          </Text>
        </View>
      )}
    </View>
  );
};
