import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PostTypeScreen from "../screens/AddPost/PostTypeScreen";
import WorkoutScreen from "../screens/AddPost/WorkoutScreen";
import FoodScreen from "../screens/AddPost/FoodScreen";
import ProgressScreen from "../screens/AddPost/ProgressScreen";

const Stack = createStackNavigator();

const AddPostStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PostType"
        component={PostTypeScreen}
        options={{ title: "New Post" }}
      />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
      <Stack.Screen name="Food" component={FoodScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
    </Stack.Navigator>
  );
};

export default AddPostStackNavigator;
