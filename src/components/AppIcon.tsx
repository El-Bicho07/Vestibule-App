import React from "react";
import { View, Text } from "react-native";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";

interface AppIconProps {
  name: string;
  icon?: string;
  blocked: boolean;
  size?: number;
  testID?: string;
}

// Deterministic initials + subtle per-app tint without reaching for emoji or
// brand trademarks. Monochrome by default; blocked apps pick up the theme accent.
const getInitials = (name: string): string => {
  const parts = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const AppIcon: React.FC<AppIconProps> = ({ name, icon, blocked, size = 40, testID }) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const initials = getInitials(name);

  const bg = blocked ? c.text : c.surface;
  const fg = blocked ? c.background : c.text;
  const borderColor = blocked ? c.text : c.border;

  return (
    <View
      testID={testID}
      style={{
        width: size,
        height: size,
        borderRadius: radius.md,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: fg,
          fontSize: size * 0.36,
          fontWeight: "600",
          letterSpacing: 0.5,
          fontFamily: "Courier",
        }}
      >
        {icon || initials}
      </Text>
    </View>
  );
};
