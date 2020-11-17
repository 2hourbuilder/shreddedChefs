import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../themes/provider";

const StatIcon = ({ name, id, active, onPressHandler }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme, active);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressHandler(id)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

StatIcon.defaultProps = {
  active: false,
};

export default StatIcon;

const getStyles = (theme, active) => {
  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 10,
      marginVertical: 10,
      padding: 10,

      borderRadius: 20,
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: active
        ? theme.AccentBackgroundColor
        : theme.PrimaryBorderColor,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginRight: 4,
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
