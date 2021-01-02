import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  Button,
  Switch,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useProfile } from "../firebase/provider";
import { useTheme } from "../themes/provider";
import GoalChart from "./GoalChart";
import {
  addProgressData,
  changeGoalSettings,
  deleteGoalById,
} from "../firebase/firestore";
import { auth, firestore } from "../firebase/general";
import DataPointRow from "./DataPointRow";

const GoalCard = ({
  goalId,
  statId,
  startDate,
  startValue,
  endDate,
  endValue,
  title,
}) => {
  const { theme, mode } = useTheme();
  const { profile } = useProfile();
  const styles = getStyles(theme, mode);
  const [showGoalActions, setShowGoalActions] = useState(false);
  const [dataDate, setDataDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );
  const [dataDateMS, setDataDateMS] = useState(
    Math.max(new Date().getTime(), startDate)
  );
  const [dataDateValid, setDataDateValid] = useState(true);
  const [weight, setWeight] = useState("");
  const [weightValid, setWeightValid] = useState(false);
  const [bodyFat, setBodyFat] = useState("");
  const [bodyFatValid, setBodyFatValid] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);
  const [numberOfHistoryData, setNumberOfHistoryData] = useState(5);
  const [showChartCategories, setShowChartCategories] = useState(false);
  const [showChartBounds, setShowChartBounds] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseDate = (text, setState, setValid, setMS) => {
    let separator = "/";
    let year = 0;
    let month = 0;
    let day = 0;
    const re = new RegExp(
      "^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$"
    );
    setState(text);
    if (re.test(text)) {
      separator = text.match(/[^0-9]/g)[0];
      day = text.slice(0, text.indexOf(separator, 0));
      month = text.slice(
        text.indexOf(separator) + 1,
        text.lastIndexOf(separator)
      );
      year = text.slice(text.lastIndexOf(separator) + 1);
      year < 2000 ? (year = parseInt(year) + 2000) : null;
      setMS(new Date(year, month - 1, day).getTime());
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const ValidationCircle = ({ validationExpression }) =>
    validationExpression ? (
      <MaterialIcons
        name="check-circle"
        size={18}
        color={theme.AccentBackgroundColor}
      />
    ) : (
      <MaterialIcons name="error" size={18} color={theme.DangerColor} />
    );

  const submitHandler = async (progressDataObj) => {
    setIsSubmitting(true);
    try {
      await addProgressData(goalId, { ...progressDataObj });
      setIsSubmitting(false);
    } catch (err) {
      throw new Error(err);
    }
  };

  const generateValue = () => {
    const heightSquared =
      (profile.personalData.height * profile.personalData.height) / 10000;
    switch (statId) {
      case "1":
        return parseFloat(weight.replace(",", "."));
      case "2":
        return parseFloat(bodyFat.replace(",", "."));
      case "3":
        return parseFloat(weight.replace(",", ".") / heightSquared);
      case "4":
        return parseFloat(
          (weight.replace(",", ".") * (1 - bodyFat.replace(",", ".") / 100)) /
            heightSquared +
            6.3 * (1.8 - parseInt(profile.personalData.height) / 100)
        );
      case "5":
        return parseFloat(weight.replace(",", "."));
      default:
        break;
    }
  };

  const changeSettings = async (showChartBounds, showChartCategories) => {
    await changeGoalSettings(goalId, showChartBounds, showChartCategories);
  };

  useEffect(() => {
    const ref = firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals")
      .doc(goalId);
    let listener = () => {};
    const setListener = async () => {
      listener = ref.onSnapshot(
        function (snapshot) {
          snapshot.data().hasOwnProperty("progressData")
            ? setProgressHistory(
                snapshot
                  .data()
                  .progressData.sort((a, b) => b.dataDate - a.dataDate)
              )
            : null;
          if (snapshot.data().hasOwnProperty("settings")) {
            setShowChartCategories(
              snapshot.data().settings.showChartCategories
            );
            setShowChartBounds(snapshot.data().settings.showChartBounds);
          }
        },
        function (error) {
          alert(error);
        }
      );
    };
    try {
      setListener();
    } catch (error) {
      throw new Error(error);
    }
    return () => listener();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: 60 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>{title}</Text>
        </View>
        <TouchableOpacity
          style={{
            width: 54,
            paddingTop: 14,
            paddingBottom: 5,
            paddingLeft: 20,
          }}
          onPress={() => {
            setShowGoalActions((prevState) => !prevState);
            setNumberOfHistoryData(5);
          }}
        >
          <MaterialIcons
            name="dehaze"
            size={20}
            color={theme.PrimaryTextColor}
          />
        </TouchableOpacity>
      </View>
      <GoalChart
        showChartCategories={showChartCategories}
        height={profile.personalData.height}
        male={profile.personalData.gender === "m" ? true : false}
        statId={statId}
        startDate={startDate}
        startValue={startValue}
        endDate={endDate}
        endValue={endValue}
        showChartBounds={showChartBounds}
        actualData={progressHistory.map((entry) => {
          return {
            x: entry.dataDate,
            y: entry.value,
          };
        })}
      />
      {showGoalActions ? (
        <View
          style={{
            width: "80%",
            borderTopColor: "white",
            borderTopWidth: StyleSheet.hairlineWidth,
            paddingTop: 8,
          }}
        >
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>Date </Text>
            <TextInput
              style={styles.detailsValue}
              value={dataDate}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={theme.PrimaryBorderColor}
              onChangeText={(text) =>
                parseDate(text, setDataDate, setDataDateValid, setDataDateMS)
              }
              keyboardType="default"
              returnKeyType="next"
            />
            <View style={styles.detailsValue}>
              <ValidationCircle validationExpression={dataDateValid} />
            </View>
          </View>
          {statId != "2" && statId != "5" ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Weight</Text>
              <TextInput
                style={styles.detailsValue}
                value={weight}
                placeholder="kg"
                placeholderTextColor={theme.PrimaryBorderColor}
                onChangeText={(text) => {
                  setWeight(text);
                  setWeightValid(
                    parseFloat(text.replace(",", ".")) > 40 &&
                      parseFloat(text.replace(",", ".")) < 200
                  );
                }}
                keyboardType="numeric"
                returnKeyType="next"
              />
              <View style={styles.detailsValue}>
                <ValidationCircle validationExpression={weightValid} />
              </View>
            </View>
          ) : null}
          {statId === "5" ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Measurement</Text>
              <TextInput
                style={styles.detailsValue}
                value={weight}
                placeholder="cm"
                placeholderTextColor={theme.PrimaryBorderColor}
                onChangeText={(text) => {
                  setWeight(text);
                  setWeightValid(
                    parseFloat(text.replace(",", ".")) > 0 &&
                      parseFloat(text.replace(",", ".")) < 200
                  );
                }}
                keyboardType="numeric"
                returnKeyType="next"
              />
              <View style={styles.detailsValue}>
                <ValidationCircle validationExpression={weightValid} />
              </View>
            </View>
          ) : null}
          {statId === "2" || statId === "4" ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Body fat %</Text>
              <TextInput
                style={styles.detailsValue}
                value={bodyFat}
                placeholder="%"
                placeholderTextColor={theme.PrimaryBorderColor}
                onChangeText={(text) => {
                  setBodyFat(text);
                  setBodyFatValid(
                    parseFloat(text.replace(",", ".")) > 5 &&
                      parseFloat(text.replace(",", ".")) < 50
                  );
                }}
                keyboardType="numeric"
                returnKeyType="next"
              />
              <View style={styles.detailsValue}>
                <ValidationCircle validationExpression={bodyFatValid} />
              </View>
            </View>
          ) : null}
          <TouchableOpacity
            style={{
              ...styles.submitButton,
              backgroundColor:
                dataDateValid &&
                (weightValid || statId === "2") &&
                (bodyFatValid ||
                  statId === "1" ||
                  statId === "3" ||
                  statId === "5")
                  ? theme.AccentBackgroundColor
                  : theme.PrimaryBorderColor,
            }}
            onPress={() => {
              submitHandler({
                dataDate: dataDateMS,
                value: generateValue(),
              });
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "400",
                marginLeft: 10,
              }}
            >
              Add progress data
            </Text>
          </TouchableOpacity>
          {progressHistory.map((item, index) =>
            index < numberOfHistoryData ? (
              <DataPointRow
                progressDataId={item.id}
                goalId={goalId}
                dataDate={item.dataDate}
                value={item.value}
                key={item.id}
                index={index}
              />
            ) : null
          )}
          {numberOfHistoryData < progressHistory.length ? (
            <Button
              title="Show more"
              onPress={() =>
                setNumberOfHistoryData((prevState) => prevState + 5)
              }
            />
          ) : null}
          {statId != "5" ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Show chart categories</Text>
              <Switch
                onValueChange={() =>
                  changeSettings(showChartBounds, !showChartCategories)
                }
                value={showChartCategories}
                ios_backgroundColor={theme.SecondaryBackgroundColor}
                trackColor={{
                  true: theme.AccentBackgroundColor,
                  false: theme.SecondaryBackgroundColor,
                }}
              />
            </View>
          ) : null}
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>Show upper and lower bounds</Text>
            <Switch
              onValueChange={() =>
                changeSettings(!showChartBounds, showChartCategories)
              }
              value={showChartBounds}
              ios_backgroundColor={theme.SecondaryBackgroundColor}
              trackColor={{
                true: theme.AccentBackgroundColor,
                false: theme.SecondaryBackgroundColor,
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              if (Platform.OS === "web") {
                const r = confirm("Do you really want to delete this goal?");
                r ? deleteGoalById(goalId) : null;
              } else {
                Alert.alert(
                  "Delete goal",
                  "Do you really want to delete this goal?",
                  [
                    { text: "No way!", style: "cancel" },
                    { text: "Yes", onPress: () => deleteGoalById(goalId) },
                  ]
                );
              }
            }}
          >
            <MaterialIcons name="delete" color="white" size={18} />
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "400",
                marginLeft: 5,
              }}
            >
              Delete goal
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default GoalCard;

const getStyles = (theme, mode) => {
  const styles = StyleSheet.create({
    container: {
      width: "95%",
      backgroundColor:
        mode === "light"
          ? theme.PrimaryBackgroundColor
          : theme.SecondaryBackgroundColor,
      borderRadius: 30,
      shadowColor: theme.ShadowColor,
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: "600",
      paddingTop: 14,
      color: theme.PrimaryTextColor,
      textAlign: "center",
    },
    deleteButton: {
      width: "50%",
      alignSelf: "center",
      padding: 8,
      backgroundColor: theme.DangerColor,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 10,
    },
    submitButton: {
      padding: 8,
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 10,
    },
    detailsContainer: {
      flexDirection: "row",
      padding: 8,
      width: "100%",
      alignItems: "center",
      paddingTop: 6,
    },
    detailsLabel: {
      flex: 1,
      color: theme.PrimaryTextColor,
      fontWeight: "300",
    },
    detailsValue: {
      marginLeft: 8,
      color: theme.PrimaryTextColor,
      fontWeight: "300",
    },
  });
  return styles;
};
