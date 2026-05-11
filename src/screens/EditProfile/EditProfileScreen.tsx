import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { launchImageLibrary } from 'react-native-image-picker';

import {
  fetchProfile,
  saveProfile,
  saveVehicle,
} from '../../redux/slices/profile/profileSlice';

import { uploadImage } from '../../services/uploadService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileFormSection from './components/ProfileFormSection';
import VehicleFormSection from './components/VehicleFormSection';

export default function EditProfileScreen() {
  const dispatch = useDispatch<any>();

  const { user, vehicle, loading } = useSelector(
    (state: any) => state.profile,
  );

  const [localUser, setLocalUser] = useState<any>(null);
  const [localVehicle, setLocalVehicle] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    setToken(storedToken);
  };

  loadToken();
}, []);

  // 🔄 Fetch profile on mount
  useEffect(() => {
  if (token) {
    dispatch(fetchProfile(token));
  }
}, [token]);

  // 📥 Prefill form
  useEffect(() => {
    if (user) setLocalUser(user);
    if (vehicle) setLocalVehicle(vehicle);
  }, [user, vehicle]);

  // 📸 Pick Image
  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
    });

    if (result.assets?.length) {
      setImage(result.assets[0]);
    }
  };

  // 💾 Save Handler
  const handleSave = async () => {
  if (!token) return;

  try {
    setSaving(true);

    let avatarUrl = localUser?.avatar;

    if (image) {
      const res = await uploadImage(
        token,
        image,
        'voita/avatars',
      );
      avatarUrl = res.url;
    }

    await dispatch(
      saveProfile({
        token,
        data: {
          ...localUser,
          profile_picture_url: avatarUrl,
        },
      }),
    );

    if (localVehicle?.id) {
      await dispatch(
        saveVehicle({
          token,
          vehicleId: localVehicle.id,
          data: localVehicle,
        }),
      );
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Profile updated successfully',
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Update failed',
    });
  } finally {
    setSaving(false);
  }
};

  // ⏳ Loading State
  if (loading || !localUser || !localVehicle) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* PROFILE IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              image?.uri ||
              localUser?.avatar ||
              'https://via.placeholder.com/100',
          }}
          style={styles.avatar}
        />

        <TouchableOpacity
          style={styles.changePhotoBtn}
          onPress={handlePickImage}
        >
          <Text style={styles.changePhotoText}>
            Change Photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* 👤 PROFILE SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Info</Text>

        <ProfileFormSection
          user={localUser}
          setUser={setLocalUser}
        />
      </View>

      {/* 🚗 VEHICLE SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Info</Text>

        <VehicleFormSection
          vehicle={localVehicle}
          setVehicle={setLocalVehicle}
        />
      </View>

      {/* 💾 SAVE BUTTON */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>
            Save Changes
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 16,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  changePhotoBtn: {
    marginTop: 10,
  },

  changePhotoText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },

  saveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
