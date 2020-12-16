import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GoalsOverviewScreen from "../screens/Goals/GoalsOverviewScreen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "../themes/provider";

const Stack = createStackNavigator();

const GoalsStackNavigator = ({ navigation }) => {
  const { theme } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Goals Overview"
        component={GoalsOverviewScreen}
        options={{
          title: "My Fitness Goals",
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 20 }}
              onPress={() => navigation.navigate("New Goal")}
            >
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={theme.PrimaryTextColor}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default GoalsStackNavigator;
