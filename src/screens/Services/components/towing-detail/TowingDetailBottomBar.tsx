import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MessageCircle, Phone, Share2 } from 'lucide-react-native';

interface TowingDetailBottomBarProps {
  onMessage: () => void;
  onCall: () => void;
  onShare: () => void;
}

export const TowingDetailBottomBar: React.FC<TowingDetailBottomBarProps> = ({
  onMessage,
  onCall,
  onShare,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onMessage}
        activeOpacity={0.75}
      >
        <MessageCircle size={20} color="#374151" strokeWidth={2} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.callButton}
        onPress={onCall}
        activeOpacity={0.85}
      >
        <Phone size={18} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
        <Text style={styles.callText}>Call Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onShare}
        activeOpacity={0.75}
      >
        <Share2 size={20} color="#374151" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
  },
  callText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
