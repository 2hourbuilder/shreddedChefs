import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../themes/provider";
import { useProfile } from "../../firebase/provider";
import { addPost } from "../../firebase/firestore";
import SectionHeader from "../../components/SectionHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firestore } from "../../firebase/general";
import StatIcon from "../../components/StatIcon";
import GoalChart from "../../components/GoalChart";

const ProgressScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user, profile } = useProfile();
  const [text, setText] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [goals, setGoals] = useState([]);
  const [goal, setGoal] = useState(null);
  const scrollViewRef = useRef(null);

  const onSubmitHandler = async () => {
    try {
      setIsPosting(true);
      const thumbnailURL = profile.thumbnail ? profile.thumbnail : "";
      await addPost(
        thumbnailURL,
        user.displayName,
        user.uid,
        "Progress",
        {
          ...goal,
          height: profile.personalData.height,
          gender: profile.personalData.gender,
        },
        text
      );
      setIsPosting(false);
      setText("");
      navigation.navigate("Timeline");
    } catch (err) {
      console.log("Error in posting:", err);
    }
  };

  useEffect(() => {
    const loadGoals = async () => {
      const ref = firestore
        .collection("users")
        .doc(user.uid)
        .collection("goals");
      const goalArray = [];
      const querySnapshot = await ref.get();
      querySnapshot.forEach((doc) => {
        goalArray.push({ ...doc.data(), id: doc.id });
      });
      setGoals(goalArray);
    };
    loadGoals();
  });
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      innerRef={(ref) => (scrollViewRef.current = ref)}
    >
      <View style={styles.formContainer}>
        <SectionHeader headerText="Select one of your goals to share" />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {goals
            ? goals.map((goal) => (
                <StatIcon
                  name={goal.title}
                  id={goal.id}
                  key={goal.id}
                  onPressHandler={(id) => {
                    setSelectedGoalId(id);
                    setGoal(goals.find((el) => el.id === goal.id));
                  }}
                  active={selectedGoalId === goal.id ? true : false}
                />
              ))
            : null}
        </View>
        {goal ? (
          <GoalChart
            actualData={goal.progressData.map((d) => ({
              x: d.dataDate,
              y: d.value,
            }))}
            endDate={goal.targetDate}
            endValue={goal.targetValue}
            height={profile.personalData.height}
            male={profile.personalData.gender === "m" ? true : false}
            startDate={goal.startDate}
            startValue={goal.startValue}
            statId={goal.statId}
            key={goal.id}
            showChartBounds={goal.settings.showChartBounds}
            showChartCategories={goal.settings.showChartCategories}
          />
        ) : null}
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

export default ProgressScreen;

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
  });
  return styles;
};
