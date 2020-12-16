import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../themes/provider";

const SectionHeader = ({ headerText }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{headerText}</Text>
    </View>
  );
};

export default SectionHeader;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: 42,
      paddingBottom: 4,
      paddingTop: 8,
      paddingHorizontal: 8,
      //backgroundColor: theme.SecondaryBackgroundColor,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.PrimaryBorderColor,
      justifyContent: "center",
    },
    text: {
      color: theme.PrimaryTextColor,
      fontSize: 16,
      fontWeight: "600",
    },
  });
  return styles;
};
