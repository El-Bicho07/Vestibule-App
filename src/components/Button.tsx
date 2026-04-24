import React, { useRef } from "react";
import { Pressable, Text, Animated, View, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import { useThemeStore } from "../store/useThemeStore";
import { getColors, radius } from "../constants/theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  haptic?: "light" | "medium" | "heavy" | "selection" | "auto" | "none";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

// Per-variant motion tuning:
// - Primary: firmer press (0.96), heavier haptic — it's the committing action.
// - Secondary/Danger: softer press (0.975), lighter tactile.
// - Ghost: the softest — selection-only tick, tiny scale.
const motion: Record<Variant, { scale: number; speed: number; bounciness: number }> = {
  primary: { scale: 0.96, speed: 36, bounciness: 2 },
  secondary: { scale: 0.975, speed: 30, bounciness: 3 },
  danger: { scale: 0.97, speed: 30, bounciness: 3 },
  ghost: { scale: 0.985, speed: 28, bounciness: 2 },
};

const autoHaptic: Record<Variant, () => void> = {
  primary: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  secondary: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  danger: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  ghost: () => Haptics.selectionAsync(),
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  testID,
  haptic = "auto",
  fullWidth = true,
  leftIcon,
}) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const m = motion[variant];

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: m.scale,
        useNativeDriver: true,
        speed: m.speed,
        bounciness: m.bounciness,
      }),
      Animated.timing(opacity, {
        toValue: 0.92,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: m.speed,
        bounciness: m.bounciness,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fireHaptic = () => {
    if (haptic === "none") return;
    if (haptic === "auto") {
      autoHaptic[variant]();
      return;
    }
    if (haptic === "selection") {
      Haptics.selectionAsync();
      return;
    }
    const style =
      haptic === "heavy"
        ? Haptics.ImpactFeedbackStyle.Heavy
        : haptic === "medium"
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light;
    Haptics.impactAsync(style);
  };

  const handlePress = () => {
    if (disabled || loading) return;
    fireHaptic();
    onPress();
  };

  const styles = getVariantStyles(variant, c);
  const height = size === "lg" ? 60 : 52;

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        opacity,
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

const getVariantStyles = (variant: Variant, c: ReturnType<typeof getColors>) => {
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
