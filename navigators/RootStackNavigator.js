import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens or subnavigators
import AddPostScreen from "../screens/AddPostScreen";
import TabNavigator from "./TabNavigator";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const RootStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" mode="modal" headerMode="none">
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="AddPost" component={AddPostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigator;
