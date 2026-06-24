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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

import { ProfileStackParamList } from '../../navigation/ProfileStack';
import { VehicleImagePicker } from './components/profile/edit/VehicleImagePicker';
import { VehicleSpecsSection } from './components/profile/edit/VehicleSpecsSection';
import { TireConfigSection } from './components/profile/edit/TireConfigSection';
import { MaintenanceSection } from './components/profile/edit/MaintenanceSection';
import {
  updateMaintenanceDates,
  updateVehicle,
  uploadVehiclePhoto,
} from '../../redux/slices/profile/profileSlice';

interface VehicleSpecs {
  numberPlate: string;
  make: string;
  model: string;
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
type RouteProps = RouteProp<ProfileStackParamList, 'EditVehicleDetails'>;

const toISO = (d: Date) => d.toISOString().split('T')[0];

// Split "Toyota Corolla" stored in vehicle_type back into make + model
const parseMakeModel = (vehicleType: string) => {
  const parts = vehicleType.trim().split(' ');
  return {
    make: parts[0] ?? '',
    model: (parts.slice(1).join(' ') || parts[0]) ?? '',
  };
};

export const EditVehicleDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const dispatch = useDispatch<any>();

  const [isSaving, setIsSaving] = useState(false);

  const { vehicles, loading } = useSelector((state: any) => state.profile);

  // Use the vehicleId param passed from ProfileScreen
  const vehicleId = route.params?.vehicleId;
  const vehicle = vehicles.find((v: any) => v.id === vehicleId) ?? vehicles[0];

  const { make: parsedMake, model: parsedModel } = parseMakeModel(
    vehicle?.vehicle_type ?? '',
  );

  const [imageUri, setImageUri] = useState<string>(vehicle?.photo_url ?? '');
  const [specs, setSpecs] = useState<VehicleSpecs>({
    numberPlate: vehicle?.number_plate ?? '',
    make: parsedMake,
    model: parsedModel,
    modelYear: vehicle?.model_year ?? '',
    color: vehicle?.color ?? '',
    fuelType: vehicle?.fuel_type ?? '',
  });
  const [tires, setTires] = useState<TireConfig>({
    alloyType: vehicle?.alloy_type ?? '',
    pressureFront: vehicle?.pressure_front?.toString() ?? '',
    pressureRear: vehicle?.pressure_rear?.toString() ?? '',
  });
  const [maintenance, setMaintenance] = useState<MaintenanceDates>({
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
    if (!specs.numberPlate || !specs.make) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Number plate and Make are required.',
      });
      return;
    }
    if (!vehicle?.id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No vehicle selected to update.',
      });
      return;
    }

    try {
      setIsSaving(true); // ← start spinner

      await dispatch(
        updateVehicle({
          id: vehicle.id,
          data: {
            registration_number: specs.numberPlate,
            make: specs.make,
            model: specs.model,
            year: parseInt(specs.modelYear, 10) || undefined,
            color: specs.color,
            fuel_type: specs.fuelType,
            alloy_type: tires.alloyType || undefined,
            pressure_front: tires.pressureFront
              ? parseFloat(tires.pressureFront)
              : undefined,
            pressure_rear: tires.pressureRear
              ? parseFloat(tires.pressureRear)
              : undefined,
          },
        }),
      ).unwrap();

      await dispatch(
        updateMaintenanceDates({
          id: vehicle.id,
          data: {
            insurance_expiry: toISO(maintenance.insuranceExpiry),
            license_expiry: toISO(maintenance.licenseExpiry),
            last_service_date: toISO(maintenance.serviceDue),
            next_tire_rotation: toISO(maintenance.nextRotation),
          },
        }),
      ).unwrap();

      if (imageUri && imageUri !== vehicle?.photo_url) {
        await dispatch(
          uploadVehiclePhoto({ id: vehicle.id, imageUri }),
        ).unwrap();
      }

      Toast.show({
        type: 'success',
        text1: 'Saved',
        text2: 'Vehicle updated successfully.',
      });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.message || error || 'An unexpected error occurred.',
      });
    } finally {
      setIsSaving(false); // ← always stop spinner
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          disabled={isSaving}
        >
          <ChevronLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Vehicle Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <VehicleImagePicker
              imageUri={imageUri}
              onImageChange={setImageUri}
            />
            <View style={{ height: 16 }} />
            <VehicleSpecsSection specs={specs} onChange={handleSpecsChange} />
            <TireConfigSection
              config={tires}
              onChange={handleTireChange}
              isCalibrated={vehicle?.is_calibrated ?? false}
            />
            <MaintenanceSection
              dates={maintenance}
              onChange={handleMaintenanceChange}
            />
            <View style={{ height: 16 }} />

            {/* Footer as flex sibling — never overlaps scroll content */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.discardButton}
                onPress={handleDiscard}
                activeOpacity={0.7}
                disabled={isSaving}
              >
                <Text style={styles.discardText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                activeOpacity={0.85}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.updateText}>Update Vehicle</Text>
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
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
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
  headerSpacer: { width: 36 },
  scrollContent: { paddingBottom: 16 },
  footer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 90,
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
  discardText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  updateButton: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
  },
  updateText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});

export default EditVehicleDetailsScreen;
