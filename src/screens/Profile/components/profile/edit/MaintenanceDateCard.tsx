import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

type ActionVariant = 'renew' | 'book' | 'schedule';

interface Props {
  icon: React.ReactNode;
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  actionLabel?: string;
  actionVariant?: ActionVariant;
  onActionPress?: () => void;
  isAlert?: boolean;
}

const ACTION_COLORS: Record<ActionVariant, string> = {
  renew: '#16A34A',
  book: '#16A34A',
  schedule: '#16A34A',
};

export const MaintenanceDateCard: React.FC<Props> = ({
  icon,
  label,
  date,
  onDateChange,
  actionLabel,
  actionVariant = 'renew',
  onActionPress,
  isAlert = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    // On Android the picker closes itself; on iOS it stays open
    if (Platform.OS === 'android') setShowPicker(false);
    if (selected) onDateChange(selected);
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  const actionColor = ACTION_COLORS[actionVariant];

  return (
    <View style={[styles.card, isAlert && styles.cardAlert]}>
      {/* Icon + label on the same row */}
      <View style={styles.iconBlock}>
        <View style={[styles.iconWrapper, isAlert && styles.iconWrapperAlert]}>
          {icon}
        </View>
        <Text style={[styles.label, isAlert && styles.labelAlert]}>
          {label}
        </Text>
      </View>

      {/* Date field below */}
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[styles.dateField, isAlert && styles.dateFieldAlert]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dateText, isAlert && styles.dateTextAlert]}>
            {formattedDate}
          </Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardAlert: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FFF9F9',
  },
  iconBlock: {
    flexDirection: 'row', // ← was column, now row
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    width: '100%',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperAlert: {
    backgroundColor: '#FEE2E2',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  labelAlert: {
    color: '#DC2626',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  dateField: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  dateFieldAlert: {
    borderColor: '#FECACA',
    backgroundColor: '#FFF5F5',
  },
  dateText: {
    fontSize: 14,
    color: '#374151',
  },
  dateTextAlert: {
    color: '#DC2626',
  },
  calendarIcon: {
    fontSize: 14,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
