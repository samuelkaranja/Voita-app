import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const TOWING_TYPES = ['Flatbed', 'Roadside', 'Heavy Duty'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    phone: string;
    location: string;
    vehicleType: string;
    reason: string;
  }) => Promise<void>;
}

export const SuggestTowingModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [vehicleType, setVehicleType] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    name.trim() &&
    phone.trim() &&
    location.trim() &&
    vehicleType &&
    reason.trim();

  const resetForm = () => {
    setName('');
    setPhone('');
    setLocation('');
    setVehicleType(null);
    setReason('');
  };

  const handleSubmit = async () => {
    if (!isValid || !vehicleType) return;
    try {
      setSubmitting(true);
      await onSubmit({ name, phone, location, vehicleType, reason });
      Toast.show({
        type: 'success',
        text1: 'Thanks for the suggestion!',
        text2: "We'll review it before adding them to the list.",
      });
      resetForm();
      onClose();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Could not submit',
        text2: typeof err === 'string' ? err : 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Suggest a Towing Provider</Text>
              <Text style={styles.subtitle}>
                Know a reliable towing provider we're missing? Let us know and
                we'll review it.
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <X size={22} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
          >
            <Text style={styles.label}>Provider Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Rapid Tow Kenya"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="07XX XXX XXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Juja, Kiambu"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.chipRow}>
              {TOWING_TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setVehicleType(t)}
                  style={[styles.chip, vehicleType === t && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      vehicleType === t && styles.chipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Why should we add them?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={reason}
              onChangeText={setReason}
              placeholder="Tell us what makes them worth recommending..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                !isValid && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isValid || submitting}
              activeOpacity={0.85}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Suggestion</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  headerText: { flex: 1, flexShrink: 1, minWidth: 0, marginRight: 12 },
  title: { fontSize: 17, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6B7280', marginTop: 4, lineHeight: 17 },
  form: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  chipTextActive: { color: '#FFFFFF' },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: { backgroundColor: '#D1D5DB' },
  submitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
