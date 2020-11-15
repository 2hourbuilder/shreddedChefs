import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import TimelineScreen from "../screens/TimelineScreen";
import { useTheme } from "../themes/provider";

const Stack = createStackNavigator();

const TimelineStackNavigator = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator initialRouteName="Timeline">
      <Stack.Screen name="Timeline" component={TimelineScreen} />
    </Stack.Navigator>
  );
};

export default TimelineStackNavigator;
