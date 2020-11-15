import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Formik } from "formik";
import { useTheme } from "../../themes/provider";
import * as yup from "yup";
import FormikStyledTextInput from "../../components/FormikStyledTextInput";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";

const validationSchema = yup.object().shape({
  username: yup.string().min(2).required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(6, "Password must contain at least 6 characters")
    .required(),
});

const RegistrationScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme.theme);
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Become a Shredded Chef!</Text>
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          try {
            await doCreateUserWithEmailAndPassword(
              values.username,
              values.email,
              values.password
            );
            actions.resetForm();
            navigation.navigate("Home");
          } catch (error) {
            console.log(error);
          }
        }}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <View style={styles.formContainer}>
            <FormikStyledTextInput
              formikProps={formikProps}
              formikKey="username"
              autoFocus
              placeholder="Username"
              value={formikProps.values.username}
            />
            <FormikStyledTextInput
              formikProps={formikProps}
              formikKey="email"
              placeholder="E-Mail"
              keyboardType="email-address"
              value={formikProps.values.email}
            />
            <FormikStyledTextInput
              formikProps={formikProps}
              formikKey="password"
              placeholder="Password"
              value={formikProps.values.password}
              secureTextEntry
            />
            <View style={styles.submitContainer}>
              {formikProps.isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    formikProps.handleSubmit();
                  }}
                >
                  <Text>Register</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Login")}
              >
                Login
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.PrimaryBackgroundColor,
      flex: 1,
      alignItems: "center",
    },
    header: {
      height: "15%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.SecondaryBackgroundColor,
    },
    headerText: {
      fontWeight: "bold",
      fontSize: 20,
      color: theme.PrimaryTextColor,
    },
    formContainer: {
      width: "100%",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    submitContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
    button: {
      backgroundColor: theme.AccentBackgroundColor,
      width: 200,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
      shadowColor: theme.ShadowColor,
      shadowOffset: { height: 1, width: 2 },
      shadowRadius: 8,
      shadowOpacity: 0.3,
    },
    footer: {
      flexDirection: "row",
      marginVertical: 30,
    },
    footerText: {
      color: theme.PrimaryTextColor,
    },
    linkText: {
      color: theme.AccentTextColor,
      fontWeight: "500",
    },
  });
  return styles;
};
