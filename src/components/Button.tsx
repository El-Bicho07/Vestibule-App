import React, { useRef } from "react";
import { Pressable, Text, Animated, View, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius, typography } from "../constants/theme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  haptic?: "light" | "medium" | "heavy" | "selection" | "none";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  testID,
  haptic = "light",
  fullWidth = true,
  leftIcon,
}) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (haptic !== "none") {
      const style =
        haptic === "heavy"
          ? Haptics.ImpactFeedbackStyle.Heavy
          : haptic === "medium"
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light;
      if (haptic === "selection") {
        Haptics.selectionAsync();
      } else {
        Haptics.impactAsync(style);
      }
    }
    onPress();
  };

  const styles = getVariantStyles(variant, c);
  const height = size === "lg" ? 60 : 52;

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        width: fullWidth ? "100%" : undefined,
      }}
    >
      <Pressable
        testID={testID}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        style={{
          height,
          borderRadius: radius.md,
          backgroundColor: styles.bg,
          borderWidth: styles.borderWidth,
          borderColor: styles.border,
          opacity: disabled ? 0.45 : 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          flexDirection: "row",
        }}
      >
        {loading ? (
          <ActivityIndicator color={styles.fg} size="small" />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {leftIcon && <View style={{ marginRight: 10 }}>{leftIcon}</View>}
            <Text
              style={{
                color: styles.fg,
                fontSize: size === "lg" ? 17 : 15,
                fontWeight: "600",
                letterSpacing: 0.3,
              }}
            >
              {label}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const getVariantStyles = (
  variant: NonNullable<ButtonProps["variant"]>,
  c: ReturnType<typeof getColors>,
) => {
  switch (variant) {
    case "primary":
      return { bg: c.primary, fg: c.background, border: c.primary, borderWidth: 0 };
    case "secondary":
      return { bg: "transparent", fg: c.text, border: c.border, borderWidth: 1 };
    case "ghost":
      return { bg: "transparent", fg: c.subtext, border: "transparent", borderWidth: 0 };
    case "danger":
      return { bg: "transparent", fg: c.danger, border: c.danger, borderWidth: 1 };
  }
};
