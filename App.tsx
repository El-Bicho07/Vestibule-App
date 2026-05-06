import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { useThemeStore } from "./src/store/useThemeStore";
import { getColors } from "./src/constants/theme";

export default function App() {
  const { theme } = useThemeStore();
  const c = getColors(theme);

  const navTheme =
    theme === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: c.background,
            card: c.surface,
            text: c.text,
            border: c.border,
            primary: c.accent,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: c.background,
            card: c.surface,
            text: c.text,
            border: c.border,
            primary: c.accent,
          },
        };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: c.background }}>
          <NavigationContainer theme={navTheme}>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <RootNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
