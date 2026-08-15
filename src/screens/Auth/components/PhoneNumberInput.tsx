import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../../theme/ResetPassword/colors';

interface PhoneNumberInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label = 'PHONE NUMBER',
  value,
  onChangeText,
  placeholder = '07xxxxxxxx',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {/* <View style={styles.prefixChip}>
          <Text style={styles.flag}>🇰🇪</Text>
          <Text style={styles.prefixText}>+254</Text>
        </View>
        <View style={styles.divider} /> */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#eef1ef',
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.md,
  },
  prefixChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  flag: { fontSize: 18, marginRight: spacing.xs },
  prefixText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
});
