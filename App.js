import React, { useState } from "react";
import { AppLoading } from "expo";
import RootStackNavigator from "./navigators/RootStackNavigator";
import UserProvider from "./firebase/provider";
import { AppearanceProvider } from "react-native-appearance";
import ThemeProvider from "./themes/provider";
import * as Notifications from "expo-notifications";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (!isReady) {
    return (
      <AppLoading
        startAsync={() => {}}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <UserProvider>
      <AppearanceProvider>
        <ThemeProvider>
          <RootStackNavigator />
        </ThemeProvider>
      </AppearanceProvider>
    </UserProvider>
  );
}

// Add userinterfacestyle to app.json!
