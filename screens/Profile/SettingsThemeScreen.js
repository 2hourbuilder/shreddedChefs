import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../../firebase/provider";
import { useTheme } from "../../themes/provider";

const SettingsThemeScreen = () => {
  const { theme, changeHandler } = useTheme();
  const { profile } = useProfile();
  const styles = getStyles(theme);

  const data = [
    {
      text: "Automatic",
      selected: profile.settings.preferredTheme === "automatic" ? true : false,
    },
    {
      text: "Light",
      selected: profile.settings.preferredTheme === "light" ? true : false,
    },
    {
      text: "Dark",
      selected: profile.settings.preferredTheme === "dark" ? true : false,
    },
  ];
  const ListItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => changeHandler(item.text.toLowerCase())}
      >
        <View style={styles.itemText}>
          <Text style={styles.text}>{item.text}</Text>
        </View>
        {item.selected ? (
          <View style={styles.itemAction}>
            <Ionicons
              name="md-checkmark"
              size={24}
              color={theme.PrimaryTextColor}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={data}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.text}
    />
  );
};

export default SettingsThemeScreen;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.PrimaryBackgroundColor,
    },
    listItemContainer: {
      height: 50,
      width: "100%",
      borderColor: theme.PrimaryBorderColor,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
    },
    itemText: {
      justifyContent: "center",
      flex: 1,
      marginLeft: 8,
    },
    itemAction: {
      marginHorizontal: 8,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: theme.PrimaryTextColor,
    },
  });

  return styles;
};
