import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserRoundPen } from 'lucide-react-native';
import { FormField } from './FormField';
import { GenderPicker } from './GenderPicker';

interface PersonalForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
}

interface Props {
  form: PersonalForm;
  onChange: (field: keyof PersonalForm, value: string) => void;
}

export const PersonalDetailsSection: React.FC<Props> = ({ form, onChange }) => {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <UserRoundPen size={18} color="#111827" strokeWidth={2} />
        <Text style={styles.sectionTitle}>Personal Details</Text>
      </View>

      <FormField
        label="First Name"
        value={form.firstName}
        onChangeText={v => onChange('firstName', v)}
        autoCapitalize="words"
      />
      <FormField
        label="Last Name"
        value={form.lastName}
        onChangeText={v => onChange('lastName', v)}
        autoCapitalize="words"
      />
      <FormField
        label="Phone Number"
        value={form.phone}
        onChangeText={v => onChange('phone', v)}
        keyboardType="phone-pad"
      />
      <FormField
        label="Email Address"
        value={form.email}
        onChangeText={v => onChange('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <GenderPicker value={form.gender} onChange={v => onChange('gender', v)} />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});
