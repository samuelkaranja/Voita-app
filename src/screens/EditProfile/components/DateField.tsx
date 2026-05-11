import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

interface DateFieldProps {
  label: string;
  value: Date | string | null;
  onChange: (date: Date) => void;
  editable?: boolean;
}

export default function DateField({
  label,
  value,
  onChange,
  editable = true,
}: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  // SAFE DATE HANDLING (fix for your error)
  const getFormattedDate = (val: Date | string | null) => {
    if (!val) return 'Select date';

    const date = val instanceof Date ? val : new Date(val);

    if (isNaN(date.getTime())) return 'Select date';

    return date.toLocaleDateString();
  };

  const formattedDate = getFormattedDate(value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.input, !editable && styles.disabledInput]}
        onPress={() => editable && setShowPicker(true)}
        activeOpacity={editable ? 0.7 : 1}
      >
        <Text style={styles.text}>{formattedDate}</Text>
        <Calendar size={18} color="#555" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value instanceof Date ? value : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
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
