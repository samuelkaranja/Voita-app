import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Save } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {
  updateProfile,
  uploadAvatar,
  addEmergencyContact,
  updateEmergencyContact,
} from '../../redux/slices/profile/profileSlice';
import { EditAvatarHeader } from './components/profile/edit/EditAvatarHeader';
import { PersonalDetailsSection } from './components/profile/edit/PersonalDetailsSection';
import { EmergencyContactSection } from './components/profile/edit/EmergencyContactSection';

// Safe error stringifier
const extractError = (payload: any): string => {
  if (!payload) return 'Something went wrong';
  if (typeof payload === 'string') return payload;
  if (Array.isArray(payload)) {
    return payload.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
  }
  if (payload.detail) {
    if (typeof payload.detail === 'string') return payload.detail;
    if (Array.isArray(payload.detail)) {
      return payload.detail
        .map((e: any) => e.msg || JSON.stringify(e))
        .join(', ');
    }
  }
  return JSON.stringify(payload);
};

export const EditPersonalDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  const authUser = useSelector((state: any) => state.auth.user);
  const { profile, emergencyContacts, loading } = useSelector(
    (state: any) => state.profile,
  );

  const [personalForm, setPersonalForm] = useState({
    firstName: authUser?.firstName ?? '',
    lastName: authUser?.lastName ?? '',
    phone: authUser?.phone ?? '',
    email: authUser?.email ?? '',
    gender: profile?.gender ?? '',
  });

  const firstContact = emergencyContacts[0];
  const [emergencyForm, setEmergencyForm] = useState({
    name: firstContact?.name ?? '',
    relationship: firstContact?.relationship_type ?? '',
    phone: firstContact?.phone ?? '',
  });

  const handlePersonalChange = (field: string, value: string) =>
    setPersonalForm(prev => ({ ...prev, [field]: value }));

  const handleEmergencyChange = (field: string, value: string) =>
    setEmergencyForm(prev => ({ ...prev, [field]: value }));

  console.log('emergencyForm at save time:', JSON.stringify(emergencyForm));
  console.log('contactFieldsFilled:', {
    name: emergencyForm.name.trim(),
    relationship: emergencyForm.relationship.trim(),
    phone: emergencyForm.phone.trim(),
  });

  // Save
  const handleSave = async () => {
    // 1. Update personal profile
    const profileRes = await dispatch(
      updateProfile({
        first_name: personalForm.firstName,
        last_name: personalForm.lastName,
        email: personalForm.email,
        phone: personalForm.phone,
        gender: personalForm.gender,
      }),
    );

    const profileOk = profileRes.meta.requestStatus === 'fulfilled';

    if (!profileOk) {
      Toast.show({
        type: 'error',
        text1: 'Profile Update Failed',
        text2: extractError(profileRes.payload),
      });
      return;
    }

    // 2. Only attempt contact save if ALL three fields are filled
    let contactRes;
    const contactFieldsFilled =
      emergencyForm.name.trim() !== '' &&
      emergencyForm.phone.trim() !== '' &&
      emergencyForm.relationship.trim() !== '';

    if (contactFieldsFilled) {
      const contactPayload = {
        name: emergencyForm.name.trim(),
        relationship_type: emergencyForm.relationship.trim(),
        phone: emergencyForm.phone.trim(),
      };

      console.log('Sending contact payload:', JSON.stringify(contactPayload));

      if (firstContact?.id) {
        contactRes = await dispatch(
          updateEmergencyContact({ id: firstContact.id, data: contactPayload }),
        );
      } else {
        contactRes = await dispatch(addEmergencyContact(contactPayload));
      }

      const contactOk = contactRes.meta.requestStatus === 'fulfilled';
      if (!contactOk) {
        Toast.show({
          type: 'error',
          text1: 'Contact Update Failed',
          text2: extractError(contactRes.payload),
        });
        return;
      }
    }

    // Both succeeded (or contact was intentionally skipped)
    Toast.show({
      type: 'success',
      text1: 'Saved',
      text2: 'Profile updated successfully',
    });
    navigation.goBack();
  };

  // Avatar upload
  const handleImageChange = async (uri: string) => {
    const res = await dispatch(uploadAvatar(uri));
    if (res.meta.requestStatus === 'fulfilled') {
      Toast.show({ type: 'success', text1: 'Photo updated' });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: extractError(res.payload),
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Personal Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* flex:1 body — ScrollView + footer share space */}
        <View style={styles.body}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <EditAvatarHeader
              initialImageUri={
                profile?.profile_image_url ?? authUser?.profileImageUrl
              }
              name={`${personalForm.firstName} ${personalForm.lastName}`}
              memberSince={
                profile?.member_since
                  ? `Member since ${new Date(
                      profile.member_since,
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}`
                  : 'Voita Member'
              }
              onImageChange={handleImageChange}
            />

            <PersonalDetailsSection
              form={personalForm}
              onChange={handlePersonalChange}
            />
            <EmergencyContactSection
              form={emergencyForm}
              onChange={handleEmergencyChange}
            />

            {/* Footer — naturally at bottom, never overlaps content */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  loading.updateProfile && { opacity: 0.7 },
                ]}
                onPress={handleSave}
                disabled={loading.updateProfile}
                activeOpacity={0.85}
              >
                {loading.updateProfile ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Save size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
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
  headerSpacer: {
    width: 36,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  footer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 80,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default EditPersonalDetailsScreen;
