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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Pencil, LogOut, Car } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sendVerificationEmail } from '../../redux/slices/auth/authSlice';
import { EmailVerificationBanner } from './components/profile/EmailVerificationBanner';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../navigation/ProfileStack';
import {
  fetchProfile,
  fetchEmergencyContacts,
  fetchVehicles,
  fetchVerificationStatus,
  clearProfileError,
  resetProfile,
  Vehicle as BackendVehicle,
} from '../../redux/slices/profile/profileSlice';
import { logout } from '../../redux/slices/auth/authSlice';
import { ProfileTabBar } from './components/profile/ProfileTabBar';
import { ProfileAvatar } from './components/profile/ProfileAvatar';
import { PersonalTab } from './components/profile/PersonalTab';
import {
  MaintenanceItem,
  VehicleInfo,
  VehicleTab,
} from './components/profile/VehicleTab';

type Tab = 'personal' | 'vehicle';
type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

const formatExpiryLabel = (expiryDateStr?: string): string => {
  if (!expiryDateStr) return 'Not set';
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  if (expiry < now) return 'Expired';

  const diffTime = Math.abs(expiry.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) return `Expires in ${diffDays} days`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Expires in ${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
};

const mapBackendVehicleToUI = (vehicle?: BackendVehicle): VehicleInfo => {
  const defaultImage =
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=500';

  const maintenance: MaintenanceItem[] = [
    {
      id: 'insurance',
      category: 'Insurance',
      title: 'Comprehensive Policy',
      metaLabel: 'Expiry Date',
      metaValue: vehicle?.insurance_expiry
        ? new Date(vehicle.insurance_expiry).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Not Set',
      metaVariant: vehicle?.insurance_expiry
        ? new Date(vehicle.insurance_expiry) < new Date()
          ? 'danger'
          : 'info'
        : 'warning',
      accentColor: '#3B82F6',
      iconKey: 'insurance' as const,
    },
    {
      id: 'license',
      category: 'Vehicle Registration',
      title: 'License Renewal',
      metaLabel: 'Expiry Date',
      metaValue: vehicle?.license_expiry
        ? new Date(vehicle.license_expiry).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Not Set',
      metaVariant: vehicle?.license_expiry
        ? new Date(vehicle.license_expiry) < new Date()
          ? 'danger'
          : 'default'
        : 'warning',
      accentColor: '#10B981',
      iconKey: 'license' as const,
    },
    {
      id: 'service',
      category: 'Routine Service',
      title: 'Oil & Filter / Battery Check',
      metaLabel: 'Last Service Date',
      metaValue: vehicle?.last_service_date
        ? new Date(vehicle.last_service_date).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Not Set',
      metaVariant: vehicle?.last_service_date ? 'default' : 'warning',
      accentColor: '#F59E0B',
      iconKey: 'service' as const,
    },
    {
      id: 'tires',
      category: 'Tyre Maintenance',
      title: 'Next Tyre Rotation',
      metaLabel: 'Due Date',
      metaValue: vehicle?.next_tire_rotation
        ? new Date(vehicle.next_tire_rotation).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Not Set',
      metaVariant: vehicle?.next_tire_rotation
        ? new Date(vehicle.next_tire_rotation) < new Date()
          ? 'warning'
          : 'default'
        : 'warning',
      accentColor: '#8B5CF6',
      iconKey: 'tires' as const,
    },
  ];

  console.log(
    '🚗 [mapBackendVehicleToUI] raw vehicle:',
    JSON.stringify(vehicle, null, 2),
  );
  console.log('🔧 [mapBackendVehicleToUI] mapped tyre data:', {
    pressureFront: vehicle?.pressure_front,
    pressureRear: vehicle?.pressure_rear,
    alloyType: vehicle?.alloy_type,
    pressureFrontStringified:
      vehicle?.pressure_front != null
        ? String(vehicle.pressure_front)
        : undefined,
    pressureRearStringified:
      vehicle?.pressure_rear != null
        ? String(vehicle.pressure_rear)
        : undefined,
  });

  return {
    id: vehicle?.id ?? 'fallback-id',
    label: vehicle?.vehicle_type ?? 'Vehicle Not Set',
    modelYear: vehicle?.model_year ?? 'Not Set',
    color: vehicle?.color ?? 'Not Set',
    plateNumber: vehicle?.number_plate ?? 'Not Set',
    fuelType: vehicle?.fuel_type ?? 'Not Set',
    tirePressure:
      vehicle?.pressure_front != null && vehicle?.pressure_rear != null
        ? `F: ${vehicle.pressure_front} / R: ${vehicle.pressure_rear} PSI`
        : 'Not Set',
    pressureFront:
      vehicle?.pressure_front != null
        ? String(vehicle.pressure_front)
        : undefined,
    pressureRear:
      vehicle?.pressure_rear != null
        ? String(vehicle.pressure_rear)
        : undefined,
    alloyType: vehicle?.alloy_type ?? undefined,
    isCalibrated: vehicle?.is_calibrated ?? false,
    imageUri: vehicle?.photo_url ?? defaultImage,
    maintenance,
  };
};

// Main screen
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch<any>();
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    string | undefined
  >(undefined);

  const {
    profile,
    emergencyContacts,
    vehicles,
    primaryVehicleId,
    verificationStatus,
    loading,
    error,
  } = useSelector((state: any) => state.profile);

  const authUser = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const authLoading = useSelector((state: any) => state.auth.loading.init);
  const sendingVerification = useSelector(
    (state: any) => state.auth.loading.sendVerificationEmail,
  );

  // ── Fetch on mount — only when token is ready ─────────────────────────────
  useEffect(() => {
    if (authLoading || !token) return;
    dispatch(clearProfileError());
    dispatch(fetchProfile());
    dispatch(fetchEmergencyContacts());
    dispatch(fetchVehicles());
    dispatch(fetchVerificationStatus());
  }, [dispatch, token, authLoading]);

  // ── Refetch profile on focus (picks up email verification after browser return) ──
  const isFirstFocus = React.useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false; // skip duplicate call on initial mount
        return;
      }
      if (token) dispatch(fetchVerificationStatus());
    }, [dispatch, token]),
  );

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

  // const primaryVehicle = Array.isArray(vehicles)
  //   ? vehicles.find((v: any) => v.id === primaryVehicleId) ?? vehicles[0]
  //   : undefined;

  const vehicleToEdit =
    vehicles.find((v: any) => v.id === selectedVehicleId) ??
    vehicles.find((v: any) => v.id === primaryVehicleId) ??
    vehicles[0];

  // const handleEditPress = () => {
  //   if (activeTab === 'personal') {
  //     navigation.navigate('EditPersonalDetails');
  //   } else {
  //     if (!vehicleToEdit) return;
  //     navigation.navigate('EditVehicleDetails', {
  //       vehicleId: vehicleToEdit.id,
  //     });
  //   }
  // };

  const handleSendVerificationEmail = () => {
    dispatch(sendVerificationEmail())
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Verification email sent',
          text2: 'Check your inbox and tap the link.',
        });
      })
      .catch((err: string) => {
        Toast.show({
          type: 'error',
          text1: 'Could not send email',
          text2: err,
        });
      });
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
              <EmailVerificationBanner
                email={authUser?.email ?? ''}
                verified={verificationStatus?.email_verified ?? false}
                sending={sendingVerification}
                onVerify={handleSendVerificationEmail}
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
                onEditPress={() => navigation.navigate('EditPersonalDetails')}
              />
            </>
          ) : (
            <VehicleTab
              mappedVehicles={
                Array.isArray(vehicles)
                  ? vehicles.map((v: any) => mapBackendVehicleToUI(v))
                  : []
              }
              onVehicleSelect={setSelectedVehicleId}
              onEditPress={() => {
                if (!vehicleToEdit) return;
                navigation.navigate('EditVehicleDetails', {
                  vehicleId: vehicleToEdit.id,
                });
              }}
            />
          )}
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
  // footer: {
  //   backgroundColor: '#F3F4F6',
  //   paddingHorizontal: 16,
  //   paddingTop: 40,
  //   paddingBottom: 80,
  //   borderTopWidth: StyleSheet.hairlineWidth,
  //   borderTopColor: '#E5E7EB',
  // },
  // editButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   gap: 8,
  //   backgroundColor: '#111827',
  //   borderRadius: 14,
  //   paddingVertical: 16,
  // },
  // editButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default ProfileScreen;
