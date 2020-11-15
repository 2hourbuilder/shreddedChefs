import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTheme } from "../../themes/provider";
import { useProfile } from "../../firebase/provider";
import { addPost } from "../../firebase/firestore";
import Slider from "@react-native-community/slider";
import SectionHeader from "../../components/SectionHeader";
import SportsIcon from "../../components/SportsIcon";
import { sports } from "../../data/sports";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const WorkoutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user, profile } = useProfile();

  const [text, setText] = useState("");
  const [duration, setDuration] = useState("45");
  const [selectedSportId, setSelectedSportId] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const scrollViewRef = useRef(null);
  const sliderRef = useRef(null);

  const onSubmitHandler = async () => {
    try {
      setIsPosting(true);
      await addPost(
        profile.thumbnail,
        user.displayName,
        user.uid,
        "Workout",
        { sportsId: selectedSportId, duration: parseInt(duration) },
        text
      );
      setIsPosting(false);
      setText("");
      navigation.navigate("Timeline");
    } catch (err) {
      console.log("Error in posting:", err);
    }
  };
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      innerRef={(ref) => (scrollViewRef.current = ref)}
    >
      <View style={styles.formContainer}>
        <SectionHeader headerText="What did you do?" />
        <View style={styles.sportsContainer}>
          {sports.map((sport) => (
            <SportsIcon
              key={sport.id}
              id={sport.id}
              name={sport.name}
              iconSource={sport.iconSource}
              width={70}
              active={sport.id === selectedSportId ? true : false}
              onPressHandler={setSelectedSportId}
            />
          ))}
        </View>
        <SectionHeader headerText="Duration (minutes)" />
        <View style={styles.durationSlider}>
          <TextInput
            style={styles.durationText}
            value={duration}
            onChangeText={(value) => {
              setDuration(value);
              if (value != "") {
                sliderRef.current.setNativeProps({
                  value: Math.min(parseInt(value), 120),
                });
              } else {
                sliderRef.current.setNativeProps({ value: 0 });
              }
            }}
            keyboardType={"number-pad"}
            maxLength={3}
            returnKeyType="done"
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            minimumTrackTintColor={theme.AccentBackgroundColor}
            maximumValue={120}
            maximumTrackTintColor={theme.PrimaryBorderColor}
            step={1}
            value={45}
            thumbTintColor={theme.AccentBackgroundColor}
            onValueChange={(value) => setDuration(Math.floor(value).toString())}
            ref={sliderRef}
          />
        </View>
        <SectionHeader headerText="Any comments?" />
        <TextInput
          onChangeText={(textInput) => setText(textInput)}
          multiline
          numberOfLines={8}
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

export default WorkoutScreen;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: 1,
      backgroundColor: theme.PrimaryBackgroundColor,
    },
    heading: {
      height: "15%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    headingText: {
      fontSize: 18,
      fontWeight: "300",
      color: theme.PrimaryTextColor,
    },
    formContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 20,
    },
    sportsContainer: {
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
    durationSlider: {
      flexDirection: "row",
      width: "90%",
      margin: 8,
    },
    durationText: {
      color: theme.PrimaryTextColor,
      width: 80,
      height: 60,
      justifyContent: "center",
      textAlign: "center",
    },
    slider: {
      flex: 1,
      height: 60,
    },
    button: {
      marginVertical: 20,
      backgroundColor: theme.AccentBackgroundColor,
      width: "50%",
    },
  });
  return styles;
};
