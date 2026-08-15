import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MessageSquareText } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../../redux/store';
import { requestPasswordReset } from '../../redux/slices/auth/authSlice';
import { AuthHeader } from './components/AuthHeader';
import { IconBadge } from './components/IconBadge';
import { PhoneNumberInput } from './components/PhoneNumberInput';
import { PrimaryButton } from './components/PrimaryButton';
import { colors, spacing } from '../../theme/ResetPassword/colors';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(
    (state: RootState) => state.auth.loading.requestPasswordReset,
  );
  const [phone, setPhone] = useState('');

  const isValid = phone.length >= 9;

  const handleSendCode = async () => {
    try {
      await dispatch(requestPasswordReset(phone)).unwrap();
      navigation.navigate('EnterVerificationCode', { phone });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Could not send code',
        text2: typeof error === 'string' ? error : 'Please try again.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <AuthHeader showBackButton={true} logoAlign="center" />

        <View style={styles.content}>
          {/* <IconBadge icon={MessageSquareText} /> */}

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries. Enter your phone number and we'll send you a 6-digit
            verification code via SMS.
          </Text>

          <PhoneNumberInput value={phone} onChangeText={setPhone} />

          <PrimaryButton
            title="Send Code"
            onPress={handleSendCode}
            loading={loading}
            disabled={!isValid}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate('Login')}
            >
              Log In
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  title: {
    fontSize: 28,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: { fontSize: 14, color: colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: colors.brandGreen },
});
