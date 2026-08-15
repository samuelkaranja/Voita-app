import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/ResetPassword/colors';

interface PasswordStrengthMeterProps {
  password: string;
}

type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; color: string };

// Purely cosmetic — does NOT gate submission. The weak-password check is
// deliberately left server-side only (existing project decision, kept
// for backend testability), so this stays decorative.
function scorePassword(password: string): Strength {
  if (password.length === 0) {
    return { score: 0, label: '', color: colors.disabledButton };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const map: Record<number, Strength> = {
    0: { score: 0, label: 'Too short', color: colors.strengthWeak },
    1: { score: 1, label: 'Weak', color: colors.strengthWeak },
    2: { score: 2, label: 'Fair', color: colors.strengthFair },
    3: { score: 3, label: 'Good', color: colors.strengthGood },
    4: { score: 4, label: 'Strong', color: colors.strengthStrong },
  };

  return map[Math.min(score, 4)];
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const strength = useMemo(() => scorePassword(password), [password]);

  if (password.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {[0, 1, 2, 3].map(index => (
          <View
            key={index}
            style={[
              styles.segment,
              index < strength.score && { backgroundColor: strength.color },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: strength.color }]}>
        {strength.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: -spacing.sm, marginBottom: spacing.md },
  track: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' },
  label: { fontSize: 12, fontWeight: '600' },
});
