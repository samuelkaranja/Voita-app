import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, sendOtp } from '../../redux/slices/auth/authSlice';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const verifyLoading = useSelector(
    (state: any) => state.auth.loading.verifyOtp,
  );

  const resendLoading = useSelector((state: any) => state.auth.loading.sendOtp);

  const inputs = useRef<Array<TextInput | null>>([]);

  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const phone = useSelector((state: any) => state.auth.phone);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');

    const res = await dispatch(verifyOtp({ phone, otp: code }));

    if (res.meta.requestStatus === 'fulfilled') {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Phone verified successfully',
      });

      navigation.navigate('Login');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: res.payload || 'Something went wrong',
      });
    }
  };

  const handleResend = () => {
    dispatch(sendOtp(phone));

    Toast.show({
      type: 'info',
      text1: 'OTP Sent',
      text2: 'A new code has been sent to your phone',
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Enter your OTP</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            We sent you a code to verify your number
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  inputs.current[index] = ref;
                }}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleBackspace(digit, index);
                  }
                }}
              />
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.button, verifyLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={verifyLoading}
          >
            {verifyLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
            {resendLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.resendText}>Resend OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  input: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#eef1ef',
    color: '#000',
    textAlign: 'center',
    fontSize: 20,

    /* iOS shadow */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    /* Android shadow */
    elevation: 2,
  },
  button: {
    width: '90%',
    backgroundColor: '#0d2b1f',
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resendText: {
    color: '#333',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
