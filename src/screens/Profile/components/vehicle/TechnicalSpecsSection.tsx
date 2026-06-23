import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { FormField } from '../profile/edit/FormField';
import { FuelTypePicker } from './FuelTypePicker';

interface TechnicalSpecs {
  color: string;
  fuelType: string;
}

interface Props {
  specs: TechnicalSpecs;
  onChange: (field: keyof TechnicalSpecs, value: string) => void;
}

export const TechnicalSpecsSection: React.FC<Props> = ({ specs, onChange }) => {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <SlidersHorizontal size={18} color="#111827" strokeWidth={2} />
        <Text style={styles.sectionTitle}>Technical Specifications</Text>
      </View>

      <FormField
        label="Color"
        value={specs.color}
        onChangeText={v => onChange('color', v)}
        placeholder="e.g. Midnight Blue"
        autoCapitalize="words"
      />

      <FuelTypePicker
        value={specs.fuelType}
        onChange={v => onChange('fuelType', v)}
      />
    </View>
  );
};

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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});
