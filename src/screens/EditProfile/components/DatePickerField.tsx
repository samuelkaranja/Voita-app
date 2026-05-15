import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
};

export default function DatePickerField({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  // =========================
  // HANDLE DATE CHANGE SAFELY
  // =========================
  const handleChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>
          {value ? value.toDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>

      {/* =========================
          DATE PICKER (SAFE MODE)
         ========================= */}
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: "#333333",
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  text: {
    color: "#000",
    fontSize: 14,
  },
});
