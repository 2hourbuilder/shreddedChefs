import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import ProfileScreen from "../screens/Profile/ProfileScreen";
import { TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../themes/provider";
import SettingsStackNavigator from "./SettingsStackNavigator";

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginHorizontal: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons
                name="ios-settings"
                size={24}
                color={theme.PrimaryTextColor}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Settings" component={SettingsStackNavigator} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
