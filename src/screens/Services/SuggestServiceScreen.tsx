import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Wrench, Droplets, Truck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { ServicesStackParamList } from '../../navigation/ServicesStack';
import { useAppDispatch } from '../../redux/hooks';
import { suggestMechanic } from '../../redux/slices/services/mechanicsSlice';
import { suggestCarWash } from '../../redux/slices/services/carWashSlice';
import { suggestTowing } from '../../redux/slices/services/towingSlice';

type NavProp = NativeStackNavigationProp<
  ServicesStackParamList,
  'SuggestService'
>;

type Category = 'mechanic' | 'carwash' | 'towing';

const CATEGORY_OPTIONS: {
  id: Category;
  label: string;
  Icon: typeof Wrench;
  typeLabel: string;
  typeOptions: string[];
  nameLabel: string;
  namePlaceholder: string;
}[] = [
  {
    id: 'mechanic',
    label: 'Mechanic',
    Icon: Wrench,
    typeLabel: 'Specialty',
    typeOptions: ['Engine', 'Electrical', 'Bodywork', 'Transmission'],
    nameLabel: 'Mechanic / Garage Name',
    namePlaceholder: 'e.g. David\u2019s Auto Garage',
  },
  {
    id: 'carwash',
    label: 'Car Wash',
    Icon: Droplets,
    typeLabel: 'Service Type',
    typeOptions: ['Interior', 'Exterior', 'Full Detail'],
    nameLabel: 'Car Wash / Center Name',
    namePlaceholder: 'e.g. Speed Wash Pro',
  },
  {
    id: 'towing',
    label: 'Towing',
    Icon: Truck,
    typeLabel: 'Vehicle Type',
    typeOptions: ['Flatbed', 'Roadside', 'Heavy Duty'],
    nameLabel: 'Provider Name',
    namePlaceholder: 'e.g. Rapid Tow Kenya',
  },
];

export default function SuggestServiceScreen() {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const scrollEnabled = contentHeight > containerHeight;

  const selectedCategory = CATEGORY_OPTIONS.find(c => c.id === category);

  const isValid =
    category &&
    name.trim() &&
    phone.trim() &&
    location.trim() &&
    type &&
    reason.trim();

  const resetForm = () => {
    setName('');
    setPhone('');
    setLocation('');
    setType(null);
    setReason('');
  };

  const handleCategoryChange = (id: Category) => {
    setCategory(id);
    setType(null); // type options differ per category, so clear the previous selection
  };

  const handleSubmit = async () => {
    if (!isValid || !category || !type) return;

    try {
      setSubmitting(true);

      if (category === 'mechanic') {
        await dispatch(
          suggestMechanic({ name, phone, location, specialty: type, reason }),
        ).unwrap();
      } else if (category === 'carwash') {
        await dispatch(
          suggestCarWash({ name, phone, location, serviceType: type, reason }),
        ).unwrap();
      } else {
        await dispatch(
          suggestTowing({ name, phone, location, vehicleType: type, reason }),
        ).unwrap();
      }

      Toast.show({
        type: 'success',
        text1: 'Thanks for the suggestion!',
        text2: "We'll review it before adding them to the list.",
      });
      resetForm();
      navigation.goBack();
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={10}
        >
          <ChevronLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suggest a Service</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={scrollEnabled}
        bounces={scrollEnabled}
        onLayout={e => setContainerHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(w, h) => setContentHeight(h)}
      >
        <Text style={styles.label}>What kind of service?</Text>
        <View style={styles.categoryRow}>
          {CATEGORY_OPTIONS.map(opt => {
            const isSelected = category === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleCategoryChange(opt.id)}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardActive,
                ]}
                activeOpacity={0.85}
              >
                <opt.Icon
                  size={22}
                  color={isSelected ? '#FFFFFF' : '#111827'}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedCategory && (
          <>
            <Text style={styles.label}>{selectedCategory.nameLabel}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={selectedCategory.namePlaceholder}
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

            <Text style={styles.label}>{selectedCategory.typeLabel}</Text>
            <View style={styles.chipRow}>
              {selectedCategory.typeOptions.map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.chip, type === t && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      type === t && styles.chipTextActive,
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 60 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 16,
  },
  categoryRow: { flexDirection: 'row', gap: 10 },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  categoryCardActive: { backgroundColor: '#111827', borderColor: '#111827' },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#111827' },
  categoryTextActive: { color: '#FFFFFF' },
  input: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
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
    marginTop: 28,
  },
  submitButtonDisabled: { backgroundColor: '#D1D5DB' },
  submitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
