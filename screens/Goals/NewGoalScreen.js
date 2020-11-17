import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SectionHeader from "../../components/SectionHeader";
import { useTheme } from "../../themes/provider";
import { goals } from "../../data/goals";
import { stats } from "../../data/stats";
import GoalsIcon from "../../components/GoalsIcon";
import StatIcon from "../../components/StatIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const NewGoalScreen = (props) => {
  const { theme } = useTheme();
  const [selectedGoalTypeId, setSelectedGoalTypeId] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const styles = getStyles(theme);

  const StatContainer = () => {
    const availableStats = goals.find((goal) => goal.id === selectedGoalTypeId)
      .stats;
    return (
      <>
        <SectionHeader headerText="Select one main stat to set your goal" />
        <View style={styles.goalTypeContainer}>
          {stats
            .filter((stat) => availableStats.includes(stat.id))
            .map((stat) => (
              <StatIcon
                key={stat.id}
                id={stat.id}
                name={stat.name}
                active={stat.id === selectedStat ? true : false}
                onPressHandler={setSelectedStat}
              />
            ))}
        </View>
      </>
    );
  };

  const GoalDetailsContainer = () => {
    return <SectionHeader headerText="Great, let's get to the details!" />;
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.banner}>
        <Text style={styles.text}>
          Great that you're setting yourself new goals!
        </Text>
        <Text style={styles.text}>
          To give you the best support, please set your goal as specific as
          possible!
        </Text>
      </View>
      <SectionHeader headerText="Select your type of goal" />
      <View style={styles.goalTypeContainer}>
        {goals.map((goal) => (
          <GoalsIcon
            key={goal.id}
            id={goal.id}
            iconSource={goal.iconSource}
            name={goal.name}
            active={goal.id === selectedGoalTypeId ? true : false}
            onPressHandler={setSelectedGoalTypeId}
          />
        ))}
      </View>
      {selectedGoalTypeId != null ? <StatContainer /> : null}
      {selectedStat != null ? (
        <View style={{ padding: 8 }}>
          <Text style={styles.textHeader}>
            {stats.find((stat) => stat.id === selectedStat).longName}
          </Text>
          <Text style={styles.plainText}>
            {stats.find((stat) => stat.id === selectedStat).description}
          </Text>
        </View>
      ) : null}
      {selectedStat != null ? <GoalDetailsContainer /> : null}
    </KeyboardAwareScrollView>
  );
};

export default NewGoalScreen;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    text: {
      color: "black",
      fontSize: 16,
      textAlign: "center",
    },
    banner: {
      margin: 8,
      padding: 8,
      backgroundColor: theme.AccentBackgroundColor,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: theme.ShadowColor,
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { height: 2, width: 1 },
    },
    goalTypeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 8,
      flexWrap: "wrap",
    },
    textHeader: {
      color: theme.PrimaryTextColor,
      fontWeight: "600",
      fontSize: 18,
      marginBottom: 4,
    },
    plainText: {
      color: theme.PrimaryTextColor,
      fontWeight: "300",
    },
  });
  return styles;
};
