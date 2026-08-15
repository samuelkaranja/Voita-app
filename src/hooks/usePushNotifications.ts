import { useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerFCMToken } from '../redux/slices/notifications/notificationsSlice';
import Toast from 'react-native-toast-message';

const requestAndroidNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    // Pre-Android 13 doesn't have this runtime permission — treat as granted
    return true;
  }

  const alreadyGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (alreadyGranted) return true;

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  console.log('🟡 [usePushNotifications] POST_NOTIFICATIONS result:', result);
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const usePushNotifications = () => {
  const dispatch = useAppDispatch();
  const authToken = useAppSelector((state: any) => state.auth.token);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!authToken || hasInitialized.current) return;
    hasInitialized.current = true;

    const setup = async () => {
      try {
        const androidPermissionGranted =
          await requestAndroidNotificationPermission();
        if (!androidPermissionGranted) {
          console.log(
            '🔴 [usePushNotifications] Android POST_NOTIFICATIONS denied',
          );
          return;
        }

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('🔴 [usePushNotifications] Permission denied');
          return;
        }

        const fcmToken = await messaging().getToken();
        //console.log('🟢 [usePushNotifications] FCM token:', fcmToken);

        if (fcmToken) {
          console.log('🟣 ABOUT TO DISPATCH registerFCMToken');
          dispatch(
            registerFCMToken({
              fcm_token: fcmToken,
              platform: Platform.OS as 'ios' | 'android',
            }),
          );
        }

        if (fcmToken) {
          dispatch(
            registerFCMToken({
              fcm_token: fcmToken,
              platform: Platform.OS as 'ios' | 'android',
            }),
          )
            .unwrap()
            .then(() => {
              if (__DEV__) {
                Toast.show({
                  type: 'success',
                  text1: 'Push notifications enabled',
                });
              }
            });
        }
      } catch (err) {
        console.log('🔴 [usePushNotifications] Setup error:', err);
      }
    };

    setup();

    // FCM tokens can rotate — re-register on refresh, otherwise the backend
    // keeps sending to a dead token and notifications silently stop arriving
    const unsubscribeRefresh = messaging().onTokenRefresh(newToken => {
      console.log('🔵 [usePushNotifications] Token refreshed:', newToken);
      dispatch(
        registerFCMToken({
          fcm_token: newToken,
          platform: Platform.OS as 'ios' | 'android',
        }),
      );
    });

    return () => unsubscribeRefresh();
  }, [authToken, dispatch]);
};
