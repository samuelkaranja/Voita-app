import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Navigation, CalendarDays } from 'lucide-react-native';

interface CarWashDetailBottomBarProps {
  onDirections: () => void;
  onBookService: () => void;
}

export const CarWashDetailBottomBar: React.FC<CarWashDetailBottomBarProps> = ({
  onDirections,
  onBookService,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.directionsBtn}
        onPress={onDirections}
        activeOpacity={0.8}
      >
        <Navigation size={17} color="#374151" strokeWidth={2} />
        <Text style={styles.directionsText}>Directions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={onBookService}
        activeOpacity={0.85}
      >
        <CalendarDays size={17} color="#FFFFFF" strokeWidth={2} />
        <Text style={styles.bookText}>Book Service</Text>
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
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 13,
  },
  directionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  bookBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 13,
  },
  bookText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
