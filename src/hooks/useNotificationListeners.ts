import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export const useNotificationListeners = () => {
  const navigation = useNavigation<any>();

  const handleNotificationNavigation = (data: any) => {
    if (data?.screen) {
      try {
        const params = data.params ? JSON.parse(data.params) : undefined;
        navigation.navigate(data.screen, params);
      } catch (err) {
        console.log(
          '🔴 [useNotificationListeners] Navigation parse error:',
          err,
        );
      }
    }
  };

  useEffect(() => {
    // Foreground: app is open, show an in-app toast
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log(
        '🟢 [useNotificationListeners] Foreground notification:',
        remoteMessage,
      );
      Toast.show({
        type: 'info',
        text1: remoteMessage.notification?.title ?? 'Notification',
        text2: remoteMessage.notification?.body,
        onPress: () => handleNotificationNavigation(remoteMessage.data),
      });
    });

    // App was backgrounded, user tapped the notification to open it
    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          '🔵 [useNotificationListeners] Opened from background:',
          remoteMessage,
        );
        handleNotificationNavigation(remoteMessage.data);
      },
    );

    // App was fully killed, user tapped the notification to launch it
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '🔵 [useNotificationListeners] Opened from quit state:',
            remoteMessage,
          );
          handleNotificationNavigation(remoteMessage.data);
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);
};
