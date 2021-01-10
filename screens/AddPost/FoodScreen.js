import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useTheme } from "../../themes/provider";
import { useProfile } from "../../firebase/provider";
import { addPost } from "../../firebase/firestore";
import SectionHeader from "../../components/SectionHeader";
import SportsIcon from "../../components/SportsIcon";
import { foods } from "../../data/food";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import { uploadPostImage } from "../../firebase/storage";
import ProgressCircle from "react-native-progress-circle";
import { IMG_NO_PROFILE_PICTURE } from "../../assets/images";

const FoodScreen = ({ navigation }) => {
  const { theme, dimensions } = useTheme();
  const styles = getStyles(theme);
  const { user, profile } = useProfile();
  const [text, setText] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [imageUri, setImageUri] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [storageURL, setStorageURL] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const scrollViewRef = useRef(null);

  const onSubmitHandler = async () => {
    try {
      setIsPosting(true);
      const thumbnailURL = profile.thumbnail ? profile.thumbnail : "";
      await addPost(
        thumbnailURL,
        user.displayName,
        user.uid,
        "Food",
        { foodId: selectedFoodId, imageURL: storageURL },
        text
      );
      setIsPosting(false);
      setText("");
      navigation.navigate("Timeline");
    } catch (err) {
      console.log("Error in posting:", err);
    }
  };

  const TakePhotoHandler = async () => {
    await getCameraPermissionAsync();
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.cancelled) {
        setIsUploading(true);
        const fbURL = await uploadPostImage(result.uri, setProgress);
        setImageUri(fbURL);
        setStorageURL(fbURL);
        setIsUploading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SelectPhotoHandler = async () => {
    await getCameraRollPermissionAsync();
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
        const fbURL = await uploadPostImage(result.uri, setProgress);
        setImageUri(fbURL);
        setStorageURL(fbURL);
        setIsUploading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCameraPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== "granted") {
        alert("Sorry, camera permissions is required to make this work!");
      }
    }
  };

  const getCameraRollPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, camera roll permissions is required to make this work!");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      innerRef={(ref) => (scrollViewRef.current = ref)}
    >
      <View style={styles.formContainer}>
        <SectionHeader headerText="Show us your meal!" />
        <View style={styles.foodsContainer}>
          {foods.map((food) => (
            <SportsIcon
              key={food.id}
              id={food.id}
              name={food.name}
              iconSource={food.iconSource}
              width={70}
              active={food.id === selectedFoodId ? true : false}
              onPressHandler={setSelectedFoodId}
            />
          ))}
        </View>
        <SectionHeader headerText="Upload image" />
        {storageURL != null ? (
          <Image style={styles.image} source={{ uri: imageUri }} />
        ) : isUploading ? (
          <ProgressCircle
            percent={progress}
            radius={Math.min(125, dimensions.window.width * 0.15)}
            borderWidth={3}
            color={theme.AccentBackgroundColor}
            shadowColor={theme.SecondaryBackgroundColor}
            bgColor={theme.PrimaryBackgroundColor}
            outerCircleStyle={{ overflow: "hidden" }}
            children={
              <Text
                style={{
                  color: theme.PrimaryTextColor,
                  fontSize: 14,
                }}
              >
                {Math.round(progress)}%
              </Text>
            }
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: "90%",
            }}
          >
            {Platform.OS != "web" ? (
              <TouchableOpacity
                onPress={TakePhotoHandler}
                style={styles.imageContainer}
              >
                <FontAwesome
                  name="camera"
                  size={100}
                  color={theme.PrimaryBorderColor}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={SelectPhotoHandler}
              style={styles.imageContainer}
            >
              <FontAwesome
                name="image"
                size={100}
                color={theme.PrimaryBorderColor}
              />
            </TouchableOpacity>
          </View>
        )}
        <SectionHeader headerText="Any comments?" />
        <TextInput
          onChangeText={(textInput) => setText(textInput)}
          multiline
          numberOfLines={4}
          style={styles.textInputField}
          scrollEnabled
          value={text}
          returnKeyType="default"
          onEndEditing={() => {
            if (scrollViewRef.current != null) {
              scrollViewRef.current.props.scrollToEnd();
            }
          }}
        />
        {isPosting ? (
          <ActivityIndicator />
        ) : (
          <Button
            style={styles.button}
            title="Post!"
            color={theme.AccentBackgroundColor}
            onPress={onSubmitHandler}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default FoodScreen;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: 1,
      backgroundColor: theme.PrimaryBackgroundColor,
    },
    formContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 20,
    },
    foodsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
    },
    textInputField: {
      width: "90%",
      height: 100,
      backgroundColor: theme.SecondaryBackgroundColor,
      borderColor: theme.PrimaryBorderColor,
      borderWidth: StyleSheet.hairlineWidth,
      color: theme.PrimaryTextColor,
      shadowColor: theme.ShadowCOlor,
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      margin: 8,
      marginBottom: 20,
    },
    button: {
      marginVertical: 20,
      backgroundColor: theme.AccentBackgroundColor,
      width: "50%",
    },
    imageContainer: {
      height: 120,
      overflow: "hidden",
      margin: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 300,
      height: 300,
      resizeMode: "contain",
      margin: 0,
    },
  });
  return styles;
};
