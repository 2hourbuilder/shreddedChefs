import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../themes/provider";
import { addComment } from "../firebase/firestore";

const CommentTextInput = ({ postID, user, setAddComment }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [value, setValue] = useState("");

  const onCancelHandler = () => {
    setValue("");
    setAddComment(false);
  };

  const onConfirmHandler = async () => {
    if (value.length >= 0) {
      try {
        await addComment(postID, user, value);
        setAddComment(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      Alert.alert("Nothing entered!");
    }
  };

  return (
    <View style={styles.commentRow}>
      <Text style={styles.commentAuthor}>{user ? user.displayName : null}</Text>
      <TextInput
        style={styles.commentText}
        value={value}
        editable={true}
        onChangeText={(text) => setValue(text)}
        autoFocus
      ></TextInput>

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
    </View>
  );
};
export default CommentTextInput;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    commentRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      height: 40,
    },
    commentAuthor: {
      fontWeight: "bold",
      color: theme.PrimaryTextColor,
    },
    commentText: {
      flex: 1,
      color: theme.PrimaryTextColor,
      marginLeft: 8,
      backgroundColor: theme.SecondaryBackgroundColor,
      borderColor: theme.PrimaryBorderColor,
      height: 30,
      borderRadius: 5,
      paddingLeft: 6,
    },
    actionContainer: {
      flexDirection: "row",
      width: 60,
      height: 30,
      justifyContent: "space-between",
      alignItems: "center",
      marginLeft: 10,
      marginRight: 8,
    },
  });

  return styles;
};
