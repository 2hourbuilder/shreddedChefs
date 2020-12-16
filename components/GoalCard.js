import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useProfile } from "../firebase/provider";
import { useTheme } from "../themes/provider";
import GoalChart from "./GoalChart";
import { deleteGoalById } from "../firebase/firestore";

const GoalCard = ({
  goalId,
  statId,
  startDate,
  startValue,
  endDate,
  endValue,
  title,
}) => {
  const { theme, mode } = useTheme();
  const { profile } = useProfile();
  const styles = getStyles(theme, mode);
  const [showGoalActions, setShowGoalActions] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: 60 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>{title}</Text>
        </View>
        <TouchableOpacity
          style={{
            width: 54,
            paddingTop: 14,
            paddingBottom: 5,
            paddingLeft: 5,
          }}
          onPress={() => setShowGoalActions((prevState) => !prevState)}
        >
          <MaterialIcons name="edit" size={20} color={theme.PrimaryTextColor} />
        </TouchableOpacity>
      </View>
      <GoalChart
        height={profile.personalData.height}
        male={profile.personalData.gender === "m" ? true : false}
        statId={statId}
        startDate={startDate}
        startValue={startValue}
        endDate={endDate}
        endValue={endValue}
      />
      {showGoalActions ? (
        <View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              Alert.alert(
                "Delete goal",
                "Do you really want to delete this goal?",
                [
                  { text: "No way!", style: "cancel" },
                  { text: "Yes", onPress: () => deleteGoalById(goalId) },
                ]
              )
            }
          >
            <MaterialIcons name="delete" color="white" size={18} />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "400",
                marginLeft: 10,
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default GoalCard;

const getStyles = (theme, mode) => {
  const styles = StyleSheet.create({
    container: {
      width: "95%",
      backgroundColor:
        mode === "light"
          ? theme.PrimaryBackgroundColor
          : theme.SecondaryBackgroundColor,
      borderRadius: 30,
      shadowColor: theme.ShadowColor,
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    header: {
      fontSize: 18,
      fontWeight: "600",
      paddingTop: 14,
      color: theme.PrimaryTextColor,
      textAlign: "center",
    },
    deleteButton: {
      padding: 8,
      backgroundColor: theme.DangerColor,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 10,
    },
  });
  return styles;
};
