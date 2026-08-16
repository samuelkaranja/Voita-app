import { useEffect } from 'react';
import { Keyboard, Platform, KeyboardEvent } from 'react-native';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useKeyboardOffset() {
  const keyboardHeight = useSharedValue(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Android: the activity uses android:windowSoftInputMode="adjustResize",
    // so the OS shrinks the window and lifts the whole layout (map, tab bar,
    // and this card) on its own. Adding an offset here would double it.
    if (Platform.OS !== 'ios') return;

    const animate = (to: number, duration?: number) => {
      keyboardHeight.value = withTiming(to, {
        duration: duration || 250,
        easing: Easing.out(Easing.ease),
      });
    };

    // iOS never resizes the window, so we compensate for the real overlap.
    // bottomOffset already reserves the safe area, so don't count it twice.
    const onShow = (e: KeyboardEvent) =>
      animate(Math.max(0, e.endCoordinates.height - insets.bottom), e.duration);

    const onHide = (e: KeyboardEvent) => animate(0, e?.duration);

    const subs = [
      Keyboard.addListener('keyboardWillShow', onShow),
      // fires when the keyboard height changes (autocomplete bar, emoji panel)
      Keyboard.addListener('keyboardWillChangeFrame', onShow),
      Keyboard.addListener('keyboardWillHide', onHide),
    ];

    return () => subs.forEach(s => s.remove());
  }, [insets.bottom]);

  return keyboardHeight;
}
