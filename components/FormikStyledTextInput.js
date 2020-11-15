import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../themes/provider";
// Theme and Store

const FormikStyledTextInput = ({ value, formikProps, formikKey, ...rest }) => {
  const theme = useTheme();
  const styles = getStyles(theme.theme);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        value={value}
        onBlur={formikProps.handleBlur(formikKey)}
        onChangeText={formikProps.handleChange(formikKey)}
        keyboardType="default"
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor={styles.placeholderTextColor.color}
        {...rest}
      />
      <Text style={styles.errorText}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
  );
};

export default FormikStyledTextInput;

const getStyles = (theme) => {
  const styles = StyleSheet.create({
    inputContainer: {
      marginHorizontal: 20,
      marginVertical: 2,
      width: "80%",
      alignSelf: "center",
    },
    textInput: {
      borderBottomWidth: 1,
      borderColor: theme.PrimaryBorderColor,
      padding: 12,
      marginBottom: 0,
      color: theme.PrimaryTextColor,
      fontSize: 14,
    },
    placeholderTextColor: {
      color: theme.PrimaryBorderColor,
    },
    errorText: {
      color: "red",
      fontSize: 10,
    },
  });
  return styles;
};
