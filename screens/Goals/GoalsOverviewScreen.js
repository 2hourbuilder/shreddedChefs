import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GoalCard from "../../components/GoalCard";
import { auth, firestore } from "../../firebase/general";
import { useTheme } from "../../themes/provider";

const GoalsOverviewScreen = () => {
  const { theme } = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    const ref = firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals");
    let listener = () => {};
    const setListener = async () => {
      listener = ref.onSnapshot(
        function (snapshot) {
          setData(
            snapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              };
            })
          );
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
    <KeyboardAwareScrollView contentContainerStyle={{ alignItems: "center" }}>
      {data != undefined && data != [] ? (
        data.map((goal) => {
          return (
            <GoalCard
              key={goal.id}
              goalId={goal.id}
              startDate={goal.startDate}
              startValue={goal.startValue}
              endDate={goal.targetDate}
              endValue={goal.targetValue}
              statId={goal.statId}
              title={goal.title}
            />
          );
        })
      ) : (
        <Text
          style={{
            color: theme.SecondaryTextColor,
            width: "80%",
            textAlign: "center",
            marginTop: 20,
            fontSize: 16,
          }}
          lineBreakMode="tail"
        >
          It looks like you haven't added any goals yet. Press the + Button in
          the upper right corner to get started!
        </Text>
      )}
    </KeyboardAwareScrollView>
  );
};

export default GoalsOverviewScreen;

const styles = StyleSheet.create({});
