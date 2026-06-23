import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, CircleCheckBig } from 'lucide-react-native';
import { FormField } from './FormField';

interface EmergencyContactForm {
  name: string;
  relationship: string;
  phone: string;
}

interface Props {
  form: EmergencyContactForm;
  onChange: (field: keyof EmergencyContactForm, value: string) => void;
}

export const EmergencyContactSection: React.FC<Props> = ({
  form,
  onChange,
}) => {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <ShieldCheck size={18} color="#111827" strokeWidth={2} />
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        </View>
        <View style={styles.badge}>
          <CircleCheckBig size={13} color="#16A34A" strokeWidth={2.5} />
          <Text style={styles.badgeText}>Safety Enabled</Text>
        </View>
      </View>

      <Text style={styles.description}>
        These contacts will be notified in case of an emergency during your
        trips.
        {'\n'}Fill in all three fields to save a contact.
      </Text>

      {/* Inner contact fields box */}
      <View style={styles.contactBox}>
        <FormField
          label="Contact Name"
          value={form.name}
          onChangeText={v => onChange('name', v)}
          autoCapitalize="words"
        />
        <FormField
          label="Relationship"
          value={form.relationship}
          onChangeText={v => onChange('relationship', v)}
          autoCapitalize="words"
        />
        <FormField
          label="Phone Number"
          value={form.phone}
          onChangeText={v => onChange('phone', v)}
          keyboardType="phone-pad"
        />
      </View>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
    lineHeight: 15,
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
    marginBottom: 14,
  },
  contactBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
  },
});
