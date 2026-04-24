import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import { SessionScreen } from "../screens/SessionScreen";
import { CompleteScreen } from "../screens/CompleteScreen";
import { AbandonScreen } from "../screens/AbandonScreen";

export type RootStackParamList = {
  Tabs: undefined;
  Session: undefined;
  Complete: undefined;
  Abandon: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="Session"
        component={SessionScreen}
        options={{ gestureEnabled: false, animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="Complete"
        component={CompleteScreen}
        options={{ gestureEnabled: false, animation: "fade" }}
      />
      <Stack.Screen
        name="Abandon"
        component={AbandonScreen}
        options={{ gestureEnabled: false, animation: "fade" }}
      />
    </Stack.Navigator>
  );
};
