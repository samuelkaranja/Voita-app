import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GitFork, CircleCheckBig } from 'lucide-react-native';
import { FormField } from './FormField';

interface TireConfig {
  alloyType: string;
  pressureFront: string;
  pressureRear: string;
}

interface Props {
  config: TireConfig;
  onChange: (field: keyof TireConfig, value: string) => void;
  isCalibrated?: boolean;
}

export const TireConfigSection: React.FC<Props> = ({
  config,
  onChange,
  isCalibrated = false,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Tire Configuration</Text>
        {isCalibrated && (
          <View style={styles.badge}>
            <CircleCheckBig size={13} color="#16A34A" strokeWidth={2.5} />
            <Text style={styles.badgeText}>Calibrated</Text>
          </View>
        )}
      </View>

      {/* Alloy icon + label */}
      <View style={styles.alloyIconBlock}>
        <GitFork size={32} color="#111827" strokeWidth={1.5} />
        <Text style={styles.alloyLabel}>ALLOY TYPE</Text>
      </View>

      <FormField
        label=""
        labelHidden
        value={config.alloyType}
        onChangeText={v => onChange('alloyType', v)}
        autoCapitalize="words"
        textAlign="center"
        style={styles.alloyInput}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* Pressure row */}
      <View style={styles.pressureRow}>
        <PressureField
          label="Pressure (Front)"
          value={config.pressureFront}
          onChange={v => onChange('pressureFront', v)}
        />
        <PressureField
          label="Pressure (Rear)"
          value={config.pressureRear}
          onChange={v => onChange('pressureRear', v)}
        />
      </View>
    </View>
  );
};

// ── Inline pressure sub-field with PSI suffix ────────────────────────────────
interface PressureFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const PressureField: React.FC<PressureFieldProps> = ({
  label,
  value,
  onChange,
}) => (
  <View style={pressureStyles.wrapper}>
    <Text style={pressureStyles.label}>{label}</Text>
    <View style={pressureStyles.row}>
      <FormField
        label=""
        labelHidden
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        maxLength={3}
        containerStyle={{ flex: 1, marginBottom: 0 }}
      />
      <View style={pressureStyles.suffix}>
        <Text style={pressureStyles.suffixText}>PSI</Text>
      </View>
    </View>
  </View>
);

const pressureStyles = StyleSheet.create({
  wrapper: { flex: 1 },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  input: {
    flex: 1,
  },
  suffix: {
    paddingHorizontal: 6,
  },
  suffixText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  alloyIconBlock: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  alloyLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  alloyInput: {
    textAlign: 'center',
    marginBottom: 16,
  },
  pressureRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
});
