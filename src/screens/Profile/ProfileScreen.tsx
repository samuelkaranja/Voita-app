import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Pencil, LogOut, Car } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../navigation/ProfileStack';
import {
  fetchProfile,
  fetchEmergencyContacts,
  fetchVehicles,
  clearProfileError,
  resetProfile,
} from '../../redux/slices/profile/profileSlice';
import { logout } from '../../redux/slices/auth/authSlice';
import { ProfileTabBar } from './components/profile/ProfileTabBar';
import { ProfileAvatar } from './components/profile/ProfileAvatar';
import { PersonalTab } from './components/profile/PersonalTab';
import { VehicleTab } from './components/profile/VehicleTab';

type Tab = 'personal' | 'vehicle';
type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

const DEFAULT_VEHICLE_DATA = {
  id: 'default-vehicle',
  label: 'Tesla Model 3',
  modelYear: '2024',
  color: 'Midnight Silver',
  plateNumber: 'ABC-1234',
  fuelType: 'Electric',
  tirePressure: '38 PSI',
  imageUri:
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500',
  maintenance: [
    {
      id: 'm1',
      category: 'Insurance',
      title: 'Comprehensive Plan',
      metaLabel: 'Expires',
      metaValue: 'In 3 months',
      metaVariant: 'info',
      accentColor: '#3B82F6',
      iconKey: 'insurance',
    },
    {
      id: 'm2',
      category: 'Annual Service',
      title: 'Routine Maintenance',
      metaLabel: 'Status',
      metaValue: 'Due Soon',
      metaVariant: 'warning',
      accentColor: '#F59E0B',
      iconKey: 'service',
    },
  ],
};

// ── Main screen ───────────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState<Tab>('personal');

  const {
    profile,
    emergencyContacts,
    vehicles,
    primaryVehicleId,
    loading,
    error,
  } = useSelector((state: any) => state.profile);

  const authUser = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const authLoading = useSelector((state: any) => state.auth.loading.init);

  // ── Fetch on mount — only when token is ready ─────────────────────────────
  useEffect(() => {
    if (authLoading || !token) return;
    dispatch(clearProfileError());
    dispatch(fetchProfile());
    dispatch(fetchEmergencyContacts());
    dispatch(fetchVehicles());
  }, [dispatch, token, authLoading]);

  // ── Error toast — skip on first render ────────────────────────────────────
  const isMounted = React.useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error });
    }
  }, [error]);

  const isLoading = loading.profile || loading.contacts || loading.vehicles;

  const primaryVehicle =
    vehicles.find((v: any) => v.id === primaryVehicleId) ?? vehicles[0];

  const handleEditPress = () => {
    if (activeTab === 'personal') {
      navigation.navigate('EditPersonalDetails');
    } else {
      navigation.navigate('EditVehicleDetails');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          dispatch(resetProfile());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' as any }],
          });
        },
      },
    ]);
  };

  // ── Show spinner while auth restores from AsyncStorage or data loads ──────
  if (authLoading || !token || isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={{ flex: 1 }} color="#111827" />
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Profile Management</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* flex:1 body — ScrollView + footer share remaining space */}
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'personal' ? (
            <>
              <ProfileAvatar
                name={
                  authUser ? `${authUser.firstName} ${authUser.lastName}` : ''
                }
                membershipLabel={profile?.membership_label ?? 'Voita Member'}
                imageUri={
                  profile?.profile_image_url ?? authUser?.profileImageUrl
                }
              />
              <PersonalTab
                personalInfo={{
                  firstName: authUser?.firstName ?? '',
                  lastName: authUser?.lastName ?? '',
                  phone: authUser?.phone ?? '',
                  email: authUser?.email ?? '',
                  gender: profile?.gender ?? 'Not set',
                }}
                emergencyContacts={emergencyContacts.map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  relationship: c.relationship_type,
                  phone: c.phone,
                }))}
              />
            </>
          ) : (
            <VehicleTab
              vehicleInfo={{
                label:
                  primaryVehicle?.label ??
                  primaryVehicle?.make ??
                  DEFAULT_VEHICLE_DATA.label,
                modelYear:
                  primaryVehicle?.modelYear ??
                  primaryVehicle?.model_year ??
                  DEFAULT_VEHICLE_DATA.modelYear,
                color: primaryVehicle?.color ?? DEFAULT_VEHICLE_DATA.color,
                plateNumber:
                  primaryVehicle?.plateNumber ??
                  primaryVehicle?.plate_number ??
                  DEFAULT_VEHICLE_DATA.plateNumber,
                fuelType:
                  primaryVehicle?.fuelType ??
                  primaryVehicle?.fuel_type ??
                  DEFAULT_VEHICLE_DATA.fuelType,
                tirePressure:
                  primaryVehicle?.tirePressure ??
                  primaryVehicle?.tire_pressure ??
                  DEFAULT_VEHICLE_DATA.tirePressure,
                imageUri:
                  primaryVehicle?.imageUri ??
                  primaryVehicle?.image_url ??
                  DEFAULT_VEHICLE_DATA.imageUri,
                maintenance:
                  primaryVehicle?.maintenance ??
                  DEFAULT_VEHICLE_DATA.maintenance,
              }}
            />
          )}

          {/* Footer — naturally at bottom, never overlaps */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
              activeOpacity={0.85}
            >
              <Pencil size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.editButtonText}>
                {activeTab === 'personal'
                  ? 'Edit Personal Details'
                  : 'Edit Vehicle Details'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#F3F4F6',
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
  logoutBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, flexDirection: 'column' },
  scrollContent: { paddingBottom: 16 },
  footer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 100,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
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

const noVehicleStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 24,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;
