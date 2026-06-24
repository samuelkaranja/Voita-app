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
import { store } from '../../redux/store';

interface BasicInfo {
  numberPlate: string;
  make: string;
  model: string;
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
    make: '',
    model: '',
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

  // Local sync saving loader covering downstream chained API requests
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);

  const handleBasicInfoChange = (field: keyof BasicInfo, value: string) =>
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  const handleTechSpecsChange = (field: keyof TechnicalSpecs, value: string) =>
    setTechSpecs(prev => ({ ...prev, [field]: value }));
  const handleTireChange = (field: keyof TireConfig, value: string) =>
    setTireConfig(prev => ({ ...prev, [field]: value }));
  const handleMaintenanceChange = (field: keyof MaintenanceDates, date: Date) =>
    setMaintenance(prev => ({ ...prev, [field]: date }));

  const handleSave = async () => {
    const token = (store.getState() as any).auth.token;
    if (!basicInfo.numberPlate || !basicInfo.make) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in Number Plate and Make.',
      });
      return;
    }

    try {
      setIsSavingWorkflow(true);

      // 1. Create vehicle
      const newVehicle = await dispatch(
        addVehicle({
          registration_number: basicInfo.numberPlate,
          make: basicInfo.make,
          model: basicInfo.model || basicInfo.make,
          year: parseInt(basicInfo.modelYear, 10) || new Date().getFullYear(),
          color: techSpecs.color || 'Unspecified',
          fuel_type: techSpecs.fuelType || 'Petrol',
        }),
      ).unwrap();

      console.log(
        '✅ [handleSave] addVehicle response:',
        JSON.stringify(newVehicle, null, 2),
      );

      const vehicleId = newVehicle?.id;
      if (!vehicleId)
        throw new Error('Could not read vehicle ID from response.');

      // 2. Tyre specs
      console.log(
        '🔧 [handleSave] tireConfig state before update:',
        JSON.stringify(tireConfig, null, 2),
      );

      if (
        tireConfig.alloyType ||
        tireConfig.pressureFront ||
        tireConfig.pressureRear
      ) {
        const tyrePayload = {
          alloy_type: tireConfig.alloyType || undefined,
          pressure_front: tireConfig.pressureFront
            ? parseFloat(tireConfig.pressureFront)
            : undefined,
          pressure_rear: tireConfig.pressureRear
            ? parseFloat(tireConfig.pressureRear)
            : undefined,
        };
        console.log(
          '🔧 [handleSave] sending tyre update payload:',
          JSON.stringify(tyrePayload, null, 2),
        );
        const tyreRes = await dispatch(
          updateVehicle({ id: vehicleId, data: tyrePayload }),
        ).unwrap();
        console.log(
          '✅ [handleSave] updateVehicle (tyre) response:',
          JSON.stringify(tyreRes, null, 2),
        );
      } else {
        console.log(
          '⚠️ [handleSave] tyre update SKIPPED — all tireConfig fields are empty',
        );
      }

      // 3. Maintenance
      console.log(
        '📅 [handleSave] maintenance state before update:',
        JSON.stringify(
          {
            insuranceExpiry: maintenance.insuranceExpiry,
            licenseExpiry: maintenance.licenseExpiry,
            lastServiceDate: maintenance.lastServiceDate,
            nextTireRotation: maintenance.nextTireRotation,
          },
          null,
          2,
        ),
      );

      const hasMaintenance = Object.values(maintenance).some(Boolean);
      if (hasMaintenance) {
        const maintPayload = {
          insurance_expiry: toISO(maintenance.insuranceExpiry),
          license_expiry: toISO(maintenance.licenseExpiry),
          last_service_date: toISO(maintenance.lastServiceDate),
          next_tire_rotation: toISO(maintenance.nextTireRotation),
        };
        console.log(
          '📅 [handleSave] sending maintenance payload:',
          JSON.stringify(maintPayload, null, 2),
        );
        const maintRes = await dispatch(
          updateMaintenanceDates({ id: vehicleId, data: maintPayload }),
        ).unwrap();
        console.log(
          '✅ [handleSave] updateMaintenanceDates response:',
          JSON.stringify(maintRes, null, 2),
        );
      } else {
        console.log(
          '⚠️ [handleSave] maintenance update SKIPPED — all dates are null',
        );
      }

      // 4. Photo
      if (imageUri) {
        await dispatch(
          uploadVehiclePhoto({ id: vehicleId, imageUri }),
        ).unwrap();
        console.log('✅ [handleSave] photo uploaded');
      }

      Toast.show({
        type: 'success',
        text1: 'Vehicle Added',
        text2: 'Your vehicle has been registered successfully.',
      });
      navigation.goBack();
    } catch (error: any) {
      console.log(
        '🔴 [handleSave] caught error:',
        JSON.stringify(error, null, 2),
      );
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error?.message || error || 'An unexpected error occurred.',
      });
    } finally {
      setIsSavingWorkflow(false);
    }
  };

  const handleCancel = () => navigation.goBack();

  const isPending = loading.vehicles || isSavingWorkflow;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          disabled={isPending}
        >
          <ChevronLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Vehicle</Text>
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
          <View style={styles.pageTitleBlock}>
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

          <View style={{ height: 30 }} />

          {/* Fixed Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveButton, isPending && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={isPending}
              activeOpacity={0.85}
            >
              {isPending ? (
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
              disabled={isPending}
              activeOpacity={0.7}
            >
              <X size={15} color="#6B7280" strokeWidth={2} />
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  pageSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 19,
    paddingBottom: 8,
  },
  scrollContent: { paddingBottom: 16 },
  footer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
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
