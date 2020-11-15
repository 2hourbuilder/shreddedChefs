import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../themes/provider";

const SportsIcon = ({
  name,
  id,
  iconSource,
  width,
  active,
  onPressHandler,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, width, active);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressHandler(id)}
    >
      <View style={styles.iconContainer}>
        <Image style={styles.image} source={iconSource} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

SportsIcon.defaultProps = {
  width: 100,
  active: false,
};

export default SportsIcon;

const getStyles = (theme, width, active) => {
  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 6,
      marginVertical: 6,
      justifyContent: "center",
      alignItems: "center",
    },
    iconContainer: {
      width: width,
      height: width,
      borderRadius: width * 0.5,
      overflow: "hidden",
      backgroundColor: active
        ? theme.AccentBackgroundColor
        : theme.PrimaryBorderColor,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: width * 0.75,
      height: width * 0.75,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      margin: 4,
    },
    text: {
      color: theme.PrimaryTextColor,
    },
  });
  return styles;
};
