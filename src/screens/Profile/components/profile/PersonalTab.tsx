import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Phone, Pencil } from 'lucide-react-native';
import { InfoCard } from './InfoCard';
import { SectionHeader } from './SectionHeader';
import { EmergencyContactCard } from './EmergencyContactCard';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

interface Props {
  personalInfo: PersonalInfo;
  emergencyContacts: EmergencyContact[];
  onEditPress: () => void;
}

export const PersonalTab: React.FC<Props> = ({
  personalInfo,
  emergencyContacts,
  onEditPress,
}) => {
  const contactFields = [
    { label: 'First Name', value: personalInfo.firstName, maskable: true },
    { label: 'Last Name', value: personalInfo.lastName, maskable: true },
    { label: 'Phone Number', value: personalInfo.phone, maskable: true },
    { label: 'Email Address', value: personalInfo.email, maskable: true },
    { label: 'Gender', value: personalInfo.gender, maskable: true },
  ];

  return (
    <View>
      <SectionHeader title="Contact Details" />
      <InfoCard fields={contactFields} />

      <SectionHeader title="Emergency Contacts" />

      {emergencyContacts.length > 0 ? (
        emergencyContacts.map(contact => (
          <EmergencyContactCard
            key={contact.id}
            contact={contact}
            onEditPress={() => {}}
          />
        ))
      ) : (
        <View style={styles.emptyContactCard}>
          <View style={styles.emptyIconWrapper}>
            <Phone size={20} color="#9CA3AF" strokeWidth={1.8} />
          </View>
          <View style={styles.emptyInfo}>
            <Text style={styles.emptyTitle}>No emergency contact added</Text>
            <Text style={styles.emptySubtitle}>
              Add one in Edit Personal Details
            </Text>
          </View>
        </View>
      )}

      <View style={styles.editFooter}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.85}
        >
          <Pencil size={16} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.editButtonText}>Edit Personal Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emptyInfo: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 3,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  editFooter: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 80,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
  },
  editButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
