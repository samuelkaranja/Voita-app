import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FormField } from './FormField';

interface VehicleSpecs {
  numberPlate: string;
  vehicleType: string;
  modelYear: string;
  color: string;
  fuelType: string;
}

interface Props {
  specs: VehicleSpecs;
  onChange: (field: keyof VehicleSpecs, value: string) => void;
}

export const VehicleSpecsSection: React.FC<Props> = ({ specs, onChange }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Vehicle Specifications</Text>

      <FormField
        label="NUMBER PLATE"
        value={specs.numberPlate}
        onChangeText={v => onChange('numberPlate', v)}
        autoCapitalize="characters"
      />
      <FormField
        label="VEHICLE TYPE"
        value={specs.vehicleType}
        onChangeText={v => onChange('vehicleType', v)}
        autoCapitalize="words"
      />

      {/* Model Year + Color side by side */}
      <View style={styles.row}>
        <View style={styles.rowHalf}>
          <FormField
            label="MODEL YEAR"
            value={specs.modelYear}
            onChangeText={v => onChange('modelYear', v)}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
        <View style={styles.rowHalf}>
          <ColorField
            label="COLOR"
            value={specs.color}
            onChange={v => onChange('color', v)}
          />
        </View>
      </View>

      <FormField
        label="OIL / FUEL TYPE"
        value={specs.fuelType}
        onChangeText={v => onChange('fuelType', v)}
        autoCapitalize="words"
      />
    </View>
  );
};

// ── Inline color field with dot indicator ────────────────────────────────────
const COLOR_DOT: Record<string, string> = {
  obsidian: '#1a1a2e',
  black: '#000000',
  white: '#FFFFFF',
  silver: '#C0C0C0',
  red: '#DC2626',
  blue: '#2563EB',
  grey: '#6B7280',
};

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const dotColor = COLOR_DOT[value.toLowerCase()] ?? '#374151';

  return (
    <View style={colorStyles.wrapper}>
      <Text style={colorStyles.label}>{label}</Text>
      <View style={[colorStyles.inputRow, isFocused && colorStyles.inputRowFocused]}>
        <View style={[colorStyles.dot, { backgroundColor: dotColor }]} />
        <TextInput
          value={value}
          onChangeText={onChange}
          autoCapitalize="words"
          style={colorStyles.input}
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

const colorStyles = StyleSheet.create({
  wrapper: { flex: 1 },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 10,
    height: 48,
  },
  inputRowFocused: {
    borderColor: '#111827', // matches FormField focus style
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingHorizontal: 4,
    height: '100%',
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowHalf: {
    flex: 1,
  },
});
