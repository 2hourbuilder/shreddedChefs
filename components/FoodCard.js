import React from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { foods } from "../data/food";
import { useTheme } from "../themes/provider";

const FoodCard = ({ imageURL, foodId, text }) => {
  const { theme, dimensions } = useTheme();
  const styles = getStyles(theme, dimensions);
  const food = foods.find((e) => e.id === foodId);
  return (
    <View style={styles.cardContainer}>
      <ImageBackground style={styles.imageContainer} source={{ uri: imageURL }}>
        {foodId != undefined ? (
          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={food.iconSource} />
          </View>
        ) : null}
      </ImageBackground>
      {text != "" ? (
        <View style={styles.bottomContainer}>
          <Text style={styles.standardText}>{text}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default FoodCard;

const getStyles = (theme, dimensions) => {
  const iconSize = 80;
  const styles = StyleSheet.create({
    cardContainer: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
    },
    imageContainer: {
      width: Math.min(640, dimensions.window.width),
      height: Math.min(dimensions.window.width, 640) * 0.75,
      resizeMode: "contain",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      padding: 20,
    },
    bottomContainer: {
      padding: 8,
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
    standardText: {
      color: theme.PrimaryTextColor,
      fontWeight: "400",
    },
  });
  return styles;
};
