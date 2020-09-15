import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TimelineScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Timeline Screen</Text>
    </View>
  );
};

export default TimelineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
