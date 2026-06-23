import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { CalendarDays, CircleCheckBig } from 'lucide-react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface MaintenanceDates {
  insuranceExpiry: Date | null;
  licenseExpiry: Date | null;
  lastServiceDate: Date | null;
  nextTireRotation: Date | null;
}

interface Props {
  dates: MaintenanceDates;
  onChange: (field: keyof MaintenanceDates, date: Date) => void;
}

interface DateFieldProps {
  label: string;
  date: Date | null;
  onPress: () => void;
}

const DateField: React.FC<DateFieldProps> = ({ label, date, onPress }) => {
  const formatted = date
    ? date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    : null;

  return (
    <View style={dateStyles.wrapper}>
      <Text style={dateStyles.label}>{label}</Text>
      <TouchableOpacity
        style={dateStyles.field}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={formatted ? dateStyles.dateText : dateStyles.placeholder}>
          {formatted ?? 'mm/dd/yyyy'}
        </Text>
        <CalendarDays size={16} color="#9CA3AF" strokeWidth={1.8} />
      </TouchableOpacity>
    </View>
  );
};

const dateStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  field: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 15,
    color: '#111827',
  },
  placeholder: {
    fontSize: 15,
    color: '#9CA3AF',
  },
});

export const AddMaintenanceSection: React.FC<Props> = ({ dates, onChange }) => {
  const [activePicker, setActivePicker] = useState<
    keyof MaintenanceDates | null
  >(null);

  const activeDate =
    activePicker && dates[activePicker]
      ? (dates[activePicker] as Date)
      : new Date();

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setActivePicker(null);
    if (selected && activePicker) onChange(activePicker, selected);
  };

  const fields: { key: keyof MaintenanceDates; label: string }[] = [
    { key: 'insuranceExpiry', label: 'Insurance Expiry' },
    { key: 'licenseExpiry', label: 'License Expiry' },
    { key: 'lastServiceDate', label: 'Last Service Date' },
    { key: 'nextTireRotation', label: 'Next Tire Rotation' },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <CalendarDays size={18} color="#111827" strokeWidth={2} />
          <Text style={styles.sectionTitle}>Maintenance & Renewals</Text>
        </View>
        <View style={styles.badge}>
          <CircleCheckBig size={13} color="#16A34A" strokeWidth={2.5} />
          <Text style={styles.badgeText}>SAFETY FIRST</Text>
        </View>
      </View>

      {/* Date fields — driven by array to keep it DRY */}
      {fields.map(field => (
        <DateField
          key={field.key}
          label={field.label}
          date={dates[field.key]}
          onPress={() => setActivePicker(field.key)}
        />
      ))}

      {/* Single shared picker */}
      {activePicker && (
        <DateTimePicker
          value={activeDate}
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
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
});
