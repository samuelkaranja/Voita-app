import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface Props {
  label: string;
  value: string;
  isLast?: boolean;
  maskable?: boolean;
}

const maskValue = (value: string): string => {
  if (!value) return value;
  return '*'.repeat(value.length);
};

export const InfoField: React.FC<Props> = ({
  label,
  value,
  isLast = false,
  maskable = false,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const displayValue = maskable && !isRevealed ? maskValue(value) : value;

  return (
    <View style={[styles.container, !isLast && styles.withBorder]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{displayValue}</Text>
        {maskable && (
          <TouchableOpacity
            onPress={() => setIsRevealed(prev => !prev)}
            hitSlop={10}
            style={styles.eyeButton}
          >
            {isRevealed ? (
              <EyeOff size={16} color="#9CA3AF" />
            ) : (
              <Eye size={16} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  withBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111827',
  },
  eyeButton: {
    padding: 4,
  },
});
