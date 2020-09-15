import React, { useState } from "react";
import { AppLoading } from "expo";
import RootStackNavigator from "./navigators/RootStackNavigator";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    return (
      <AppLoading
        startAsync={() => {}}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return <RootStackNavigator />;
}
