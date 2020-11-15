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
import { doSignInWithEmailAndPassword } from "../../firebase/auth";

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme.theme);
  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome back!</Text>
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          try {
            await doSignInWithEmailAndPassword(values.email, values.password);
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
                  <Text>Login</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account yet? </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Registration")}
              >
                Register
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
