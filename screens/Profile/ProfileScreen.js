import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import { signOut, doChangeUsername } from "../../firebase/auth";
import { useProfile } from "../../firebase/provider";
import { useTheme } from "../../themes/provider";
import { IMG_NO_PROFILE_PICTURE } from "../../assets/images";
import { uploadProfileImage, generateThumbnail } from "../../firebase/storage";
import ProgressCircle from "react-native-progress-circle";
import UsernameTextInput from "../../components/UsernameTextInput";

const ProfileScreen = ({ navigation }) => {
  const { user, profile, snapshotListeners } = useProfile();
  const { theme, dimensions } = useTheme();
  const [imageUri, setImageUri] = useState(IMG_NO_PROFILE_PICTURE);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const styles = getStyles(theme, dimensions);

  useEffect(() => {
    if (profile !== undefined) {
      profile.hasOwnProperty("profilePicture")
        ? setImageUri({ uri: profile.profilePicture })
        : null;
    }
  }, [profile]);

  const ChangeImageHandler = async () => {
    await getPermissionAsync();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.cancelled) {
        setIsUploading(true);
        await uploadProfileImage(result.uri, setProgress, user.uid);
        await generateThumbnail(result.uri, setProgress, user.uid);
        setIsUploading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, camera roll permissions is required to make this work!");
      }
    }
  };

  if (!user) {
    navigation.navigate("Auth");
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {isUploading ? (
          <ProgressCircle
            percent={progress}
            radius={Math.min(125, dimensions.window.width * 0.15)}
            borderWidth={3}
            color={theme.AccentBackgroundColor}
            shadowColor={theme.SecondaryBackgroundColor}
            bgColor={theme.PrimaryBackgroundColor}
            outerCircleStyle={{ overflow: "hidden" }}
            children={<Text style={styles.text}>{Math.round(progress)}%</Text>}
          />
        ) : (
          <TouchableOpacity
            onPress={ChangeImageHandler}
            style={styles.imageContainer}
          >
            <Image style={styles.image} source={imageUri} />
          </TouchableOpacity>
        )}
        <UsernameTextInput initialValue={user.displayName} />
      </View>
      <Button title="Signout" onPress={() => signOut(snapshotListeners)} />
    </View>
  );
};

export default ProfileScreen;

const getStyles = (theme, dimensions) => {
  const height = Math.min(250, dimensions.window.width * 0.3);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.PrimaryBackgroundColor,
    },
    topSection: {
      flexDirection: "row",
      height: height + 20,
    },
    imageContainer: {
      height: height,
      width: height,
      overflow: "hidden",
      borderRadius: height * 0.5,
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: height,
      height: height,
      resizeMode: "contain",
      margin: 0,
    },
    text: {
      color: theme.PrimaryTextColor,
      fontSize: 14,
    },
  });

  return styles;
};
