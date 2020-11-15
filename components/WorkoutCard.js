import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { sports } from "../data/sports";
import { useTheme } from "../themes/provider";

const WorkoutCard = ({ duration, sportsId, text }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const sport = sports.find((e) => e.id === sportsId);
  return (
    <View style={styles.cardContainer}>
      {sportsId != undefined ? (
        <View style={styles.topContainer}>
          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={sport.iconSource} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.subContainerBig}>
              <Text style={styles.header}>{sport.name}</Text>
            </View>
            <View style={styles.subContainer}>
              <Text style={styles.detailsTextBold}>{duration}</Text>
              <Text style={styles.detailsText}>min</Text>
            </View>
            <View style={styles.subContainer}>
              <Text style={styles.detailsTextBold}>
                {Math.floor((duration * sport.calories) / 60)}
              </Text>
              <Text style={styles.detailsText}>kcal</Text>
            </View>
          </View>
        </View>
      ) : null}
      {text != "" ? (
        <View style={styles.bottomContainer}>
          <Text style={styles.standardText}>{text}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default WorkoutCard;

const getStyles = (theme) => {
  const iconSize = 56;
  const styles = StyleSheet.create({
    cardContainer: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 2,
      padding: 8,
    },
    topContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    bottomContainer: {
      marginTop: 8,
      width: "100%",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    iconContainer: {
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize * 0.5,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.AccentBackgroundColor,
    },
    icon: {
      width: iconSize * 0.75,
      height: iconSize * 0.75,
      resizeMode: "contain",
    },
    detailsContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    header: {
      color: theme.PrimaryTextColor,
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      flexWrap: "wrap",
    },
    detailsText: {
      color: theme.PrimaryTextColor,
      textAlign: "center",
      fontWeight: "200",
    },
    standardText: {
      color: theme.PrimaryTextColor,
      fontWeight: "400",
    },
    detailsTextBold: {
      color: theme.PrimaryTextColor,
      fontSize: 16,
      fontWeight: "600",
    },
    subContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    subContainerBig: {
      flex: 2,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  });
  return styles;
};
