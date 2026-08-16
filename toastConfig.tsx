import { BaseToast } from 'react-native-toast-message';

export const toastConfig = {
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#00A86B' }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1NumberOfLines={2}
      text2NumberOfLines={0}
    />
  ),
};
