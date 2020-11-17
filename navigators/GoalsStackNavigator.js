import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import GoalsOverviewScreen from "../screens/Goals/GoalsOverviewScreen";

const Stack = createStackNavigator();

const GoalsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Goals"
        component={GoalsOverviewScreen}
        options={{ title: "My Fitness Goals" }}
      />
    </Stack.Navigator>
  );
};

export default GoalsStackNavigator;
