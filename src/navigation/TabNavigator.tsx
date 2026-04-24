import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { BlocklistScreen } from "../screens/BlocklistScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { useThemeStore } from "../store/useThemeStore";
import { getColors } from "../constants/theme";

export type TabParamList = {
  Home: undefined;
  Blocklist: undefined;
  Stats: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabLabel: React.FC<{ label: string; focused: boolean }> = ({ label, focused }) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  return (
    <Text
      style={{
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        color: focused ? c.text : c.subtext,
        fontWeight: focused ? "600" : "400",
      }}
    >
      {label}
    </Text>
  );
};

const TabDot: React.FC<{ focused: boolean }> = ({ focused }) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);
  return (
    <View
      style={{
        width: focused ? 18 : 4,
        height: 2,
        borderRadius: 1,
        backgroundColor: focused ? c.accent : "transparent",
        marginBottom: 6,
      }}
    />
  );
};

export const TabNavigator: React.FC = () => {
  const { theme } = useThemeStore();
  const c = getColors(theme);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 1,
          height: 74,
          paddingTop: 10,
          paddingBottom: 18,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabDot focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Blocklist"
        component={BlocklistScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabDot focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="At The Door" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabDot focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Time Inside" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
