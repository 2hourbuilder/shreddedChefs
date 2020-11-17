import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
// Import Screens

import { View } from "react-native";
import { useTheme } from "../themes/provider";
import ProfileStackNavigator from "./ProfileStackNavigator";
import TimelineStackNavigator from "./TimelineStackNavigator";
import GoalsModalNavigator from "./GoalsModalNavigator";

const Tab = createBottomTabNavigator();

const Placeholder = () => <View style={{ flex: 1 }}></View>;

const TabNavigator = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Timeline"
      tabBarOptions={{ activeTintColor: theme.AccentBackgroundColor }}
    >
      <Tab.Screen
        name="Timeline"
        component={TimelineStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="New Post"
        component={Placeholder}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("AddPost");
          },
        })}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsModalNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="show-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
