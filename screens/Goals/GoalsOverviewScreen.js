import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory-native";
import SectionHeader from "../../components/SectionHeader";
import { useTheme } from "../../themes/provider";

const GoalsOverviewScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <SectionHeader headerText="Weight" />
      <VictoryChart>
        <VictoryAxis
          style={{
            axis: { stroke: theme.ChartsColorAxis },
            tickLabels: { fill: theme.PrimaryTextColor },
            grid: { stroke: theme.PrimaryBorderColor },
          }}
          tickFormat={(t) =>
            new Date(t).toLocaleDateString("de-DE", {
              day: "numeric",
              month: "numeric",
            })
          }
          tickCount={4}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: theme.ChartsColorAxis },
            tickLabels: { fill: theme.PrimaryTextColor },
            grid: { stroke: theme.PrimaryBorderColor },
          }}
        />
        <VictoryLine
          data={[
            { x: 1602494594622, y: 85 },
            { x: 1603271408644, y: 86 },
            { x: 1603644945702, y: 85.4 },
            { x: 1603844945702, y: 85.4 },
            { x: 1604044945702, y: 85.4 },
          ]}
          animate={{
            duration: 1000,
            onLoad: { duration: 1000 },
          }}
          height={300}
          interpolation="catmullRom"
          style={{
            data: {
              stroke: theme.AccentBackgroundColor,
            },
          }}
          domainPadding={{ y: 10 }}
        />
      </VictoryChart>
      <Text>Plan</Text>
      <Button
        title="New Goal"
        onPress={() => navigation.navigate("New Goal")}
      />
    </View>
  );
};

export default GoalsOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
