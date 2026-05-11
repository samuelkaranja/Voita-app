import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export default function InputField({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor="#888"
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    flex: 1,
  },
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
  disabledInput: {
    backgroundColor: '#d1d5db',
    color: '#666',
  },
});
