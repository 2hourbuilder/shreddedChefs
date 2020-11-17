import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NewGoalScreen from "../screens/Goals/NewGoalScreen";
import GoalsStackNavigator from "./GoalsStackNavigator";

const Stack = createStackNavigator();

const GoalsModalNavigator = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Goals"
        component={GoalsStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="New Goal" component={NewGoalScreen} />
    </Stack.Navigator>
  );
};

export default GoalsModalNavigator;
