import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Phone, MoreVertical } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { deleteEmergencyContact } from '../../../../redux/slices/profile/profileSlice';
import Toast from 'react-native-toast-message';

// Updated interface — id is now required
interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

interface Props {
  contact: EmergencyContact;
  onEditPress?: () => void;
}

export const EmergencyContactCard: React.FC<Props> = ({
  contact,
  onEditPress,
}) => {
  const dispatch = useDispatch<any>();

  const handleOptions = () => {
    Alert.alert(contact.name, 'What would you like to do?', [
      {
        text: 'Edit',
        onPress: () => onEditPress?.(),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const res = await dispatch(deleteEmergencyContact(contact.id));
          if (res.meta.requestStatus === 'fulfilled') {
            Toast.show({ type: 'success', text1: 'Contact removed' });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to remove contact',
            });
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Phone size={20} color="#10B981" strokeWidth={2} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.sub}>
          {contact.relationship} • {contact.phone}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleOptions}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MoreVertical size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },
  sub: {
    fontSize: 12,
    color: '#6B7280',
  },
});
