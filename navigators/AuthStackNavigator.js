import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import LoginScreen from "../screens/Profile/LoginScreen";
import RegistrationScreen from "../screens/Profile/RegistrationScreen";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Registration" headerMode="none">
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
