import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PlanScreen from "../screens/Plan/PlanScreen";

const Stack = createStackNavigator();

const AddPostStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Plan"
        component={PlanScreen}
        options={{ title: "My Journey Plan" }}
      />
    </Stack.Navigator>
  );
};

export default AddPostStackNavigator;
