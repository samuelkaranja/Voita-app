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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, Save, X } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

import {
  addVehicle,
  updateVehicle,
  updateMaintenanceDates,
  uploadVehiclePhoto,
} from '../../redux/slices/profile/profileSlice';
import { VehicleBasicInfoSection } from './components/vehicle/VehicleBasicInfoSection';
import { TechnicalSpecsSection } from './components/vehicle/TechnicalSpecsSection';
import { TireConfigSection } from './components/profile/edit/TireConfigSection';
import { AddMaintenanceSection } from './components/vehicle/AddMaintenanceSection';

interface BasicInfo {
  numberPlate: string;
  vehicleType: string;
  modelYear: string;
}

interface TechnicalSpecs {
  color: string;
  fuelType: string;
}

interface TireConfig {
  alloyType: string;
  pressureFront: string;
  pressureRear: string;
}

interface MaintenanceDates {
  insuranceExpiry: Date | null;
  licenseExpiry: Date | null;
  lastServiceDate: Date | null;
  nextTireRotation: Date | null;
}

type NavProp = NativeStackNavigationProp<any>;

const toISO = (d: Date | null) => d?.toISOString().split('T')[0] ?? undefined;

export const AddVehicleScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch<any>();
  const { loading } = useSelector((state: any) => state.profile);

  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    numberPlate: '',
    vehicleType: '',
    modelYear: '',
  });
  const [techSpecs, setTechSpecs] = useState<TechnicalSpecs>({
    color: '',
    fuelType: '',
  });
  const [tireConfig, setTireConfig] = useState<TireConfig>({
    alloyType: '',
    pressureFront: '',
    pressureRear: '',
  });
  const [maintenance, setMaintenance] = useState<MaintenanceDates>({
    insuranceExpiry: null,
    licenseExpiry: null,
    lastServiceDate: null,
    nextTireRotation: null,
  });

  const handleBasicInfoChange = (field: keyof BasicInfo, value: string) =>
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  const handleTechSpecsChange = (field: keyof TechnicalSpecs, value: string) =>
    setTechSpecs(prev => ({ ...prev, [field]: value }));
  const handleTireChange = (field: keyof TireConfig, value: string) =>
    setTireConfig(prev => ({ ...prev, [field]: value }));
  const handleMaintenanceChange = (field: keyof MaintenanceDates, date: Date) =>
    setMaintenance(prev => ({ ...prev, [field]: date }));

  const handleSave = async () => {
    // 1. Create the vehicle first
    const addRes = await dispatch(
      addVehicle({
        number_plate: basicInfo.numberPlate,
        make: basicInfo.vehicleType.split(' ')[0] ?? basicInfo.vehicleType,
        model:
          basicInfo.vehicleType.split(' ').slice(1).join(' ') ||
          basicInfo.vehicleType,
        year: parseInt(basicInfo.modelYear, 10),
        color: techSpecs.color,
        fuel_type: techSpecs.fuelType,
      }),
    );

    if (addRes.meta.requestStatus !== 'fulfilled') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: addRes.payload || 'Failed to add vehicle',
      });
      return;
    }

    // Get the new vehicle id from the response
    const newVehicles = addRes.payload as any[];
    const newVehicle = newVehicles?.[newVehicles.length - 1];
    const vehicleId = newVehicle?.id;

    if (!vehicleId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Vehicle created but ID not returned',
      });
      return;
    }

    // 2. Update tires + specs on the new vehicle
    await dispatch(
      updateVehicle({
        id: vehicleId,
        data: {
          alloy_type: tireConfig.alloyType,
          pressure_front: tireConfig.pressureFront,
          pressure_rear: tireConfig.pressureRear,
        },
      }),
    );

    // 3. Update maintenance dates if any were set
    const hasMaintenance = Object.values(maintenance).some(Boolean);
    if (hasMaintenance) {
      await dispatch(
        updateMaintenanceDates({
          id: vehicleId,
          data: {
            insurance_expiry: toISO(maintenance.insuranceExpiry),
            license_expiry: toISO(maintenance.licenseExpiry),
            last_service_date: toISO(maintenance.lastServiceDate),
            next_tire_rotation: toISO(maintenance.nextTireRotation),
          },
        }),
      );
    }

    // 4. Upload photo if one was selected
    if (imageUri) {
      await dispatch(uploadVehiclePhoto({ id: vehicleId, imageUri }));
    }

    Toast.show({
      type: 'success',
      text1: 'Vehicle Added',
      text2: 'Your vehicle has been registered',
    });
    navigation.goBack();
  };

  const handleCancel = () => navigation.goBack();

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
        <Text style={styles.headerTitle}>AutoServe</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ── Scrollable content ── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.pageTitleBlock}>
            <Text style={styles.pageTitle}>Add New Vehicle</Text>
            <Text style={styles.pageSubtitle}>
              Register your vehicle to manage maintenance and track safety
              details.
            </Text>
          </View>

          <VehicleBasicInfoSection
            imageUri={imageUri}
            info={basicInfo}
            onImageChange={setImageUri}
            onChange={handleBasicInfoChange}
          />

          <TechnicalSpecsSection
            specs={techSpecs}
            onChange={handleTechSpecsChange}
          />

          <TireConfigSection
            config={tireConfig}
            onChange={handleTireChange}
            isCalibrated={false}
          />

          <AddMaintenanceSection
            dates={maintenance}
            onChange={handleMaintenanceChange}
          />

          {/* Spacer so content clears the fixed footer */}
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* ── Fixed footer — outside ScrollView so it never scrolls away ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, loading.vehicles && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading.vehicles}
            activeOpacity={0.85}
          >
            {loading.vehicles ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Save size={16} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.saveText}>Save Vehicle</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <X size={15} color="#6B7280" strokeWidth={2} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
  headerSpacer: { width: 36 },
  pageTitleBlock: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitle: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  scrollContent: { paddingBottom: 16 },
  footer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 8,
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
  saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  cancelText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
});

export default AddVehicleScreen;
