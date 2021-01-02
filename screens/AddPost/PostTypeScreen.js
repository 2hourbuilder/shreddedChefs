import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  ImageBackground,
} from "react-native";
import { IMG_WORKOUT, IMG_FOOD, IMG_PROGRESS } from "../../assets/images";
import { useTheme } from "../../themes/provider";

const PostTypeScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.imageContainer,
          mode === "light" ? styles.cardShadows : null,
        ]}
        onPress={() => navigation.navigate("Workout")}
      >
        <ImageBackground style={styles.image} source={IMG_WORKOUT}>
          <Text style={styles.caption}>WORKOUT</Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.imageContainer,
          mode === "light" ? styles.cardShadows : null,
        ]}
        onPress={() => navigation.navigate("Food")}
      >
        <ImageBackground style={styles.image} source={IMG_FOOD}>
          <Text style={styles.caption}>FOOD</Text>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.imageContainer,
          mode === "light" ? styles.cardShadows : null,
        ]}
        onPress={() => navigation.navigate("Progress")}
      >
        <ImageBackground style={styles.image} source={IMG_PROGRESS}>
          <Text style={styles.caption}>PROGRESS</Text>
        </ImageBackground>
      </TouchableOpacity>
      <Button
        title="Cancel"
        color={theme.DangerColor}
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

export default PostTypeScreen;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
    },
    imageContainer: {
      height: 150,
      width: "100%",
      margin: 0,
    },
    cardShadows: {
      shadowColor: theme.ShadowColor,
      shadowOpacity: 0.5,
      shadowRadius: 10,
      shadowOffset: { height: 2, width: 2 },
    },
    image: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    caption: {
      fontSize: 36,
      fontWeight: "600",
      color: "white",
    },
  });
  return styles;
};
