import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native-appearance";
import { getTheme } from "./theme";
import { Dimensions } from "react-native";
import { doChangePreferredTheme, doGetPreferredTheme } from "../firebase/auth";
import { useProfile } from "../firebase/provider";

const osTheme = Appearance.getColorScheme();
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export const ThemeContext = createContext({
  mode: osTheme,
  theme: getTheme(osTheme),
  dimensions: { window, screen },
  changeHandler: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = (props) => {
  const [dimensions, setDimensions] = useState({ window, screen });
  const [mode, setMode] = useState(osTheme);
  const { user } = useProfile();

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
  };

  useEffect(() => {
    const loadPreferredTheme = async (user) => {
      const result = await doGetPreferredTheme(user);
      if (result === "automatic") {
        osTheme === "dark" ? setMode("dark") : setMode("light");
      } else {
        setMode(result);
      }
    };

    user != undefined ? loadPreferredTheme(user) : null;

    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, [user]);

  const changeTheme = async (selected) => {
    if (selected === "automatic") {
      osTheme === "dark" ? setMode("dark") : setMode("light");
    } else {
      setMode(selected);
    }
    await doChangePreferredTheme(selected);
  };
  return (
    <ThemeContext.Provider
      value={{
        mode: mode,
        theme: getTheme(mode),
        dimensions: dimensions,
        changeHandler: changeTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
