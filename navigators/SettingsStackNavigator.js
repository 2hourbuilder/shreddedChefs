import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import SettingsScreen from "../screens/Profile/SettingsScreen";
import SettingsThemeScreen from "../screens/Profile/SettingsThemeScreen";
import { useTheme } from "../themes/provider";

const Stack = createStackNavigator();

const SettingsStackNavigator = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator initialRouteName="SettingsHome">
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="Preferred Theme" component={SettingsThemeScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
