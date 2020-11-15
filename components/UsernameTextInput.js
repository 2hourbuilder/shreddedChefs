import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../themes/provider";
import { doChangeUsername } from "../firebase/auth";

const UsernameTextInput = ({ initialValue }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onEditHandler = () => {
    setIsEditable(true);
    setValue("");
  };

  const onCancelHandler = () => {
    setIsEditable(false);
    setValue(initialValue);
  };

  const onConfirmHandler = async () => {
    if (value.length >= 2) {
      try {
        await doChangeUsername(value);
        setIsEditable(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      Alert.alert(
        "New username is invalid",
        "Username must contain at least 2 characters"
      );
    }
  };

  return (
    <View style={styles.usernameRow}>
      <TextInput
        style={[styles.usernameText, isEditable ? styles.editable : null]}
        value={value}
        editable={isEditable}
        placeholder="New Username"
        onChangeText={(text) => setValue(text)}
      ></TextInput>
      {!isEditable ? (
        <TouchableOpacity onPress={onEditHandler}>
          <MaterialIcons name="edit" size={25} color={theme.PrimaryTextColor} />
        </TouchableOpacity>
      ) : (
        <View style={styles.actionContainer}>
          <TouchableOpacity onPress={onCancelHandler}>
            <MaterialIcons name="cancel" size={25} color={theme.DangerColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirmHandler}>
            <MaterialIcons
              name="check-circle"
              size={25}
              color={theme.AccentBackgroundColor}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default UsernameTextInput;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    usernameRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
      marginHorizontal: 10,
    },
    usernameText: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      color: theme.PrimaryTextColor,
    },
    editable: {
      borderBottomWidth: 1,
      borderColor: theme.PrimaryBorderColor,
    },
    actionContainer: {
      flexDirection: "row",
      width: 60,
      height: 30,
      justifyContent: "space-between",
      alignItems: "center",
      marginLeft: 10,
    },
  });

  return styles;
};
