import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryArea,
} from "victory-native";
import { useTheme } from "../themes/provider";
import { stats } from "../data/stats";

const GoalChart = ({
  height,
  male,
  statId,
  startDate,
  endDate,
  startValue,
  endValue,
  actualData,
  showChartCategories = false,
  showChartBounds = false,
}) => {
  const { theme } = useTheme();
  const domainMax = Math.max(startValue, endValue) * 1.15;
  const domainMin = Math.min(startValue, endValue) * 0.85;

  return (
    <View style={styles.container}>
      <VictoryChart
        padding={{ top: 15, bottom: 40, right: 40, left: 60 }}
        height={260}
        domain={{
          y: [domainMin, domainMax],
        }}
        scale={{ x: "time" }}
      >
        <VictoryAxis
          key="1"
          style={{
            axis: { stroke: theme.ChartsColorAxis },
            tickLabels: { fill: theme.PrimaryTextColor },
            grid: { stroke: theme.PrimaryBorderColor, strokeWidth: 0.5 },
          }}
          tickFormat={(t) =>
            new Date(t).toLocaleDateString("de-DE", {
              day: "numeric",
              month: "numeric",
            })
          }
        />
        <VictoryAxis
          key="2"
          dependentAxis
          label={stats.find((stat) => stat.id === statId).name}
          style={{
            axis: { stroke: theme.ChartsColorAxis },
            axisLabel: {
              fontSize: 16,
              fill: theme.PrimaryTextColor,
              padding: 30,
            },
            tickLabels: { fill: theme.PrimaryTextColor },
            grid: { stroke: theme.PrimaryBorderColor, strokeWidth: 0.5 },
          }}
          tickFormat={(t) => Math.floor(t)}
        />
        {showChartCategories
          ? stats
              .find((stat) => stat.id === statId)
              .classifications(height, male)
              .map((item, index) => (
                <VictoryArea
                  key={item.name}
                  style={{ data: { fill: item.color, opacity: 0.5 } }}
                  data={[
                    {
                      x: startDate,
                      y: Math.min(item.max, domainMax),
                      y0: Math.max(item.min, domainMin),
                    },
                    {
                      x: endDate,
                      y: Math.min(item.max, domainMax),
                      y0: Math.max(item.min, domainMin),
                    },
                  ]}
                />
              ))
          : null}
        {showChartBounds ? (
          <VictoryLine
            key="upper"
            data={[
              { x: startDate, y: startValue },
              { x: endDate, y: endValue * 1.1 },
            ]}
            animate={{
              duration: 100,
              onLoad: { duration: 100 },
            }}
            interpolation="natural"
            style={{
              data: {
                stroke: "#aaa",
                strokeWidth: 1,
                strokeDasharray: 2,
              },
            }}
          />
        ) : null}
        {showChartBounds ? (
          <VictoryLine
            key="lower"
            data={[
              { x: startDate, y: startValue },
              { x: endDate, y: endValue * 0.9 },
            ]}
            animate={{
              duration: 100,
              onLoad: { duration: 100 },
            }}
            interpolation="natural"
            style={{
              data: {
                stroke: "#aaa",
                strokeWidth: 1,
                strokeDasharray: 2,
              },
            }}
          />
        ) : null}
        <VictoryLine
          key="journey"
          data={[
            { x: startDate, y: startValue },
            { x: endDate, y: endValue },
          ]}
          animate={{
            duration: 100,
            onLoad: { duration: 100 },
          }}
          interpolation="natural"
          style={{
            data: {
              stroke: "#fff",
              strokeWidth: 1,
              strokeDasharray: 5,
            },
          }}
        />
        {actualData != undefined ? (
          <VictoryLine
            key="actual"
            data={actualData}
            animate={{
              duration: 100,
              onLoad: { duration: 1000 },
            }}
            interpolation="natural"
            style={{
              data: {
                stroke: showChartCategories
                  ? "black"
                  : theme.AccentBackgroundColor,
                strokeWidth: 3,
              },
            }}
          />
        ) : null}
      </VictoryChart>
    </View>
  );
};

export default GoalChart;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
});
