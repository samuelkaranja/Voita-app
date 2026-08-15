import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IntroScreen from '../screens/Auth/IntroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import { ForgotPasswordScreen } from '../screens/Auth/ForgotPasswordScreen';
import { EnterVerificationScreen } from '../screens/Auth/EnterVerificationScreen';
import { CreateNewPasswordScreen } from '../screens/Auth/CreateNewPasswordScreen';

export type AuthStackParamList = {
  Intro: undefined;
  Login: undefined;
  SignUp: undefined;
  OTP: undefined;
  ForgotPassword: undefined;
  EnterVerificationCode: { phone: string };
  CreateNewPassword: { phone: string; resetToken: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
const INTRO_SEEN_KEY = 'voita_has_seen_intro';

export default function AuthStack() {
  const [initialRoute, setInitialRoute] = useState<'Intro' | 'Login' | null>(
    null,
  );

  useEffect(() => {
    AsyncStorage.getItem(INTRO_SEEN_KEY)
      .then(value => setInitialRoute(value === 'true' ? 'Login' : 'Intro'))
      .catch(() => setInitialRoute('Login'));
  }, []);

  if (initialRoute === null) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator color="#0D2B1F" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTP" component={OtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="EnterVerificationCode"
        component={EnterVerificationScreen}
      />
      <Stack.Screen
        name="CreateNewPassword"
        component={CreateNewPasswordScreen}
      />
    </Stack.Navigator>
  );
}
