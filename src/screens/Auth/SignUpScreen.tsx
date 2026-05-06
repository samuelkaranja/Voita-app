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
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';

export default function SignUpScreen() {
  const navigation = useNavigation<any>();

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
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create Account</Text>
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
    paddingTop: 10,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#333333',
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeceb',
    borderRadius: 16,
    paddingHorizontal: 18,
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
  },
});
