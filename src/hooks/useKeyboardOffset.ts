import { useEffect } from 'react';
import { Keyboard, Platform, KeyboardEvent } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

export function useKeyboardOffset() {
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, {
        duration: 220,
      });
    };
    const onHide = () => {
      keyboardHeight.value = withTiming(0, { duration: 220 });
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return keyboardHeight;
}
