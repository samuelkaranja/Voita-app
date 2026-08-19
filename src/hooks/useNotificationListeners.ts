import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../redux/hooks';
import {
  fetchCommunityRooms,
  markRoomJoined,
} from '../redux/slices/community/communitySlice';
import { addReceivedAlert } from '../redux/slices/notifications/notificationsSlice';

export const useNotificationListeners = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handleNotificationNavigation = (data: any) => {
    if (data?.type === 'chat_join_approved' && data?.roomId) {
      dispatch(markRoomJoined(data.roomId));
      dispatch(fetchCommunityRooms()); // pulls the room into brandRooms/generalRooms with full data
    }

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

  // Admin-sent alerts are tagged data.type === 'system' by the backend.
  // Captured into notificationsSlice.receivedAlerts so HomeScreen's Live
  // Alerts panel can display them alongside flood/congestion/camera alerts.
  const handleAlertCapture = (remoteMessage: any) => {
    const data = remoteMessage?.data ?? {};
    if (data?.type !== 'system') return;

    const title = remoteMessage?.notification?.title;
    const body = remoteMessage?.notification?.body;
    if (!title && !body) return;

    dispatch(
      addReceivedAlert({
        id: data.alert_id ?? remoteMessage?.messageId ?? `${Date.now()}`,
        title: title ?? 'Alert',
        subtitle: body ?? '',
        receivedAt: Date.now(),
      }),
    );
  };

  useEffect(() => {
    // Foreground: app is open, show an in-app toast
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log(
        '🟢 [useNotificationListeners] Foreground notification:',
        remoteMessage,
      );
      handleAlertCapture(remoteMessage);
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
        handleAlertCapture(remoteMessage);
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
          handleAlertCapture(remoteMessage);
          handleNotificationNavigation(remoteMessage.data);
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);
};
