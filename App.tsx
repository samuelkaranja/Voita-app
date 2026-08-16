import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store.ts';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import RootNavigator from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { loadStoredAuth } from './src/redux/slices/auth/authSlice';
import type { AppDispatch } from './src/redux/store';
import { toastConfig } from './toastConfig.tsx';

enableScreens();

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadStoredAuth());
  }, [dispatch]);

  return <RootNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <BottomSheetModalProvider>
            <AppContent />
            <Toast config={toastConfig} position="top" visibilityTime={6000} />
          </BottomSheetModalProvider>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}
