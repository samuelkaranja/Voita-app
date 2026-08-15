import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Search } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { colors, spacing } from '../../theme/ResetPassword/colors';
import { AppDispatch, RootState } from '../../redux/store';
import { resetPassword } from '../../redux/slices/auth/authSlice';
import { AuthHeader } from './components/AuthHeader';
import { IconBadge } from './components/IconBadge';
import { PasswordInput } from './PasswordInput';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { PrimaryButton } from './components/PrimaryButton';

export const CreateNewPasswordScreen = ({ route, navigation }: any) => {
  const { phone, resetToken } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(
    (state: RootState) => state.auth.loading.resetPassword,
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordsMatch = newPassword === confirmPassword;
  const isLongEnough = newPassword.length >= 8;
  const canSubmit =
    isLongEnough && passwordsMatch && confirmPassword.length > 0;

  const handleReset = async () => {
    if (!passwordsMatch) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (!isLongEnough) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 8 characters',
      });
      return;
    }

    try {
      await dispatch(
        resetPassword({ phone, resetToken, newPassword }),
      ).unwrap();
      Alert.alert(
        'Password Reset Successful',
        'Your password has been reset successfully. You can now log in with your new password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      );
    } catch (error: any) {
      const message =
        typeof error === 'string' ? error : 'Failed to reset password';
      const tokenExpired = /invalid or expired reset token/i.test(message);

      if (tokenExpired) {
        Alert.alert(
          'Session Expired',
          'Your verification session has expired. Please request a new code.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ForgotPassword'),
            },
          ],
        );
      } else {
        Toast.show({ type: 'error', text1: 'Reset failed', text2: message });
      }
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        showBackButton
        onBackPress={() => navigation.goBack()}
        logoAlign="center"
      />

      <View style={styles.content}>
        <IconBadge icon={Search} />

        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Choose a strong new password for your account. Use at least 8
          characters.
        </Text>

        <PasswordInput
          label="NEW PASSWORD"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <PasswordStrengthMeter password={newPassword} />

        <PasswordInput
          label="CONFIRM NEW PASSWORD"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <PrimaryButton
          title="Reset Password"
          onPress={handleReset}
          loading={loading}
          disabled={!canSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});
