import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Shield,
  IdCard,
  UserRoundCog,
  CalendarClock,
} from 'lucide-react-native';
import { MaintenanceDateCard } from './MaintenanceDateCard';

interface MaintenanceDates {
  insuranceExpiry: Date;
  licenseExpiry: Date;
  serviceDue: Date;
  nextRotation: Date;
}

interface Props {
  dates: MaintenanceDates;
  onChange: (field: keyof MaintenanceDates, date: Date) => void;
}

export const MaintenanceSection: React.FC<Props> = ({ dates, onChange }) => {
  return (
    <View>
      <Text style={styles.sectionHeader}>Maintenance & Renewals</Text>

      <MaintenanceDateCard
        icon={<Shield size={18} color="#374151" strokeWidth={2} />}
        label="INSURANCE EXPIRY"
        date={dates.insuranceExpiry}
        onDateChange={d => onChange('insuranceExpiry', d)}
        actionLabel="RENEW"
        actionVariant="renew"
      />

      <MaintenanceDateCard
        icon={<IdCard size={18} color="#374151" strokeWidth={2} />}
        label="LICENSE EXPIRY"
        date={dates.licenseExpiry}
        onDateChange={d => onChange('licenseExpiry', d)}
        actionLabel="RENEW"
        actionVariant="renew"
      />

      <MaintenanceDateCard
        icon={<UserRoundCog size={18} color="#DC2626" strokeWidth={2} />}
        label="SERVICE DUE"
        date={dates.serviceDue}
        onDateChange={d => onChange('serviceDue', d)}
        actionLabel="BOOK NOW"
        actionVariant="book"
        isAlert
      />

      <MaintenanceDateCard
        icon={<CalendarClock size={18} color="#374151" strokeWidth={2} />}
        label="NEXT ROTATION"
        date={dates.nextRotation}
        onDateChange={d => onChange('nextRotation', d)}
        actionLabel="SCHEDULE"
        actionVariant="schedule"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
});
