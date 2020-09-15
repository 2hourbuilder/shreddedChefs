import React from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";

const LaunchScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Shredded Chefs is loading...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LaunchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
