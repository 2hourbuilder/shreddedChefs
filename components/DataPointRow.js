import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../themes/provider";
import { deleteProgressData } from "../firebase/firestore";

const DataPointRow = ({ progressDataId, goalId, dataDate, value, index }) => {
  const { theme } = useTheme();
  const deleteHandler = async () => {
    await deleteProgressData(goalId, progressDataId);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:
          index % 2 === 0
            ? theme.SecondaryBackgroundColor
            : theme.PrimaryBackgroundColor,
      }}
    >
      <Text
        style={{
          flex: 1,
          color: theme.SecondaryTextColor,
          fontWeight: "300",
          paddingLeft: 6,
        }}
      >
        {new Date(dataDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </Text>
      <Text style={{ color: theme.SecondaryTextColor, fontWeight: "300" }}>
        {Number(value).toLocaleString("en-GB", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        })}
      </Text>
      <TouchableOpacity
        style={{ width: 50, alignItems: "flex-end", marginRight: 8 }}
        onPress={deleteHandler}
      >
        <MaterialIcons name="delete" size={18} color={theme.DangerColor} />
      </TouchableOpacity>
    </View>
  );
};

export default DataPointRow;
