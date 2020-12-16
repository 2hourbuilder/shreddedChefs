import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SectionHeader from "../../components/SectionHeader";
import { useTheme } from "../../themes/provider";
import { goals } from "../../data/goals";
import { stats } from "../../data/stats";
import GoalsIcon from "../../components/GoalsIcon";
import StatIcon from "../../components/StatIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useProfile } from "../../firebase/provider";
import GoalChart from "../../components/GoalChart";
import { doSetPersonalData } from "../../firebase/auth";
import { addGoal } from "../../firebase/firestore";

const NewGoalScreen = (props) => {
  const { theme } = useTheme();
  const { profile } = useProfile();
  const [goalTitle, setGoalTitle] = useState("");
  const [selectedGoalTypeId, setSelectedGoalTypeId] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [height, setHeight] = useState("");
  const [heightValid, setHeightValid] = useState(false);
  const [gender, setGender] = useState("");
  const [genderValid, setGenderValid] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [endDateMS, setEndDateMS] = useState(new Date());
  const [endDateValid, setEndDateValid] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startDateMS, setStartDateMS] = useState(new Date());
  const [startDateValid, setStartDateValid] = useState(false);
  const [weight, setWeight] = useState("");
  const [weightValid, setWeightValid] = useState(false);
  const [bodyFat, setBodyFat] = useState("");
  const [bodyFatValid, setBodyFatValid] = useState(false);
  const [target, setTarget] = useState("");
  const [targetValid, setTargetValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [askPersonalData, setAskPersonalData] = useState(false);
  const styles = getStyles(theme);

  const StatContainer = () => {
    const availableStats = goals.find((goal) => goal.id === selectedGoalTypeId)
      .stats;
    return (
      <>
        <SectionHeader headerText="Select one main stat to set your goal" />
        <View style={styles.goalTypeContainer}>
          {stats
            .filter((stat) => availableStats.includes(stat.id))
            .map((stat) => (
              <StatIcon
                key={stat.id}
                id={stat.id}
                name={stat.name}
                active={stat.id === selectedStat ? true : false}
                onPressHandler={setSelectedStat}
              />
            ))}
        </View>
      </>
    );
  };

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

  const calculateCurrent = (statId) => {
    const heightSquared = (parseInt(height) * parseInt(height)) / 10000;
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
            6.3 * (1.8 - parseInt(height) / 100)
        );
      default:
        break;
    }
  };

  const submitHandler = async () => {
    setIsSubmitting(true);
    try {
      if (profile.personalData === undefined) {
        await doSetPersonalData(parseInt(height), gender);
      }
      await addGoal(
        goalTitle,
        selectedGoalTypeId,
        selectedStat,
        startDateMS,
        endDateMS,
        calculateCurrent(selectedStat),
        parseFloat(target.replace(",", "."))
      );
      props.navigation.navigate("Goals");
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    if (profile.personalData === undefined) {
      setAskPersonalData(true);
    } else {
      setHeight(profile.personalData.height);
      setHeightValid(true);
      setGender(profile.personalData.gender);
      setGenderValid(true);
    }
  }, [profile.personalData]);

  return (
    <KeyboardAwareScrollView viewIsInsideTabBar extraScrollHeight={100}>
      <View style={styles.banner}>
        <Text style={styles.text}>
          Great that you're setting yourself new goals!
        </Text>
        <Text style={styles.text}>
          To give you the best support, please set your goal as specific as
          possible!
        </Text>
      </View>
      <SectionHeader headerText="Enter your goal title" />
      <View>
        <TextInput
          style={styles.goalTitle}
          value={goalTitle}
          placeholder="Get in shape for the beach!"
          placeholderTextColor={theme.PrimaryBorderColor}
          onChangeText={(text) => setGoalTitle(text)}
        />
      </View>
      <SectionHeader headerText="Select your type of goal" />
      <View style={styles.goalTypeContainer}>
        {goals.map((goal) => (
          <GoalsIcon
            key={goal.id}
            id={goal.id}
            iconSource={goal.iconSource}
            name={goal.name}
            active={goal.id === selectedGoalTypeId ? true : false}
            onPressHandler={setSelectedGoalTypeId}
          />
        ))}
      </View>
      {selectedGoalTypeId != null ? <StatContainer /> : null}
      {selectedStat != null ? (
        <View style={{ padding: 8 }}>
          <Text style={styles.textHeader}>
            {stats.find((stat) => stat.id === selectedStat).longName}
          </Text>
          <Text style={styles.plainText}>
            {stats.find((stat) => stat.id === selectedStat).description}
          </Text>
        </View>
      ) : null}
      {selectedStat != null ? (
        <View>
          <SectionHeader headerText="Great, let's get to the details!" />
          {askPersonalData ? (
            <>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsLabel}>Height in cm</Text>
                <TextInput
                  style={styles.detailsValue}
                  value={String(height)}
                  placeholder="cm"
                  placeholderTextColor={theme.PrimaryBorderColor}
                  onChangeText={(text) => {
                    setHeight(text);
                    setHeightValid(
                      parseInt(text) > 100 && parseInt(text) < 250
                        ? true
                        : false
                    );
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                  returnKeyType="next"
                />
                <View style={styles.detailsValue}>
                  <ValidationCircle validationExpression={heightValid} />
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <Text style={styles.detailsLabel}>Gender</Text>
                <TextInput
                  style={styles.detailsValue}
                  value={gender}
                  placeholder="m / f"
                  placeholderTextColor={theme.PrimaryBorderColor}
                  onChangeText={(text) => {
                    setGender(text.toLowerCase());
                    setGenderValid(
                      text.toLowerCase() === "m" || text.toLowerCase() === "f"
                    );
                  }}
                  keyboardType="default"
                  maxLength={1}
                  returnKeyType="next"
                />
                <View style={styles.detailsValue}>
                  <ValidationCircle validationExpression={genderValid} />
                </View>
              </View>
            </>
          ) : null}

          {selectedStat != "2" ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Current weight</Text>
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
          {selectedStat === "2" || selectedStat === "4" ? (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>Current body fat %</Text>
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
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>Start date </Text>
            <TextInput
              style={styles.detailsValue}
              value={startDate}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={theme.PrimaryBorderColor}
              onChangeText={(text) =>
                parseDate(text, setStartDate, setStartDateValid, setStartDateMS)
              }
              keyboardType="default"
              returnKeyType="next"
            />
            <View style={styles.detailsValue}>
              <ValidationCircle validationExpression={startDateValid} />
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>Target date </Text>
            <TextInput
              style={styles.detailsValue}
              value={endDate}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={theme.PrimaryBorderColor}
              onChangeText={(text) =>
                parseDate(text, setEndDate, setEndDateValid, setEndDateMS)
              }
              keyboardType="default"
              returnKeyType="next"
            />
            <View style={styles.detailsValue}>
              <ValidationCircle validationExpression={endDateValid} />
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsLabel}>
              {"Target "}
              {selectedStat === "1"
                ? "weight"
                : stats.find((stat) => stat.id === selectedStat).name}
            </Text>
            <TextInput
              style={styles.detailsValue}
              value={target}
              placeholder={stats.find((stat) => stat.id === selectedStat).name}
              placeholderTextColor={theme.PrimaryBorderColor}
              onChangeText={(text) => {
                setTarget(text);
                setTargetValid(text != "" ? true : false);
              }}
              keyboardType="numeric"
            />
            <View style={styles.detailsValue}>
              <ValidationCircle validationExpression={targetValid} />
            </View>
          </View>
        </View>
      ) : null}
      {heightValid &&
      genderValid &&
      (weightValid || selectedStat === "2") &&
      (bodyFatValid || selectedStat === "1" || selectedStat === "3") &&
      startDateValid &&
      endDateValid &&
      targetValid ? (
        <>
          <SectionHeader headerText="This is your journey" />
          <GoalChart
            height={parseInt(height)}
            male={gender === "f" ? false : true}
            statId={selectedStat}
            startDate={startDateMS}
            startValue={calculateCurrent(selectedStat)}
            endDate={endDateMS}
            endValue={
              target != "" ? parseFloat(target.replace(",", ".")) : target
            }
          />
          <View style={styles.centeredText}>
            <Text style={{ ...styles.plainText, fontWeight: "600" }}>
              Motivated to get started?
            </Text>
          </View>
          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity style={styles.button} onPress={submitHandler}>
              <Text style={{ ...styles.text, fontWeight: "600" }}>
                Save goal
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.centeredText}>
          <Text style={styles.plainText}>
            Enter all details to show Journey Plan!
          </Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default NewGoalScreen;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    text: {
      color: "black",
      fontSize: 16,
      textAlign: "center",
    },
    button: {
      width: "60%",
      height: 48,
      backgroundColor: theme.AccentBackgroundColor,
      borderRadius: 12,
      shadowColor: theme.ShadowColor,
      shadowOffset: { height: 2, width: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      alignContent: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginVertical: 20,
    },
    banner: {
      margin: 8,
      padding: 8,
      backgroundColor: theme.AccentBackgroundColor,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: theme.ShadowColor,
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { height: 2, width: 1 },
    },
    goalTypeContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 8,
      flexWrap: "wrap",
    },
    textHeader: {
      color: theme.PrimaryTextColor,
      fontWeight: "500",
      fontSize: 16,
      marginBottom: 4,
    },
    plainText: {
      color: theme.PrimaryTextColor,
      fontWeight: "300",
    },
    centeredText: {
      fontWeight: "600",
      flexDirection: "row",
      padding: 8,
      width: "100%",
      alignItems: "center",
      paddingTop: 20,
      justifyContent: "center",
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
    goalTitle: {
      color: theme.AccentBackgroundColor,
      fontSize: 16,
      fontWeight: "600",
      padding: 8,
    },
  });
  return styles;
};
