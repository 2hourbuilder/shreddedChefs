import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../themes/provider";

const GoalsIcon = ({ name, id, iconSource, active, onPressHandler }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, active);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressHandler(id)}
    >
      <View style={styles.iconContainer}>
        <Image style={styles.image} source={iconSource} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

GoalsIcon.defaultProps = {
  active: false,
};

export default GoalsIcon;

const getStyles = (theme, active) => {
  const width = 120;
  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 10,
      marginVertical: 6,
      height: 75,
      paddingHorizontal: 10,
      borderRadius: 20,
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: active
        ? theme.AccentBackgroundColor
        : theme.PrimaryBorderColor,
    },
    iconContainer: {
      width: width * 0.5,
      height: 75,
      overflow: "hidden",
      justifyContent: "center",
    },
    image: {
      width: width * 0.35,
      height: width * 0.35,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginRight: 4,
      width: width * 0.5,
    },
    text: {
      color: active ? "black" : theme.SecondaryTextColor,
      fontSize: 18,
      fontWeight: active ? "600" : "400",
      textAlign: "center",
    },
  });
  return styles;
};
