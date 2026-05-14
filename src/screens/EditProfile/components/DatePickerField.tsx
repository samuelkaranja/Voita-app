import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePickerField ({ label, value, onChange }: any) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Text style={styles.text}>
          {value ? value.toDateString() : "Select Date"}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
  },
  text: {
    color: '#000',
  },
});
