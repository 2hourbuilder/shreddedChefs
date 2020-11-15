import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
} from "react-native";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import { useProfile } from "../../firebase/provider";
import { useTheme } from "../../themes/provider";
import { capitalize } from "../../helpers/helpers";
import {
  doAddPushNotificationsToken,
  doChangePushNotifications,
  doRemovePushNotificationsToken,
} from "../../firebase/auth";

const registerForPushNotificationsAsync = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Please allow push notifications to make this work.");
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    await doAddPushNotificationsToken(token.data);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: theme.AccentBackgroundColor,
    });
  }
};

const SettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { profile } = useProfile();
  const styles = getStyles(theme);

  const onSwitchHandler = async (newValue) => {
    if (newValue === true) {
      await registerForPushNotificationsAsync();
      await doChangePushNotifications(true);
    } else {
      await doChangePushNotifications(false);
      try {
        const token = await Notifications.getExpoPushTokenAsync();
        await doRemovePushNotificationsToken(token.data);
      } catch {
        console.log("No token received to remove");
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.listItemContainer}>
        <View style={styles.itemText}>
          <Text style={styles.text}>Push Notifications</Text>
        </View>
        <View style={styles.itemAction}>
          <Switch
            value={profile.settings.pushNotifications}
            onValueChange={(value) => onSwitchHandler(value)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => navigation.navigate("Preferred Theme")}
      >
        <View style={styles.itemText}>
          <Text style={styles.text}>Preferred Theme</Text>
        </View>
        <View style={styles.itemAction}>
          <Text style={styles.text}>
            {capitalize(profile.settings.preferredTheme)}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;

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
