import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { colors, radii } from '../../../theme/ResetPassword/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brandGreen,
    borderRadius: radii.lg,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { backgroundColor: colors.disabledButton },
  buttonPressed: { opacity: 0.9 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
