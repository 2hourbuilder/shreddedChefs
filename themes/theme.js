import { ThemeColors as ReactNavigationThemeColors } from "react-navigation";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
export const ThemeColors = {
  PrimaryTextColor: {
    light: "black",
    dark: "white",
  },
  SecondaryTextColor: {
    light: "#333",
    dark: "#bbb",
  },
  AccentTextColor: {
    light: "#2ec1ac",
    dark: "#2ec1ac",
  },
  PrimaryBackgroundColor: {
    light: "white",
    dark: "black",
  },
  SecondaryBackgroundColor: {
    light: "#eee",
    dark: "#222",
  },
  AccentBackgroundColor: {
    light: "#2ec1ac",
    dark: "#2ec1ac",
  },
  ShadowColor: {
    light: "#555",
    dark: "#eee",
  },
  DangerColor: {
    light: "#f56a79",
    dark: "#f56a79",
  },
  PrimaryBorderColor: {
    light: "#ddd",
    dark: "#444",
  },
  ChartsColorAxis: {
    light: "#444",
    dark: "#ddd",
  },
  Navigation: {
    light: { ...DefaultTheme },
    dark: { ...DarkTheme },
  },
};

export const getTheme = (mode) => {
  let Theme = {};
  for (let key in ThemeColors) {
    Theme[key] = ThemeColors[key][mode];
  }
  return Theme;
};
