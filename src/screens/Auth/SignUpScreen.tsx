import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';

import { useDispatch } from 'react-redux';
import { registerUser, sendOtp } from '../../redux/slices/auth/authSlice';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const loading = useSelector((state: any) => state.auth.loading.register);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const isValidPhone = (phone: string) => {
    const trimmed = phone.trim();
    // Accepts 07XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX
    return /^(0\d{9}|(\+?254)\d{9})$/.test(trimmed);
  };

  const handleSubmit = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing info',
        text2: 'Please enter your first and last name',
      });
      return;
    }

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    if (!isValidPhone(form.phone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid phone number',
        text2: 'Enter a valid number, e.g. 07XXXXXXXX',
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    try {
      const res = await dispatch(registerUser(form));

      if (res.meta.requestStatus === 'fulfilled') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created! OTP sent to your phone',
        });

        navigation.navigate('OTP');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: res.payload || 'Something went wrong',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unexpected error occurred',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled"
          >
            {/* TITLE */}
            <Text style={styles.title}>Create your {'\n'} account</Text>

            {/* FORM */}
            <View style={styles.form}>
              <TextInput
                placeholder="First name"
                placeholderTextColor="#0d2b1f"
                style={styles.input}
                value={form.firstName}
                onChangeText={v => handleChange('firstName', v)}
              />

              <TextInput
                placeholder="Last name"
                placeholderTextColor="#0d2b1f"
                style={styles.input}
                value={form.lastName}
                onChangeText={v => handleChange('lastName', v)}
              />

              <TextInput
                placeholder="Email address"
                placeholderTextColor="#0d2b1f"
                style={styles.input}
                keyboardType="email-address"
                value={form.email}
                onChangeText={v => handleChange('email', v)}
              />

              <TextInput
                placeholder="Phone number"
                placeholderTextColor="#0d2b1f"
                style={styles.input}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={v => handleChange('phone', v)}
              />

              {/* PASSWORD */}
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#0d2b1f"
                  style={styles.passwordInput}
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={v => handleChange('password', v)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="Confirm password"
                  placeholderTextColor="#0d2b1f"
                  style={styles.passwordInput}
                  secureTextEntry={!showConfirmPassword}
                  value={form.confirmPassword}
                  onChangeText={v => handleChange('confirmPassword', v)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* LOGIN */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f6',
    paddingTop: 5,
  },

  inner: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },

  step: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 10,
  },

  title: {
    fontSize: 35,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 30,
  },

  form: {
    gap: 20,
  },

  input: {
    backgroundColor: '#eaeceb',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#333333',

    /* iOS shadow */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    /* Android shadow */
    elevation: 2,
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeceb',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 5,

    /* iOS shadow */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    /* Android shadow */
    elevation: 2,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111827',
  },

  button: {
    marginTop: 30,
    backgroundColor: '#0d2b1f',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  loginText: {
    color: '#6b7280',
  },

  loginLink: {
    color: '#111827',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
