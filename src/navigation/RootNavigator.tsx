import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import SplashScreen from '../screens/Splash/SplashScreen';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useNotificationListeners } from '../hooks/useNotificationListeners';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, loading } = useSelector((state: any) => state.auth);

  usePushNotifications();
  useNotificationListeners();

  // Show splash while checking auth
  if (loading.init) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
