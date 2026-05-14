import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

export default function CustomInput ({ placeholder, value, onChangeText }: any) {
  return (
    <View style={styles.inputContainer}>
     
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 15 },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
});
