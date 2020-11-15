import React from "react";
import { View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

// Import screens or subnavigators
import TabNavigator from "./TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./AuthStackNavigator";
import { useProfile } from "../firebase/provider";
import { useTheme } from "../themes/provider";
import { StatusBar } from "expo-status-bar";
import AddPostStackNavigator from "./AddPostStackNavigator";

const Stack = createStackNavigator();

const getHeaderTitle = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || "Timeline";

  switch (routeName) {
    case "Timeline":
      return "Timeline";
    case "Profile":
      return "Profile";
  }
};

const RootStackNavigator = () => {
  const { theme, mode, dimensions } = useTheme();
  const auth = useProfile();
  const contentWidth = Math.min(dimensions.window.width, 640);

  if (!auth.authReady) {
    return null;
  }
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <View
        style={{
          width: (dimensions.window.width - contentWidth) / 2,
          backgroundColor: theme.SecondaryBackgroundColor,
        }}
      />
      <View
        style={{
          flex: 1,
          width: contentWidth,
          height: dimensions.window.height,
          shadowColor: theme.ShadowColor,
          shadowOpacity: 0.2,
          shadowRadius: 50,
        }}
      >
        <StatusBar style={mode === "light" ? "dark" : "light"} />
        <NavigationContainer theme={theme.Navigation}>
          {auth.user ? (
            <Stack.Navigator initialRouteName={"Home"} headerMode="none">
              <Stack.Screen
                name="Home"
                component={TabNavigator}
                options={({ route }) => ({
                  headerTitle: getHeaderTitle(route),
                })}
              />
              <Stack.Screen
                name="AddPost"
                component={AddPostStackNavigator}
                options={{ headerTitle: "New Post" }}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator headerMode="none" mode="modal">
              <Stack.Screen name="Auth" component={AuthStackNavigator} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </View>
      <View
        style={{
          width: (dimensions.window.width - contentWidth) / 2,
          backgroundColor: theme.SecondaryBackgroundColor,
        }}
      />
    </View>
  );
};

export default RootStackNavigator;
