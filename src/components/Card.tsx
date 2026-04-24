import React from "react";
import { View, ViewStyle } from "react-native";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  style?: ViewStyle;
  bordered?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 20,
  style,
  bordered = true,
  testID,
}) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);

  return (
    <View
      testID={testID}
      style={[
        {
          backgroundColor: c.surface,
          borderRadius: radius.lg,
          padding,
          borderWidth: bordered ? 1 : 0,
          borderColor: c.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
