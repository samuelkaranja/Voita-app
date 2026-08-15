import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { CheckCircle2, MailWarning } from 'lucide-react-native';

interface Props {
  email: string;
  verified: boolean;
  sending: boolean;
  onVerify: () => void;
}

export const EmailVerificationBanner: React.FC<Props> = ({
  email,
  verified,
  sending,
  onVerify,
}) => {
  if (!email) return null;

  if (verified) {
    return (
      <View style={[styles.banner, styles.verified]}>
        <CheckCircle2 size={16} color="#059669" />
        <Text style={styles.verifiedText}>Email verified</Text>
      </View>
    );
  }

  return (
    <View style={[styles.banner, styles.unverified]}>
      <MailWarning size={16} color="#B45309" />
      <Text style={styles.unverifiedText}>Email not verified</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onVerify}
        disabled={sending}
        activeOpacity={0.7}
      >
        {sending ? (
          <ActivityIndicator size="small" color="#111827" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  verified: { backgroundColor: '#ECFDF5' },
  unverified: { backgroundColor: '#FFFBEB' },
  verifiedText: { color: '#059669', fontSize: 13, fontWeight: '600' },
  unverifiedText: {
    color: '#B45309',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  button: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
