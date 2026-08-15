import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, radii, spacing } from '../../theme/ResetPassword/colors';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          onPress={() => setVisible(v => !v)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff size={20} color={colors.textSecondary} />
          ) : (
            <Eye size={20} color={colors.textSecondary} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
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
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 2,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
});
