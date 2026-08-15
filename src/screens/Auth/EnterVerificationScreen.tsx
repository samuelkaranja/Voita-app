import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { colors, spacing } from '../../theme/ResetPassword/colors';
import { AppDispatch, RootState } from '../../redux/store';
import { useCountdown } from '../../hooks/useCountdown';
import {
  requestPasswordReset,
  verifyResetOtp,
} from '../../redux/slices/auth/authSlice';
import { AuthHeader } from './components/AuthHeader';
import { IconBadge } from './components/IconBadge';
import { PrimaryButton } from './components/PrimaryButton';
import { OtpCodeInput } from './components/OtpCodeInput';

// Confirmed via backend spec: OTP expires in 5 minutes (mockup copy said
// 10 — using the confirmed value here instead).
const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 30;

function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}XX XXX ${end}`;
}

export const EnterVerificationScreen = ({ route, navigation }: any) => {
  const { phone } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(
    (state: RootState) => state.auth.loading.verifyResetOtp,
  );
  const resending = useSelector(
    (state: RootState) => state.auth.loading.requestPasswordReset,
  );

  const [otpCode, setOtpCode] = useState('');
  const expiry = useCountdown(OTP_EXPIRY_SECONDS);
  const resendCooldown = useCountdown(RESEND_COOLDOWN_SECONDS);

  const handleVerify = async (codeOverride?: string) => {
    const codeToVerify = codeOverride ?? otpCode;

    try {
      const result = await dispatch(
        verifyResetOtp({ phone, otpCode: codeToVerify }),
      ).unwrap();
      navigation.navigate('CreateNewPassword', {
        phone,
        resetToken: result.reset_token,
      });
    } catch (error: any) {
      const message =
        typeof error === 'string' ? error : 'Invalid or expired OTP';
      Alert.alert('Verification Failed', message, [
        { text: 'Try Again', style: 'cancel' },
        { text: 'Resend OTP', onPress: handleResend },
      ]);
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(requestPasswordReset(phone)).unwrap();
      expiry.restart(OTP_EXPIRY_SECONDS);
      resendCooldown.restart(RESEND_COOLDOWN_SECONDS);
      setOtpCode('');
      Toast.show({ type: 'success', text1: 'A new code has been sent' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not resend code',
        text2: typeof error === 'string' ? error : 'Please try again.',
      });
    }
  };

  const isComplete = otpCode.length === 6;

  return (
    <View style={styles.container}>
      <AuthHeader
        showBackButton
        onBackPress={() => navigation.goBack()}
        logoAlign="center"
        title="Verify OTP"
      />

      <View style={styles.content}>
        <IconBadge icon={ShieldCheck} />

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{' '}
          <Text style={styles.subtitleBold}>{maskPhone(phone)}</Text>. It
          expires in {Math.ceil(OTP_EXPIRY_SECONDS / 60)} minutes.
        </Text>

        <OtpCodeInput onChangeCode={setOtpCode} onCodeComplete={handleVerify} />

        <PrimaryButton
          title="Verify Code"
          onPress={() => handleVerify()}
          loading={loading}
          disabled={!isComplete}
        />

        <View style={styles.resendRow}>
          {resendCooldown.isActive ? (
            <Text style={styles.resendText}>
              Resend code in{' '}
              <Text style={styles.resendBold}>{resendCooldown.formatted}</Text>
            </Text>
          ) : (
            <Text
              style={styles.resendLink}
              onPress={resending ? undefined : handleResend}
            >
              {resending ? 'Resending…' : 'Resend Code'}
            </Text>
          )}
        </View>
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
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  subtitleBold: { fontWeight: '700', color: colors.textPrimary },
  resendRow: { alignItems: 'center', marginTop: spacing.lg },
  resendText: { fontSize: 13, color: colors.textSecondary },
  resendBold: { fontWeight: '700', color: colors.textPrimary },
  resendLink: { fontSize: 13, fontWeight: '700', color: colors.brandGreen },
});
