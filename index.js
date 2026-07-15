/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Must be registered at the top level, before the app mounts
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🔵 [BackgroundHandler] Notification received:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
