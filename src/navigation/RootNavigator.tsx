import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/Splash/SplashScreen';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      {/* Splash Screen */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Auth Flow */}
      <Stack.Screen name="Auth" component={AuthStack} />

      {/* Main App */}
      <Stack.Screen name="App" component={AppTabs} />
    </Stack.Navigator>
  );
}
