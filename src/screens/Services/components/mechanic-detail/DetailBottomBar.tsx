import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Phone, MessageCircle, CalendarDays } from 'lucide-react-native';

interface DetailBottomBarProps {
  onCall: () => void;
  onMessage: () => void;
  onBookAppointment: () => void;
}

export const DetailBottomBar: React.FC<DetailBottomBarProps> = ({
  onCall,
  onMessage,
  onBookAppointment,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onCall}
        activeOpacity={0.75}
      >
        <Phone size={20} color="#374151" strokeWidth={2} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onMessage}
        activeOpacity={0.75}
      >
        <MessageCircle size={20} color="#374151" strokeWidth={2} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={onBookAppointment}
        activeOpacity={0.85}
      >
        <Text style={styles.bookText}>Book Appointment</Text>
        <CalendarDays size={17} color="#FFFFFF" strokeWidth={2} />
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
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
  },
  bookText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
