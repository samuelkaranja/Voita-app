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

// ✅ Lucide Icons
import { Phone, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

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
                resizeMode="contain"
              />
              <Text style={styles.tagline}>Smart Automotive Platform</Text>
            </View>

            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in and continue to enjoy Voita
              </Text>
            </View>

            {/* PHONE INPUT */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number</Text>

              <View style={styles.inputContainer}>
                <Phone size={20} color="#0d2b1f" strokeWidth={2} />

                <TextInput
                  placeholder="+254 700 000000"
                  placeholderTextColor="#0d2b1f"
                  value={phone}
                  onChangeText={setPhone}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#0d2b1f" strokeWidth={2} />

                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#0d2b1f"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secure}
                  style={styles.input}
                />

                <TouchableOpacity onPress={() => setSecure(!secure)}>
                  {secure ? (
                    <Eye size={20} color="#0d2b1f" strokeWidth={2} />
                  ) : (
                    <EyeOff size={20} color="#0d2b1f" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* FORGOT PASSWORD */}
            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* LOGIN BUTTON */}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* SIGN UP */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account?</Text>

              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* TEMP NAV */}
            <TouchableOpacity onPress={() => navigation.navigate('App')}>
              <Text style={styles.signupLink}> HomePage</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f5',
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },

  /* LOGO */
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  tagline: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },

  /* HEADER */
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 6,
  },

  /* INPUTS */
  inputWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef1ef',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#111',
  },

  /* FORGOT */
  forgot: {
    textAlign: 'right',
    color: '#0d2b1f',
    fontWeight: '600',
    marginBottom: 25,
  },

  /* BUTTON */
  button: {
    backgroundColor: '#0d2b1f',
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* SIGNUP */
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#6b7280',
  },
  signupLink: {
    color: '#0d2b1f',
    fontWeight: '700',
  },
});
