import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { ProfileStackParamList } from '../../navigation/ProfileStack';

import { VehicleImagePicker } from './components/profile/edit/VehicleImagePicker';
import { VehicleSpecsSection } from './components/profile/edit/VehicleSpecsSection';
import { TireConfigSection } from './components/profile/edit/TireConfigSection';
import { MaintenanceSection } from './components/profile/edit/MaintenanceSection';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateMaintenanceDates,
  updateVehicle,
  uploadVehiclePhoto,
} from '../../redux/slices/profile/profileSlice';
import Toast from 'react-native-toast-message';

interface VehicleSpecs {
  numberPlate: string;
  vehicleType: string;
  modelYear: string;
  color: string;
  fuelType: string;
}

interface TireConfig {
  alloyType: string;
  pressureFront: string;
  pressureRear: string;
}

interface MaintenanceDates {
  insuranceExpiry: Date;
  licenseExpiry: Date;
  serviceDue: Date;
  nextRotation: Date;
}

type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

const { vehicles, primaryVehicleId, loading } = useSelector(
  (state: any) => state.profile,
);
const dispatch = useDispatch<any>();

const vehicle =
  vehicles.find((v: any) => v.id === primaryVehicleId) ?? vehicles[0];

export const EditVehicleDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();

  const [imageUri, setImageUri] = useState<string>(vehicle?.photo_url ?? '');
  const [specs, setSpecs] = useState({
    numberPlate: vehicle?.number_plate ?? '',
    vehicleType: vehicle?.vehicle_type ?? '',
    modelYear: vehicle?.model_year ?? '',
    color: vehicle?.color ?? '',
    fuelType: vehicle?.fuel_type ?? '',
  });
  const [tires, setTires] = useState({
    alloyType: vehicle?.alloy_type ?? '',
    pressureFront: vehicle?.pressure_front ?? '',
    pressureRear: vehicle?.pressure_rear ?? '',
  });
  const [maintenance, setMaintenance] = useState({
    insuranceExpiry: vehicle?.insurance_expiry
      ? new Date(vehicle.insurance_expiry)
      : new Date(),
    licenseExpiry: vehicle?.license_expiry
      ? new Date(vehicle.license_expiry)
      : new Date(),
    serviceDue: vehicle?.last_service_date
      ? new Date(vehicle.last_service_date)
      : new Date(),
    nextRotation: vehicle?.next_tire_rotation
      ? new Date(vehicle.next_tire_rotation)
      : new Date(),
  });

  const handleSpecsChange = (field: keyof VehicleSpecs, value: string) =>
    setSpecs(prev => ({ ...prev, [field]: value }));

  const handleTireChange = (field: keyof TireConfig, value: string) =>
    setTires(prev => ({ ...prev, [field]: value }));

  const handleMaintenanceChange = (field: keyof MaintenanceDates, date: Date) =>
    setMaintenance(prev => ({ ...prev, [field]: date }));

  const handleDiscard = () => navigation.goBack();

  const handleUpdate = async () => {
    const toISO = (d: Date) => d.toISOString().split('T')[0];

    // 1. Update vehicle specs
    const specRes = await dispatch(
      updateVehicle({
        id: vehicle.id,
        data: {
          number_plate: specs.numberPlate,
          vehicle_type: specs.vehicleType,
          model_year: specs.modelYear,
          color: specs.color,
          fuel_type: specs.fuelType,
          alloy_type: tires.alloyType,
          pressure_front: tires.pressureFront,
          pressure_rear: tires.pressureRear,
        },
      }),
    );

    // 2. Update maintenance dates
    const maintRes = await dispatch(
      updateMaintenanceDates({
        id: vehicle.id,
        data: {
          insurance_expiry: toISO(maintenance.insuranceExpiry),
          license_expiry: toISO(maintenance.licenseExpiry),
          last_service_date: toISO(maintenance.serviceDue),
          next_tire_rotation: toISO(maintenance.nextRotation),
        },
      }),
    );

    // 3. Upload new photo if changed
    if (imageUri && imageUri !== vehicle.photo_url) {
      await dispatch(uploadVehiclePhoto({ id: vehicle.id, imageUri }));
    }

    if (
      specRes.meta.requestStatus === 'fulfilled' &&
      maintRes.meta.requestStatus === 'fulfilled'
    ) {
      Toast.show({
        type: 'success',
        text1: 'Saved',
        text2: 'Vehicle updated successfully',
      });
      navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update vehicle',
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
        <Text style={styles.headerTitle}>Profile Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VehicleImagePicker imageUri={imageUri} onImageChange={setImageUri} />

          <View style={{ height: 16 }} />

          <VehicleSpecsSection specs={specs} onChange={handleSpecsChange} />

          <TireConfigSection
            config={tires}
            onChange={handleTireChange}
            isCalibrated
          />

          <MaintenanceSection
            dates={maintenance}
            onChange={handleMaintenanceChange}
          />

          <View style={{ height: 90 }} />

          {/* Fixed footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={handleDiscard}
              activeOpacity={0.7}
            >
              <Text style={styles.discardText}>Discard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
              activeOpacity={0.85}
            >
              <Text style={styles.updateText}>Update Vehicle</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingBottom: 100,
  },
  // ── New header styles ──────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
  headerSpacer: {
    width: 36, // mirrors backBtn width to keep title centered
  },
  // ──────────────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  discardButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  discardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  updateButton: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  updateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EditVehicleDetailsScreen;
