import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
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
import Ionicons from 'react-native-vector-icons/Ionicons';

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
            {/* LOGO */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/VoitaLogo.png')}
                style={styles.logo}
              />
              <Text style={styles.tagline}>Smart Automotive Platform</Text>
            </View>

            {/* HEADER */}
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Join the smart automotive platform
            </Text>

            {/* FORM */}
            <View style={styles.form}>
              {/* FIRST & LAST NAME */}
              <View style={styles.row}>
                <View style={[styles.fieldHalf, styles.fieldLeft]}>
                  <Text style={styles.label}>First Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={18} color="#0d2b1f" />
                    <TextInput
                      placeholder="John"
                      style={styles.input}
                      value={form.firstName}
                      onChangeText={v => handleChange('firstName', v)}
                    />
                  </View>
                </View>

                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>Last Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={18} color="#0d2b1f" />
                    <TextInput
                      placeholder="Doe"
                      style={styles.input}
                      value={form.lastName}
                      onChangeText={v => handleChange('lastName', v)}
                    />
                  </View>
                </View>
              </View>

              {/* EMAIL */}
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#0d2b1f" />
                  <TextInput
                    placeholder="your.email@example.com"
                    style={styles.input}
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={v => handleChange('email', v)}
                  />
                </View>
              </View>

              {/* PHONE */}
              <View style={styles.field}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={18} color="#0d2b1f" />
                  <TextInput
                    placeholder="0700000000"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={v => handleChange('phone', v)}
                  />
                </View>
              </View>

              {/* PASSWORD */}
              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#0d2b1f"
                  />
                  <TextInput
                    placeholder="Create a strong password"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={v => handleChange('password', v)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
		   <Ionicons
		    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
		    size={18}
		    color="#0d2b1f"
		   />
		  </TouchableOpacity>
                </View>
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#0d2b1f"
                  />
                  <TextInput
                    placeholder="Confirm your password"
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    value={form.confirmPassword}
                    onChangeText={v => handleChange('confirmPassword', v)}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)}>
		   <Ionicons
		    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
		    size={18}
		    color="#0d2b1f"
		   />
		 </TouchableOpacity>
                </View>
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
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7f6' },

  inner: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },

  logo: {
    width: 100,
    height: 70,
  },

  tagline: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 5,
  },

  subtitle: {
    fontSize: 14,
    color: '#8a8f98',
    marginBottom: 20,
  },

  form: {
    marginTop: 5,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  field: {
    marginBottom: 14,
  },

  fieldHalf: {
    flex: 1,
  },

  fieldLeft: {
    marginRight: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef1f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: '#0d2b1f',
  },

  button: {
    marginTop: 20,
    backgroundColor: '#0d2b1f',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
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
    color: '#0d2b1f',
    fontWeight: '700',
  },
});
